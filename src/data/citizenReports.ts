import { CitizenIncidentReport } from '../types';

// Preset sample water-logging photos (rendered cleanly as self-contained SVG Data URIs so they load offline and reliably)
export const SAMPLE_WATER_LOGGING_IMAGES = [
  {
    id: 'sample-underpass',
    name: 'Flooded Railway Underpass',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23111827'/%3E%3Cstop offset='100%25' stop-color='%231f2937'/%3E%3C/linearGradient%3E%3ClinearGradient id='water' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230e7490'/%3E%3Cstop offset='100%25' stop-color='%23164e63'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='260' fill='url(%23sky)'/%3E%3Cpath d='M20 120 L80 40 L320 40 L380 120 Z' fill='%23374151' stroke='%234b5563' stroke-width='4'/%3E%3Crect x='80' y='60' width='240' height='80' fill='%23111827'/%3E%3Crect y='140' width='400' height='120' fill='url(%23water)' opacity='0.9'/%3E%3Cpath d='M0 145 Q 100 140 200 145 T 400 145' stroke='%2338bdf8' stroke-width='2' fill='none' opacity='0.7'/%3E%3Cpath d='M0 160 Q 120 152 240 160 T 400 160' stroke='%2338bdf8' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3Crect x='150' y='135' width='100' height='35' rx='6' fill='%23b91c1c' stroke='%23f87171' stroke-width='1.5'/%3E%3Crect x='170' y='120' width='60' height='18' rx='3' fill='%23991b1b'/%3E%3Ccircle cx='175' cy='165' r='10' fill='%231f2937'/%3E%3Ccircle cx='225' cy='165' r='10' fill='%231f2937'/%3E%3Ctext x='200' y='220' font-family='monospace' font-size='12' fill='%23fef08a' text-anchor='middle' font-weight='bold'%3EWATER DEPTH: 1.2M (ROOF LEVEL)%3C/text%3E%3Ctext x='200' y='240' font-family='monospace' font-size='10' fill='%2394a3b8' text-anchor='middle'%3EVEHICLE TRAPPED UNDER BRIDGE%3C/text%3E%3C/svg%3E",
    description: "Sedan stalled and partially submerged up to windows under Lamar Blvd underpass.",
    depth: "VEHICLE_SUBMERGED" as const,
  },
  {
    id: 'sample-residential',
    name: 'Residential Street Inundation',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Cdefs%3E%3ClinearGradient id='bg2' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%231e293b'/%3E%3C/linearGradient%3E%3ClinearGradient id='mudwater' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2378350f'/%3E%3Cstop offset='100%25' stop-color='%23451a03'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='260' fill='url(%23bg2)'/%3E%3Cpolygon points='40,110 80,60 120,110' fill='%23475569'/%3E%3Crect x='50' y='110' width='60' height='40' fill='%2364748b'/%3E%3Cpolygon points='280,110 320,60 360,110' fill='%23475569'/%3E%3Crect x='290' y='110' width='60' height='40' fill='%2364748b'/%3E%3Crect y='145' width='400' height='115' fill='url(%23mudwater)' opacity='0.95'/%3E%3Cpath d='M0 150 Q 80 145 160 150 T 320 150 T 400 150' stroke='%23f59e0b' stroke-width='2' fill='none' opacity='0.7'/%3E%3Crect x='190' y='140' width='20' height='45' fill='%23f97316'/%3E%3Ccircle cx='200' cy='135' r='8' fill='%23fed7aa'/%3E%3Ctext x='200' y='220' font-family='monospace' font-size='12' fill='%23fde047' text-anchor='middle' font-weight='bold'%3EWAIST DEEP MUDDY RUNOFF%3C/text%3E%3Ctext x='200' y='240' font-family='monospace' font-size='10' fill='%23cbd5e1' text-anchor='middle'%3ERESIDENTIAL DRIVEWAYS IMPASSABLE%3C/text%3E%3C/svg%3E",
    description: "Brown muddy sheet flow rushing through front yards and over curbs. 0.8m deep.",
    depth: "WAIST_DEEP" as const,
  },
  {
    id: 'sample-stormdrain',
    name: 'Storm Drain Overflow & Geyser',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Cdefs%3E%3ClinearGradient id='bg3' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230b1120'/%3E%3Cstop offset='100%25' stop-color='%23131c31'/%3E%3C/linearGradient%3E%3ClinearGradient id='spray' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2338bdf8'/%3E%3Cstop offset='100%25' stop-color='%230284c7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='260' fill='url(%23bg3)'/%3E%3Cellipse cx='200' cy='180' rx='60' ry='20' fill='%231e293b' stroke='%23475569' stroke-width='3'/%3E%3Cellipse cx='200' cy='180' rx='45' ry='12' fill='%230284c7'/%3E%3Cpath d='M175 178 Q 170 100 200 70 Q 230 100 225 178 Z' fill='url(%23spray)' opacity='0.85'/%3E%3Ccircle cx='185' cy='90' r='5' fill='%23e0f2fe'/%3E%3Ccircle cx='215' cy='80' r='6' fill='%23e0f2fe'/%3E%3Ccircle cx='200' cy='60' r='4' fill='%23e0f2fe'/%3E%3Crect y='190' width='400' height='70' fill='%230369a1' opacity='0.7'/%3E%3Ctext x='200' y='225' font-family='monospace' font-size='12' fill='%2367e8f9' text-anchor='middle' font-weight='bold'%3ESEWER MANHOLE GEYSER DETECTED%3C/text%3E%3Ctext x='200' y='245' font-family='monospace' font-size='10' fill='%23cbd5e1' text-anchor='middle'%3EINTERNAL PRESSURE POPPED 200KG LID%3C/text%3E%3C/svg%3E",
    description: "Stormwater backflow blew off storm manhole casting. Water shooting 1m into the air.",
    depth: "KNEE_DEEP" as const,
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenIncidentReport[] = [
  {
    id: 'report-atx-01',
    ticketNumber: 'CITIZEN-REP-7891',
    caseId: 'austin-tx',
    cityName: 'Austin',
    timestamp: '11:28 CST (5 mins ago)',
    location: 'N Lamar Blvd at 24th St Intersection Underpass',
    waterDepth: 'VEHICLE_SUBMERGED',
    description: 'Silver crossover vehicle stalled under the train trestle. Water is over the headlights and continuing to rise rapidly. Driver got out safely and is waiting on the embankment.',
    urgency: 'CRITICAL_RESCUE',
    reporterName: 'Carlos M. (Shoal Creek Resident)',
    contactPhone: '(512) 555-0144',
    imageUrl: SAMPLE_WATER_LOGGING_IMAGES[0].url,
    imageFileName: 'underpass_submerged_car.jpg',
    status: 'DISPATCHED',
    gpsCoordinates: '30.2882° N, 97.7489° W'
  },
  {
    id: 'report-atx-02',
    ticketNumber: 'CITIZEN-REP-7884',
    caseId: 'austin-tx',
    cityName: 'Austin',
    timestamp: '11:14 CST (19 mins ago)',
    location: 'Pease District Park Parking & Trailhead',
    waterDepth: 'WAIST_DEEP',
    description: 'Creek has jumped the stone retaining wall. Pedestrian footbridge completely submerged under swift brown current. Debris log trapped against pier.',
    urgency: 'HIGH',
    reporterName: 'Sarah Jenkins',
    imageUrl: SAMPLE_WATER_LOGGING_IMAGES[1].url,
    imageFileName: 'pease_park_trail_flood.jpg',
    status: 'VERIFIED',
    gpsCoordinates: '30.2810° N, 97.7533° W'
  },
  {
    id: 'report-atx-03',
    ticketNumber: 'CITIZEN-REP-7870',
    caseId: 'austin-tx',
    cityName: 'Austin',
    timestamp: '10:55 CST (38 mins ago)',
    location: 'Shoal Creek Blvd near W 31st St',
    waterDepth: 'KNEE_DEEP',
    description: 'Storm culvert grate blocked with tree branches. Water ponding across all lanes. Cars turning around on the median.',
    urgency: 'MODERATE',
    reporterName: 'Austin Public Works Citizen Scout',
    imageUrl: SAMPLE_WATER_LOGGING_IMAGES[2].url,
    imageFileName: 'storm_culvert_geyser.jpg',
    status: 'VERIFIED',
    gpsCoordinates: '30.3012° N, 97.7471° W'
  }
];

const LOCAL_STORAGE_KEY = 'flash_flood_citizen_reports_v1';

export function getStoredCitizenReports(): CitizenIncidentReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading stored citizen reports:', err);
  }
  return INITIAL_CITIZEN_REPORTS;
}

export function saveCitizenReport(report: CitizenIncidentReport): CitizenIncidentReport[] {
  const existing = getStoredCitizenReports();
  const updated = [report, ...existing];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving citizen report to storage:', err);
  }
  return updated;
}
