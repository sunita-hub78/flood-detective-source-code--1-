import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Flame, 
  AlertOctagon, 
  TrendingUp, 
  Droplets, 
  Clock, 
  Building,
  CheckCircle2,
  Play
} from 'lucide-react';
import { CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface IncidentSimulatorViewProps {
  caseFile: CityCaseFile;
}

export const IncidentSimulatorView: React.FC<IncidentSimulatorViewProps> = ({ caseFile }) => {
  const [rainIntensity, setRainIntensity] = useState(caseFile.telemetry.rainfallCurrentMmHr);
  const [durationMin, setDurationMin] = useState(60);
  const [soilSatPct, setSoilSatPct] = useState(caseFile.telemetry.soilMoisturePct);
  const [drainBlockagePct, setDrainBlockagePct] = useState(45);

  // Dynamic simulation computations
  const effectiveRain = (rainIntensity * (durationMin / 60));
  const runoffMultiplier = (soilSatPct / 100) * 0.7 + (drainBlockagePct / 100) * 0.3;
  const simulatedPeakDischarge = Math.round(caseFile.telemetry.riverFlowRateCubicMs * (rainIntensity / 60) * (soilSatPct / 80));
  
  // Simulated risk score (0-100)
  const computedScore = Math.min(
    100,
    Math.round(
      (rainIntensity * 0.4) + 
      (soilSatPct * 0.3) + 
      (drainBlockagePct * 0.3)
    )
  );

  const timeToPeak = Math.max(12, Math.round(110 - (rainIntensity * 0.5) - (soilSatPct * 0.4)));
  const breachedCrossings = Math.min(18, Math.max(0, Math.floor(computedScore / 7)));

  const applyPreset = (preset: 'MODERATE' | 'CLOUD_BURST' | 'DANA_DELUGE' | 'HURRICANE') => {
    soundEffects.playBlip();
    if (preset === 'MODERATE') {
      setRainIntensity(32);
      setDurationMin(45);
      setSoilSatPct(65);
      setDrainBlockagePct(20);
    } else if (preset === 'CLOUD_BURST') {
      setRainIntensity(95);
      setDurationMin(90);
      setSoilSatPct(95);
      setDrainBlockagePct(65);
    } else if (preset === 'DANA_DELUGE') {
      setRainIntensity(150);
      setDurationMin(120);
      setSoilSatPct(98);
      setDrainBlockagePct(85);
    } else {
      setRainIntensity(120);
      setDurationMin(180);
      setSoilSatPct(92);
      setDrainBlockagePct(50);
    }
  };

  const handleReset = () => {
    soundEffects.playBlip();
    setRainIntensity(caseFile.telemetry.rainfallCurrentMmHr);
    setDurationMin(60);
    setSoilSatPct(caseFile.telemetry.soilMoisturePct);
    setDrainBlockagePct(45);
  };

  return (
    <div id="incident-simulator-view" className="flex-1 overflow-y-auto bg-[#0a0d13] p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-cyan-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              FLASH SURGE SIMULATOR: {caseFile.cityName.toUpperCase()}
            </h1>
          </div>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            STRESS-TEST RUNOFF KINETICS, RAIN CELL BURSTS & MUNICIPAL DRAINAGE BOTTLENECKS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-[#141a26] border border-slate-700 text-xs font-mono-hud text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET TO TELEMETRY
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#0c1018] border border-slate-800 text-xs font-mono-hud">
        <span className="text-slate-400 mr-2">FORENSIC SIMULATION PRESETS:</span>
        <button
          onClick={() => applyPreset('MODERATE')}
          className="px-2.5 py-1 rounded bg-[#141b29] hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          Moderate Shower (32 mm/h)
        </button>
        <button
          onClick={() => applyPreset('CLOUD_BURST')}
          className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40"
        >
          Stationary Squall (95 mm/h)
        </button>
        <button
          onClick={() => applyPreset('DANA_DELUGE')}
          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-600/40 font-bold"
        >
          Extreme DANA Cloudburst (150 mm/h)
        </button>
      </div>

      {/* Main Simulator Controls & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Sliders (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0f1420] border border-cyan-900/60 p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            ATMOSPHERIC & HYDROLOGICAL SLIDERS
          </h3>

          {/* Slider 1: Rain Intensity */}
          <div className="space-y-2 font-mono-hud">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">PRECIPITATION INTENSITY:</span>
              <span className="text-rose-400 font-bold text-sm">{rainIntensity} mm/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={rainIntensity}
              onChange={(e) => setRainIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 mm/h (Light)</span>
              <span>75 mm/h (Flash Flood)</span>
              <span>180 mm/h (Catastrophic)</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div className="space-y-2 font-mono-hud">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">STORM DWELL TIME (RESIDENCE DURATION):</span>
              <span className="text-amber-400 font-bold text-sm">{durationMin} min</span>
            </div>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>15 min</span>
              <span>60 min (1 Hour)</span>
              <span>180 min (Stalled Vortex)</span>
            </div>
          </div>

          {/* Slider 3: Soil Moisture */}
          <div className="space-y-2 font-mono-hud">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">INITIAL SOIL MOISTURE SATURATION:</span>
              <span className="text-cyan-400 font-bold text-sm">{soilSatPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="2"
              value={soilSatPct}
              onChange={(e) => setSoilSatPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20% (Dry Karst)</span>
              <span>60% (Moist)</span>
              <span>100% (Absolute Saturation)</span>
            </div>
          </div>

          {/* Slider 4: Drain Blockage */}
          <div className="space-y-2 font-mono-hud">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">CULVERT & STORM GRATE DEBRIS OCCLUSION:</span>
              <span className="text-amber-400 font-bold text-sm">{drainBlockagePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={drainBlockagePct}
              onChange={(e) => setDrainBlockagePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Clean Culverts)</span>
              <span>50% (Sediment Jams)</span>
              <span>100% (Completely Choked)</span>
            </div>
          </div>
        </div>

        {/* Right Output Verdict & Projected Gauges (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Computed Risk Score HUD */}
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-cyan-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-hud text-slate-400 uppercase tracking-wider">
                SIMULATED RISK VERDICT
              </span>
              <span className={`text-xs font-mono-hud font-bold px-2.5 py-0.5 rounded border ${
                computedScore >= 80 ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse' :
                computedScore >= 60 ? 'bg-amber-950 text-amber-300 border-amber-500' :
                'bg-cyan-950 text-cyan-300 border-cyan-500'
              }`}>
                {computedScore >= 80 ? 'CRITICAL FLASH SURGE' : computedScore >= 60 ? 'HIGH INUNDATION RISK' : 'ELEVATED WATCH'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-mono-hud text-white">
                {computedScore}
              </span>
              <span className="text-slate-500 text-sm font-mono-hud">/100 THREAT INDEX</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-hud">
              <div className="p-3 rounded-lg bg-[#131926] border border-slate-800">
                <span className="text-slate-400 text-[10px]">TIME TO PEAK:</span>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {timeToPeak} min
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#131926] border border-slate-800">
                <span className="text-slate-400 text-[10px]">BREACHED CROSSINGS:</span>
                <div className="text-base font-bold text-rose-400 mt-0.5">
                  {breachedCrossings} Low-Water Bridges
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#131926] border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px]">PROJECTED ACCUM:</span>
                <div className="text-base font-bold text-cyan-300 mt-0.5">
                  {effectiveRain.toFixed(1)} mm
                </div>
              </div>
            </div>
          </div>

          {/* Impact assessment */}
          <div className="p-5 rounded-2xl bg-[#0c1018] border border-slate-800 text-xs font-mono-hud space-y-3">
            <h4 className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              FORENSIC SIMULATION ASSESSMENT:
            </h4>
            <p className="text-slate-300 leading-relaxed">
              At <strong className="text-rose-400">{rainIntensity} mm/h</strong> for <strong className="text-amber-300">{durationMin} minutes</strong> with <strong className="text-cyan-300">{soilSatPct}% soil moisture</strong>, natural absorption collapses within {Math.max(5, Math.round(30 - (soilSatPct * 0.25)))} minutes. 
              Sheetflow runoff velocity will exceed <strong className="text-rose-400">4.2 m/s</strong> in street channels.
            </p>
            <div className="p-3 rounded-lg bg-[#121824] border border-cyan-900/40 text-slate-400 text-[11px]">
              {computedScore >= 80 
                ? '🔴 RED PROTOCOL: Mandatory evacuation of lower creek basements and street closures recommended.'
                : '🟡 AMBER PROTOCOL: Deploy barrier trucks to known drainage underpasses.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
