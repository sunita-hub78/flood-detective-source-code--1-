import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  ShieldAlert,
  Sparkles,
  ChevronDown,
  PhoneCall,
  Download
} from 'lucide-react';
import { CityCaseFile } from '../types';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  currentCase: CityCaseFile;
  onSelectCity: (cityIdOrName: string) => void;
  allCases: CityCaseFile[];
  onToggleSound: () => boolean;
  soundEnabled: boolean;
  activeFilter: 'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE';
  onChangeFilter: (filter: 'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  onSelectCity,
  allCases,
  onToggleSound,
  soundEnabled,
  activeFilter,
  onChangeFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Live detective UTC time clock
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered city list for search dropdown
  const filteredCities = allCases.filter((c) => {
    const matchesQuery = 
      c.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.stateOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.basinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'ALL') return matchesQuery;
    return matchesQuery && c.riskLevel === activeFilter;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      soundEffects.playBlip();
      onSelectCity(searchQuery.trim());
      setIsDropdownOpen(false);
      setSearchQuery('');
    }
  };

  const handleCitySelect = (cityName: string) => {
    soundEffects.playBlip();
    onSelectCity(cityName);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const getRiskColorClasses = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
      case 'MODERATE':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/60';
    }
  };

  return (
    <header id="detective-header" className="h-18 bg-[#0e121a]/95 border-b border-cyan-950/60 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
      {/* Left: Active Case Indicator & Live Threat Level */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse ring-2 ring-[#0e121a]" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-mono-hud text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                {currentCase.caseNumber}
              </span>
              <span className={`text-[10px] font-mono-hud font-bold px-2 py-0.5 rounded border ${getRiskColorClasses(currentCase.riskLevel)}`}>
                {currentCase.riskLevel} SURGE
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 truncate">
              <span>{currentCase.cityName}</span>
              <span className="text-slate-500 text-xs font-normal">({currentCase.stateOrCountry})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: High-Tech Global City Search Bar */}
      <div ref={searchRef} className="flex-1 max-w-xl relative">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-cyan-400/80">
            <Search className="w-4 h-4" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search city, basin, or case ID (e.g., Austin, Valencia, Mumbai)..."
            className="w-full h-10 pl-10 pr-24 rounded-lg bg-[#141a24] border border-cyan-900/50 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/40 font-mono-hud transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            <kbd className="hidden lg:inline-block text-[10px] px-1.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 rounded font-mono-hud">
              ENTER
            </kbd>
          </div>
        </form>

        {/* Autocomplete / Search Dropdown Panel */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-12 bg-[#121722] border border-cyan-800/60 rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
            {/* Quick Filter Tabs */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0b0e15] border-b border-cyan-950/80 text-xs">
              <span className="text-slate-400 font-mono-hud flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE INVESTIGATION HUBS:
              </span>
              <div className="flex items-center gap-1">
                {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE'] as const).map((filter) => (
                  <button
                    key={filter}
                    id={`filter-${filter.toLowerCase()}`}
                    type="button"
                    onClick={() => onChangeFilter(filter)}
                    className={`text-[10px] font-mono-hud px-2 py-0.5 rounded transition-colors ${
                      activeFilter === filter
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Cases */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40">
              {filteredCities.map((item) => (
                <button
                  key={item.id}
                  id={`select-city-${item.id}`}
                  type="button"
                  onClick={() => handleCitySelect(item.cityName)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-cyan-950/30 flex items-center justify-between group transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                        {item.cityName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.stateOrCountry}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono-hud">
                      {item.basinName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono-hud font-bold text-slate-300">
                        {item.overallRiskScore}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                    <span className={`text-[10px] font-mono-hud px-2 py-0.5 rounded border ${getRiskColorClasses(item.riskLevel)}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                </button>
              ))}

              {/* Custom Global Search Option */}
              {searchQuery.trim() && (
                <button
                  id="custom-city-search-btn"
                  type="button"
                  onClick={() => handleCitySelect(searchQuery)}
                  className="w-full text-left px-3.5 py-3 bg-cyan-950/20 hover:bg-cyan-900/30 border-t border-cyan-900/40 flex items-center gap-2.5 text-cyan-300 group"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <div className="text-xs">
                    <span className="font-semibold text-white">Initialize New Detective Dossier:</span>{' '}
                    <span className="text-cyan-400 font-mono-hud">"{searchQuery}"</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Synthesizes real-time radar telemetry, flood basins, and risk suspects.
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Telemetry Clock, Quick Audio Alert, and System Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* UTC Live Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121620] border border-cyan-950/80 text-xs font-mono-hud text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || 'SYNCHRONIZING...'}</span>
        </div>

        {/* Download Project ZIP Button */}
        <a
          id="header-download-zip-btn"
          href="/flood-detective-source-code.zip"
          download="flood-detective-project.zip"
          onClick={() => soundEffects.playBlip()}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-hud font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all border border-emerald-400/40 hover:scale-105"
          title="Download Complete Source Code ZIP (VS Code Ready)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GET ZIP</span>
          <span className="sm:hidden">ZIP</span>
        </a>

        {/* Quick SOS Hotlines Jump Button */}
        <button
          id="header-sos-hotlines-btn"
          type="button"
          onClick={() => {
            soundEffects.playWarningAlert();
            const elem = document.getElementById('emergency-hotlines');
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.hash = '#emergency-hotlines';
            }
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono-hud font-bold text-xs shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all animate-pulse"
          title="Jump to Emergency Hotlines & SOS Numbers"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SOS HOTLINES</span>
          <span className="sm:hidden">SOS</span>
        </button>

        {/* Audio Toggle Button */}
        <button
          id="audio-toggle-btn"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? "Mute Forensic Telemetry Audio" : "Enable Forensic Sonar / Telemetry Audio"}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled 
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-[#141a24] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Rapid Alert Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141a24] border border-slate-800 text-xs">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="hidden md:inline font-mono-hud text-[11px] text-slate-300">
            RADAR: <strong className="text-cyan-400">ACTIVE</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
