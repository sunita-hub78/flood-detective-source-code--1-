import React, { useState } from 'react';
import { 
  Map, 
  BarChart3, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Radio, 
  CloudRain, 
  ShieldAlert,
  Zap
} from 'lucide-react';
import { CityCaseFile } from '../types';
import { TacticalFloodMap } from './TacticalFloodMap';
import { RainfallPredictionChart } from './RainfallPredictionChart';
import { soundEffects } from '../utils/audio';

interface GeospatialCommandCenterProps {
  caseFile: CityCaseFile;
  maintenanceSensorIds?: string[];
  onToggleSensor?: (sensorId: string) => void;
  isSimulatedSpike?: boolean;
}

type CenterDisplayLayout = 'SPLIT' | 'MAP_FOCUS' | 'CHART_FOCUS';

export const GeospatialCommandCenter: React.FC<GeospatialCommandCenterProps> = ({
  caseFile,
  maintenanceSensorIds = [],
  onToggleSensor,
  isSimulatedSpike = false,
}) => {
  const [layout, setLayout] = useState<CenterDisplayLayout>('SPLIT');

  return (
    <div className="relative z-10 mb-8 rounded-2xl bg-[#0b0f19]/95 border border-cyan-500/40 p-4 lg:p-6 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
      {/* Center Command Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
                TACTICAL GEOSPATIAL & PREDICTIVE RADAR CENTER
              </h2>
              <span className="text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50">
                LIVE GIS + RECHARTS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-hud mt-0.5">
              Center surveillance matrix correlating real-time geospatial hazard pins, Doppler radar contours, and 24h predictive hourly rainfall curves.
            </p>
          </div>
        </div>

        {/* Layout Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-[#121827] p-1 rounded-lg border border-slate-800 text-xs font-mono-hud">
          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setLayout('SPLIT');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-bold ${
              layout === 'SPLIT'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DUAL DISPLAY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setLayout('MAP_FOCUS');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-bold ${
              layout === 'MAP_FOCUS'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MAP FOCUS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setLayout('CHART_FOCUS');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-bold ${
              layout === 'CHART_FOCUS'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HOURLY FORECAST</span>
          </button>
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      {layout === 'SPLIT' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="w-full">
            <TacticalFloodMap
              caseFile={caseFile}
              maintenanceSensorIds={maintenanceSensorIds}
              onToggleSensor={onToggleSensor}
              isSimulatedSpike={isSimulatedSpike}
            />
          </div>
          <div className="w-full">
            <RainfallPredictionChart
              caseFile={caseFile}
              isSimulatedSpike={isSimulatedSpike}
            />
          </div>
        </div>
      )}

      {layout === 'MAP_FOCUS' && (
        <div className="w-full space-y-4">
          <TacticalFloodMap
            caseFile={caseFile}
            maintenanceSensorIds={maintenanceSensorIds}
            onToggleSensor={onToggleSensor}
            isSimulatedSpike={isSimulatedSpike}
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => setLayout('SPLIT')}
              className="text-xs font-mono-hud text-cyan-400 hover:underline"
            >
              &larr; Return to Dual Split View
            </button>
          </div>
        </div>
      )}

      {layout === 'CHART_FOCUS' && (
        <div className="w-full space-y-4">
          <RainfallPredictionChart
            caseFile={caseFile}
            isSimulatedSpike={isSimulatedSpike}
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => setLayout('SPLIT')}
              className="text-xs font-mono-hud text-cyan-400 hover:underline"
            >
              &larr; Return to Dual Split View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
