import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  LifeBuoy, 
  Zap, 
  Home, 
  Radio, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  HeartHandshake,
  Ambulance,
  Clock,
  Volume2
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HotlineItem {
  id: string;
  name: string;
  telNumber: string;
  displayNumber: string;
  category: 'RESCUE' | 'MUNICIPAL' | 'UTILITIES' | 'SHELTER' | 'WEATHER';
  description: string;
  availableHours: string;
  priority: 'CRITICAL_SOS' | 'HIGH_URGENCY' | 'STANDARD';
  instructions: string;
}

const EMERGENCY_HOTLINES: HotlineItem[] = [
  {
    id: 'sos-911',
    name: 'National Swift Water & Emergency Rescue (911)',
    telNumber: '911',
    displayNumber: '911 (Tap to Dial)',
    category: 'RESCUE',
    description: 'Immediate life-threatening swift water rescue, stranded vehicles, and residential trapped occupants.',
    availableHours: '24/7 Priority Emergency Line',
    priority: 'CRITICAL_SOS',
    instructions: 'State your exact cross-streets or landmarks immediately. If on a vehicle roof, stay put.'
  },
  {
    id: 'sos-flood-dispatch',
    name: 'Municipal Flood Disaster & Evacuation Dispatch',
    telNumber: '1-800-356-6389',
    displayNumber: '1-800-FLOOD-WZ (1-800-356-6389)',
    category: 'MUNICIPAL',
    description: 'Direct dispatch to City Swift Water boats, low-water crossing barrier teams, and flood sirens.',
    availableHours: '24/7 Active Storm Center',
    priority: 'CRITICAL_SOS',
    instructions: 'Report overtopped bridges, failed retaining walls, or rising floodwater entering living areas.'
  },
  {
    id: 'sos-power-gas',
    name: 'Electric Grid & Downed Power Lines Crisis Line',
    telNumber: '1-888-225-5773',
    displayNumber: '1-888-CALL-PWR (1-888-225-5773)',
    category: 'UTILITIES',
    description: 'Emergency isolation of electrified floodwaters, severed power poles, and bubbling gas mains.',
    availableHours: '24/7 Rapid Response Crew',
    priority: 'HIGH_URGENCY',
    instructions: 'Assume all standing water near utility poles carries lethal voltage. Stay back at least 35 feet.'
  },
  {
    id: 'sos-red-cross',
    name: 'Red Cross Emergency Evacuation & Shelter Center',
    telNumber: '1-800-733-2767',
    displayNumber: '1-800-RED-CROSS (1-800-733-2767)',
    category: 'SHELTER',
    description: 'Emergency high-ground shelters, dry blankets, hot meals, prescription assistance, and family reunification.',
    availableHours: '24/7 Disaster Relief Hotline',
    priority: 'STANDARD',
    instructions: 'Call to find the nearest dry municipal shelter and coordinate transport for elderly or disabled.'
  },
  {
    id: 'sos-weather-dispatch',
    name: 'NOAA All-Hazards Emergency Weather Radio Hub',
    telNumber: '1-800-843-6342',
    displayNumber: '1-800-843-6342 (Option 2)',
    category: 'WEATHER',
    description: 'Live synthesized audio broadcast of National Weather Service Flash Flood Warnings & Doppler Radar feeds.',
    availableHours: '24/7 Automated + Meteorologist Feed',
    priority: 'STANDARD',
    instructions: 'Listen to real-time basin stage forecasts and dam spillway opening announcements.'
  },
  {
    id: 'sos-311-city',
    name: 'Municipal 311 Road Impasse & Water Logging Hotline',
    telNumber: '311',
    displayNumber: '311 (or 512-974-2000)',
    category: 'MUNICIPAL',
    description: 'Report clogged storm drains, fallen trees blocking drainage, and non-emergency neighborhood ponding.',
    availableHours: '24/7 Citizen Support',
    priority: 'STANDARD',
    instructions: 'For non-life-threatening municipal road closures, culvert blockages, and city drainage maintenance.'
  }
];

export const EmergencyHotlineSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, number: string) => {
    soundEffects.playBlip();
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div id="emergency-hotlines" className="relative z-10 mb-8 rounded-2xl bg-[#0e090f]/95 border-2 border-rose-500/70 p-5 lg:p-7 shadow-[0_0_40px_rgba(244,63,94,0.3)] font-mono-hud">
      {/* Top Warning Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-400 shadow-[0_0_20px_#f43f5e] animate-pulse">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base lg:text-xl font-display font-extrabold text-white uppercase tracking-wider">
                EMERGENCY HOTLINES & CLICKABLE SOS DISPATCH
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-[0_0_10px_#f43f5e] animate-pulse">
                24/7 ACTIVE LINES
              </span>
            </div>
            <p className="text-xs text-rose-300/80 mt-0.5">
              Tap any hotline button below to dial immediately via mobile or desktop softphone. Do not hesitate to call if water is rising rapidly.
            </p>
          </div>
        </div>

        {/* Global Warning Badge */}
        <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 rounded-xl text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-bold">RULE #1: TURN AROUND, DON'T DROWN</span>
        </div>
      </div>

      {/* Grid of Clickable SOS Hotline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 mb-6">
        {EMERGENCY_HOTLINES.map((hotline) => {
          const isCritical = hotline.priority === 'CRITICAL_SOS';
          const isCopied = copiedId === hotline.id;

          return (
            <div
              key={hotline.id}
              className={`relative rounded-xl p-4 lg:p-5 border transition-all duration-200 flex flex-col justify-between ${
                isCritical
                  ? 'bg-[#19090f] border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:border-rose-400'
                  : 'bg-[#120f18] border-slate-800 hover:border-cyan-500/60 shadow-lg'
              }`}
            >
              {/* Top Tag & Availability */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isCritical
                      ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                      : 'bg-slate-900 text-cyan-300 border-cyan-900/60'
                  }`}>
                    {hotline.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{hotline.availableHours}</span>
                  </div>
                </div>

                {/* Name & Description */}
                <h3 className="text-sm font-bold text-white font-display mb-1.5">
                  {hotline.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {hotline.description}
                </p>

                {/* Instructions Box */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] text-slate-400 mb-4 leading-snug">
                  <strong className="text-slate-200">Protocol:</strong> {hotline.instructions}
                </div>
              </div>

              {/* Call Action Bar with Clickable Tel Link + Copy Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <a
                  href={`tel:${hotline.telNumber}`}
                  onClick={() => soundEffects.playWarningAlert()}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group ${
                    isCritical
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 group-hover:animate-bounce" />
                  <span className="truncate">DIAL {hotline.displayNumber}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(hotline.id, hotline.telNumber)}
                  title="Copy Phone Number"
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flood Survival Quick Directive Footer Strip */}
      <div className="p-3.5 rounded-xl bg-black/60 border border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <LifeBuoy className="w-5 h-5 text-rose-400 shrink-0" />
          <span>
            <strong className="text-white">Vehicle Submersion Guidance:</strong> Just 6 inches of rapid water will reach vehicle undercarriages; 12 inches can sweep most passenger cars away. Unbuckle, open windows immediately, and climb to the roof.
          </span>
        </div>
        <div className="shrink-0">
          <span className="text-[11px] font-bold text-rose-400 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-600/40">
            RAPID SOS ENABLED
          </span>
        </div>
      </div>
    </div>
  );
};
