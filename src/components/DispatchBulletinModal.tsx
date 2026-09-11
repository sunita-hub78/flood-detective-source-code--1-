import React from 'react';
import { X, AlertOctagon, Siren, Radio, MapPin, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface DispatchBulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseFile: CityCaseFile;
}

export const DispatchBulletinModal: React.FC<DispatchBulletinModalProps> = ({
  isOpen,
  onClose,
  caseFile,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.playBlip();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-[#0e121a] border-2 border-rose-500/80 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgent Emergency Header */}
        <div className="bg-rose-950/80 border-b border-rose-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-lg text-white animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-hud text-xs font-bold text-rose-300 tracking-widest uppercase">
                  OFFICIAL TACTICAL DISPATCH BULLETIN
                </span>
                <span className="text-[10px] font-mono-hud px-2 py-0.5 rounded bg-rose-900 border border-rose-600 text-rose-200">
                  CODE RED IMMINENT
                </span>
              </div>
              <h3 className="text-base font-display font-bold text-white">
                FLASH FLOOD EMERGENCY ADVISORY: {caseFile.cityName.toUpperCase()}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="text-rose-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto font-mono-hud text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#141a26] border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400">INCIDENT ID:</span>
              <div className="font-bold text-slate-100">{caseFile.caseNumber}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">EST. TIME TO PEAK:</span>
              <div className="font-bold text-rose-400">{caseFile.telemetry.estimatedTimeToPeakMin} MINUTES</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">RIVER STAGE:</span>
              <div className="font-bold text-amber-400">{caseFile.telemetry.riverLevelMeters}m / {caseFile.telemetry.riverFloodStageMeters}m</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">RAIN RATE:</span>
              <div className="font-bold text-rose-400">{caseFile.telemetry.rainfallCurrentMmHr} mm/h</div>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertOctagon className="w-4 h-4" />
              <span>FORENSIC VERDICT & THREAT ASSESSMENT</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {caseFile.threatVerdict}
            </p>
          </div>

          {/* Immediate Action Orders */}
          <div className="p-4 rounded-xl bg-[#131924] border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Radio className="w-4 h-4" />
              <span>DIRECTIVE TO MUNICIPAL EMERGENCY SERVICES</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {caseFile.recommendedAction}
            </p>
          </div>

          {/* Vulnerable Chokepoints */}
          <div>
            <span className="text-slate-400 font-bold block mb-2">
              CRITICAL INFRASTRUCTURE BOTTLENECKS (BARRIER CLOSURES ORDERED):
            </span>
            <div className="space-y-2">
              {caseFile.chokepoints.map((cp) => (
                <div 
                  key={cp.id}
                  className="p-2.5 rounded-lg bg-[#111620] border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200">{cp.name}</span>
                    <div className="text-[10px] text-slate-400">
                      Coordinates: {cp.coordinates} | Debris Occlusion: {cp.debrisBlockagePct}%
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    cp.status === 'OVERTOPPED' 
                      ? 'bg-rose-950 text-rose-400 border-rose-500' 
                      : 'bg-amber-950 text-amber-400 border-amber-500'
                  }`}>
                    {cp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0a0d13] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono-hud text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Authorized by: {caseFile.investigatorLead} ({caseFile.badgeNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-hud flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              EXPORT BULLETIN
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono-hud transition-colors"
            >
              ACKNOWLEDGE & CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
