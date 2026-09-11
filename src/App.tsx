import React, { useState } from 'react';
import { INITIAL_CASE_FILES, generateProceduralCaseFile } from './data/caseFiles';
import { ActiveTab, CityCaseFile, EvidenceExhibit } from './types';
import { soundEffects } from './utils/audio';
import { getHydroSensorsForCase, isExhibitInMaintenance } from './utils/hydroSensors';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InvestigationBoard } from './components/InvestigationBoard';
import { RadarTelemetryView } from './components/RadarTelemetryView';
import { SuspectDossiersView } from './components/SuspectDossiersView';
import { IncidentSimulatorView } from './components/IncidentSimulatorView';
import { CaseArchivesView } from './components/CaseArchivesView';
import { EvidenceModal } from './components/EvidenceModal';
import { AddNoteModal } from './components/AddNoteModal';
import { DispatchBulletinModal } from './components/DispatchBulletinModal';

export default function App() {
  const [allCases, setAllCases] = useState<CityCaseFile[]>(INITIAL_CASE_FILES);
  const [currentCaseId, setCurrentCaseId] = useState<string>('austin-tx');
  const [activeTab, setActiveTab] = useState<ActiveTab>('investigation-board');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE'>('ALL');
  const [maintenanceSensorIds, setMaintenanceSensorIds] = useState<string[]>([]);
  
  // Modals
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceExhibit | null>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState<boolean>(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState<boolean>(false);
  const [isSimulatedSpike, setIsSimulatedSpike] = useState<boolean>(false);

  // Current active case
  const currentCase = allCases.find((c) => c.id === currentCaseId) || allCases[0];

  // City selection & procedural generation
  const handleSelectCity = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    
    // Check if existing
    const existing = allCases.find(
      (c) => 
        c.id.toLowerCase() === trimmed || 
        c.cityName.toLowerCase() === trimmed ||
        c.caseNumber.toLowerCase() === trimmed
    );

    if (existing) {
      setCurrentCaseId(existing.id);
      setIsSimulatedSpike(false);
    } else {
      // Procedurally generate a realistic forensic case file
      const newCase = generateProceduralCaseFile(query.trim());
      setAllCases((prev) => [newCase, ...prev]);
      setCurrentCaseId(newCase.id);
      setIsSimulatedSpike(false);
    }
  };

  const handleToggleSound = () => {
    const nextState = soundEffects.toggleSound();
    setSoundEnabled(nextState);
    return nextState;
  };

  const handleToggleHydroSensor = (sensorId: string) => {
    soundEffects.playWarningAlert();
    setMaintenanceSensorIds((prev) =>
      prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]
    );
  };

  const handleToggleAllHydroSensors = (enableMaintenance: boolean) => {
    soundEffects.playWarningAlert();
    if (enableMaintenance) {
      const sensors = getHydroSensorsForCase(currentCase);
      setMaintenanceSensorIds(sensors.map((s) => s.id));
    } else {
      setMaintenanceSensorIds([]);
    }
  };

  // Add field note to current case
  const handleAddNote = (noteData: { text: string; tag: 'EVIDENCE' | 'HYPOTHESIS' | 'ALERT' | 'FIELD' }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} UTC`;

    const newNote = {
      id: `note-custom-${Date.now()}`,
      author: currentCase.investigatorLead,
      badge: currentCase.badgeNumber,
      time: timeStr,
      note: noteData.text,
      tag: noteData.tag,
    };

    setAllCases((prev) =>
      prev.map((c) => {
        if (c.id === currentCase.id) {
          return {
            ...c,
            investigatorNotes: [newNote, ...c.investigatorNotes],
          };
        }
        return c;
      })
    );
  };

  // Simulate rain spike (+25 mm/h squall)
  const handleSimulateRainSpike = () => {
    soundEffects.playWarningAlert();
    const nextSpike = !isSimulatedSpike;
    setIsSimulatedSpike(nextSpike);

    setAllCases((prev) =>
      prev.map((c) => {
        if (c.id === currentCase.id) {
          const delta = nextSpike ? 25 : -25;
          const newRain = Math.max(10, c.telemetry.rainfallCurrentMmHr + delta);
          const newScore = Math.min(99, Math.max(20, c.overallRiskScore + (nextSpike ? 8 : -8)));
          return {
            ...c,
            overallRiskScore: newScore,
            riskLevel: newScore >= 85 ? 'CRITICAL' : newScore >= 70 ? 'HIGH' : 'MODERATE',
            telemetry: {
              ...c.telemetry,
              rainfallCurrentMmHr: parseFloat(newRain.toFixed(1)),
              riverLevelMeters: parseFloat((c.telemetry.riverLevelMeters + (nextSpike ? 0.45 : -0.45)).toFixed(2)),
            },
          };
        }
        return c;
      })
    );
  };

  // Linked suspect for selected evidence modal
  const linkedSuspect = selectedEvidence?.linkedSuspectId
    ? currentCase.suspects.find((s) => s.id === selectedEvidence.linkedSuspectId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#090c12] text-slate-100 flex flex-col font-sans">
      {/* Top Global Detective Search & Navigation Header */}
      <Header
        currentCase={currentCase}
        onSelectCity={handleSelectCity}
        allCases={allCases}
        onToggleSound={handleToggleSound}
        soundEnabled={soundEnabled}
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
      />

      {/* Main Workspace: Sidebar + Dynamic Investigation Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentCase={currentCase}
          allCases={allCases}
          onSelectCity={handleSelectCity}
        />

        {/* Dynamic Main Panel Views */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {activeTab === 'investigation-board' && (
            <InvestigationBoard
              caseFile={currentCase}
              onOpenEvidence={(exhibit) => setSelectedEvidence(exhibit)}
              onOpenAddNote={() => setIsAddNoteOpen(true)}
              onOpenDispatch={() => setIsDispatchOpen(true)}
              onSimulateRainSpike={handleSimulateRainSpike}
              isSimulatedSpike={isSimulatedSpike}
              maintenanceSensorIds={maintenanceSensorIds}
              onToggleHydroSensor={handleToggleHydroSensor}
              onToggleAllHydroSensors={handleToggleAllHydroSensors}
            />
          )}

          {activeTab === 'radar-telemetry' && (
            <RadarTelemetryView caseFile={currentCase} />
          )}

          {activeTab === 'suspect-dossiers' && (
            <SuspectDossiersView caseFile={currentCase} />
          )}

          {activeTab === 'incident-sim' && (
            <IncidentSimulatorView caseFile={currentCase} />
          )}

          {activeTab === 'case-archives' && (
            <CaseArchivesView onSelectCity={handleSelectCity} />
          )}
        </main>
      </div>

      {/* Lightbox / Inspector Modals */}
      {(() => {
        const currentSensors = getHydroSensorsForCase(currentCase);
        const { inMaintenance, sensor: modalSensor } = selectedEvidence
          ? isExhibitInMaintenance(selectedEvidence, maintenanceSensorIds, currentSensors)
          : { inMaintenance: false, sensor: undefined };

        return (
          <EvidenceModal
            exhibit={selectedEvidence}
            onClose={() => setSelectedEvidence(null)}
            linkedSuspect={linkedSuspect}
            isSensorInMaintenance={inMaintenance}
            onToggleMaintenance={
              modalSensor
                ? () => handleToggleHydroSensor(modalSensor.id)
                : undefined
            }
          />
        );
      })()}

      <AddNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onAddNote={handleAddNote}
        leadInvestigator={currentCase.investigatorLead}
      />

      <DispatchBulletinModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        caseFile={currentCase}
      />
    </div>
  );
}
