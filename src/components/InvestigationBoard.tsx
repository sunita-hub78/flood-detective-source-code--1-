import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Pin, 
  Share2, 
  Plus, 
  Zap, 
  Radio, 
  Eye, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  FileSearch,
  Activity,
  Droplets,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  Wrench,
  RotateCcw,
  Sliders,
  Gauge,
  PhoneCall,
  Camera
} from 'lucide-react';
import { CityCaseFile, EvidenceExhibit, RiskCulprit } from '../types';
import { soundEffects } from '../utils/audio';
import { getHydroSensorsForCase, isExhibitInMaintenance, isChokepointInMaintenance } from '../utils/hydroSensors';
import { HydroSensorPanel } from './HydroSensorPanel';
import { GeospatialCommandCenter } from './GeospatialCommandCenter';
import { EvidenceCollectedSection } from './EvidenceCollectedSection';
import { EmergencyHotlineSection } from './EmergencyHotlineSection';
import { ReportFloodIncidentSection } from './ReportFloodIncidentSection';

interface InvestigationBoardProps {
  caseFile: CityCaseFile;
  onOpenEvidence: (exhibit: EvidenceExhibit) => void;
  onOpenAddNote: () => void;
  onOpenDispatch: () => void;
  onSimulateRainSpike: () => void;
  isSimulatedSpike: boolean;
  maintenanceSensorIds?: string[];
  onToggleHydroSensor?: (sensorId: string) => void;
  onToggleAllHydroSensors?: (enableMaintenance: boolean) => void;
}

