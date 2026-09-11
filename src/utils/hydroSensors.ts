import { CityCaseFile, EvidenceExhibit, ChokepointData, HydroSensor } from '../types';

/**
 * Derives the active hydro-sensor network stations for a given city case file.
 * Each station monitors specific hydrological telemetry (River Stage, Doppler, Soil Tensiometer, Culvert Sonar, Outfall Flume).
 */
export function getHydroSensorsForCase(caseFile: CityCaseFile): HydroSensor[] {
  const riverExhibit = caseFile.evidenceExhibits.find(
    (e) => e.type === 'HYDROGRAPH' || e.sensorLocation.toLowerCase().includes('gauge')
  );
  const radarExhibit = caseFile.evidenceExhibits.find(
    (e) => e.type === 'RADAR_ECHO' || e.sensorLocation.toLowerCase().includes('doppler')
  );
  const soilExhibit = caseFile.evidenceExhibits.find(
    (e) => e.type === 'SOIL_CORE' || e.type === 'SATELLITE_MASK' || e.sensorLocation.toLowerCase().includes('soil')
  );
  const sonarExhibit = caseFile.evidenceExhibits.find(
    (e) => e.type === 'CHOKEPOINT_SENSOR' || e.sensorLocation.toLowerCase().includes('sonar')
  );

  const primaryCp = caseFile.chokepoints[0];
  const secondaryCp = caseFile.chokepoints[1] || caseFile.chokepoints[0];

  return [
    {
      id: `sensor-usgs-${caseFile.id}`,
      code: 'USGS-STAGE-01',
      name: `${caseFile.cityName} River Stage & Discharge Gauge`,
      type: 'RIVER_STAGE',
      stationLocation: riverExhibit?.sensorLocation || `${caseFile.basinName} Central Station`,
      primaryMetricLabel: 'River Stage Level',
      primaryMetricValue: `${caseFile.telemetry.riverLevelMeters} m`,
      unit: 'meters',
      secondaryMetric: `Discharge: ${caseFile.telemetry.riverFlowRateCubicMs} m³/s • Flood Stage: ${caseFile.telemetry.riverFloodStageMeters} m`,
      batteryPct: 96,
      lastPingTime: '4 sec ago',
      linkedExhibitId: riverExhibit?.id,
    },
    {
      id: `sensor-radar-${caseFile.id}`,
      code: 'NEXRAD-RADAR-02',
      name: `${caseFile.cityName} Doppler Weather Radar Array`,
      type: 'DOPPLER_RADAR',
      stationLocation: radarExhibit?.sensorLocation || `Regional Terminal Doppler Radar Tower`,
      primaryMetricLabel: 'Doppler Precip Rate',
      primaryMetricValue: `${caseFile.telemetry.rainfallCurrentMmHr} mm/h`,
      unit: 'mm/hr',
      secondaryMetric: `Peak Intensity: ${caseFile.telemetry.rainfallPeakMmHr} mm/h • 24h Accum: ${caseFile.telemetry.rainfallAccum24hMm} mm`,
      batteryPct: 100,
      lastPingTime: '1 sec ago',
      linkedExhibitId: radarExhibit?.id,
    },
    {
      id: `sensor-soil-${caseFile.id}`,
      code: 'TENS-ARRAY-03',
      name: `Bedrock & Soil Moisture Tensiometer Array`,
      type: 'SOIL_TENSIOMETER',
      stationLocation: soilExhibit?.sensorLocation || `${caseFile.basinName} Alluvial Gradient`,
      primaryMetricLabel: 'Soil Moisture Saturation',
      primaryMetricValue: `${caseFile.telemetry.soilMoisturePct}%`,
      unit: '% saturation',
      secondaryMetric: `Runoff Sheetflow Coeff: ${caseFile.telemetry.runoffCoefficientPct}% • Permeability: ${caseFile.telemetry.urbanPermeabilityPct}%`,
      batteryPct: 88,
      lastPingTime: '12 sec ago',
      linkedExhibitId: soilExhibit?.id,
    },
    {
      id: `sensor-sonar-${caseFile.id}`,
      code: 'SONAR-CULVERT-04',
      name: `Acoustic Sonar & Culvert Junction Transducer`,
      type: 'CULVERT_SONAR',
      stationLocation: primaryCp ? primaryCp.name : 'Municipal Main Bridge Span',
      primaryMetricLabel: 'Culvert Water Velocity',
      primaryMetricValue: `${primaryCp ? primaryCp.waterSpeedMs : 4.8} m/s`,
      unit: 'm/s',
      secondaryMetric: `Debris Jam: ${primaryCp ? primaryCp.debrisBlockagePct : 68}% • Capacity: ${primaryCp ? primaryCp.drainageCapacityPct : 142}%`,
      batteryPct: 91,
      lastPingTime: '8 sec ago',
      linkedExhibitId: sonarExhibit?.id,
      linkedChokepointId: primaryCp?.id,
    },
    {
      id: `sensor-flume-${caseFile.id}`,
      code: 'FLUME-SURFACE-05',
      name: `Urban Drainage Flume Inundation Sensor`,
      type: 'RUNOFF_FLUME',
      stationLocation: secondaryCp ? secondaryCp.name : 'Downtown Storm Canal Inflow',
      primaryMetricLabel: 'Drainage Channel Load',
      primaryMetricValue: `${secondaryCp ? secondaryCp.drainageCapacityPct : 118}%`,
      unit: '% capacity',
      secondaryMetric: `Flow Speed: ${secondaryCp ? secondaryCp.waterSpeedMs : 3.9} m/s • Status: ${secondaryCp ? secondaryCp.status : 'RESTRICTED'}`,
      batteryPct: 84,
      lastPingTime: '15 sec ago',
      linkedChokepointId: secondaryCp?.id,
    },
  ];
}

