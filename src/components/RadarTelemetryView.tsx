import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, 
  Play, 
  Pause, 
  Radio, 
  Layers, 
  Maximize2, 
  Droplets, 
  Gauge, 
  TrendingUp, 
  AlertTriangle,
  RotateCw,
  Crosshair
} from 'lucide-react';
import { CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface RadarTelemetryViewProps {
  caseFile: CityCaseFile;
}

export const RadarTelemetryView: React.FC<RadarTelemetryViewProps> = ({ caseFile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [showBasin, setShowBasin] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<'LOCAL' | 'REGIONAL'>('LOCAL');
  const animFrameId = useRef<number | null>(null);

  // Storm cell blobs generated based on city telemetry
  const rainRate = caseFile.telemetry.rainfallCurrentMmHr;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 20;

      // Dark radar background
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, width, height);

      // Radar Range Rings (Concentric Circles)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.stroke();

      // Range labels
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('15 km', cx + 5, cy - radius * 0.25);
      ctx.fillText('30 km', cx + 5, cy - radius * 0.5);
      ctx.fillText('45 km', cx + 5, cy - radius * 0.75);
      ctx.fillText('60 km', cx + 5, cy - radius + 12);

      // Simulated River Basin Contour
      if (showBasin) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - 80, cy - 90);
        ctx.bezierCurveTo(cx - 40, cy - 30, cx - 10, cy + 20, cx + 50, cy + 80);
        ctx.bezierCurveTo(cx + 90, cy + 120, cx + 130, cy + 140, cx + 160, cy + 160);
        ctx.stroke();

        // Basin label
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(caseFile.basinName.substring(0, 26) + '...', cx - 120, cy - 95);
        ctx.restore();
      }

      // Doppler Weather Storm Echo Clusters
      const drawPrecipEcho = (x: number, y: number, r: number, dbz: number) => {
        const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
        if (dbz > 60) {
          grad.addColorStop(0, 'rgba(244, 63, 94, 0.9)'); // Severe Pink/Red
          grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)'); // Amber
          grad.addColorStop(0.7, 'rgba(34, 197, 94, 0.5)'); // Green
          grad.addColorStop(1, 'transparent');
        } else if (dbz > 45) {
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.8)'); // Amber
          grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.5)');
          grad.addColorStop(1, 'transparent');
        } else {
          grad.addColorStop(0, 'rgba(34, 197, 94, 0.7)');
          grad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      // Storm Core 1 (Directly over city center)
      drawPrecipEcho(cx - 15, cy - 20, 65, rainRate > 80 ? 65 : 55);
      // Storm Core 2 (Upstream feeder band)
      drawPrecipEcho(cx - 50, cy - 60, 48, 52);
      // Storm Core 3 (Downstream tail)
      drawPrecipEcho(cx + 35, cy + 25, 42, 45);

      // Hydro-Sensor Markers
      if (showSensors) {
        const sensors = [
          { x: cx - 20, y: cy - 10, label: 'USGS #081568', status: 'OVERTOPPING' },
          { x: cx + 40, y: cy + 45, label: 'SONAR #02', status: 'ACTIVE' },
          { x: cx - 60, y: cy - 70, label: 'TENSIOMETER #04', status: 'SATURATED' }
        ];

        sensors.forEach((s) => {
          ctx.fillStyle = s.status === 'OVERTOPPING' ? '#f43f5e' : '#00e5ff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = s.status === 'OVERTOPPING' ? 'rgba(244,63,94,0.6)' : 'rgba(0,229,255,0.6)';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#e2e8f0';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(s.label, s.x + 10, s.y + 3);
        });
      }

      // Radar Sweep Arm with Phosphor Trail
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Sweep gradient fan
      const sweepGrad = ctx.createLinearGradient(0, 0, radius, -radius * 0.4);
      sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, -Math.PI / 4, true);
      ctx.closePath();
      ctx.fill();

      // Sharp sweep leading line
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();
      ctx.restore();

      if (isPlaying) {
        angle += 0.035;
        if (angle >= Math.PI * 2) angle = 0;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, showBasin, showSensors, rainRate, caseFile]);

  const togglePlay = () => {
    soundEffects.playBlip();
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="radar-telemetry-view" className="flex-1 overflow-y-auto bg-[#0a0d13] p-4 lg:p-6 space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0f1420] border border-cyan-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </span>
            <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              {caseFile.cityName.toUpperCase()} DOPPLER RADAR & HYDROGRAPH TERMINAL
            </h1>
          </div>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            NEXRAD DUAL-POL POLARIMETRIC REFLECTIVITY & REAL-TIME STREAM GAUGE HYDROGRAPH
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-lg bg-[#141b28] hover:bg-cyan-950/50 border border-slate-700 text-xs font-mono-hud text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isPlaying ? 'PAUSE SWEEP' : 'RESUME SWEEP'}</span>
          </button>

          <button
            onClick={() => setShowBasin(!showBasin)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud border transition-colors ${
              showBasin ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-[#141b28] border-slate-700 text-slate-400'
            }`}
          >
            BASIN CONTOUR: {showBasin ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud border transition-colors ${
              showSensors ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-[#141b28] border-slate-700 text-slate-400'
            }`}
          >
            SENSOR MASTS: {showSensors ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Hydrograph Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Radar Terminal Canvas (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl bg-[#0b0e16] border border-cyan-900/60 p-5 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
          <div className="w-full flex items-center justify-between mb-3 text-xs font-mono-hud">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              SWEEP REFRESH: 42 RPM
            </span>
            <span className="text-slate-400">
              POLARIZATION: DUAL-POL (ZDR / KDP)
            </span>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              className="rounded-full border border-cyan-500/30 max-w-full aspect-square"
            />
          </div>

          {/* Radar dBZ Reflectivity Scale Legend */}
          <div className="w-full mt-4 p-3 rounded-xl bg-[#101522] border border-slate-800 text-xs font-mono-hud">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>PRECIPITATION REFLECTIVITY (dBZ SCALE):</span>
              <span className="text-rose-400 font-bold">CORE: {caseFile.telemetry.rainfallCurrentMmHr > 80 ? '62 dBZ (TORRENTIAL)' : '52 dBZ (HEAVY)'}</span>
            </div>
            <div className="h-3 rounded flex overflow-hidden">
              <div className="flex-1 bg-emerald-700" title="15-25 dBZ (Light Rain)" />
              <div className="flex-1 bg-emerald-500" title="25-35 dBZ (Moderate Rain)" />
              <div className="flex-1 bg-amber-500" title="35-45 dBZ (Heavy Rain)" />
              <div className="flex-1 bg-amber-600" title="45-55 dBZ (Intense Downpour)" />
              <div className="flex-1 bg-rose-600" title="55-65 dBZ (Cloudburst Flash Flood)" />
              <div className="flex-1 bg-purple-600" title="65+ dBZ (Hail / Tropical Deluge)" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>15 dBZ</span>
              <span>30 dBZ</span>
              <span>45 dBZ</span>
              <span>55 dBZ (Flood Warning)</span>
              <span>65+ dBZ</span>
            </div>
          </div>
        </div>

        {/* Real-time Hydrograph & Telemetry Gauges (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* River Hydrograph Graph Card */}
          <div className="rounded-2xl bg-[#0f1420] border border-cyan-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                USGS BASIN HYDROGRAPH (RIVER STAGE)
              </h3>
              <span className={`text-[10px] font-mono-hud px-2 py-0.5 rounded border ${
                caseFile.telemetry.riverLevelMeters >= caseFile.telemetry.riverFloodStageMeters
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-amber-950 text-amber-300 border-amber-600'
              }`}>
                {caseFile.telemetry.riverLevelMeters >= caseFile.telemetry.riverFloodStageMeters ? 'FLOOD STAGE BREACHED' : 'ELEVATED STAGE'}
              </span>
            </div>

            {/* Custom Interactive SVG Hydrograph */}
            <div className="p-3 rounded-xl bg-[#0a0d14] border border-slate-800">
              <svg viewBox="0 0 400 200" className="w-full h-44 overflow-visible font-mono-hud text-[9px]">
                {/* Horizontal Threshold Lines */}
                {/* Major Flood Threshold (e.g. 4.2m) */}
                <line x1="40" y1="40" x2="380" y2="40" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,4" />
                <text x="45" y="36" fill="#f43f5e">MAJOR FLOOD STAGE (4.2m)</text>

                {/* Moderate Flood Stage (3.2m) */}
                <line x1="40" y1="80" x2="380" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                <text x="45" y="76" fill="#f59e0b">ACTION FLOOD STAGE (3.2m)</text>

                {/* Normal Baseline Stage (1.5m) */}
                <line x1="40" y1="150" x2="380" y2="150" stroke="#334155" strokeWidth="1" />
                <text x="45" y="146" fill="#64748b">NORMAL BASELINE (1.5m)</text>

                {/* Hydrograph Surge Curve Area */}
                <defs>
                  <linearGradient id="hydroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 50 160 Q 120 150, 180 120 T 260 50 T 320 35 T 380 65 L 380 180 L 50 180 Z"
                  fill="url(#hydroGrad)"
                />

                <path
                  d="M 50 160 Q 120 150, 180 120 T 260 50 T 320 35 T 380 65"
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="2.5"
                />

                {/* Current Observation Point */}
                <circle cx="260" cy="50" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                <text x="235" y="32" fill="#fff" fontWeight="bold">CURRENT: {caseFile.telemetry.riverLevelMeters}m</text>

                {/* Axes */}
                <line x1="40" y1="20" x2="40" y2="180" stroke="#475569" strokeWidth="1" />
                <line x1="40" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="1" />
                <text x="45" y="195" fill="#64748b">-3 Hrs</text>
                <text x="145" y="195" fill="#64748b">-2 Hrs</text>
                <text x="245" y="195" fill="#00e5ff">NOW</text>
                <text x="335" y="195" fill="#f59e0b">+1 Hr (Proj)</text>
              </svg>
            </div>

            {/* Stage details */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono-hud">
              <div className="p-3 rounded-lg bg-[#141a26] border border-slate-800">
                <span className="text-slate-400">DISCHARGE VOLUME:</span>
                <div className="text-base font-bold text-cyan-300 mt-0.5">
                  {caseFile.telemetry.riverFlowRateCubicMs} m³/s
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#141a26] border border-slate-800">
                <span className="text-slate-400">EST. TIME TO CREST:</span>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {caseFile.telemetry.estimatedTimeToPeakMin} MINUTES
                </div>
              </div>
            </div>
          </div>

          {/* Geological Infiltration & Runoff Matrix */}
          <div className="rounded-2xl bg-[#0f1420] border border-cyan-900/60 p-5 space-y-3.5">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              SURFACE INFILTRATION & RUNOFF COEFFICIENT
            </h3>

            <div className="space-y-3 text-xs font-mono-hud">
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Soil Moisture Saturation:</span>
                  <span className="font-bold text-rose-400">{caseFile.telemetry.soilMoisturePct}% (CRITICAL)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${caseFile.telemetry.soilMoisturePct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Runoff Coefficient (Sheetflow Rate):</span>
                  <span className="font-bold text-amber-400">{caseFile.telemetry.runoffCoefficientPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${caseFile.telemetry.runoffCoefficientPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Urban Permeable Green Space:</span>
                  <span className="font-bold text-cyan-300">{caseFile.telemetry.urbanPermeabilityPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${caseFile.telemetry.urbanPermeabilityPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
