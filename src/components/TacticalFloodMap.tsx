import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Radio, 
  AlertTriangle, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  Compass,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { CityCaseFile, ChokepointData, HydroSensor } from '../types';
import { getHydroSensorsForCase } from '../utils/hydroSensors';
import { soundEffects } from '../utils/audio';

interface TacticalFloodMapProps {
  caseFile: CityCaseFile;
  maintenanceSensorIds?: string[];
  onToggleSensor?: (sensorId: string) => void;
  isSimulatedSpike?: boolean;
}

export const TacticalFloodMap: React.FC<TacticalFloodMapProps> = ({
  caseFile,
  maintenanceSensorIds = [],
  onToggleSensor,
  isSimulatedSpike = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Toggles
  const [showRadarOverlay, setShowRadarOverlay] = useState<boolean>(true);
  const [showWarningPins, setShowWarningPins] = useState<boolean>(true);
  const [showChokepoints, setShowChokepoints] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [activeLegend, setActiveLegend] = useState<boolean>(true);
  const [selectedPinInfo, setSelectedPinInfo] = useState<string | null>(null);

  const sensors = useMemo(() => getHydroSensorsForCase(caseFile), [caseFile]);

  // Center coordinates of the active city
  const centerLat = caseFile.coordinates.lat;
  const centerLng = caseFile.coordinates.lng;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If map already exists, remove it before reinitializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
      maxZoom: 18,
      minZoom: 10,
    });

    // Sleek Dark Matter Tactical CartoDB Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Fix map container size on render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [centerLat, centerLng]);

  // Parse or offset coordinates for chokepoints
  const parseCoordinates = (coordStr: string, index: number): [number, number] => {
    const match = coordStr.match(/([\d.]+)\s*°?\s*([NS])\s*,\s*([\d.]+)\s*°?\s*([EW])/i);
    if (match) {
      const lat = parseFloat(match[1]) * (match[2].toUpperCase() === 'S' ? -1 : 1);
      const lng = parseFloat(match[3]) * (match[4].toUpperCase() === 'W' ? -1 : 1);
      return [lat, lng];
    }
    // Fallback circular offset around city center
    const angle = (index * (360 / (caseFile.chokepoints.length || 4))) * (Math.PI / 180);
    const radius = 0.015 + index * 0.006;
    return [centerLat + Math.sin(angle) * radius, centerLng + Math.cos(angle) * radius];
  };

  // Render Map Overlays and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Mock Radar Indicators (Concentric Reflectivity Rings & Storm Cell Contours)
    if (showRadarOverlay) {
      // Upstream storm epicenter coordinates
      const stormLat = centerLat + 0.014;
      const stormLng = centerLng - 0.012;

      // Outer Radar Echo Coverage Circle (Light rain 25-35 dBZ)
      const outerRadarCircle = L.circle([stormLat, stormLng], {
        radius: 4200,
        color: '#00e5ff',
        weight: 1.5,
        opacity: 0.5,
        fillColor: '#0284c7',
        fillOpacity: 0.12,
        dashArray: '5, 5',
      });
      outerRadarCircle.bindTooltip('Radar Echo Perimeter: 35 dBZ Moderate Rain', {
        className: 'font-mono-hud text-[10px] bg-slate-900 text-cyan-300 border border-cyan-500/40',
      });
      layerGroup.addLayer(outerRadarCircle);

      // Mid-tier Heavy Squall Core (45-55 dBZ)
      const midRadarCircle = L.circle([stormLat, stormLng], {
        radius: 2400,
        color: '#f59e0b',
        weight: 2,
        opacity: 0.7,
        fillColor: '#d97706',
        fillOpacity: 0.22,
      });
      midRadarCircle.bindTooltip('Intense Rainband Core: 52 dBZ Squall', {
        className: 'font-mono-hud text-[10px] bg-slate-900 text-amber-300 border border-amber-500/40',
      });
      layerGroup.addLayer(midRadarCircle);

      // Inner Convective Red Core (60-65+ dBZ Extreme Flash Surge)
      const innerCoreCircle = L.circle([stormLat, stormLng], {
        radius: isSimulatedSpike ? 1600 : 1100,
        color: '#f43f5e',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#e11d48',
        fillOpacity: isSimulatedSpike ? 0.45 : 0.35,
      });
      innerCoreCircle.bindTooltip(`Critical Storm Core: ${isSimulatedSpike ? '68 dBZ (SQUALL SPIKE)' : '62 dBZ Extreme'}`, {
        className: 'font-mono-hud text-[10px] bg-rose-950 text-rose-200 border border-rose-500',
      });
      layerGroup.addLayer(innerCoreCircle);

      // Radar Station Beacon Pulse Marker
      const radarIcon = L.divIcon({
        className: 'radar-beacon-div-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-cyan-400 opacity-40 animate-ping"></span>
            <div class="w-6 h-6 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#00e5ff]">
              <div class="w-2 h-2 rounded-full bg-cyan-300"></div>
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-500/40 text-[9px] font-mono-hud text-cyan-300 font-bold">
              RADAR ECHO SWEEP
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const radarMarker = L.marker([stormLat, stormLng], { icon: radarIcon });
      radarMarker.bindPopup(`
        <div class="p-2 font-mono-hud text-xs space-y-1">
          <div class="text-cyan-400 font-bold text-sm">DOPPLER RADAR ECHO CORE</div>
          <div class="text-slate-300">Peak Reflectivity: <strong class="text-rose-400">62 dBZ</strong></div>
          <div class="text-slate-400">Cell Motion: <strong class="text-amber-300">Stalled (Back-Building)</strong></div>
          <div class="text-[10px] text-slate-400 mt-1">Convective cell training along basin contour line.</div>
        </div>
      `);
      layerGroup.addLayer(radarMarker);
    }

    // 2. High-Risk Municipal Chokepoints (Warning Pins)
    if (showChokepoints) {
      caseFile.chokepoints.forEach((cp, idx) => {
        const [lat, lng] = parseCoordinates(cp.coordinates, idx);
        const isOvertopped = cp.status === 'OVERTOPPED';
        const isRestricted = cp.status === 'RESTRICTED';

        const pinColor = isOvertopped ? '#f43f5e' : isRestricted ? '#f59e0b' : '#00e5ff';
        const pulseAnim = isOvertopped ? 'animate-ping' : '';

        const chokepointIcon = L.divIcon({
          className: 'custom-chokepoint-pin',
          html: `
            <div class="relative flex flex-col items-center group cursor-pointer">
              ${isOvertopped ? `<span class="absolute -top-1 w-6 h-6 rounded-full bg-rose-500 opacity-60 ${pulseAnim}"></span>` : ''}
              <div class="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform hover:scale-110" style="background-color: #0b0f17; border-color: ${pinColor}; box-shadow: 0 0 10px ${pinColor}88;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${pinColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono-hud font-bold whitespace-nowrap shadow-md" style="background-color: #0a0d15e6; border: 1px solid ${pinColor}88; color: ${pinColor};">
                ${cp.name.split(' ')[0]} (${cp.drainageCapacityPct}%)
              </div>
            </div>
          `,
          iconSize: [28, 38],
          iconAnchor: [14, 19],
        });

        const marker = L.marker([lat, lng], { icon: chokepointIcon });
        marker.bindPopup(`
          <div class="p-2.5 font-mono-hud text-xs space-y-1.5 min-w-[220px]">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1">
              <span class="font-bold text-white text-sm">${cp.name}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${
                isOvertopped ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'bg-amber-950 text-amber-300 border border-amber-500/50'
              }">
                ${cp.status}
              </span>
            </div>
            <div class="text-[11px] text-slate-300 space-y-0.5">
              <div>Drainage Capacity: <strong class="${isOvertopped ? 'text-rose-400' : 'text-amber-400'}">${cp.drainageCapacityPct}%</strong></div>
              <div>Water Velocity: <strong class="text-cyan-300">${cp.waterSpeedMs} m/s</strong></div>
              <div>Debris Occlusion: <strong class="text-amber-400">${cp.debrisBlockagePct}%</strong></div>
              <div>Type: <span class="text-slate-400">${cp.type}</span></div>
            </div>
            <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Coordinates: ${cp.coordinates}
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 3. High-Risk Culprit Pins (Suspects Geo-Anchors)
    if (showWarningPins) {
      caseFile.suspects.slice(0, 3).forEach((suspect, idx) => {
        // Offset angles for suspect locations
        const angle = (idx * 120 + 45) * (Math.PI / 180);
        const lat = centerLat + Math.sin(angle) * 0.022;
        const lng = centerLng + Math.cos(angle) * 0.022;

        const isCritical = suspect.impactLevel === 'CRITICAL';
        const color = isCritical ? '#f43f5e' : '#f59e0b';

        const suspectPinIcon = L.divIcon({
          className: 'suspect-geo-pin',
          html: `
            <div class="relative flex flex-col items-center cursor-pointer">
              <div class="w-6 h-6 rounded-md border-2 flex items-center justify-center font-mono-hud text-[11px] font-bold shadow-lg" style="background-color: #0d111a; border-color: ${color}; color: ${color}; box-shadow: 0 0 10px ${color}88;">
                !
              </div>
              <div class="mt-1 px-1.5 py-0.5 rounded text-[8px] font-mono-hud font-bold whitespace-nowrap bg-slate-900/90 border border-slate-700 text-slate-300">
                ${suspect.alias}
              </div>
            </div>
          `,
          iconSize: [24, 32],
          iconAnchor: [12, 16],
        });

        const suspectMarker = L.marker([lat, lng], { icon: suspectPinIcon });
        suspectMarker.bindPopup(`
          <div class="p-2 font-mono-hud text-xs space-y-1 min-w-[210px]">
            <div class="text-amber-400 font-bold text-xs uppercase">${suspect.category} HAZARD</div>
            <div class="text-white font-bold text-sm">${suspect.name}</div>
            <div class="text-slate-300 text-[11px] leading-snug">${suspect.summary}</div>
            <div class="text-[10px] text-cyan-300 mt-1">Confidence: ${suspect.confidenceScore}% | ${suspect.status}</div>
          </div>
        `);
        layerGroup.addLayer(suspectMarker);
      });
    }

    // 4. Hydro-Sensors (Transducers & Stream Gauges)
    if (showSensors) {
      sensors.forEach((sensor, idx) => {
        const inMaintenance = maintenanceSensorIds.includes(sensor.id);
        const angle = (idx * 90 + 30) * (Math.PI / 180);
        const lat = centerLat + Math.sin(angle) * 0.016;
        const lng = centerLng + Math.cos(angle) * 0.016;

        const sensorColor = inMaintenance ? '#64748b' : '#10b981';

        const sensorDivIcon = L.divIcon({
          className: 'sensor-geo-pin',
          html: `
            <div class="relative flex flex-col items-center cursor-pointer ${inMaintenance ? 'opacity-60 grayscale' : ''}">
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono-hud text-[9px] font-bold" style="background-color: #090e17; border-color: ${sensorColor}; color: ${sensorColor}; box-shadow: 0 0 8px ${sensorColor}66;">
                S
              </div>
              <div class="mt-0.5 px-1 py-0.2 rounded text-[8px] font-mono-hud font-bold whitespace-nowrap bg-slate-900 border border-slate-700 ${inMaintenance ? 'text-slate-500 line-through' : 'text-emerald-400'}">
                ${sensor.code}
              </div>
            </div>
          `,
          iconSize: [20, 26],
          iconAnchor: [10, 13],
        });

        const sensorMarker = L.marker([lat, lng], { icon: sensorDivIcon });
        sensorMarker.bindPopup(`
          <div class="p-2 font-mono-hud text-xs space-y-1 min-w-[200px]">
            <div class="flex items-center justify-between">
              <span class="text-amber-400 font-bold">${sensor.code}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.2 rounded ${inMaintenance ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-300'}">
                ${inMaintenance ? 'MAINTENANCE' : 'ONLINE'}
              </span>
            </div>
            <div class="text-white font-bold text-xs">${sensor.name}</div>
            <div class="text-slate-400 text-[11px]">Metric: <strong class="${inMaintenance ? 'text-slate-500 line-through' : 'text-cyan-300'}">${sensor.primaryMetricValue}</strong></div>
          </div>
        `);
        layerGroup.addLayer(sensorMarker);
      });
    }

  }, [
    centerLat,
    centerLng,
    showRadarOverlay,
    showWarningPins,
    showChokepoints,
    showSensors,
    caseFile,
    maintenanceSensorIds,
    sensors,
    isSimulatedSpike,
  ]);

  const handleRecenter = () => {
    soundEffects.playBlip();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([centerLat, centerLng], 13, { animate: true });
    }
  };

  return (
    <div className="relative rounded-xl bg-[#0a0d16] border border-cyan-900/80 shadow-2xl overflow-hidden font-mono-hud flex flex-col">
      {/* Top Map Header & Controls Bar */}
      <div className="p-3 bg-[#0d1320] border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2.5 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-display font-bold text-white uppercase tracking-wider">
                TACTICAL GEOSPATIAL RADAR & HAZARD MAP
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                LEAFLET TACTICAL HUD
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Basin: <strong className="text-slate-200">{caseFile.basinName}</strong> ({centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°W)
            </div>
          </div>
        </div>

        {/* Map Overlays Toggle Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setShowRadarOverlay(!showRadarOverlay);
            }}
            className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all ${
              showRadarOverlay
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>Radar Echo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setShowChokepoints(!showChokepoints);
            }}
            className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all ${
              showChokepoints
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Chokepoint Pins</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBlip();
              setShowSensors(!showSensors);
            }}
            className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all ${
              showSensors
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Sensors</span>
          </button>

          <button
            type="button"
            onClick={handleRecenter}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Recenter Map on Basin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaflet Map Interactive Canvas */}
      <div className="relative w-full h-80 sm:h-96">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tactical Crosshair / Center Watermark */}
        <div className="absolute top-3 left-3 pointer-events-none z-[400] bg-slate-950/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-2 text-[10px] space-y-0.5 text-slate-300">
          <div className="text-cyan-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>LIVE GEOSPATIAL SURVEILLANCE</span>
          </div>
          <div>Scale: 1:25,000 | Projection: EPSG:3857</div>
          <div className="text-amber-400 font-bold">
            Risk Tier: {caseFile.riskLevel} ({caseFile.overallRiskScore}/100)
          </div>
        </div>

        {/* Legend Overlay at bottom-right */}
        {activeLegend && (
          <div className="absolute bottom-3 right-3 z-[400] bg-slate-950/85 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-[10px] space-y-1.5 shadow-xl">
            <div className="flex items-center justify-between gap-4 font-bold text-slate-200 border-b border-slate-800 pb-1">
              <span>RADAR & RISK LEGEND</span>
              <button
                type="button"
                onClick={() => setActiveLegend(false)}
                className="text-slate-500 hover:text-slate-300 text-[9px]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                <span className="text-rose-300">Overtopped / Extreme (&gt;60 dBZ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
                <span className="text-amber-300">Restricted / Heavy (45-55 dBZ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                <span className="text-cyan-300">Moderate Rain Echo (35 dBZ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span className="text-emerald-300">Online Hydro-Sensor</span>
              </div>
            </div>
          </div>
        )}

        {!activeLegend && (
          <button
            type="button"
            onClick={() => setActiveLegend(true)}
            className="absolute bottom-3 right-3 z-[400] bg-slate-900/80 border border-slate-700 px-2 py-1 rounded text-[10px] text-slate-400 hover:text-slate-200"
          >
            Show Legend
          </button>
        )}
      </div>

      {/* Footer Status Strip */}
      <div className="p-2.5 bg-[#0b0e18] border-t border-cyan-950 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any pin or radar contour on the map to inspect telemetry & hydraulic chokepoint data.</span>
        </div>
        <div className="text-slate-500">
          Tiles: CartoDB Dark Matter
        </div>
      </div>
    </div>
  );
};
