import { CityCaseFile, RiskCulprit, EvidenceExhibit, ChokepointData, TimelineEvent } from '../types';

export const INITIAL_CASE_FILES: CityCaseFile[] = [
  {
    id: 'austin-tx',
    caseNumber: 'CASE-FFD-7821-ATX',
    cityName: 'Austin',
    stateOrCountry: 'Texas, USA',
    basinName: 'Shoal Creek & Lower Colorado Tributary Basin',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    overallRiskScore: 89,
    riskLevel: 'CRITICAL',
    investigatorLead: 'Det. Vance Cross',
    badgeNumber: 'HYDRO-049',
    caseOpenedTime: '2026-09-09 11:15 CST',
    threatVerdict: 'IMMINENT SURGE: Severe convective storm cell stalling directly over Balcones Fault line. Limestone soils saturated; rapid runoff into urban creek beds expected within 35 minutes.',
    recommendedAction: 'Immediate low-water crossing closures on Lamar Blvd and 24th St. Trigger Level 2 flood evacuation sirens for lower Shoal Creek corridor.',
    telemetry: {
      rainfallCurrentMmHr: 84.5,
      rainfallPeakMmHr: 112.0,
      rainfallAccum24hMm: 148.2,
      soilMoisturePct: 94.6,
      runoffCoefficientPct: 88.0,
      riverLevelMeters: 4.85,
      riverFloodStageMeters: 4.20,
      riverFlowRateCubicMs: 410.5,
      atmosphericPressureHpa: 1004.2,
      urbanPermeabilityPct: 18.5,
      estimatedTimeToPeakMin: 32,
    },
    suspects: [
      {
        id: 'suspect-atx-1',
        name: 'Convective Squall Training Band',
        alias: 'The Stalled Cell',
        category: 'METEOROLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 97,
        summary: 'Back-building thunderstorm anchored along the Balcones Escarpment, dumping intense precipitation without translation velocity.',
        forensicEvidence: 'NEXRAD Level II Doppler reflectivity showing persistent 62 dBZ core stationary over northern Travis County for 85 consecutive minutes.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Doppler Echo', value: '62 dBZ', severity: 'red' },
          { label: 'Precip Rate', value: '84.5 mm/h', severity: 'red' },
          { label: 'Cell Movement', value: '4 km/h (Stalled)', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-atx-2',
        name: 'Limestone Karst Infiltration Ceiling',
        alias: 'The Concrete Sponge',
        category: 'GEOLOGY',
        impactLevel: 'SEVERE',
        confidenceScore: 92,
        summary: 'Thin topsoil layer over impervious Cretaceous limestone bedrock reached absolute saturation at 09:40 UTC.',
        forensicEvidence: 'Tensiometer sensor array #04 indicates 0.0 mm/hr percolation rate. 96% of subsequent rain converted directly into sheetflow runoff.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Soil Saturation', value: '94.6%', severity: 'red' },
          { label: 'Infiltration Rate', value: '0.2 mm/hr', severity: 'red' },
          { label: 'Bedrock Depth', value: '18 cm', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-atx-3',
        name: 'Urban Impervious Asphalt Expansion',
        alias: 'The Parking Lot Funnel',
        category: 'INFRASTRUCTURE',
        impactLevel: 'ELEVATED',
        confidenceScore: 88,
        summary: '81.5% impervious coverage in downtown commercial district accelerated hydraulic concentration time by a factor of 3.4x.',
        forensicEvidence: 'Satellite multispectral NDVI runoff indices confirm runoff coefficient jumped from historical baseline 0.35 to 0.88.',
        status: 'ACCOMPLICE',
        metrics: [
          { label: 'Impervious Area', value: '81.5%', severity: 'amber' },
          { label: 'Concentration Time', value: '18 min', severity: 'red' },
          { label: 'Peak Multiplier', value: '3.4x', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-atx-4',
        name: 'Lamar Bridge Culvert Debris Dam',
        alias: 'The Chokepoint Bottleneck',
        category: 'INFRASTRUCTURE',
        impactLevel: 'CRITICAL',
        confidenceScore: 95,
        summary: 'Submerged acoustic sonar and thermal traffic cameras reveal uprooted cedar debris jamming central arch 2 & 3.',
        forensicEvidence: 'Stage differential of 1.45 meters observed between upstream and downstream bridge pier sensors.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Hydraulic Blockage', value: '68%', severity: 'red' },
          { label: 'Head Loss Delta', value: '+1.45 m', severity: 'red' },
          { label: 'Water Backing', value: '780 m upstream', severity: 'red' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-atx-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'NEXRAD Dual-Pol Polarimetric Radar Core',
        type: 'RADAR_ECHO',
        classification: 'CRITICAL_PROOF',
        timestamp: '11:20:00 CST',
        sensorLocation: 'KEWX New Braunfels Terminal Doppler',
        keyFinding: 'Extreme reflectivity core >60 dBZ with differential reflectivity (ZDR) approaching 0 dB indicating water-coated giant raindrops and supercooled hydrometeors.',
        details: 'Training cell has anchored over the watershed divide for 1 hour 25 minutes. Total column liquid water content exceeds historical 99th percentile for Central Texas autumn storms.',
        metricHighlight: {
          label: 'Reflectivity Intensity',
          value: '62 dBZ',
          subtext: 'Violent Cloudburst Threshold',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-atx-1',
        boardCoords: { x: 8, y: 12 }
      },
      {
        id: 'exhibit-atx-02',
        exhibitCode: 'EXHIBIT B-2',
        title: 'Shoal Creek USGS Gauge 08156800 Hydrograph',
        type: 'HYDROGRAPH',
        classification: 'CRITICAL_PROOF',
        timestamp: '11:22:15 CST',
        sensorLocation: 'Shoal Creek at 12th Street (Station 08156800)',
        keyFinding: 'Flash rise rate of 1.1 meters in 15 minutes. Stage currently 4.85m, breaching Major Flood Stage (4.20m).',
        details: 'Hydrograph displays classic "knife-edge" flash surge profile. Time-to-peak compressed by urban channelization upstream. Discharge estimated at 410 m³/s.',
        metricHighlight: {
          label: 'Stage Height',
          value: '4.85 m (Major Flood)',
          subtext: '+0.65m above threshold',
          trend: 'rising'
        },
        pinned: true,
        linkedSuspectId: 'suspect-atx-4',
        boardCoords: { x: 38, y: 16 }
      },
      {
        id: 'exhibit-atx-03',
        exhibitCode: 'EXHIBIT C-3',
        title: 'Balcones Fault Escarpment Terrain Gradient Map',
        type: 'SATELLITE_MASK',
        classification: 'CORROBORATING',
        timestamp: '11:05:00 CST',
        sensorLocation: 'LiDAR Airborne Elevation Grid (DEM 1m)',
        keyFinding: 'Mean basin slope of 12.8% channels surface water into narrow limestone canyons with minimal friction loss.',
        details: 'Gravity-driven hydraulic acceleration reaches 4.6 m/s in natural bedrock flumes before hitting urban stormwater inlets.',
        metricHighlight: {
          label: 'Basin Slope Gradient',
          value: '12.8° Mean',
          subtext: 'High Velocity Funneling',
          trend: 'stable'
        },
        pinned: true,
        linkedSuspectId: 'suspect-atx-2',
        boardCoords: { x: 68, y: 14 }
      },
      {
        id: 'exhibit-atx-04',
        exhibitCode: 'EXHIBIT D-4',
        title: 'Acoustic Sonar & Culvert Telemetry Probe',
        type: 'CHOKEPOINT_SENSOR',
        classification: 'CRITICAL_PROOF',
        timestamp: '11:25:30 CST',
        sensorLocation: 'Culvert Junction #14 (Lamar Blvd Inundation Hub)',
        keyFinding: 'Upstream debris buildup has throttled flow area by 68%. Severe hydraulic jump generating backwater flooding.',
        details: 'Automated pressure transducers show turbulent cavitation and surge vortex forming. Structural stress levels at 84% allowable load.',
        metricHighlight: {
          label: 'Debris Chokepoint',
          value: '68% Occlusion',
          subtext: 'Immediate Clearance Required',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-atx-4',
        boardCoords: { x: 22, y: 55 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-atx-1',
        name: 'Lamar Boulevard Arch Span',
        type: 'BRIDGE_PIER',
        drainageCapacityPct: 142,
        waterSpeedMs: 4.8,
        debrisBlockagePct: 68,
        status: 'OVERTOPPED',
        coordinates: '30.2721° N, 97.7512° W'
      },
      {
        id: 'cp-atx-2',
        name: '24th Street Storm Culvert Influx',
        type: 'CULVERT',
        drainageCapacityPct: 118,
        waterSpeedMs: 3.9,
        debrisBlockagePct: 45,
        status: 'RESTRICTED',
        coordinates: '30.2882° N, 97.7489° W'
      },
      {
        id: 'cp-atx-3',
        name: 'Pease Park Detention Spillway',
        type: 'CANAL_WEIR',
        drainageCapacityPct: 92,
        waterSpeedMs: 2.7,
        debrisBlockagePct: 18,
        status: 'CAUTION',
        coordinates: '30.2810° N, 97.7533° W'
      },
      {
        id: 'cp-atx-4',
        name: 'Lady Bird Lake Outfall Junction',
        type: 'STORM_TUNNEL',
        drainageCapacityPct: 78,
        waterSpeedMs: 2.1,
        debrisBlockagePct: 12,
        status: 'CLEAR',
        coordinates: '30.2644° N, 97.7521° W'
      }
    ],
    timeline: [
      { time: '09:30', timeRelative: '-110m', rainIntensityMm: 12, riverStageM: 1.2, floodRiskScore: 24, isProjected: false, incidentFlag: 'Rain band enters county' },
      { time: '10:00', timeRelative: '-80m', rainIntensityMm: 38, riverStageM: 1.8, floodRiskScore: 46, isProjected: false },
      { time: '10:30', timeRelative: '-50m', rainIntensityMm: 72, riverStageM: 2.9, floodRiskScore: 72, isProjected: false, incidentFlag: 'Soil saturation reached 90%' },
      { time: '11:00', timeRelative: '-20m', rainIntensityMm: 98, riverStageM: 4.1, floodRiskScore: 84, isProjected: false, incidentFlag: 'Minor flood stage breached' },
      { time: '11:20', timeRelative: 'NOW', rainIntensityMm: 85, riverStageM: 4.85, floodRiskScore: 89, isProjected: false, incidentFlag: 'CODE AMBER SURGE: Major flood stage' },
      { time: '11:50', timeRelative: '+30m', rainIntensityMm: 70, riverStageM: 5.3, floodRiskScore: 94, isProjected: true, incidentFlag: 'Projected crest at downtown bridge' },
      { time: '12:20', timeRelative: '+60m', rainIntensityMm: 35, riverStageM: 5.1, floodRiskScore: 82, isProjected: true },
      { time: '12:50', timeRelative: '+90m', rainIntensityMm: 15, riverStageM: 4.2, floodRiskScore: 65, isProjected: true, incidentFlag: 'Receding below roadway crest' }
    ],
    investigatorNotes: [
      {
        id: 'note-atx-1',
        author: 'Det. Vance Cross',
        badge: 'HYDRO-049',
        time: '11:18 CST',
        note: 'Debris field at Lamar Blvd arch is expanding rapidly. If arch #1 clogs, roadway will experience 0.5m sheetflow across all 4 traffic lanes within 18 minutes.',
        tag: 'ALERT'
      },
      {
        id: 'note-atx-2',
        author: 'Forensic Hydrologist Lin',
        badge: 'GEO-012',
        time: '11:02 CST',
        note: 'Infiltration tests verify karst fissures are completely flooded. Zero natural absorption remains. Every millimeter of falling rain is now 100% downstream runoff.',
        tag: 'EVIDENCE'
      },
      {
        id: 'note-atx-3',
        author: 'Det. Vance Cross',
        badge: 'HYDRO-049',
        time: '10:45 CST',
        note: 'Radar cross-section shows upper-level divergence holding cell stationary. We are treating this as an identical analogue to the 1981 Memorial Day storm setup.',
        tag: 'HYPOTHESIS'
      }
    ]
  },
  {
    id: 'valencia-es',
    caseNumber: 'CASE-FFD-9912-VLC',
    cityName: 'Valencia',
    stateOrCountry: 'Spain (Comunitat Valenciana)',
    basinName: 'Barranco del Poyo & Turia Basin Complex',
    coordinates: { lat: 39.4699, lng: -0.3763 },
    overallRiskScore: 96,
    riskLevel: 'CRITICAL',
    investigatorLead: 'Chief Insp. Elena Morales',
    badgeNumber: 'DANA-EUR-01',
    caseOpenedTime: '2026-09-09 17:30 CET',
    threatVerdict: 'CATASTROPHIC DANA DEEP CUT-OFF LOW: Multi-supercell stationary convective cluster funneled down dry river ravine (Rambla). Surge wall traveling at 7 m/s toward populated coastal plain.',
    recommendedAction: 'Trigger immediate RED CODE phone broadcast (ES-Alert). Ban all vehicular travel on V-30 and V-31 highways. Evacuate ground levels in Paiporta and Catarroja.',
    telemetry: {
      rainfallCurrentMmHr: 124.0,
      rainfallPeakMmHr: 180.5,
      rainfallAccum24hMm: 440.0,
      soilMoisturePct: 98.2,
      runoffCoefficientPct: 94.5,
      riverLevelMeters: 6.40,
      riverFloodStageMeters: 3.50,
      riverFlowRateCubicMs: 2200.0,
      atmosphericPressureHpa: 998.0,
      urbanPermeabilityPct: 12.0,
      estimatedTimeToPeakMin: 18,
    },
    suspects: [
      {
        id: 'suspect-vlc-1',
        name: 'DANA Mediterranean Cut-Off Low',
        alias: 'The Cold Drop Vortex',
        category: 'METEOROLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 99,
        summary: 'Deep high-altitude polar vortex isolated over warm Balearic Sea (24°C water) acting as an atmospheric moisture pump.',
        forensicEvidence: 'Precipitable water analysis shows anomalous moisture plume feeding continuously from Gulf of Valencia into inland mountains.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Sea Temp Anomaly', value: '+2.8 °C', severity: 'red' },
          { label: 'Precipitable Water', value: '52 mm PWAT', severity: 'red' },
          { label: 'Rainfall 24h', value: '440 mm', severity: 'red' }
        ]
      },
      {
        id: 'suspect-vlc-2',
        name: 'Barranco del Poyo Ephemeral Ravine',
        alias: 'The Dry Gully Torrent',
        category: 'GEOLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 98,
        summary: 'Normally dry gravel ravine transformed into a 2,200 m³/s raging torrent with zero flood plain buffer.',
        forensicEvidence: 'Hydraulic telemetry sensors in Chiva recorded discharge rising from 0 to 1,800 m³/s in under 50 minutes.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Flow Discharge', value: '2,200 m³/s', severity: 'red' },
          { label: 'Surge Velocity', value: '6.8 m/s', severity: 'red' },
          { label: 'Gully Width', value: '28 m (Choked)', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-vlc-3',
        name: 'Urban Sprawl Across Natural Alluvial Fans',
        alias: 'The Concrete Obstacle',
        category: 'INFRASTRUCTURE',
        impactLevel: 'SEVERE',
        confidenceScore: 93,
        summary: 'Residential and industrial estates built across natural flood paths created high barriers that deflected surge into narrow streets.',
        forensicEvidence: 'Street-canyon velocity amplification factors exceed 2.2x between multi-story masonry blocks.',
        status: 'ACCOMPLICE',
        metrics: [
          { label: 'Channel Obstruction', value: '74%', severity: 'red' },
          { label: 'Street Inundation Depth', value: '2.1 m', severity: 'red' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-vlc-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'AEMET Valencia Doppler Reflectivity Loop',
        type: 'RADAR_ECHO',
        classification: 'CRITICAL_PROOF',
        timestamp: '17:35:00 CET',
        sensorLocation: 'Cullera Dual-Polarization Weather Radar',
        keyFinding: 'Stationary V-shaped convective storm train dumping sustained rain exceeding 150 mm in 2 hours over Chiva and Utiel.',
        details: 'Convective cells continuously regenerate at the exact same geographic convergence zone along the Sierra de Chiva slopes.',
        metricHighlight: {
          label: 'Doppler Echo',
          value: '66 dBZ',
          subtext: 'Torrential Hail/Rain Core',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-vlc-1',
        boardCoords: { x: 10, y: 15 }
      },
      {
        id: 'exhibit-vlc-02',
        exhibitCode: 'EXHIBIT B-2',
        title: 'CHJ Rambla del Poyo Hydrological Sensor Pulse',
        type: 'HYDROGRAPH',
        classification: 'CRITICAL_PROOF',
        timestamp: '17:40:00 CET',
        sensorLocation: 'Poyo Sensor Node #208 (Riba-roja de Túria)',
        keyFinding: 'Catastrophic vertical rise rate: sensor went from 0.4m to 6.4m in 42 minutes before transmission was severed.',
        details: 'The flow rate exceeded the design capacity of all downstream highway underpasses and town bridges simultaneously.',
        metricHighlight: {
          label: 'Peak Discharge',
          value: '2,200 m³/s',
          subtext: 'Exceeds Ebro River Mean Flow',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-vlc-2',
        boardCoords: { x: 42, y: 12 }
      },
      {
        id: 'exhibit-vlc-03',
        exhibitCode: 'EXHIBIT C-3',
        title: 'High-Resolution Sentinel-1 SAR Flood Extent Mask',
        type: 'SATELLITE_MASK',
        classification: 'CRITICAL_PROOF',
        timestamp: '17:15:00 CET',
        sensorLocation: 'Copernicus EMS Rapid Mapping Constellation',
        keyFinding: 'Inundation footprint spans 14,000 hectares across l\'Horta Sud district with standing water up to 2.4m in basement basements.',
        details: 'Satellite radar backscatter confirms complete submersion of commercial rail depots and industrial perimeter roads.',
        metricHighlight: {
          label: 'Flooded Area',
          value: '142 km²',
          subtext: 'Over 12 Municipalities Impacted',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-vlc-3',
        boardCoords: { x: 72, y: 18 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-vlc-1',
        name: 'Paiporta Central Bridge & Rambla Span',
        type: 'BRIDGE_PIER',
        drainageCapacityPct: 240,
        waterSpeedMs: 6.8,
        debrisBlockagePct: 92,
        status: 'OVERTOPPED',
        coordinates: '39.4262° N, 0.4181° W'
      },
      {
        id: 'cp-vlc-2',
        name: 'V-30 Highway Barranco Culvert Diverter',
        type: 'CULVERT',
        drainageCapacityPct: 185,
        waterSpeedMs: 5.4,
        debrisBlockagePct: 75,
        status: 'OVERTOPPED',
        coordinates: '39.4411° N, 0.3955° W'
      }
    ],
    timeline: [
      { time: '15:00', timeRelative: '-150m', rainIntensityMm: 35, riverStageM: 0.8, floodRiskScore: 40, isProjected: false },
      { time: '16:00', timeRelative: '-90m', rainIntensityMm: 110, riverStageM: 2.5, floodRiskScore: 78, isProjected: false, incidentFlag: 'Chiva basin reports 160mm/hr' },
      { time: '17:00', timeRelative: '-30m', rainIntensityMm: 145, riverStageM: 5.1, floodRiskScore: 92, isProjected: false, incidentFlag: 'Poyo ravine sensor destroyed' },
      { time: '17:30', timeRelative: 'NOW', rainIntensityMm: 124, riverStageM: 6.4, floodRiskScore: 96, isProjected: false, incidentFlag: 'CATASTROPHIC SURGE: Emergency declaration' },
      { time: '18:15', timeRelative: '+45m', rainIntensityMm: 80, riverStageM: 6.1, floodRiskScore: 91, isProjected: true, incidentFlag: 'Surge crest reaching coastal lagoon' }
    ],
    investigatorNotes: [
      {
        id: 'note-vlc-1',
        author: 'Chief Insp. Elena Morales',
        badge: 'DANA-EUR-01',
        time: '17:32 CET',
        note: 'This is an unprecedented hyper-concentrated flash flood. The Rambla channel was dry this morning and has now crested beyond any historic 500-year recurrence.',
        tag: 'ALERT'
      }
    ]
  },
  {
    id: 'mumbai-in',
    caseNumber: 'CASE-FFD-4410-BOM',
    cityName: 'Mumbai',
    stateOrCountry: 'India (Maharashtra)',
    basinName: 'Mithi River & Mahim Creek Estuary',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    overallRiskScore: 82,
    riskLevel: 'HIGH',
    investigatorLead: 'Senior Det. Kabir Sharma',
    badgeNumber: 'MONSOON-901',
    caseOpenedTime: '2026-09-09 20:45 IST',
    threatVerdict: 'HIGH TIDE LOCK + CLOUDBURST SYNCHRONIZATION: Spring high tide (4.6m) closing sluice gates while 95mm/hr convective bands strike suburban catchment.',
    recommendedAction: 'Deploy mobile diesel de-watering pumps to Kurla railway station and Milan subway. Divert domestic air traffic at Chhatrapati Shivaji Maharaj Airport.',
    telemetry: {
      rainfallCurrentMmHr: 72.0,
      rainfallPeakMmHr: 98.0,
      rainfallAccum24hMm: 285.0,
      soilMoisturePct: 99.0,
      runoffCoefficientPct: 96.0,
      riverLevelMeters: 4.10,
      riverFloodStageMeters: 3.20,
      riverFlowRateCubicMs: 820.0,
      atmosphericPressureHpa: 1002.0,
      urbanPermeabilityPct: 9.0,
      estimatedTimeToPeakMin: 45,
    },
    suspects: [
      {
        id: 'suspect-bom-1',
        name: 'Arabian Sea Spring High Tide Barrier',
        alias: 'The Ocean Lock',
        category: 'HYDROLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 98,
        summary: '4.6 meter astronomical tide completely locks Mahim Bay sluice outlets, reversing gravity drainage of the Mithi River.',
        forensicEvidence: 'Tidal gauge at Apollo Bunder peaked at 4.62m CD. Water head differential zeroed out gravity runoff.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Tide Height', value: '4.62 m CD', severity: 'red' },
          { label: 'Outfall Gate Status', value: 'CLOSED (Tide Lock)', severity: 'red' },
          { label: 'Duration Remaining', value: '2 hrs 15 min', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-bom-2',
        name: 'Monsoon Offshore Trough Cloudburst',
        alias: 'The Rain Bomb',
        category: 'METEOROLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 94,
        summary: 'Narrow offshore vortex drawing deep tropical moisture from Arabian Sea directly into Sanjay Gandhi National Park hills.',
        forensicEvidence: 'Santacruz automatic weather station clocked 98mm in a single 60-minute window.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: '1-Hour Rainfall', value: '72 mm', severity: 'red' },
          { label: '24h Total', value: '285 mm', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-bom-3',
        name: 'Plastic Debris & Slag River Encroachment',
        alias: 'The Choked Arteries',
        category: 'INFRASTRUCTURE',
        impactLevel: 'SEVERE',
        confidenceScore: 91,
        summary: 'Solid waste accumulation and floodplain narrowing at Bandra-Kurla Complex reduced hydraulic carrying capacity by 55%.',
        forensicEvidence: 'Hydro-acoustic sonar scans at CST Road Bridge show 3.2 meters of sediment and plastic siltation beneath the water column.',
        status: 'ACCOMPLICE',
        metrics: [
          { label: 'Capacity Loss', value: '55%', severity: 'red' },
          { label: 'Silt Depth', value: '3.2 m', severity: 'amber' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-bom-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'Doppler Radar RHI Scan - Santacruz Cell',
        type: 'RADAR_ECHO',
        classification: 'CRITICAL_PROOF',
        timestamp: '20:50:00 IST',
        sensorLocation: 'IMD Colaba Doppler Radar',
        keyFinding: 'Echo tops extending up to 15 km altitude with sustained 55 dBZ core stationary over northern suburbs.',
        details: 'High reflectivity band trapped between Western Ghats orographic barrier and coast.',
        metricHighlight: {
          label: 'Echo Top Altitude',
          value: '15.2 km',
          subtext: 'Intense Deep Convection',
          trend: 'rising'
        },
        pinned: true,
        linkedSuspectId: 'suspect-bom-2',
        boardCoords: { x: 12, y: 14 }
      },
      {
        id: 'exhibit-bom-02',
        exhibitCode: 'EXHIBIT B-2',
        title: 'Mithi River Kranti Nagar Water Gauge',
        type: 'HYDROGRAPH',
        classification: 'CRITICAL_PROOF',
        timestamp: '20:55:00 IST',
        sensorLocation: 'Kranti Nagar Sensor Mast #09',
        keyFinding: 'Water level at 4.10m, exceeding danger mark (3.50m) by 0.60m. Backwater creeping into airport taxiway perimeter.',
        details: 'Rate of climb +18 cm per 10 minutes fueled by upstream runoff and tide lock.',
        metricHighlight: {
          label: 'Current River Depth',
          value: '4.10 m',
          subtext: 'Danger Mark Exceeded',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-bom-1',
        boardCoords: { x: 45, y: 15 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-bom-1',
        name: 'Kurla CST Road Railway Culvert',
        type: 'CULVERT',
        drainageCapacityPct: 155,
        waterSpeedMs: 2.4,
        debrisBlockagePct: 80,
        status: 'OVERTOPPED',
        coordinates: '19.0688° N, 72.8790° E'
      },
      {
        id: 'cp-bom-2',
        name: 'Mahim Causeway Tidal Sluice Gates',
        type: 'CANAL_WEIR',
        drainageCapacityPct: 110,
        waterSpeedMs: 0.8,
        debrisBlockagePct: 35,
        status: 'RESTRICTED',
        coordinates: '19.0410° N, 72.8415° E'
      }
    ],
    timeline: [
      { time: '18:00', timeRelative: '-165m', rainIntensityMm: 22, riverStageM: 1.9, floodRiskScore: 38, isProjected: false },
      { time: '19:00', timeRelative: '-105m', rainIntensityMm: 55, riverStageM: 2.8, floodRiskScore: 64, isProjected: false },
      { time: '20:00', timeRelative: '-45m', rainIntensityMm: 88, riverStageM: 3.6, floodRiskScore: 79, isProjected: false, incidentFlag: 'High tide lock engaged' },
      { time: '20:45', timeRelative: 'NOW', rainIntensityMm: 72, riverStageM: 4.1, floodRiskScore: 82, isProjected: false, incidentFlag: 'ALERT: Runway edge water pooling' },
      { time: '21:30', timeRelative: '+45m', rainIntensityMm: 50, riverStageM: 4.3, floodRiskScore: 85, isProjected: true }
    ],
    investigatorNotes: [
      {
        id: 'note-bom-1',
        author: 'Senior Det. Kabir Sharma',
        badge: 'MONSOON-901',
        time: '20:48 IST',
        note: 'High tide peak expected in 25 minutes. Once the tidal peak passes at 21:15 IST, drainage gates can gradually reopen, but until then all water is stored in the streets.',
        tag: 'HYPOTHESIS'
      }
    ]
  },
  {
    id: 'tokyo-jp',
    caseNumber: 'CASE-FFD-1022-TYO',
    cityName: 'Tokyo',
    stateOrCountry: 'Japan (Kanto Region)',
    basinName: 'Kanda & Edogawa Underground Channel Network',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    overallRiskScore: 54,
    riskLevel: 'MODERATE',
    investigatorLead: 'Insp. Kenjiro Sato',
    badgeNumber: 'TOKYO-HYDRO-7',
    caseOpenedTime: '2026-09-09 22:10 JST',
    threatVerdict: 'TYPHOON INFLOW DIVERTED: Intense convective rainband delivering 68mm/h over Shinjuku. Underground G-Cans discharge tunnel operating at 62% storage buffer.',
    recommendedAction: 'Maintain turbine pump speed at 180 m³/s into the Edo River. Monitor small urban tributary levels in Meguro and Suginami.',
    telemetry: {
      rainfallCurrentMmHr: 48.0,
      rainfallPeakMmHr: 68.0,
      rainfallAccum24hMm: 165.0,
      soilMoisturePct: 86.0,
      runoffCoefficientPct: 92.0,
      riverLevelMeters: 2.80,
      riverFloodStageMeters: 4.50,
      riverFlowRateCubicMs: 310.0,
      atmosphericPressureHpa: 988.0,
      urbanPermeabilityPct: 8.0,
      estimatedTimeToPeakMin: 55,
    },
    suspects: [
      {
        id: 'suspect-tyo-1',
        name: 'Typhoon Outer Rain Spiral Band',
        alias: 'The Spiral Torrent',
        category: 'METEOROLOGY',
        impactLevel: 'SEVERE',
        confidenceScore: 92,
        summary: 'Trailing spiral feeder band from Pacific typhoon spinning over Tokyo Bay with gusty convective downpours.',
        forensicEvidence: 'JMA Phased Array Radar tracking rapid convective cell formation every 12 minutes over Musashino plateau.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Cell Velocity', value: '42 km/h', severity: 'cyan' },
          { label: 'Rainfall Rate', value: '48 mm/h', severity: 'amber' }
        ]
      },
      {
        id: 'suspect-tyo-2',
        name: 'Underground Tunnel Siphon Load',
        alias: 'The Subterranean Reservoir',
        category: 'INFRASTRUCTURE',
        impactLevel: 'MODERATE',
        confidenceScore: 89,
        summary: 'Metropolitan Outer Area Underground Discharge Channel (G-Cans) actively swallowing overflow from five small rivers.',
        forensicEvidence: 'Silo #3 sensor reports water depth at 38 meters of 65 meter capacity. Jet pumps pushing 180 m³/s into Edo River.',
        status: 'UNDER_SURVEILLANCE',
        metrics: [
          { label: 'Tunnel Fill Level', value: '62%', severity: 'amber' },
          { label: 'Pumping Velocity', value: '180 m³/s', severity: 'cyan' },
          { label: 'Buffer Reserve', value: '38% (Safe)', severity: 'cyan' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-tyo-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'JMA High-Res XRAIN Radar Telemetry',
        type: 'RADAR_ECHO',
        classification: 'CORROBORATING',
        timestamp: '22:15:00 JST',
        sensorLocation: 'Haneda Airport Terminal Doppler',
        keyFinding: 'Convective cell moving swiftly eastward at 42 km/h. Short residence time prevents sustained catastrophic accumulation.',
        details: 'Fast translation velocity limits local accumulation to under 70mm per individual storm burst.',
        metricHighlight: {
          label: 'Storm Motion',
          value: '42 km/h Eastward',
          subtext: 'Fast Clearing Trajectory',
          trend: 'falling'
        },
        pinned: true,
        linkedSuspectId: 'suspect-tyo-1',
        boardCoords: { x: 15, y: 15 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-tyo-1',
        name: 'Kanda River Subterranean Inflow Shaft #1',
        type: 'STORM_TUNNEL',
        drainageCapacityPct: 65,
        waterSpeedMs: 5.2,
        debrisBlockagePct: 4,
        status: 'CLEAR',
        coordinates: '35.7090° N, 139.7522° E'
      }
    ],
    timeline: [
      { time: '20:00', timeRelative: '-130m', rainIntensityMm: 15, riverStageM: 1.4, floodRiskScore: 28, isProjected: false },
      { time: '21:00', timeRelative: '-70m', rainIntensityMm: 35, riverStageM: 2.1, floodRiskScore: 42, isProjected: false },
      { time: '22:00', timeRelative: '-10m', rainIntensityMm: 58, riverStageM: 2.7, floodRiskScore: 56, isProjected: false },
      { time: '22:10', timeRelative: 'NOW', rainIntensityMm: 48, riverStageM: 2.8, floodRiskScore: 54, isProjected: false },
      { time: '23:00', timeRelative: '+50m', rainIntensityMm: 20, riverStageM: 2.5, floodRiskScore: 40, isProjected: true }
    ],
    investigatorNotes: [
      {
        id: 'note-tyo-1',
        author: 'Insp. Kenjiro Sato',
        badge: 'TOKYO-HYDRO-7',
        time: '22:12 JST',
        note: 'Subterranean storage shafts are handling the load smoothly. Unless cell stalls, street-level inundation will remain confined to low-lying subway entrance gratings in Suginami.',
        tag: 'EVIDENCE'
      }
    ]
  },
  {
    id: 'rapid-city-sd',
    caseNumber: 'CASE-FFD-1972-RAP',
    cityName: 'Rapid City',
    stateOrCountry: 'South Dakota, USA',
    basinName: 'Rapid Creek & Black Hills Canyon Pass',
    coordinates: { lat: 44.0805, lng: -103.2310 },
    overallRiskScore: 78,
    riskLevel: 'HIGH',
    investigatorLead: 'Marshal Dane Briggs',
    badgeNumber: 'USGS-CANYON-04',
    caseOpenedTime: '2026-09-09 10:40 MDT',
    threatVerdict: 'HIGH OROGRAPHIC FUNNELING RISK: Thunderstorm cluster locked against eastern slopes of Black Hills. Rapid Creek gorge prone to catastrophic 15-minute wall of water.',
    recommendedAction: 'Evacuate floodway greenway parks and Canyon Lake spillway recreation area. Sound town emergency sirens.',
    telemetry: {
      rainfallCurrentMmHr: 62.0,
      rainfallPeakMmHr: 85.0,
      rainfallAccum24hMm: 175.0,
      soilMoisturePct: 89.0,
      runoffCoefficientPct: 84.0,
      riverLevelMeters: 3.40,
      riverFloodStageMeters: 2.80,
      riverFlowRateCubicMs: 380.0,
      atmosphericPressureHpa: 1008.0,
      urbanPermeabilityPct: 35.0,
      estimatedTimeToPeakMin: 25,
    },
    suspects: [
      {
        id: 'suspect-rap-1',
        name: 'Black Hills Orographic Lift Engine',
        alias: 'The Mountain Squeeze',
        category: 'GEOLOGY',
        impactLevel: 'CRITICAL',
        confidenceScore: 96,
        summary: 'Low-level easterly winds forced up steep 4,000 ft mountain face, condensing saturated Great Plains moisture directly above canyon headwaters.',
        forensicEvidence: 'Stationary radar plume centered over Pactola and Silver City upstream of city gorge.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Orographic Lift', value: '4,200 ft Ascent', severity: 'red' },
          { label: 'Basin Convergence', value: 'High Density', severity: 'amber' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-rap-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'Rapid Creek Canyon Gauge Surge Spike',
        type: 'HYDROGRAPH',
        classification: 'CRITICAL_PROOF',
        timestamp: '10:42:00 MDT',
        sensorLocation: 'Rapid Creek above Canyon Lake (Station 06412500)',
        keyFinding: 'River stage jumped 1.6 meters in 20 minutes. Upstream dam spillway discharging near maximum allowable threshold.',
        details: 'Canyon funnel dynamics multiplying wave height as it enters city limits.',
        metricHighlight: {
          label: 'Wave Front Speed',
          value: '5.2 m/s',
          subtext: 'Violent Mountain Runoff',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: 'suspect-rap-1',
        boardCoords: { x: 25, y: 20 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-rap-1',
        name: 'Canyon Lake Dam Spillway Crest',
        type: 'CANAL_WEIR',
        drainageCapacityPct: 108,
        waterSpeedMs: 4.5,
        debrisBlockagePct: 30,
        status: 'RESTRICTED',
        coordinates: '44.0520° N, -103.2840° W'
      }
    ],
    timeline: [
      { time: '08:30', timeRelative: '-130m', rainIntensityMm: 10, riverStageM: 1.1, floodRiskScore: 22, isProjected: false },
      { time: '09:30', timeRelative: '-70m', rainIntensityMm: 35, riverStageM: 1.8, floodRiskScore: 48, isProjected: false },
      { time: '10:15', timeRelative: '-25m', rainIntensityMm: 75, riverStageM: 2.9, floodRiskScore: 74, isProjected: false },
      { time: '10:40', timeRelative: 'NOW', rainIntensityMm: 62, riverStageM: 3.4, floodRiskScore: 78, isProjected: false }
    ],
    investigatorNotes: [
      {
        id: 'note-rap-1',
        author: 'Marshal Dane Briggs',
        badge: 'USGS-CANYON-04',
        time: '10:38 MDT',
        note: 'Canyon acoustics detect roaring boulder displacement upstream. The surge wave is entering the urban greenway.',
        tag: 'ALERT'
      }
    ]
  },
  {
    id: 'london-uk',
    caseNumber: 'CASE-FFD-3180-LON',
    cityName: 'London',
    stateOrCountry: 'United Kingdom',
    basinName: 'River Fleet & Thames Tributary System',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    overallRiskScore: 68,
    riskLevel: 'MODERATE',
    investigatorLead: 'Insp. Arthur Pendelton',
    badgeNumber: 'MET-HYDRO-19',
    caseOpenedTime: '2026-09-09 17:15 BST',
    threatVerdict: 'COMBINED SEWER OVERLOAD: Slow-moving summer thunderstorm dumping intense rain onto impermeable Victorian masonry. Thames barrier operational but surface culverts backing up.',
    recommendedAction: 'Activate auxiliary Tideway interceptor pumps in Wandsworth and King\'s Cross. Issue travel warnings for low-lying Tube stations.',
    telemetry: {
      rainfallCurrentMmHr: 44.0,
      rainfallPeakMmHr: 58.0,
      rainfallAccum24hMm: 72.0,
      soilMoisturePct: 82.0,
      runoffCoefficientPct: 91.0,
      riverLevelMeters: 3.20,
      riverFloodStageMeters: 3.80,
      riverFlowRateCubicMs: 145.0,
      atmosphericPressureHpa: 1009.0,
      urbanPermeabilityPct: 14.0,
      estimatedTimeToPeakMin: 40,
    },
    suspects: [
      {
        id: 'suspect-lon-1',
        name: 'Victorian Combined Sewer Hydraulic Bottleneck',
        alias: 'The Buried Fleet Culvert',
        category: 'INFRASTRUCTURE',
        impactLevel: 'SEVERE',
        confidenceScore: 94,
        summary: '150-year-old subterranean brick sewers overwhelmed by simultaneous foul water and rapid surface runoff.',
        forensicEvidence: 'Acoustic pressure loggers at Farringdon node report 98% pipe bore filled with water surging under 0.4 bar backpressure.',
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Sewer Capacity', value: '98% Full', severity: 'red' },
          { label: 'Surface Runoff Ratio', value: '91%', severity: 'amber' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: 'exhibit-lon-01',
        exhibitCode: 'EXHIBIT A-1',
        title: 'Met Office Dual-Polarisation Radar Echo',
        type: 'RADAR_ECHO',
        classification: 'CORROBORATING',
        timestamp: '17:18:00 BST',
        sensorLocation: 'Chenies Weather Radar Node',
        keyFinding: 'Intense convective downpour cell stalling directly over Camden and Islington.',
        details: 'Localized downburst dropping 40mm in 45 minutes.',
        metricHighlight: {
          label: 'Cell Intensity',
          value: '52 dBZ',
          subtext: 'Urban Flash Flood Threshold',
          trend: 'stable'
        },
        pinned: true,
        linkedSuspectId: 'suspect-lon-1',
        boardCoords: { x: 20, y: 18 }
      }
    ],
    chokepoints: [
      {
        id: 'cp-lon-1',
        name: 'King\'s Cross Underpass & Fleet Outfall',
        type: 'CULVERT',
        drainageCapacityPct: 96,
        waterSpeedMs: 2.2,
        debrisBlockagePct: 22,
        status: 'CAUTION',
        coordinates: '51.5308° N, -0.1238° W'
      }
    ],
    timeline: [
      { time: '15:30', timeRelative: '-105m', rainIntensityMm: 8, riverStageM: 1.2, floodRiskScore: 20, isProjected: false },
      { time: '16:30', timeRelative: '-45m', rainIntensityMm: 38, riverStageM: 2.4, floodRiskScore: 52, isProjected: false },
      { time: '17:15', timeRelative: 'NOW', rainIntensityMm: 44, riverStageM: 3.2, floodRiskScore: 68, isProjected: false }
    ],
    investigatorNotes: [
      {
        id: 'note-lon-1',
        author: 'Insp. Arthur Pendelton',
        badge: 'MET-HYDRO-19',
        time: '17:16 BST',
        note: 'Surface ponding occurring at Baker Street and West Hampstead. The Tideway tunnel is receiving overflow, preventing direct basement sewage backup.',
        tag: 'EVIDENCE'
      }
    ]
  }
];

// Procedural generator for ANY custom city searched by the user!
export function generateProceduralCaseFile(cityName: string): CityCaseFile {
  const cleanName = cityName.trim();
  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // Seed pseudorandom characteristics from the city name string
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  
  const riskScore = 45 + (absHash % 50); // 45 - 94
  const riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 
    riskScore >= 85 ? 'CRITICAL' :
    riskScore >= 70 ? 'HIGH' :
    riskScore >= 50 ? 'MODERATE' : 'LOW';

  const rainCurrent = 35 + (absHash % 70) + ((absHash % 10) * 0.5);
  const rainPeak = rainCurrent + 25 + (absHash % 30);
  const soilMoisture = 75 + (absHash % 23);
  const riverLevel = (2.2 + (absHash % 40) * 0.1).toFixed(2);
  const floodStage = (2.8 + (absHash % 20) * 0.1).toFixed(2);
  const estTimeToPeak = 15 + (absHash % 55);

  const caseNum = `CASE-FFD-${(1000 + (absHash % 8999))}-${cleanName.substring(0, 3).toUpperCase()}`;
  const badgeNum = `DET-${100 + (absHash % 899)}`;
  const investigators = [
    'Det. Marcus Sterling',
    'Senior Analyst Rayna Chen',
    'Chief Insp. Damon Vance',
    'Specialist Tara Brooks',
    'Forensic Hydrologist J. Mercer'
  ];
  const investigatorLead = investigators[absHash % investigators.length];

  return {
    id,
    caseNumber: caseNum,
    cityName: cleanName,
    stateOrCountry: 'Global Municipal Sector',
    basinName: `${cleanName} Metropolitan River & Drainage Basin`,
    coordinates: { 
      lat: 20 + ((absHash % 450) / 10), 
      lng: -120 + ((absHash % 2400) / 10) 
    },
    overallRiskScore: riskScore,
    riskLevel,
    investigatorLead,
    badgeNumber: badgeNum,
    caseOpenedTime: '2026-09-09 12:00 UTC',
    threatVerdict: `INVESTIGATION ACTIVE IN ${cleanName.toUpperCase()}: Rapid hydrological telemetry shows ${rainCurrent.toFixed(1)} mm/hr storm cells targeting dense urban catchment. Soil saturation index is at ${soilMoisture.toFixed(0)}%.`,
    recommendedAction: `Deploy regional flood warning alerts for low-lying zones in ${cleanName}. Inspect storm culverts for debris blockage and monitor tributary river gauges.`,
    telemetry: {
      rainfallCurrentMmHr: parseFloat(rainCurrent.toFixed(1)),
      rainfallPeakMmHr: parseFloat(rainPeak.toFixed(1)),
      rainfallAccum24hMm: parseFloat((rainCurrent * 2.2).toFixed(1)),
      soilMoisturePct: soilMoisture,
      runoffCoefficientPct: Math.min(96, 70 + (absHash % 25)),
      riverLevelMeters: parseFloat(riverLevel),
      riverFloodStageMeters: parseFloat(floodStage),
      riverFlowRateCubicMs: 250 + (absHash % 600),
      atmosphericPressureHpa: 1002 - (absHash % 16),
      urbanPermeabilityPct: 10 + (absHash % 25),
      estimatedTimeToPeakMin: estTimeToPeak,
    },
    suspects: [
      {
        id: `suspect-${id}-1`,
        name: `${cleanName} Heavy Convective Rainband`,
        alias: 'The Stalled Storm Cell',
        category: 'METEOROLOGY',
        impactLevel: riskScore > 80 ? 'CRITICAL' : 'SEVERE',
        confidenceScore: 94,
        summary: `Sustained convective precipitation delivering ${rainCurrent.toFixed(1)} mm/hr over the municipal core with minimal storm translation velocity.`,
        forensicEvidence: `Doppler radar sweeps indicate strong precipitation core with high reflectivity lingering over ${cleanName}.`,
        status: 'PRIMARY_SUSPECT',
        metrics: [
          { label: 'Rain Intensity', value: `${rainCurrent.toFixed(1)} mm/h`, severity: 'red' },
          { label: 'Peak Capacity', value: `${rainPeak.toFixed(1)} mm/h`, severity: 'amber' }
        ]
      },
      {
        id: `suspect-${id}-2`,
        name: `${cleanName} Impervious Urban Runoff Accelerator`,
        alias: 'The Concrete Conduit',
        category: 'INFRASTRUCTURE',
        impactLevel: 'SEVERE',
        confidenceScore: 90,
        summary: `Dense asphalt and building coverage accelerates rainwater into municipal storm conduits in under 20 minutes.`,
        forensicEvidence: 'Multispectral satellite impervious index shows rapid surface sheetflow into primary urban canals.',
        status: 'ACCOMPLICE',
        metrics: [
          { label: 'Runoff Speed', value: '3.8 m/s', severity: 'amber' },
          { label: 'Impervious Area', value: `${85 - (absHash % 20)}%`, severity: 'amber' }
        ]
      },
      {
        id: `suspect-${id}-3`,
        name: 'Catchment Topography & Geological Funnel',
        alias: 'The Basin Chute',
        category: 'GEOLOGY',
        impactLevel: 'ELEVATED',
        confidenceScore: 86,
        summary: `Regional topography drains water from surrounding slopes directly toward the downtown river corridor.`,
        forensicEvidence: `Digital Elevation Model (DEM) shows sharp hydraulic concentration gradient heading toward ${cleanName} central watercourse.`,
        status: 'UNDER_SURVEILLANCE',
        metrics: [
          { label: 'Soil Saturation', value: `${soilMoisture}%`, severity: 'red' },
          { label: 'Time to Peak', value: `${estTimeToPeak} min`, severity: 'amber' }
        ]
      }
    ],
    evidenceExhibits: [
      {
        id: `exhibit-${id}-01`,
        exhibitCode: 'EXHIBIT A-1',
        title: `${cleanName} Terminal Doppler Sweep Echo`,
        type: 'RADAR_ECHO',
        classification: 'CRITICAL_PROOF',
        timestamp: '12:05:00 UTC',
        sensorLocation: `${cleanName} Regional Doppler Sensor Array`,
        keyFinding: `Dual-polarization radar confirms intense localized precipitation column with peak reflectivity exceeding 58 dBZ.`,
        details: `The convective cell is regenerating along an atmospheric convergence boundary over the urban basin.`,
        metricHighlight: {
          label: 'Doppler Echo',
          value: '58 dBZ',
          subtext: 'High Convective Energy',
          trend: 'rising'
        },
        pinned: true,
        linkedSuspectId: `suspect-${id}-1`,
        boardCoords: { x: 12, y: 15 }
      },
      {
        id: `exhibit-${id}-02`,
        exhibitCode: 'EXHIBIT B-2',
        title: `${cleanName} Central River Hydrograph Rise`,
        type: 'HYDROGRAPH',
        classification: 'CRITICAL_PROOF',
        timestamp: '12:08:30 UTC',
        sensorLocation: `${cleanName} Main Hydrometric Station`,
        keyFinding: `River gauge level has risen to ${riverLevel}m against a flood action threshold of ${floodStage}m.`,
        details: `Stage rising at +0.35m per hour as upstream runoff pours through storm culverts.`,
        metricHighlight: {
          label: 'Water Depth',
          value: `${riverLevel} m`,
          subtext: `Stage Threshold: ${floodStage} m`,
          trend: parseFloat(riverLevel) >= parseFloat(floodStage) ? 'critical' : 'rising'
        },
        pinned: true,
        linkedSuspectId: `suspect-${id}-2`,
        boardCoords: { x: 42, y: 16 }
      },
      {
        id: `exhibit-${id}-03`,
        exhibitCode: 'EXHIBIT C-3',
        title: 'Subsurface Storm Sewer & Culvert Acoustic Monitor',
        type: 'CHOKEPOINT_SENSOR',
        classification: 'CORROBORATING',
        timestamp: '12:12:00 UTC',
        sensorLocation: `${cleanName} Primary Canal Junction`,
        keyFinding: `Sonar telemetry detects surging flow volume at 94% channel capacity with debris accumulation at bridge piers.`,
        details: `Turbulent vortex flow detected near central highway bypass underpass.`,
        metricHighlight: {
          label: 'Canal Flow Volume',
          value: '94% Full',
          subtext: 'Nearing Overtopping',
          trend: 'critical'
        },
        pinned: true,
        linkedSuspectId: `suspect-${id}-3`,
        boardCoords: { x: 70, y: 20 }
      }
    ],
    chokepoints: [
      {
        id: `cp-${id}-1`,
        name: `${cleanName} Downtown Bridge Span & Arch`,
        type: 'BRIDGE_PIER',
        drainageCapacityPct: 104,
        waterSpeedMs: 3.8,
        debrisBlockagePct: 42,
        status: 'RESTRICTED',
        coordinates: 'Metropolitan Central Sector'
      },
      {
        id: `cp-${id}-2`,
        name: `${cleanName} East Highway Storm Culvert`,
        type: 'CULVERT',
        drainageCapacityPct: 88,
        waterSpeedMs: 2.9,
        debrisBlockagePct: 20,
        status: 'CAUTION',
        coordinates: 'Highway Crossing Sector'
      }
    ],
    timeline: [
      { time: '10:00', timeRelative: '-120m', rainIntensityMm: 12, riverStageM: parseFloat((parseFloat(riverLevel) * 0.4).toFixed(2)), floodRiskScore: 25, isProjected: false },
      { time: '11:00', timeRelative: '-60m', rainIntensityMm: 30, riverStageM: parseFloat((parseFloat(riverLevel) * 0.7).toFixed(2)), floodRiskScore: 50, isProjected: false },
      { time: '12:00', timeRelative: 'NOW', rainIntensityMm: parseFloat(rainCurrent.toFixed(0)), riverStageM: parseFloat(riverLevel), floodRiskScore: riskScore, isProjected: false, incidentFlag: `INVESTIGATION: ${riskLevel} RISK` },
      { time: '13:00', timeRelative: '+60m', rainIntensityMm: parseFloat((rainCurrent * 0.8).toFixed(0)), riverStageM: parseFloat((parseFloat(riverLevel) * 1.15).toFixed(2)), floodRiskScore: Math.min(99, riskScore + 6), isProjected: true }
    ],
    investigatorNotes: [
      {
        id: `note-${id}-1`,
        author: investigatorLead,
        badge: badgeNum,
        time: '12:04 UTC',
        note: `Case initialized for ${cleanName}. High-resolution radar tracking confirms active precipitation core over low-permeability urban sectors. Monitoring drainage choke points closely.`,
        tag: 'ALERT'
      }
    ]
  };
}
