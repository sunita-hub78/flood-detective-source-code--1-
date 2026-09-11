import React from 'react';
import { 
  FolderKanban, 
  Radar, 
  Users, 
  Sliders, 
  Archive, 
  Shield, 
  Activity, 
  Radio, 
  Droplets,
  BadgeCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ActiveTab, CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentCase: CityCaseFile;
  allCases: CityCaseFile[];
  onSelectCity: (cityName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentCase,
  allCases,
  onSelectCity,
}) => {
  const navItems = [
    {
      id: 'investigation-board' as ActiveTab,
      label: 'Investigation Board',
      subtitle: 'Evidence Corkboard & Suspects',
      icon: FolderKanban,
      badge: `${currentCase.suspects.length + currentCase.evidenceExhibits.length} Items`,
      isPrimary: true
    },
    {
      id: 'radar-telemetry' as ActiveTab,
      label: 'Radar & Hydrograph',
      subtitle: 'Doppler Sweep & River Gauge',
      icon: Radar,
      badge: `${currentCase.telemetry.rainfallCurrentMmHr} mm/h`
    },
    {
      id: 'suspect-dossiers' as ActiveTab,
      label: 'Suspect Dossiers',
      subtitle: 'Meteorology vs Drainage',
      icon: Users,
      badge: `${currentCase.suspects.length} Culprits`
    },
    {
      id: 'incident-sim' as ActiveTab,
      label: 'Surge Simulator',
      subtitle: 'Runoff & Chokepoint Lab',
      icon: Sliders,
      badge: 'Interactive'
    },
    {
      id: 'case-archives' as ActiveTab,
      label: 'Cold Cases Archive',
      subtitle: 'Historical Flash Floods',
      icon: Archive,
      badge: '5 Archived'
    }
  ];

  const handleNav = (tab: ActiveTab) => {
    soundEffects.playBlip();
    onTabChange(tab);
  };

  const handleCityPick = (name: string) => {
    soundEffects.playBlip();
    onSelectCity(name);
  };

  return (
    <aside id="detective-sidebar" className="w-72 bg-[#0c0f16] border-r border-cyan-950/70 flex flex-col h-[calc(100vh-4.5rem)] sticky top-18 shrink-0 select-none">
      {/* Brand & Badge Header */}
      <div className="p-4 border-b border-cyan-950/80 bg-gradient-to-b from-[#111722] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
              <span>FLOOD DETECTIVE</span>
            </h1>
            <p className="text-[10px] font-mono-hud text-cyan-400 tracking-wider">
              FORENSIC HYDRO-INVESTIGATION
            </p>
          </div>
        </div>

        {/* Live Active Sector Status */}
        <div className="mt-3.5 px-2.5 py-2 rounded-lg bg-[#141a25] border border-cyan-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-mono-hud text-[11px] text-slate-300">
              SECTOR: <strong className="text-white">{currentCase.cityName.toUpperCase()}</strong>
            </span>
          </div>
          <span className="font-mono-hud text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
            {currentCase.riskScore ?? currentCase.overallRiskScore}/100
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
        <div className="px-2 py-1 text-[10px] font-mono-hud text-slate-400 uppercase tracking-wider">
          INVESTIGATION MODULES
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 relative group ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-[#111622]/60 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-[#141a26] hover:border-slate-700'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#00e5ff]" />
              )}
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-800/60 text-slate-400 group-hover:text-cyan-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 tracking-wide font-display">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono-hud px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono-hud">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}

        {/* Quick Hotspot Case Switcher */}
        <div className="pt-4 pb-1">
          <div className="px-2 py-1 text-[10px] font-mono-hud text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>PRIORITY HOTSPOTS</span>
            <span className="text-[9px] text-cyan-400">SURGE ALERTS</span>
          </div>

          <div className="space-y-1 mt-1">
            {allCases.slice(0, 5).map((c) => {
              const isSelected = c.id === currentCase.id;
              return (
                <button
                  key={c.id}
                  id={`quick-case-${c.id}`}
                  type="button"
                  onClick={() => handleCityPick(c.cityName)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="truncate">{c.cityName}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono-hud text-slate-400">
                      {c.telemetry.rainfallCurrentMmHr} mm/h
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.riskLevel === 'CRITICAL'
                          ? 'bg-rose-400 animate-pulse'
                          : c.riskLevel === 'HIGH'
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Investigator Badge Card at Sidebar Bottom */}
      <div className="p-3.5 border-t border-cyan-950/80 bg-[#0a0d13]">
        <div className="p-2.5 rounded-xl bg-[#111622] border border-cyan-900/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <BadgeCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 truncate font-display">
                {currentCase.investigatorLead}
              </span>
              <span className="text-[9px] font-mono-hud text-cyan-400 px-1 py-0.2 bg-cyan-950/60 rounded border border-cyan-900/60">
                {currentCase.badgeNumber}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Hydrological Forensics Unit
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono-hud text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            GRID: 14 NODES ONLINE
          </span>
          <span className="text-amber-400">LATENCY: 12ms</span>
        </div>
      </div>
    </aside>
  );
};