export const InvestigationBoard: React.FC<InvestigationBoardProps> = ({
  caseFile,
  onOpenEvidence,
  onOpenAddNote,
  onOpenDispatch,
  onSimulateRainSpike,
  isSimulatedSpike,
  maintenanceSensorIds,
  onToggleHydroSensor,
  onToggleAllHydroSensors,
}) => {
  const [showStrings, setShowStrings] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);
  const [showSensorQuickMenu, setShowSensorQuickMenu] = useState(false);
  const [internalMaintenanceIds, setInternalMaintenanceIds] = useState<string[]>([]);

  const activeMaintenanceIds = maintenanceSensorIds ?? internalMaintenanceIds;
  const sensors = useMemo(() => getHydroSensorsForCase(caseFile), [caseFile]);

  const handleToggleSensor = (sensorId: string) => {
    if (onToggleHydroSensor) {
      onToggleHydroSensor(sensorId);
    } else {
      soundEffects.playWarningAlert();
      setInternalMaintenanceIds((prev) =>
        prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]
      );
    }
  };

  const handleToggleAllSensors = (toMaintenance: boolean) => {
    if (onToggleAllHydroSensors) {
      onToggleAllHydroSensors(toMaintenance);
    } else {
      soundEffects.playWarningAlert();
      if (toMaintenance) {
        setInternalMaintenanceIds(sensors.map((s) => s.id));
      } else {
        setInternalMaintenanceIds([]);
      }
    }
  };

  const isRadarInMaint = activeMaintenanceIds.some((id) => id.includes('radar'));
  const isRiverInMaint = activeMaintenanceIds.some((id) => id.includes('usgs'));

  // Filter suspects
  const filteredSuspects = caseFile.suspects.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const toggleStrings = () => {
    soundEffects.playBlip();
    setShowStrings(!showStrings);
  };

  const handleSuspectClick = (suspectId: string) => {
    soundEffects.playBlip();
    setActiveSuspectId(activeSuspectId === suspectId ? null : suspectId);
  };

  const getRiskGradient = (score: number) => {
    if (score >= 85) return 'from-rose-500 to-amber-500';
    if (score >= 70) return 'from-amber-500 to-amber-300';
    return 'from-cyan-500 to-emerald-400';
  };

  const getSeverityBadgeClass = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      case 'SEVERE':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/60';
      case 'ELEVATED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="flood-risk-investigation-board" className="flex-1 overflow-y-auto bg-[#0a0d13] p-4 lg:p-6 space-y-6">
      {/* Top Threat Dossier Banner */}
      <div className="relative rounded-2xl bg-[#0f1420] border border-cyan-900/60 p-5 lg:p-6 overflow-hidden shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-radar-grid opacity-60 pointer-events-none" />
        
        {/* Glow corner accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Case Info & Status */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono-hud text-xs font-bold px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 tracking-wider">
                {caseFile.caseNumber}
              </span>
              <span className="text-xs font-mono-hud text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                INITIATED: {caseFile.caseOpenedTime}
              </span>
              <span className="text-xs font-mono-hud text-amber-400/90 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                LEAD: {caseFile.investigatorLead}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-wide flex items-center gap-3">
              <span>{caseFile.cityName.toUpperCase()} FLOOD RISK INVESTIGATION BOARD</span>
            </h1>

            <p className="text-xs font-mono-hud text-slate-400">
              BASIN TARGET: <span className="text-slate-200 font-semibold">{caseFile.basinName}</span>
            </p>

            <div className="p-3 rounded-xl bg-[#141a26]/90 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed font-mono-hud flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 uppercase">FORENSIC VERDICT: </strong>
                {caseFile.threatVerdict}
              </div>
            </div>
          </div>

          {/* Right: Neon Cyber Flood Risk Meter */}
          <div className="flex items-center gap-5 shrink-0 bg-[#0b0e16] p-4 rounded-xl border border-cyan-900/80">
            <div className="text-center">
              <span className="text-[10px] font-mono-hud text-slate-400 uppercase tracking-wider block">
                COMPUTED FLOOD RISK
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className={`text-4xl lg:text-5xl font-mono-hud font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getRiskGradient(caseFile.overallRiskScore)}`}>
                  {caseFile.overallRiskScore}
                </span>
                <span className="text-xs font-mono-hud text-slate-500">/100</span>
              </div>
              <span className={`inline-block mt-1 text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded border ${
                caseFile.riskLevel === 'CRITICAL' 
                  ? 'bg-rose-950 text-rose-300 border-rose-600' 
                  : 'bg-amber-950 text-amber-300 border-amber-600'
              }`}>
                {caseFile.riskLevel} SURGE THREAT
              </span>
            </div>

            <div className="h-16 w-px bg-slate-800" />

            <div className="space-y-1.5 text-right font-mono-hud text-xs">
              <div className="text-slate-400 text-[11px]">
                RAIN ACCUM: <strong className={isRadarInMaint ? 'text-slate-500 line-through' : 'text-cyan-400'}>{caseFile.telemetry.rainfallAccum24hMm} mm</strong> {isRadarInMaint && <span className="text-[9px] text-amber-400 font-bold ml-1">[MAINT]</span>}
              </div>
              <div className="text-slate-400 text-[11px]">
                PEAK RATE: <strong className={isRadarInMaint ? 'text-slate-500 line-through' : 'text-rose-400'}>{caseFile.telemetry.rainfallCurrentMmHr} mm/h</strong> {isRadarInMaint && <span className="text-[9px] text-amber-400 font-bold ml-1">[MAINT]</span>}
              </div>
              <div className="text-slate-400 text-[11px]">
                TIME TO PEAK: <strong className={isRiverInMaint ? 'text-slate-500 line-through' : 'text-amber-400'}>{caseFile.telemetry.estimatedTimeToPeakMin} min</strong> {isRiverInMaint && <span className="text-[9px] text-amber-400 font-bold ml-1">[MAINT]</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Neon Link Strings */}
            <button
              id="toggle-evidence-strings"
              type="button"
              onClick={toggleStrings}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud flex items-center gap-1.5 transition-all border ${
                showStrings
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-[#151c2a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>DETECTIVE EVIDENCE STRINGS: {showStrings ? 'ACTIVE' : 'MUTED'}</span>
            </button>

            {/* Quick Simulate Spike */}
            <button
              id="simulate-surge-spike-btn"
              type="button"
              onClick={onSimulateRainSpike}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud flex items-center gap-1.5 transition-all border ${
                isSimulatedSpike
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-[#151c2a] border-cyan-900/60 text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSimulatedSpike ? 'SIMULATING +25mm SQUALL (RESET)' : 'SIMULATE +25mm SQUALL BURST'}</span>
            </button>

            {/* Toggle Hydro-Sensor Feature Button & Dropdown Menu */}
            <div className="relative">
              <button
                id="toggle-hydro-sensor-feature-btn"
                type="button"
                onClick={() => {
                  soundEffects.playBlip();
                  setShowSensorQuickMenu(!showSensorQuickMenu);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-hud flex items-center gap-1.5 transition-all border ${
                  activeMaintenanceIds.length > 0
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'bg-[#151c2a] border-cyan-900/60 text-cyan-300 hover:bg-cyan-950/40'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  TOGGLE HYDRO-SENSOR
                  {activeMaintenanceIds.length > 0 ? ` (${activeMaintenanceIds.length} OFFLINE)` : ''}
                </span>
                <span className="text-[10px] text-slate-400 ml-0.5">▼</span>
              </button>

              {/* Sensor Quick Maintenance Console Dropdown */}
              {showSensorQuickMenu && (
                <div 
                  className="absolute left-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0e131f] border border-cyan-500/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 font-mono-hud text-xs space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="font-bold text-slate-200">HYDRO-SENSOR MAINTENANCE</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                      {activeMaintenanceIds.length} IN MAINT
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    Simulate field sensor outage or transducer calibration. Greys out telemetry across the board.
                  </p>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {sensors.map((sensor) => {
                      const isMaint = activeMaintenanceIds.includes(sensor.id);
                      return (
                        <div
                          key={sensor.id}
                          className={`p-2 rounded-lg border flex items-center justify-between gap-2 transition-colors ${
                            isMaint 
                              ? 'bg-slate-900/80 border-slate-700 text-slate-500' 
                              : 'bg-[#141b2b] border-cyan-950 text-slate-200'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-amber-400">{sensor.code}</span>
                              <span className="truncate text-xs text-slate-300">{sensor.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {isMaint ? (
                                <span className="line-through text-slate-500">[TELEMETRY GREYED OUT]</span>
                              ) : (
                                <span className="text-cyan-400 font-bold">{sensor.primaryMetricValue} ({sensor.primaryMetricLabel})</span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSensor(sensor.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border shrink-0 ${
                              isMaint
                                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                                : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300'
                            }`}
                          >
                            {isMaint ? 'RESTORE' : 'MAINT'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAllSensors(activeMaintenanceIds.length !== sensors.length)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-bold"
                    >
                      {activeMaintenanceIds.length === sensors.length ? 'Restore All Sensors' : 'Grey Out All (All Maint)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSensorQuickMenu(false)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                    >
                      Close Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="quick-jump-hotlines-btn"
              type="button"
              onClick={() => {
                soundEffects.playWarningAlert();
                document.getElementById('emergency-hotlines')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/80 text-rose-300 text-xs font-mono-hud font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>🚨 SOS HOTLINES</span>
            </button>

            <button
              id="quick-jump-report-incident-btn"
              type="button"
              onClick={() => {
                soundEffects.playBlip();
                document.getElementById('report-flood-incident')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 text-xs font-mono-hud font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>REPORT FLOOD INCIDENT</span>
            </button>

            <button
              id="pin-note-btn"
              type="button"
              onClick={onOpenAddNote}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono-hud flex items-center gap-1.5 transition-colors"
            >
              <Pin className="w-3.5 h-3.5 fill-amber-300" />
              <span>PIN EVIDENCE NOTE</span>
            </button>

            <button
              id="dispatch-bulletin-btn"
              type="button"
              onClick={onOpenDispatch}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono-hud font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>ISSUE DISPATCH BULLETIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Investigation Corkboard Canvas */}
      <div className="relative rounded-2xl bg-detective-corkboard border border-cyan-900/50 p-5 lg:p-7 shadow-inner">
        {/* Subtle decorative string paths (SVG vector connectors) */}
        {showStrings && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0 overflow-visible">
            <line x1="20%" y1="180" x2="50%" y2="420" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,4" />
            <line x1="45%" y1="190" x2="25%" y2="440" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4,4" />
            <line x1="75%" y1="200" x2="80%" y2="430" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" />
            <line x1="45%" y1="190" x2="80%" y2="430" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5,5" />
          </svg>
        )}

        {/* Section 0: Interactive Hydro-Sensor Network & Maintenance Rack */}
        <HydroSensorPanel
          sensors={sensors}
          maintenanceSensorIds={activeMaintenanceIds}
          onToggleSensor={handleToggleSensor}
          onToggleAllSensors={handleToggleAllSensors}
        />

        {/* Section 1: Suspect Lineup ("The Primary Risk Culprits") */}
        <div className="relative z-10 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
                SUSPECT LINEUP: PRIMARY RISK CULPRITS
              </h2>
              <span className="text-xs font-mono-hud text-slate-400">
                ({filteredSuspects.length} Identified)
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-lg border border-slate-800 text-xs font-mono-hud">
              {['ALL', 'METEOROLOGY', 'GEOLOGY', 'INFRASTRUCTURE'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredSuspects.map((suspect) => {
              const isSelected = activeSuspectId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  id={`suspect-card-${suspect.id}`}
                  onClick={() => handleSuspectClick(suspect.id)}
                  className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#182030] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'bg-[#111622]/90 border-slate-800 hover:border-cyan-500/50 hover:bg-[#141a28]'
                  }`}
                >
                  {/* Brass/Amber Pin indicator */}
                  <div className="absolute -top-2.5 left-6 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-[#0e121a] shadow-[0_0_8px_rgba(245,158,11,0.5)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                    </div>
                  </div>

                  {/* Top classification tag */}
                  <div className="flex items-center justify-between gap-2 mt-1 mb-2">
                    <span className="text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded bg-[#0b0e16] text-cyan-400 border border-cyan-900/60">
                      {suspect.category}
                    </span>
                    <span className={`text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(suspect.impactLevel)}`}>
                      {suspect.confidenceScore}% CONFIDENCE
                    </span>
                  </div>

                  {/* Suspect Title & Alias */}
                  <div className="mb-2">
                    <div className="text-xs font-mono-hud text-amber-400/90 tracking-wide uppercase">
                      "{suspect.alias}"
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-display">
                      {suspect.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {suspect.summary}
                  </p>

                  {/* Metrics chips */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {suspect.metrics.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] font-mono-hud">
                        <span className="text-slate-500">{m.label}:</span>
                        <span className={`font-semibold ${
                          m.severity === 'red' 
                            ? 'text-rose-400' 
                            : m.severity === 'amber' 
                            ? 'text-amber-400' 
                            : 'text-cyan-400'
                        }`}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom status badge */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-[10px] font-mono-hud text-slate-400">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-400" />
                      STATUS: <strong className="text-slate-200">{suspect.status.replace('_', ' ')}</strong>
                    </span>
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5">
                      DETAILS &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Interactive Geospatial Centerpiece & Predictive Rain Charts */}
        <GeospatialCommandCenter
          caseFile={caseFile}
          maintenanceSensorIds={activeMaintenanceIds}
          onToggleSensor={handleToggleSensor}
          isSimulatedSpike={isSimulatedSpike}
        />

        {/* Section 3: Evidence Collected (Live Rainfall, Soil Saturation, River Level & AI Verdict) */}
        <EvidenceCollectedSection
          caseFile={caseFile}
          maintenanceSensorIds={activeMaintenanceIds}
          isSimulatedSpike={isSimulatedSpike}
        />

        {/* Section 4: Emergency Hotline Section with Clickable SOS Numbers */}
        <EmergencyHotlineSection />

        {/* Section 5: Report a Flood Incident (Citizen Field Image Upload & Live Reports Feed) */}
        <ReportFloodIncidentSection caseFile={caseFile} />

        {/* Section 6: Evidence Locker & Classified Exhibits */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
              <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
                EVIDENCE LOCKER: CLASSIFIED EXHIBITS
              </h2>
              <span className="text-xs font-mono-hud text-slate-400">
                (Click Exhibit to Inspect Forensics)
              </span>
            </div>

            <div className="text-xs font-mono-hud text-cyan-400 flex items-center gap-1.5">
              <FileSearch className="w-3.5 h-3.5" />
              <span>REAL-TIME SENSOR VERIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {caseFile.evidenceExhibits.map((exhibit) => {
              const { inMaintenance, sensor } = isExhibitInMaintenance(exhibit, activeMaintenanceIds, sensors);
              return (
                <div
                  key={exhibit.id}
                  id={`exhibit-card-${exhibit.id}`}
                  onClick={() => {
                    soundEffects.playBlip();
                    onOpenEvidence(exhibit);
                  }}
                  className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                    inMaintenance
                      ? 'bg-[#0b0e16]/95 border-dashed border-amber-500/60 grayscale-[70%] opacity-75 shadow-none'
                      : 'bg-[#111724]/95 border-cyan-900/60 hover:border-cyan-400/80 hover:bg-[#141d2e] shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  {/* Glowing Pushpin on top-center */}
                  <div className="absolute -top-2.5 right-6 flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full border-2 border-[#0e121a] flex items-center justify-center ${
                      inMaintenance
                        ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'
                        : 'bg-cyan-400 shadow-[0_0_10px_#00e5ff]'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                    </div>
                  </div>

                  {/* Exhibit Code Stamp & Maintenance Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono-hud font-bold text-amber-400 tracking-wider px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                      {exhibit.exhibitCode}
                    </span>
                    {inMaintenance ? (
                      <span className="text-[9px] font-mono-hud font-bold text-amber-300 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-500/50">
                        MAINTENANCE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono-hud text-slate-400">
                        {exhibit.timestamp}
                      </span>
                    )}
                  </div>

                  {/* Maintenance Alert Strip inside Card if In Maintenance */}
                  {inMaintenance && (
                    <div className="mb-2 p-1.5 rounded bg-amber-950/70 border border-amber-500/40 text-[10px] font-mono-hud text-amber-300 font-bold flex items-center justify-between">
                      <span>⚠ SENSOR MAINTENANCE</span>
                      <span className="text-[9px] bg-amber-900/60 px-1 py-0.2 rounded text-amber-200">TELEMETRY GREYED OUT</span>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 font-display mb-1.5 line-clamp-1">
                    {exhibit.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {exhibit.keyFinding}
                  </p>

                  {/* Live Metric Banner (Greyed out if in maintenance) */}
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    inMaintenance
                      ? 'bg-[#090b10] border-dashed border-slate-800 text-slate-500'
                      : 'bg-[#0b0e15] border-cyan-900/40'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-mono-hud uppercase ${inMaintenance ? 'text-slate-500' : 'text-slate-400'}`}>
                        {exhibit.metricHighlight.label} {inMaintenance && '(OFFLINE)'}
                      </span>
                      <div className={`text-sm font-bold font-mono-hud ${
                        inMaintenance ? 'text-slate-500 line-through select-none' : 'text-cyan-300'
                      }`}>
                        {exhibit.metricHighlight.value}
                      </div>
                      {inMaintenance && (
                        <span className="text-[9px] font-mono-hud text-amber-400/90 font-bold block mt-0.5">
                          [TELEMETRY PAUSED]
                        </span>
                      )}
                    </div>
                    <div className={`p-1.5 rounded ${
                      inMaintenance ? 'bg-slate-900 text-slate-600' : 'bg-cyan-950/50 text-cyan-400'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-hud">
                    <span className="truncate max-w-[130px] text-slate-500">{exhibit.sensorLocation}</span>
                    <div className="flex items-center gap-2">
                      {sensor && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSensor(sensor.id);
                          }}
                          className={`hover:underline font-bold ${inMaintenance ? 'text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
                        >
                          {inMaintenance ? 'RESTORE' : 'MAINT'}
                        </button>
                      )}
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5">
                        VIEW &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3 & 4: Chokepoints Matrix & Temporal Progression */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Drainage Chokepoints & Culverts */}
          <div className="rounded-xl bg-[#101522] border border-cyan-950/80 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                MUNICIPAL DRAINAGE CHOKEPOINT MATRIX
              </h3>
              <span className="text-[10px] font-mono-hud text-slate-400">
                Acoustic Sonar Readings
              </span>
            </div>

            <div className="space-y-2.5">
              {caseFile.chokepoints.map((cp) => {
                const { inMaintenance, sensor } = isChokepointInMaintenance(cp, activeMaintenanceIds, sensors);
                return (
                  <div 
                    key={cp.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs font-mono-hud transition-all ${
                      inMaintenance
                        ? 'bg-[#0a0d14] border-dashed border-slate-700 opacity-70 grayscale-[60%]'
                        : 'bg-[#141b29] border-slate-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 truncate">{cp.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {cp.type}
                        </span>
                        {inMaintenance && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 font-bold border border-amber-600/40">
                            MAINTENANCE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1">
                        <span>
                          Water Velocity:{' '}
                          {inMaintenance ? (
                            <span className="text-slate-500 line-through select-none font-bold">
                              {cp.waterSpeedMs} m/s <span className="text-[9px] text-amber-400">[GREYED OUT]</span>
                            </span>
                          ) : (
                            <strong className="text-cyan-300">{cp.waterSpeedMs} m/s</strong>
                          )}
                        </span>
                        <span>
                          Debris Occlusion:{' '}
                          {inMaintenance ? (
                            <span className="text-slate-500 line-through select-none font-bold">{cp.debrisBlockagePct}%</span>
                          ) : (
                            <strong className="text-amber-400">{cp.debrisBlockagePct}%</strong>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        inMaintenance
                          ? 'bg-slate-900 text-slate-400 border-slate-700'
                          : cp.status === 'OVERTOPPED'
                          ? 'bg-rose-950/80 text-rose-400 border-rose-500'
                          : cp.status === 'RESTRICTED'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-500'
                          : cp.status === 'CAUTION'
                          ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500'
                          : 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                      }`}>
                        {inMaintenance ? 'OFFLINE (MAINT)' : `${cp.status} (${cp.drainageCapacityPct}%)`}
                      </span>

                      {sensor && (
                        <button
                          type="button"
                          onClick={() => handleToggleSensor(sensor.id)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                            inMaintenance
                              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-300'
                          }`}
                        >
                          {inMaintenance ? 'RESTORE' : 'MAINT'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div className="rounded-xl bg-[#101522] border border-cyan-950/80 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                SURGE ESCALATION TIMELINE & PEAK PROJECTION
              </h3>
              <span className="text-[10px] font-mono-hud text-amber-400">
                T-Minus to Peak Surge
              </span>
            </div>

            <div className="space-y-2">
              {caseFile.timeline.map((event, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs font-mono-hud flex items-center justify-between ${
                    event.timeRelative === 'NOW'
                      ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                      : event.isProjected
                      ? 'bg-[#121824]/60 border-cyan-900/30 text-slate-300'
                      : 'bg-[#0d111a] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      event.timeRelative === 'NOW' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {event.time} ({event.timeRelative})
                    </span>
                    <span className="text-slate-200 truncate">
                      {event.incidentFlag || `Surge Risk Index: ${event.floodRiskScore}/100`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="text-cyan-400">{event.rainIntensityMm} mm/h</span>
                    <span className="text-amber-400">{event.riverStageM}m stage</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Pinned Investigator Field Notes */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                PINNED DETECTIVE FIELD NOTES & HYPOTHESES
              </h3>
            </div>

            <button
              onClick={onOpenAddNote}
              className="text-xs font-mono-hud text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              PIN NEW OBSERVATION
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {caseFile.investigatorNotes.map((note) => (
              <div
                key={note.id}
                className="relative p-4 rounded-xl bg-[#141a26] border border-amber-500/30 shadow-md font-mono-hud"
              >
                {/* Brass Tack */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border border-black shadow" />

                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 mt-1">
                  <span className="font-bold text-slate-300">{note.author}</span>
                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                    note.tag === 'ALERT'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : note.tag === 'EVIDENCE'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {note.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  "{note.note}"
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Badge: {note.badge}</span>
                  <span>{note.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
