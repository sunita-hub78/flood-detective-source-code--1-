export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type CulpritCategory = 'METEOROLOGY' | 'HYDROLOGY' | 'GEOLOGY' | 'INFRASTRUCTURE';

export interface RiskCulprit {
  id: string;
  name: string;
  alias: string;
  category: CulpritCategory;
  impactLevel: 'CRITICAL' | 'SEVERE' | 'ELEVATED' | 'MODERATE';
  confidenceScore: number; // 0 - 100
  summary: string;
  forensicEvidence: string;
  status: 'PRIMARY_SUSPECT' | 'ACCOMPLICE' | 'UNDER_SURVEILLANCE' | 'CLEARED';
  metrics: {
    label: string;
    value: string;
    unit?: string;
    severity: 'red' | 'amber' | 'cyan' | 'slate';
  }[];
}

export type ExhibitType = 
  | 'RADAR_ECHO' 
  | 'HYDROGRAPH' 
  | 'SATELLITE_MASK' 
  | 'CHOKEPOINT_SENSOR' 
  | 'FIELD_REPORT' 
  | 'SOIL_CORE';

export interface EvidenceExhibit {
  id: string;
  exhibitCode: string; // e.g. "EXHIBIT-01"
  title: string;
  type: ExhibitType;
  classification: 'CRITICAL_PROOF' | 'CORROBORATING' | 'ANOMALOUS' | 'MONITORING';
  timestamp: string;
  sensorLocation: string;
  keyFinding: string;
  details: string;
  metricHighlight: {
    label: string;
    value: string;
    subtext: string;
    trend: 'rising' | 'falling' | 'critical' | 'stable';
  };
  pinned: boolean;
  linkedSuspectId?: string;
  boardCoords: { x: number; y: number }; // Relative coordinates on the investigation board
}

export interface ChokepointData {
  id: string;
  name: string;
  type: 'CULVERT' | 'BRIDGE_PIER' | 'CANAL_WEIR' | 'STORM_TUNNEL';
  drainageCapacityPct: number; // e.g. 115% means overwhelmed
  waterSpeedMs: number;
  debrisBlockagePct: number;
  status: 'CLEAR' | 'CAUTION' | 'RESTRICTED' | 'OVERTOPPED';
  coordinates: string;
}

export type HydroSensorType = 
  | 'RIVER_STAGE' 
  | 'DOPPLER_RADAR' 
  | 'SOIL_TENSIOMETER' 
  | 'CULVERT_SONAR' 
  | 'RUNOFF_FLUME';

export interface HydroSensor {
  id: string;
  code: string;
  name: string;
  type: HydroSensorType;
  stationLocation: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  unit: string;
  secondaryMetric: string;
  batteryPct: number;
  lastPingTime: string;
  linkedExhibitId?: string;
  linkedChokepointId?: string;
}

export interface TimelineEvent {
  time: string; // e.g. "14:00"
  timeRelative: string; // e.g. "-60m", "NOW", "+30m"
  rainIntensityMm: number;
  riverStageM: number;
  floodRiskScore: number;
  isProjected: boolean;
  incidentFlag?: string;
}

export interface CityCaseFile {
  id: string;
  caseNumber: string;
  cityName: string;
  stateOrCountry: string;
  basinName: string;
  coordinates: { lat: number; lng: number };
  overallRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  investigatorLead: string;
  badgeNumber: string;
  caseOpenedTime: string;
  threatVerdict: string;
  recommendedAction: string;
  
  // Real-time telemetry
  telemetry: {
    rainfallCurrentMmHr: number;
    rainfallPeakMmHr: number;
    rainfallAccum24hMm: number;
    soilMoisturePct: number;
    runoffCoefficientPct: number;
    riverLevelMeters: number;
    riverFloodStageMeters: number;
    riverFlowRateCubicMs: number;
    atmosphericPressureHpa: number;
    urbanPermeabilityPct: number;
    estimatedTimeToPeakMin: number;
  };

  suspects: RiskCulprit[];
  evidenceExhibits: EvidenceExhibit[];
  chokepoints: ChokepointData[];
  timeline: TimelineEvent[];
  investigatorNotes: {
    id: string;
    author: string;
    badge: string;
    time: string;
    note: string;
    tag: 'EVIDENCE' | 'HYPOTHESIS' | 'ALERT' | 'FIELD';
  }[];
}

export type ActiveTab = 
  | 'investigation-board'
  | 'radar-telemetry'
  | 'suspect-dossiers'
  | 'incident-sim'
  | 'case-archives';

export type WaterDepthLevel = 
  | 'ANKLE_DEEP' 
  | 'KNEE_DEEP' 
  | 'WAIST_DEEP' 
  | 'VEHICLE_SUBMERGED';

export interface CitizenIncidentReport {
  id: string;
  ticketNumber: string;
  caseId: string;
  cityName: string;
  timestamp: string;
  location: string;
  waterDepth: WaterDepthLevel;
  description: string;
  urgency: 'MODERATE' | 'HIGH' | 'CRITICAL_RESCUE';
  reporterName?: string;
  contactPhone?: string;
  imageUrl?: string;
  imageFileName?: string;
  status: 'DISPATCHED' | 'VERIFIED' | 'UNDER_REVIEW';
  gpsCoordinates?: string;
}

