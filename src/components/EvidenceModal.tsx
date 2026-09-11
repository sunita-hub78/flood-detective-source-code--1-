import React from 'react';
import { X, ShieldAlert, MapPin, Clock, ArrowUpRight, TrendingUp, CheckCircle, Tag } from 'lucide-react';
import { EvidenceExhibit, RiskCulprit } from '../types';
import { soundEffects } from '../utils/audio';

interface EvidenceModalProps {
  exhibit: EvidenceExhibit | null;
  onClose: () => void;
  linkedSuspect?: RiskCulprit;
  isSensorInMaintenance?: boolean;
  onToggleMaintenance?: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ 
  exhibit, 
  onClose, 
  linkedSuspect,
  isSensorInMaintenance,
  onToggleMaintenance
}) => {
  if (!exhibit) return null;

  const handleClose = () => {
    soundEffects.playBlip();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-[#0f141f] border border-cyan-500/50 rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top classified strip */}
        <div className="bg-gradient-to-r from-cyan-950 via-[#131b2b] to-amber-950/60 px-6 py-3 border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-hud text-xs font-bold text-amber-400 tracking-widest px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
              {exhibit.exhibitCode}
            </span>
            <span className="text-xs font-mono-hud text-cyan-300">
              CLASSIFICATION: {exhibit.classification.replace('_', ' ')}
            </span>
            {isSensorInMaintenance && (
              <span className="text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/60">
                MAINTENANCE MODE ACTIVE
              </span>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Maintenance Alert Strip */}
        {isSensorInMaintenance && (
          <div className="bg-amber-950/50 border-b border-amber-500/40 px-6 py-2.5 flex items-center justify-between font-mono-hud text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>HYDRO-SENSOR IN MAINTENANCE: Real-time telemetry feed greyed out for diagnostics.</span>
            </div>
            {onToggleMaintenance && (
              <button
                type="button"
                onClick={onToggleMaintenance}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-[11px] font-bold"
              >
                RESTORE SENSOR
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <span>{exhibit.title}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono-hud text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {exhibit.sensorLocation}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {exhibit.timestamp}
              </span>
              <span className={`flex items-center gap-1 ${isSensorInMaintenance ? 'text-amber-400' : 'text-emerald-400'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                {isSensorInMaintenance ? 'SENSOR IN MAINTENANCE' : 'TELEMETRY VERIFIED'}
              </span>
            </div>
          </div>

          {/* Key Metric Highlight Card (Greyed out if in maintenance mode) */}
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            isSensorInMaintenance
              ? 'bg-[#0e121a] border-dashed border-slate-700 opacity-70 grayscale-[80%]'
              : 'bg-[#151c2a] border-cyan-500/30'
          }`}>
            <div>
              <span className={`text-xs font-mono-hud uppercase tracking-wider ${
                isSensorInMaintenance ? 'text-slate-500' : 'text-cyan-400'
              }`}>
                {exhibit.metricHighlight.label} {isSensorInMaintenance && '(OFFLINE / GREYED OUT)'}
              </span>
              <div className={`text-2xl font-bold font-mono-hud mt-0.5 ${
                isSensorInMaintenance ? 'text-slate-500 line-through select-none' : 'text-white'
              }`}>
                {exhibit.metricHighlight.value}
              </div>
              <p className={`text-xs mt-0.5 ${
                isSensorInMaintenance ? 'text-amber-400/90 font-mono-hud font-bold' : 'text-slate-400'
              }`}>
                {isSensorInMaintenance ? '⚠ Telemetry greyed out — sensor maintenance in progress' : exhibit.metricHighlight.subtext}
              </p>
            </div>

            <div className={`p-3 rounded-xl border ${
              isSensorInMaintenance
                ? 'bg-slate-900/60 border-slate-700 text-slate-500'
                : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
            }`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Forensic Finding */}
          <div className="p-4 rounded-xl bg-[#121722] border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono-hud font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              FORENSIC HYDROLOGICAL FINDING
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {exhibit.keyFinding}
            </p>
          </div>

          {/* Detailed Sensor Notes */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono-hud text-slate-400 uppercase tracking-wider">
              INVESTIGATOR NOTES & TELEMETRY PROFILE
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0e15] p-3.5 rounded-lg border border-slate-800/80 font-mono-hud">
              {exhibit.details}
            </p>
          </div>

          {/* Linked Suspect */}
          {linkedSuspect && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-hud text-amber-400 uppercase tracking-wider">
                  LINKED RISK CULPRIT:
                </span>
                <div className="text-sm font-semibold text-amber-200">
                  {linkedSuspect.name} ({linkedSuspect.alias})
                </div>
              </div>
              <span className="text-xs font-mono-hud font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30">
                {linkedSuspect.confidenceScore}% CONFIDENCE
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0b0e15] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono-hud text-slate-500">
            CASE EVIDENCE ID: #{exhibit.id.toUpperCase()}
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono-hud transition-colors"
          >
            RETURN TO BOARD
          </button>
        </div>
      </div>
    </div>
  );
};
