import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Flame, 
  Activity, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  Mountain, 
  Building2, 
  Layers 
} from 'lucide-react';
import { CityCaseFile, RiskCulprit, CulpritCategory } from '../types';
import { soundEffects } from '../utils/audio';

interface SuspectDossiersViewProps {
  caseFile: CityCaseFile;
}

export const SuspectDossiersView: React.FC<SuspectDossiersViewProps> = ({ caseFile }) => {
  const [selectedSuspect, setSelectedSuspect] = useState<RiskCulprit>(caseFile.suspects[0]);

  const getCategoryIcon = (category: CulpritCategory) => {
    switch (category) {
      case 'METEOROLOGY': return CloudRain;
      case 'GEOLOGY': return Mountain;
      case 'INFRASTRUCTURE': return Building2;
      case 'HYDROLOGY': return Layers;
    }
  };

  const handleSelect = (suspect: RiskCulprit) => {
    soundEffects.playBlip();
    setSelectedSuspect(suspect);
  };

  return (
    <div id="suspect-dossiers-view" className="flex-1 overflow-y-auto bg-[#0a0d13] p-4 lg:p-6 space-y-6">
      {/* View Header */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-cyan-900/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              FORENSIC SUSPECT DOSSIERS: {caseFile.cityName.toUpperCase()}
            </h1>
          </div>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            CRIMINAL-STYLE INVESTIGATION INTO THE PHYSICAL AGENTS OF CATASTROPHIC RUNOFF
          </p>
        </div>

        <span className="text-xs font-mono-hud text-amber-400 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/40">
          {caseFile.suspects.length} PERSONS/FACTORS OF INTEREST
        </span>
      </div>

      {/* Main Split Layout: Suspect Lineup List + Deep Forensic Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Suspects (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono-hud text-slate-400 uppercase tracking-wider block px-1">
            IDENTIFIED CULPRITS:
          </span>

          {caseFile.suspects.map((suspect) => {
            const Icon = getCategoryIcon(suspect.category);
            const isSelected = selectedSuspect.id === suspect.id;
            return (
              <div
                key={suspect.id}
                id={`dossier-item-${suspect.id}`}
                onClick={() => handleSelect(suspect)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#182133] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#101522] border-slate-800 hover:border-cyan-500/40 hover:bg-[#131929]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono-hud font-bold text-cyan-400 uppercase">
                      {suspect.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded border ${
                    suspect.status === 'PRIMARY_SUSPECT' 
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : 'bg-amber-950 text-amber-300 border-amber-600'
                  }`}>
                    {suspect.confidenceScore}% CONFIDENCE
                  </span>
                </div>

                <div className="text-xs font-mono-hud text-amber-400 font-bold mb-0.5">
                  "{suspect.alias}"
                </div>
                <h3 className="text-sm font-bold text-slate-100 font-display">
                  {suspect.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Right Deep Forensic Dossier (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0f1524] border border-cyan-900/60 p-6 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute top-4 right-6 text-slate-800 font-display font-extrabold text-7xl select-none pointer-events-none opacity-20">
            DOSSIER
          </div>

          {/* Dossier Header */}
          <div className="relative z-10 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-mono-hud font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                STATUS: {selectedSuspect.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono-hud text-slate-400">
                CATEGORY: {selectedSuspect.category}
              </span>
              <span className="text-xs font-mono-hud text-rose-400">
                IMPACT: {selectedSuspect.impactLevel}
              </span>
            </div>

            <div className="text-base font-mono-hud text-amber-400 font-bold">
              ALIAS: "{selectedSuspect.alias.toUpperCase()}"
            </div>
            <h2 className="text-2xl font-display font-bold text-white mt-1">
              {selectedSuspect.name}
            </h2>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-hud text-cyan-400 uppercase tracking-wider font-bold">
              CULPRIT MECHANISM & HYDROLOGICAL PROFILE:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-[#131a29] p-4 rounded-xl border border-slate-800">
              {selectedSuspect.summary}
            </p>
          </div>

          {/* Forensic Evidence Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-hud text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              INCRIMINATING FORENSIC EVIDENCE:
            </h4>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs font-mono-hud text-rose-200 leading-relaxed">
              {selectedSuspect.forensicEvidence}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h4 className="text-xs font-mono-hud text-slate-400 uppercase tracking-wider mb-2.5">
              TELEMETRIC CHARGES & SENSOR READINGS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedSuspect.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0b0e16] border border-cyan-900/40 font-mono-hud">
                  <span className="text-[11px] text-slate-400 block">{m.label}</span>
                  <span className={`text-lg font-bold ${
                    m.severity === 'red' ? 'text-rose-400' : m.severity === 'amber' ? 'text-amber-400' : 'text-cyan-300'
                  }`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investigator Verdict Note */}
          <div className="p-4 rounded-xl bg-[#0b0f18] border border-slate-800 flex items-center justify-between text-xs font-mono-hud">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>CONFIDENCE INDEX: {selectedSuspect.confidenceScore}%</span>
            </div>
            <span className="text-amber-400">
              VERIFIED BY: {caseFile.investigatorLead}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
