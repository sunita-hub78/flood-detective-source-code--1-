import React, { useMemo, useState } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Waves, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Radio, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Flame,
  Zap,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface EvidenceCollectedSectionProps {
  caseFile: CityCaseFile;
  maintenanceSensorIds?: string[];
  isSimulatedSpike?: boolean;
}

export type AIVerdictStatus = 'Safe' | 'Investigating' | 'Immediate Evacuation Required';

export const EvidenceCollectedSection: React.FC<EvidenceCollectedSectionProps> = ({
  caseFile,
  maintenanceSensorIds = [],
  isSimulatedSpike = false,
}) => {
  // Optional local simulation override for testing all 3 AI verdict states
  const [overrideVerdict, setOverrideVerdict] = useState<AIVerdictStatus | null>(null);

  // 1. Live Rainfall Metrics
  const rainRate = useMemo(() => {
    return isSimulatedSpike 
      ? Math.round(caseFile.telemetry.rainfallCurrentMmHr * 1.35 * 10) / 10
      : caseFile.telemetry.rainfallCurrentMmHr;
  }, [caseFile, isSimulatedSpike]);

  const rainAccum = useMemo(() => {
    return isSimulatedSpike
      ? Math.round((caseFile.telemetry.rainfallAccum24hMm + 25) * 10) / 10
      : caseFile.telemetry.rainfallAccum24hMm;
  }, [caseFile, isSimulatedSpike]);

  // 2. Soil Saturation Metrics
  const soilMoisture = useMemo(() => {
    return isSimulatedSpike
      ? Math.min(100, Math.round(caseFile.telemetry.soilMoisturePct * 1.05 * 10) / 10)
      : caseFile.telemetry.soilMoisturePct;
  }, [caseFile, isSimulatedSpike]);

  // 3. River Level Metrics
  const riverLevel = useMemo(() => {
    return isSimulatedSpike
      ? Math.round((caseFile.telemetry.riverLevelMeters + 0.45) * 100) / 100
      : caseFile.telemetry.riverLevelMeters;
  }, [caseFile, isSimulatedSpike]);

  const floodStage = caseFile.telemetry.riverFloodStageMeters;
  const riverDelta = Math.round((riverLevel - floodStage) * 100) / 100;
  const isRiverBreached = riverLevel >= floodStage;

  // Sensor Maintenance Checks
  const isRadarMaint = maintenanceSensorIds.some((id) => id.includes('radar'));
  const isSoilMaint = maintenanceSensorIds.some((id) => id.includes('soil'));
  const isRiverMaint = maintenanceSensorIds.some((id) => id.includes('usgs') || id.includes('river'));

  // Calculated AI Verdict
  const computedVerdict: AIVerdictStatus = useMemo(() => {
    if (overrideVerdict) return overrideVerdict;

    // Critical trigger conditions for Immediate Evacuation
    const riverCritical = riverLevel >= floodStage;
    const rainCritical = rainRate >= 65;
    const compoundCritical = rainRate >= 50 && soilMoisture >= 90;
    const scoreCritical = caseFile.overallRiskScore >= 80;

    if (riverCritical || rainCritical || compoundCritical || scoreCritical) {
      return 'Immediate Evacuation Required';
    }

    // Investigating conditions
    const riverElevated = riverLevel >= floodStage * 0.85;
    const rainElevated = rainRate >= 28;
    const soilElevated = soilMoisture >= 75;
    const scoreElevated = caseFile.overallRiskScore >= 45;

    if (riverElevated || rainElevated || soilElevated || scoreElevated) {
      return 'Investigating';
    }

    // Otherwise Safe
    return 'Safe';
  }, [overrideVerdict, riverLevel, floodStage, rainRate, soilMoisture, caseFile.overallRiskScore]);

  // Handle verdict test button
  const handleSetOverride = (status: AIVerdictStatus | null) => {
    soundEffects.playBlip();
    setOverrideVerdict(status);
  };

  return (
    <div className="relative z-10 mb-8 rounded-2xl bg-[#0c101a]/95 border border-cyan-500/40 p-5 lg:p-6 shadow-[0_0_35px_rgba(0,0,0,0.8)] font-mono-hud">
      {/* Section 1 Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
                EVIDENCE COLLECTED
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                LIVE GROUND-TRUTH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time multi-sensor telemetry matrix measuring live rainfall flux, subsoil saturation index, and river crest stage.
            </p>
          </div>
        </div>

        {/* Quick Diagnostics Strip */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-[#121826] border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px]">Sync: 3 Channels Calibrated</span>
          </div>
          {isSimulatedSpike && (
            <span className="px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[11px] font-bold">
              +25mm SQUALL INJECTED
            </span>
          )}
        </div>
      </div>

      {/* 3 Evidence Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-6">
        {/* WIDGET 1: Live Rainfall (mm) */}
        <div className={`p-4 lg:p-5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          isRadarMaint
            ? 'bg-[#090b10] border-dashed border-amber-500/60 opacity-80 grayscale-[60%]'
            : 'bg-[#111726] border-cyan-900/60 hover:border-cyan-400/60 shadow-lg'
        }`}>
          {/* Subtle water drop background glow */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <CloudRain className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-wider">
                  1. LIVE RAINFALL (mm)
                </span>
              </div>

              {isRadarMaint ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                  MAINTENANCE
                </span>
              ) : (
                <span className="text-[10px] text-cyan-400 font-bold">
                  {rainRate >= 50 ? 'TORRENTIAL' : rainRate >= 25 ? 'HEAVY' : 'MODERATE'}
                </span>
              )}
            </div>

            <div className="mt-3">
              <span className="text-[10px] text-slate-400 uppercase">CURRENT PRECIPITATION RATE</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  isRadarMaint 
                    ? 'line-through text-slate-500 select-none' 
                    : rainRate >= 50 ? 'text-rose-400' : rainRate >= 25 ? 'text-amber-400' : 'text-cyan-300'
                }`}>
                  {rainRate}
                </span>
                <span className="text-xs text-slate-400 font-bold">mm/h</span>
              </div>
              {isRadarMaint && (
                <div className="text-[10px] text-amber-400 font-bold mt-1">
                  [RADAR TELEMETRY GREYED OUT]
                </div>
              )}
            </div>

            {/* Precipitation Gauge Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Threshold: 50 mm/h Flash Alert</span>
                <span className={rainRate >= 50 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {rainRate >= 50 ? 'EXCEEDED' : 'WITHIN LIMIT'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    rainRate >= 50 ? 'bg-gradient-to-r from-amber-400 to-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (rainRate / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="text-slate-400">
              24h Accumulation: <strong className={isRadarMaint ? 'line-through text-slate-500' : 'text-cyan-300'}>{rainAccum} mm</strong>
            </div>
            <div className="text-slate-400">
              Peak: <strong className="text-slate-300">{caseFile.telemetry.rainfallPeakMmHr} mm/h</strong>
            </div>
          </div>
        </div>

        {/* WIDGET 2: Soil Saturation (%) */}
        <div className={`p-4 lg:p-5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          isSoilMaint
            ? 'bg-[#090b10] border-dashed border-amber-500/60 opacity-80 grayscale-[60%]'
            : 'bg-[#111726] border-cyan-900/60 hover:border-cyan-400/60 shadow-lg'
        }`}>
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-purple-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-wider">
                  2. SOIL SATURATION (%)
                </span>
              </div>

              {isSoilMaint ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                  MAINTENANCE
                </span>
              ) : (
                <span className={`text-[10px] font-bold ${soilMoisture >= 90 ? 'text-rose-400' : soilMoisture >= 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {soilMoisture >= 90 ? 'SUPER-SATURATED' : soilMoisture >= 75 ? 'NEAR CEILING' : 'ABSORPTIVE'}
                </span>
              )}
            </div>

            <div className="mt-3">
              <span className="text-[10px] text-slate-400 uppercase">VOLUMETRIC WATER CONTENT</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  isSoilMaint 
                    ? 'line-through text-slate-500 select-none' 
                    : soilMoisture >= 90 ? 'text-rose-400' : soilMoisture >= 75 ? 'text-amber-400' : 'text-purple-400'
                }`}>
                  {soilMoisture}
                </span>
                <span className="text-xs text-slate-400 font-bold">%</span>
              </div>
              {isSoilMaint && (
                <div className="text-[10px] text-amber-400 font-bold mt-1">
                  [PROBE TELEMETRY GREYED OUT]
                </div>
              )}
            </div>

            {/* Saturation Capacity Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Critical Runoff Threshold: 85%</span>
                <span className={soilMoisture >= 85 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {soilMoisture >= 85 ? 'RUNOFF 100%' : `${100 - soilMoisture}% BUFFER`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    soilMoisture >= 90 ? 'bg-rose-500' : soilMoisture >= 75 ? 'bg-amber-400' : 'bg-purple-500'
                  }`}
                  style={{ width: `${soilMoisture}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="text-slate-400">
              Runoff Coeff: <strong className="text-slate-200">{caseFile.telemetry.runoffCoefficientPct}%</strong>
            </div>
            <div className="text-slate-400">
              Permeability: <strong className="text-slate-300">{caseFile.telemetry.urbanPermeabilityPct}%</strong>
            </div>
          </div>
        </div>

        {/* WIDGET 3: River Level (m) */}
        <div className={`p-4 lg:p-5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          isRiverMaint
            ? 'bg-[#090b10] border-dashed border-amber-500/60 opacity-80 grayscale-[60%]'
            : 'bg-[#111726] border-cyan-900/60 hover:border-cyan-400/60 shadow-lg'
        }`}>
          <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-blue-400">
                  <Waves className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-wider">
                  3. RIVER LEVEL
                </span>
              </div>

              {isRiverMaint ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                  MAINTENANCE
                </span>
              ) : (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isRiverBreached 
                    ? 'bg-rose-950/80 text-rose-400 border-rose-500/50' 
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                }`}>
                  {isRiverBreached ? 'FLOOD STAGE BREACHED' : 'BELOW FLOOD STAGE'}
                </span>
              )}
            </div>

            <div className="mt-3">
              <span className="text-[10px] text-slate-400 uppercase">USGS RIVER STAGE HEIGHT</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  isRiverMaint 
                    ? 'line-through text-slate-500 select-none' 
                    : isRiverBreached ? 'text-rose-400' : 'text-cyan-300'
                }`}>
                  {riverLevel}
                </span>
                <span className="text-xs text-slate-400 font-bold">m</span>
                <span className={`text-xs font-bold ml-1 ${isRiverBreached ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ({isRiverBreached ? `+${riverDelta}m breach` : `${Math.abs(riverDelta)}m buffer`})
                </span>
              </div>
              {isRiverMaint && (
                <div className="text-[10px] text-amber-400 font-bold mt-1">
                  [TRANSDUCER TELEMETRY GREYED OUT]
                </div>
              )}
            </div>

            {/* River Flood Stage Visual Margin Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Flood Stage: {floodStage} m</span>
                <span className={isRiverBreached ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {isRiverBreached ? 'OVERTOPPING' : 'STABLE'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isRiverBreached ? 'bg-rose-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, (riverLevel / (floodStage * 1.3)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="text-slate-400">
              Discharge: <strong className="text-slate-200">{caseFile.telemetry.riverFlowRateCubicMs} m³/s</strong>
            </div>
            <div className="text-slate-400">
              Time to Crest: <strong className="text-amber-400">{caseFile.telemetry.estimatedTimeToPeakMin} min</strong>
            </div>
          </div>
        </div>
      </div>

      {/* AI VERDICT CARD (BELOW THE 3 WIDGETS) */}
      <div className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 relative overflow-hidden ${
        computedVerdict === 'Immediate Evacuation Required'
          ? 'bg-[#150a0e] border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
          : computedVerdict === 'Investigating'
          ? 'bg-[#15120a] border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
          : 'bg-[#0a1510] border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
      }`}>
        {/* Dynamic Glow Aura */}
        <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          computedVerdict === 'Immediate Evacuation Required'
            ? 'bg-rose-500'
            : computedVerdict === 'Investigating'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-black/50 border border-slate-700 text-slate-300">
                AI HYDROLOGIC VERDICT
              </span>
              <span className="text-[10px] text-slate-400">
                Cross-correlating Rainfall, Soil Saturation & River Level
              </span>
            </div>

            {/* Clear Verdict Title Display */}
            <div className="flex items-center gap-3 pt-1">
              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                computedVerdict === 'Immediate Evacuation Required'
                  ? 'bg-rose-950/90 border-rose-500 text-rose-400 shadow-[0_0_15px_#f43f5e]'
                  : computedVerdict === 'Investigating'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-400 shadow-[0_0_15px_#f59e0b]'
                  : 'bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-[0_0_15px_#10b981]'
              }`}>
                {computedVerdict === 'Immediate Evacuation Required' ? (
                  <ShieldAlert className="w-7 h-7 animate-bounce" />
                ) : computedVerdict === 'Investigating' ? (
                  <AlertTriangle className="w-7 h-7 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  STATUS ASSESSMENT:
                </div>
                <h3 className={`text-xl sm:text-2xl lg:text-3xl font-display font-extrabold tracking-wide ${
                  computedVerdict === 'Immediate Evacuation Required'
                    ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                    : computedVerdict === 'Investigating'
                    ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                }`}>
                  {computedVerdict.toUpperCase()}
                </h3>
              </div>
            </div>

            {/* Verdict Explanation Text */}
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {computedVerdict === 'Immediate Evacuation Required' && (
                <>
                  <strong className="text-rose-300">CRITICAL SURGE THRESHOLD BREACHED: </strong>
                  River level ({riverLevel}m) has exceeded municipal flood stage ({floodStage}m) by +{riverDelta}m while soil saturation is at {soilMoisture}% with precipitation intensity at {rainRate} mm/h. 100% of subsequent rainfall will become immediate destructive runoff.
                </>
              )}
              {computedVerdict === 'Investigating' && (
                <>
                  <strong className="text-amber-300">ELEVATED HYDRO-ANOMALY DETECTED: </strong>
                  Soil moisture ({soilMoisture}%) is approaching absorption capacity limit, and river stage is at {riverLevel}m (buffer remaining: {Math.abs(riverDelta)}m). Convective rainfall rate of {rainRate} mm/h requires active hydrologic surveillance.
                </>
              )}
              {computedVerdict === 'Safe' && (
                <>
                  <strong className="text-emerald-300">NOMINAL HYDRAULIC EQUILIBRIUM: </strong>
                  Precipitation rate ({rainRate} mm/h) is well below the flash flood warning threshold, river stage ({riverLevel}m) maintains adequate channel capacity ({Math.abs(riverDelta)}m buffer), and soil moisture ({soilMoisture}%) permits normal infiltration.
                </>
              )}
            </p>

            {/* Specific Tactical AI Directive */}
            <div className="pt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Recommended Directive:</span>
              <strong className={
                computedVerdict === 'Immediate Evacuation Required'
                  ? 'text-rose-300'
                  : computedVerdict === 'Investigating'
                  ? 'text-amber-300'
                  : 'text-emerald-300'
              }>
                {caseFile.recommendedAction}
              </strong>
            </div>
          </div>

          {/* Metric Status Verification Chips & Test Simulator Toggle */}
          <div className="lg:text-right shrink-0 flex flex-col justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-5">
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                TRIGGER VERIFICATION:
              </div>

              <div className="flex items-center lg:justify-end gap-2 text-[11px]">
                <span className="text-slate-400">Rain Threshold (&gt;50 mm/h):</span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                  rainRate >= 50 ? 'bg-rose-950 text-rose-400 border border-rose-600/40' : 'bg-slate-900 text-slate-400'
                }`}>
                  {rainRate >= 50 ? 'TRIGGERED' : 'NOMINAL'}
                </span>
              </div>

              <div className="flex items-center lg:justify-end gap-2 text-[11px]">
                <span className="text-slate-400">Soil Ceiling (&gt;85%):</span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                  soilMoisture >= 85 ? 'bg-rose-950 text-rose-400 border border-rose-600/40' : 'bg-slate-900 text-slate-400'
                }`}>
                  {soilMoisture >= 85 ? 'TRIGGERED' : 'NOMINAL'}
                </span>
              </div>

              <div className="flex items-center lg:justify-end gap-2 text-[11px]">
                <span className="text-slate-400">Flood Stage Breach:</span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                  isRiverBreached ? 'bg-rose-950 text-rose-400 border border-rose-600/40' : 'bg-slate-900 text-emerald-400'
                }`}>
                  {isRiverBreached ? 'BREACHED' : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* Quick Verdict Simulator / Tester Pills */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                AI Verdict Simulator Mode:
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSetOverride(overrideVerdict === 'Safe' ? null : 'Safe')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    computedVerdict === 'Safe'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Safe
                </button>
                <button
                  type="button"
                  onClick={() => handleSetOverride(overrideVerdict === 'Investigating' ? null : 'Investigating')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    computedVerdict === 'Investigating'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Investigating
                </button>
                <button
                  type="button"
                  onClick={() => handleSetOverride(overrideVerdict === 'Immediate Evacuation Required' ? null : 'Immediate Evacuation Required')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    computedVerdict === 'Immediate Evacuation Required'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Immediate Evac
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
