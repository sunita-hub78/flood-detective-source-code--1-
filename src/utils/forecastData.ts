import { CityCaseFile } from '../types';

export interface HourlyForecastPoint {
  hour: string; // e.g. "08:00"
  displayLabel: string; // e.g. "11:00 (NOW)"
  rainfallRateMm: number; // mm/h
  cumulativeRainMm: number; // running total in mm
  floodRiskScore: number; // 0 - 100
  popPct: number; // Probability of precipitation % (0 - 100)
  soilSaturationPct: number;
  status: 'PAST' | 'NOW' | 'PREDICTED';
  isFlashFloodWarning: boolean;
  radarEchoDbz: number;
}

export function generateHourlyForecast(caseFile: CityCaseFile, isSimulatedSpike: boolean = false): HourlyForecastPoint[] {
  const currentRain = caseFile.telemetry.rainfallCurrentMmHr * (isSimulatedSpike ? 1.3 : 1.0);
  const peakRain = Math.max(caseFile.telemetry.rainfallPeakMmHr * (isSimulatedSpike ? 1.35 : 1.0), currentRain * 1.15);
  const currentRisk = Math.min(100, caseFile.overallRiskScore + (isSimulatedSpike ? 8 : 0));
  const timeToPeakHours = Math.max(1, Math.round(caseFile.telemetry.estimatedTimeToPeakMin / 60));

  // Current base hour (e.g. 11:00)
  const baseHour = 11;
  const points: HourlyForecastPoint[] = [];

  let runningAccum = Math.max(20, caseFile.telemetry.rainfallAccum24hMm - (currentRain * 1.8));

  // 6 hours in the past (-6h to -1h)
  for (let i = -5; i <= -1; i++) {
    const h = (baseHour + i + 24) % 24;
    const hourStr = `${h.toString().padStart(2, '0')}:00`;
    const factor = Math.max(0.15, 0.3 + (0.7 * (i + 5) / 5));
    const rate = Math.round((currentRain * factor * (0.85 + Math.sin(i * 1.5) * 0.15)) * 10) / 10;
    runningAccum += rate;
    const risk = Math.round(currentRisk * (0.35 + (0.5 * (i + 5) / 5)));
    const dbz = Math.min(65, Math.round(20 + (rate * 0.45)));

    points.push({
      hour: hourStr,
      displayLabel: hourStr,
      rainfallRateMm: rate,
      cumulativeRainMm: Math.round(runningAccum * 10) / 10,
      floodRiskScore: risk,
      popPct: Math.min(100, Math.round(50 + (rate * 0.6))),
      soilSaturationPct: Math.min(100, Math.round(caseFile.telemetry.soilMoisturePct * (0.6 + 0.35 * ((i + 5) / 5)))),
      status: 'PAST',
      isFlashFloodWarning: rate > 50,
      radarEchoDbz: dbz
    });
  }

  // Current hour (NOW)
  const currentHourStr = `${baseHour.toString().padStart(2, '0')}:00`;
  runningAccum += currentRain;
  points.push({
    hour: currentHourStr,
    displayLabel: `${currentHourStr} (NOW)`,
    rainfallRateMm: Math.round(currentRain * 10) / 10,
    cumulativeRainMm: Math.round(runningAccum * 10) / 10,
    floodRiskScore: currentRisk,
    popPct: 98,
    soilSaturationPct: caseFile.telemetry.soilMoisturePct,
    status: 'NOW',
    isFlashFloodWarning: currentRain >= 50,
    radarEchoDbz: Math.min(68, Math.round(25 + (currentRain * 0.46)))
  });

  // Next 12 to 18 hours predictions (+1h to +14h)
  for (let i = 1; i <= 14; i++) {
    const h = (baseHour + i) % 24;
    const hourStr = `${h.toString().padStart(2, '0')}:00`;
    
    // Gaussian storm curve centered around timeToPeakHours
    const distFromPeak = Math.abs(i - timeToPeakHours);
    let rate: number;
    if (i <= timeToPeakHours) {
      // Climbing to peak
      const progress = i / timeToPeakHours;
      rate = currentRain + (peakRain - currentRain) * Math.sin((progress * Math.PI) / 2);
    } else {
      // Tapering off after peak
      const decay = Math.exp(-distFromPeak / 3.8);
      rate = Math.max(1.5, peakRain * decay * (0.9 + Math.sin(i * 1.1) * 0.1));
    }

    rate = Math.round(rate * 10) / 10;
    runningAccum += rate;

    // Projected risk curve
    let projRisk = Math.round(
      Math.min(100, currentRisk * (0.4 + 0.6 * (rate / peakRain)) + (runningAccum > 150 ? 15 : 0))
    );
    if (rate > 55) projRisk = Math.max(projRisk, 85);

    const pop = Math.min(100, Math.max(15, Math.round(95 - (i * 5.2))));
    const projSoil = Math.min(100, Math.round(caseFile.telemetry.soilMoisturePct + (i * 0.8) - (i > 6 ? (i - 6) * 1.5 : 0)));
    const dbz = Math.min(70, Math.round(18 + (rate * 0.48)));

    points.push({
      hour: hourStr,
      displayLabel: hourStr,
      rainfallRateMm: rate,
      cumulativeRainMm: Math.round(runningAccum * 10) / 10,
      floodRiskScore: projRisk,
      popPct: pop,
      soilSaturationPct: projSoil,
      status: 'PREDICTED',
      isFlashFloodWarning: rate >= 50,
      radarEchoDbz: dbz
    });
  }

  return points;
}
