import React, { useState } from 'react';
import { 
  Archive, 
  MapPin, 
  Calendar, 
  Droplets, 
  ShieldAlert, 
  ArrowRight, 
  FileText,
  Clock,
  BookOpen
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface CaseArchiveItem {
  id: string;
  title: string;
  city: string;
  country: string;
  date: string;
  deathToll: string;
  peakRainfall: string;
  primaryCulprit: string;
  forensicBreakthrough: string;
  modernSensorAdvancement: string;
  analogueCityId: string;
}

const COLD_CASES: CaseArchiveItem[] = [
  {
    id: 'case-atx-1981',
    title: '1981 Memorial Day Shoal Creek Flash Flood',
    city: 'Austin, Texas',
    country: 'USA',
    date: 'May 24-25, 1981',
    deathToll: '13 Fatalities ($36M Damages)',
    peakRainfall: '260 mm in 4 hours',
    primaryCulprit: 'Stationary convective squall training over thin limestone soils with 0mm percolation rate.',
    forensicBreakthrough: 'Established that urban stream valleys experience surge crests within 25 minutes of peak cloudburst.',
    modernSensorAdvancement: 'Spurred installation of automated flood warning gauge networks (ATX Flood Early Warning System).',
    analogueCityId: 'Austin'
  },
  {
    id: 'case-vlc-2024',
    title: '2024 Valencia Catastrophic DANA Surge',
    city: 'Valencia / Paiporta',
    country: 'Spain',
    date: 'October 29, 2024',
    deathToll: '220+ Fatalities',
    peakRainfall: '491 mm in 8 hours (Chiva)',
    primaryCulprit: 'Supercell cluster anchored by warm Mediterranean air dumping unprecedented volume into dry gravel ramblas.',
    forensicBreakthrough: 'Revealed extreme lag between upstream radar precipitation spikes and downstream civil emergency broadcast alerts.',
    modernSensorAdvancement: 'Cell-broadcast ES-Alert integration directly tied to real-time upstream tributary flow rates.',
    analogueCityId: 'Valencia'
  },
  {
    id: 'case-rap-1972',
    title: '1972 Black Hills Rapid Creek Inundation',
    city: 'Rapid City',
    country: 'South Dakota, USA',
    date: 'June 9-10, 1972',
    deathToll: '238 Fatalities',
    peakRainfall: '380 mm in 6 hours',
    primaryCulprit: 'Orographic lift locking low-level easterlies against mountain face, bursting Canyon Lake Dam.',
    forensicBreakthrough: 'Demonstrated canyon gorge velocity amplification creating a 4-meter wall of water with no local rain in the town itself.',
    modernSensorAdvancement: 'Strict civic floodway zoning converting vulnerable alluvial plains into permanent parkland greenways.',
    analogueCityId: 'Rapid City'
  },
  {
    id: 'case-bom-2005',
    title: '2005 Maharashtra Deluge & Mithi River Lock',
    city: 'Mumbai',
    country: 'India',
    date: 'July 26, 2005',
    deathToll: '1,000+ Fatalities',
    peakRainfall: '944 mm in 24 hours',
    primaryCulprit: 'Tidal surge blocking river outfalls while localized cloudburst saturated 99% impermeable suburban concrete.',
    forensicBreakthrough: 'Discovered critical hydraulic interaction between astronomical high tide crests and gravity outfall gates.',
    modernSensorAdvancement: 'Automated tidal flap-gate telemetry and desiltation acoustic probes along the Mithi estuary.',
    analogueCityId: 'Mumbai'
  }
];

interface CaseArchivesViewProps {
  onSelectCity: (cityName: string) => void;
}

export const CaseArchivesView: React.FC<CaseArchivesViewProps> = ({ onSelectCity }) => {
  const [selectedCase, setSelectedCase] = useState<CaseArchiveItem>(COLD_CASES[0]);

  const handleSelectCase = (c: CaseArchiveItem) => {
    soundEffects.playBlip();
    setSelectedCase(c);
  };

  const handleInvestigateAnalogue = (cityName: string) => {
    soundEffects.playBlip();
    onSelectCity(cityName);
  };

  return (
    <div id="case-archives-view" className="flex-1 overflow-y-auto bg-[#0a0d13] p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-cyan-900/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Archive className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              HISTORICAL COLD CASES: FLASH FLOOD FORENSIC ARCHIVE
            </h1>
          </div>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            RETROSPECTIVE POST-MORTEMS ON THE DEADLIEST FLASH INUNDATION EVENTS IN MODERN HISTORY
          </p>
        </div>
      </div>

      {/* Grid of Archive Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {COLD_CASES.map((c) => {
            const isSelected = selectedCase.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectCase(c)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#161f30] border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                    : 'bg-[#101522] border-slate-800 hover:border-slate-700 hover:bg-[#131929]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-hud text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {c.city}, {c.country}
                  </span>
                  <span>{c.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 font-display">
                  {c.title}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xs font-mono-hud text-slate-400">
                  <span>Rain: <strong className="text-rose-400">{c.peakRainfall}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Case Retrospective Dossier (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0f1422] border border-cyan-900/60 p-6 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-amber-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>INCIDENT DATE: {selectedCase.date}</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white">
              {selectedCase.title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mt-1">
              <span>LOCATION: {selectedCase.city}, {selectedCase.country}</span>
              <span>•</span>
              <span className="text-rose-400">IMPACT: {selectedCase.deathToll}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono-hud text-cyan-400 uppercase tracking-wider font-bold">
              PRIMARY HYDROLOGICAL CULPRIT:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-[#131a29] p-3.5 rounded-xl border border-slate-800">
              {selectedCase.primaryCulprit}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono-hud text-amber-400 uppercase tracking-wider font-bold">
              FORENSIC HYDRO-SCIENCE LESSON:
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#131a29] p-3.5 rounded-xl border border-slate-800">
              {selectedCase.forensicBreakthrough}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono-hud text-emerald-400 uppercase tracking-wider font-bold">
              MODERN SENSOR ADVANCEMENT DERIVED:
            </h4>
            <p className="text-xs font-mono-hud text-emerald-200/90 leading-relaxed bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30">
              {selectedCase.modernSensorAdvancement}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleInvestigateAnalogue(selectedCase.analogueCityId)}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-mono-hud text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <span>SWITCH INVESTIGATION TO {selectedCase.analogueCityId.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
