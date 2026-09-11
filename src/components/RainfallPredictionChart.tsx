import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { CloudRain, TrendingUp, AlertTriangle, Clock, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { CityCaseFile } from '../types';
import { generateHourlyForecast, HourlyForecastPoint } from '../utils/forecastData';
import { soundEffects } from '../utils/audio';

interface RainfallPredictionChartProps {
  caseFile: CityCaseFile;
  isSimulatedSpike?: boolean;
}

type ViewMode = 'COMBO' | 'ACCUMULATION' | 'RISK_CORRELATION';

export const RainfallPredictionChart: React.FC<RainfallPredictionChartProps> = ({
  caseFile,
  isSimulatedSpike = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('COMBO');
  const [showWarningThreshold, setShowWarningThreshold] = useState<boolean>(true);

  const forecastData: HourlyForecastPoint[] = useMemo(() => {
    return generateHourlyForecast(caseFile, isSimulatedSpike);
  }, [caseFile, isSimulatedSpike]);

  // Statistics
  const peakPoint = useMemo(() => {
    return forecastData.reduce((max, p) => (p.rainfallRateMm > max.rainfallRateMm ? p : max), forecastData[0]);
  }, [forecastData]);

  const totalProjectedAccum = forecastData[forecastData.length - 1]?.cumulativeRainMm || 0;
  const currentAccum = caseFile.telemetry.rainfallAccum24hMm;
  const netAddedRainfall = Math.max(0, Math.round((totalProjectedAccum - currentAccum) * 10) / 10);

  const hoursAboveThreshold = forecastData.filter((p) => p.rainfallRateMm >= 50).length;

  return (
    <div className="rounded-xl bg-[#0e1422] border border-cyan-950/90 p-4 lg:p-5 shadow-xl font-mono-hud">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <CloudRain className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                HOURLY PREDICTIVE RAINFALL TELEMETRY
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                RECHARTS V2 FORECASTER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-Polarization Doppler model predicting hourly precipitation rates, accumulation, and flash flood threshold exceedance.
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#131926] p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => {
                soundEffects.playBlip();
                setViewMode('COMBO');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'COMBO'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rate + PoP %
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playBlip();
                setViewMode('ACCUMULATION');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'ACCUMULATION'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative (mm)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playBlip();
                setViewMode('RISK_CORRELATION');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'RISK_CORRELATION'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Index (0-100)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setShowWarningThreshold(!showWarningThreshold);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
              showWarningThreshold
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>50mm THRESHOLD</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs">
        <div className="p-2.5 rounded-lg bg-[#121827] border border-cyan-900/40">
          <div className="text-[10px] text-slate-400 uppercase">PEAK RATE PROJECTED</div>
          <div className="text-sm font-bold text-rose-400 mt-0.5">
            {peakPoint.rainfallRateMm} mm/h
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Expected at {peakPoint.hour} ({peakPoint.radarEchoDbz} dBZ)
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#121827] border border-cyan-900/40">
          <div className="text-[10px] text-slate-400 uppercase">NEXT 14H ACCUMULATION</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">
            +{netAddedRainfall} mm
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Total basin accum: {totalProjectedAccum} mm
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#121827] border border-cyan-900/40">
          <div className="text-[10px] text-slate-400 uppercase">SURGE DURATION</div>
          <div className="text-sm font-bold text-cyan-300 mt-0.5">
            {hoursAboveThreshold} Hours
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {hoursAboveThreshold > 0 ? 'Critical flash alert window' : 'Below flash threshold'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#121827] border border-cyan-900/40">
          <div className="text-[10px] text-slate-400 uppercase">SOIL MOISTURE FORECAST</div>
          <div className="text-sm font-bold text-purple-400 mt-0.5">
            {peakPoint.soilSaturationPct}% Peak
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Runoff factor: {caseFile.telemetry.runoffCoefficientPct}%
          </div>
        </div>
      </div>

      {/* Main Recharts Chart Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecastData}
            margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="rainRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="accumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />

            <XAxis
              dataKey="hour"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tick={{ fill: '#94a3b8' }}
            />

            {/* Left Axis: Rainfall rate or Accumulation */}
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tick={{ fill: '#94a3b8' }}
              domain={[0, 'auto']}
              unit={viewMode === 'ACCUMULATION' ? 'mm' : 'mm'}
            />

            {/* Right Axis: PoP % or Risk Index */}
            {(viewMode === 'COMBO' || viewMode === 'RISK_CORRELATION') && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tick={{ fill: '#94a3b8' }}
                domain={[0, 100]}
                unit="%"
              />
            )}

            {/* Critical Flash Flood Threshold Line */}
            {showWarningThreshold && viewMode === 'COMBO' && (
              <ReferenceLine
                yAxisId="left"
                y={50}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{
                  value: 'FLASH FLOOD THRESHOLD (50 mm/h)',
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideTopLeft'
                }}
              />
            )}

            {/* Marker for Current Hour (NOW) */}
            <ReferenceLine
              yAxisId="left"
              x={forecastData.find((p) => p.status === 'NOW')?.hour || '11:00'}
              stroke="#00e5ff"
              strokeWidth={1.5}
              label={{
                value: 'CURRENT TIME',
                fill: '#00e5ff',
                fontSize: 10,
                position: 'top'
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as HourlyForecastPoint;
                  return (
                    <div className="rounded-lg bg-[#0a0f1a] border border-cyan-500/50 p-3 shadow-2xl font-mono-hud text-xs space-y-1.5 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-white text-sm">{data.hour}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          data.status === 'NOW'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : data.status === 'PAST'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {data.status === 'NOW' ? 'CURRENT (NOW)' : data.status}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Precip Rate:</span>
                          <strong className={data.rainfallRateMm >= 50 ? 'text-rose-400' : 'text-cyan-300'}>
                            {data.rainfallRateMm} mm/h
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Cumulative Accum:</span>
                          <strong className="text-amber-400">{data.cumulativeRainMm} mm</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Doppler Echo:</span>
                          <strong className="text-slate-300">{data.radarEchoDbz} dBZ</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Probability (PoP):</span>
                          <strong className="text-emerald-400">{data.popPct}%</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Flood Risk Index:</span>
                          <strong className={data.floodRiskScore >= 75 ? 'text-rose-400' : 'text-amber-300'}>
                            {data.floodRiskScore}/100
                          </strong>
                        </div>
                      </div>

                      {data.isFlashFloodWarning && (
                        <div className="mt-2 pt-1.5 border-t border-rose-900/60 flex items-center gap-1.5 text-[10px] text-rose-300 font-bold">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>WARNING: Flash Inundation Risk</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />

            {/* Mode 1: COMBO (Rate Area + PoP Line) */}
            {viewMode === 'COMBO' && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="rainfallRateMm"
                  name="Rainfall Rate (mm/h)"
                  stroke="#00e5ff"
                  strokeWidth={2.5}
                  fill="url(#rainRateGradient)"
                  activeDot={{ r: 5, fill: '#00e5ff', stroke: '#fff' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="popPct"
                  name="Precip Probability (%)"
                  stroke="#10b981"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </>
            )}

            {/* Mode 2: ACCUMULATION (Cumulative Curve + Hourly Bar) */}
            {viewMode === 'ACCUMULATION' && (
              <>
                <Bar
                  yAxisId="left"
                  dataKey="rainfallRateMm"
                  name="Hourly Influx (mm)"
                  fill="#0284c7"
                  opacity={0.65}
                  radius={[3, 3, 0, 0]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="cumulativeRainMm"
                  name="Total Accumulated (mm)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#accumGradient)"
                  activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff' }}
                />
              </>
            )}

            {/* Mode 3: RISK CORRELATION */}
            {viewMode === 'RISK_CORRELATION' && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="rainfallRateMm"
                  name="Precip Rate (mm/h)"
                  stroke="#00e5ff"
                  strokeWidth={2}
                  fill="url(#rainRateGradient)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="floodRiskScore"
                  name="Risk Index (0-100)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="soilSaturationPct"
                  name="Soil Saturation (%)"
                  stroke="#a855f7"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Banner */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Forecast Interval: <strong>Hourly (1h Resolution)</strong> | Model Source:{' '}
            <strong className="text-cyan-300">NEXRAD HRRR Convective Ensemble</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
          <span>Real-time calibration active</span>
        </div>
      </div>
    </div>
  );
};
