import React from 'react';
import { 
  Radio, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Battery, 
  Wifi, 
  Zap, 
  RotateCcw,
  Sliders,
  Activity,
  Droplets,
  CloudRain,
  Mountain,
  Gauge
} from 'lucide-react';
import { HydroSensor, HydroSensorType } from '../types';
import { soundEffects } from '../utils/audio';

interface HydroSensorPanelProps {
  sensors: HydroSensor[];
  maintenanceSensorIds: string[];
  onToggleSensor: (sensorId: string) => void;
  onToggleAllSensors: (enableMaintenance: boolean) => void;
}

export const HydroSensorPanel: React.FC<HydroSensorPanelProps> = ({
  sensors,
  maintenanceSensorIds,
  onToggleSensor,
  onToggleAllSensors,
}) => {
  const getSensorIcon = (type: HydroSensorType) => {
    switch (type) {
      case 'RIVER_STAGE':
        return Droplets;
      case 'DOPPLER_RADAR':
        return CloudRain;
      case 'SOIL_TENSIOMETER':
        return Mountain;
      case 'CULVERT_SONAR':
        return Activity;
      case 'RUNOFF_FLUME':
        return Gauge;
      default:
        return Radio;
    }
  };

  const handleToggle = (sensorId: string) => {
    soundEffects.playWarningAlert();
    onToggleSensor(sensorId);
  };

  const maintenanceCount = maintenanceSensorIds.length;
  const allInMaintenance = maintenanceCount === sensors.length;

  return (
    <div id="hydro-sensor-network-panel" className="relative z-10 mb-8 rounded-2xl bg-[#0f1422] border border-cyan-900/60 p-5 lg:p-6 shadow-xl overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header & Batch Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
              HYDRO-SENSOR TELEMETRY MATRIX & MAINTENANCE RACK
            </h2>
          </div>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            FIELD TELEMETRY MONITORS • SIMULATE SENSOR MAINTENANCE TO GREY OUT REAL-TIME READINGS
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono-hud text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#0b0f18] border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              STATUS: <strong className="text-cyan-400">{sensors.length - maintenanceCount} ONLINE</strong> /{' '}
              <strong className={maintenanceCount > 0 ? 'text-amber-400' : 'text-slate-500'}>
                {maintenanceCount} IN MAINTENANCE
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playWarningAlert();
              onToggleAllSensors(!allInMaintenance);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              allInMaintenance
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/30'
                : 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            {allInMaintenance ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTORE ALL SENSORS (ONLINE)</span>
              </>
            ) : (
              <>
                <Wrench className="w-3.5 h-3.5" />
                <span>SIMULATE ALL IN MAINTENANCE (GREY OUT ALL)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {sensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const isMaintenance = maintenanceSensorIds.includes(sensor.id);

          return (
            <div
              key={sensor.id}
              id={`sensor-card-${sensor.id}`}
              className={`relative rounded-xl p-4 transition-all duration-300 flex flex-col justify-between border ${
                isMaintenance
                  ? 'bg-[#0a0d13]/90 border-slate-700/80 grayscale-[80%] opacity-70 shadow-none'
                  : 'bg-[#121826]/90 border-cyan-900/60 hover:border-cyan-500/60 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]'
              }`}
            >
              {/* Top Station Tag & Battery */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded border ${
                    isMaintenance
                      ? 'bg-slate-900 text-slate-400 border-slate-700'
                      : 'bg-cyan-950 text-cyan-400 border-cyan-900/60'
                  }`}>
                    {sensor.code}
                  </span>

                  <div className="flex items-center gap-2 text-[10px] font-mono-hud text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Wifi className={`w-3 h-3 ${isMaintenance ? 'text-slate-600' : 'text-cyan-400'}`} />
                      {isMaintenance ? 'NO SIGNAL' : sensor.lastPingTime}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Battery className={`w-3 h-3 ${isMaintenance ? 'text-slate-600' : 'text-emerald-400'}`} />
                      {sensor.batteryPct}%
                    </span>
                  </div>
                </div>

                {/* Sensor Title & Location */}
                <div className="flex items-start gap-2 mb-2.5">
                  <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                    isMaintenance ? 'bg-slate-800 text-slate-500' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-display font-bold leading-snug line-clamp-1 ${
                      isMaintenance ? 'text-slate-400' : 'text-slate-100'
                    }`}>
                      {sensor.name}
                    </h3>
                    <p className="text-[10px] font-mono-hud text-slate-500 truncate max-w-[170px]">
                      {sensor.stationLocation}
                    </p>
                  </div>
                </div>

                {/* Live Telemetry Display (Greyed out if in maintenance mode) */}
                <div className={`p-3 rounded-xl border mb-3 transition-all ${
                  isMaintenance
                    ? 'bg-[#090b10] border-dashed border-slate-800 text-slate-500'
                    : 'bg-[#0a0f19] border-cyan-950 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono-hud mb-1">
                    <span className={isMaintenance ? 'text-slate-600' : 'text-slate-400 uppercase'}>
                      {sensor.primaryMetricLabel}:
                    </span>
                    {isMaintenance ? (
                      <span className="text-[9px] font-bold text-amber-500/90 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-600/40">
                        MAINTENANCE
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE STREAM
                      </span>
                    )}
                  </div>

                  {/* Primary Telemetry Value */}
                  <div className="flex items-baseline gap-2">
                    {isMaintenance ? (
                      <div className="space-y-0.5">
                        <span className="text-lg font-mono-hud font-extrabold text-slate-500 line-through select-none block">
                          {sensor.primaryMetricValue}
                        </span>
                        <span className="text-[10px] font-mono-hud text-amber-400/90 font-bold block">
                          [TELEMETRY GREYED OUT]
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-mono-hud font-extrabold text-cyan-300">
                        {sensor.primaryMetricValue}
                      </span>
                    )}
                  </div>

                  {/* Secondary Metric */}
                  <p className={`text-[10px] font-mono-hud mt-1 truncate ${
                    isMaintenance ? 'text-slate-600 line-through' : 'text-slate-400'
                  }`}>
                    {isMaintenance ? 'Telemetry stream suspended for field calibration' : sensor.secondaryMetric}
                  </p>
                </div>
              </div>

              {/* Toggle Hydro-Sensor Button */}
              <button
                type="button"
                id={`toggle-sensor-btn-${sensor.id}`}
                onClick={() => handleToggle(sensor.id)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-mono-hud font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isMaintenance
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 hover:border-amber-400'
                }`}
              >
                {isMaintenance ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RESTORE SENSOR</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>TOGGLE HYDRO-SENSOR</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