/**
 * Checks if a specific exhibit is linked to a sensor currently in maintenance mode.
 */
export function isExhibitInMaintenance(
  exhibit: EvidenceExhibit,
  maintenanceSensorIds: string[],
  sensors: HydroSensor[]
): { inMaintenance: boolean; sensor?: HydroSensor } {
  for (const sensor of sensors) {
    if (maintenanceSensorIds.includes(sensor.id)) {
      if (sensor.linkedExhibitId === exhibit.id) {
        return { inMaintenance: true, sensor };
      }
      // Fallback matching by type
      if (
        (sensor.type === 'RIVER_STAGE' && exhibit.type === 'HYDROGRAPH') ||
        (sensor.type === 'DOPPLER_RADAR' && exhibit.type === 'RADAR_ECHO') ||
        (sensor.type === 'CULVERT_SONAR' && exhibit.type === 'CHOKEPOINT_SENSOR') ||
        (sensor.type === 'SOIL_TENSIOMETER' && (exhibit.type === 'SOIL_CORE' || exhibit.type === 'SATELLITE_MASK'))
      ) {
        return { inMaintenance: true, sensor };
      }
    }
  }
  return { inMaintenance: false };
}

/**
 * Checks if a specific chokepoint is linked to a sensor currently in maintenance mode.
 */
export function isChokepointInMaintenance(
  chokepoint: ChokepointData,
  maintenanceSensorIds: string[],
  sensors: HydroSensor[]
): { inMaintenance: boolean; sensor?: HydroSensor } {
  for (const sensor of sensors) {
    if (maintenanceSensorIds.includes(sensor.id)) {
      if (sensor.linkedChokepointId === chokepoint.id) {
        return { inMaintenance: true, sensor };
      }
      // Sonar affects bridge pier or primary culvert
      if (sensor.type === 'CULVERT_SONAR' && (chokepoint.type === 'BRIDGE_PIER' || chokepoint.type === 'CULVERT')) {
        return { inMaintenance: true, sensor };
      }
      // Flume affects canal weir or storm tunnel
      if (sensor.type === 'RUNOFF_FLUME' && (chokepoint.type === 'CANAL_WEIR' || chokepoint.type === 'STORM_TUNNEL')) {
        return { inMaintenance: true, sensor };
      }
    }
  }
  return { inMaintenance: false };
}
