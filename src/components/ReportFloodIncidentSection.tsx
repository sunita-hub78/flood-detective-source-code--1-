import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  MapPin, 
  Droplets, 
  Send, 
  CheckCircle2, 
  Image as ImageIcon, 
  X, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  User,
  Phone,
  FileText,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CityCaseFile, CitizenIncidentReport, WaterDepthLevel } from '../types';
import { 
  SAMPLE_WATER_LOGGING_IMAGES, 
  getStoredCitizenReports, 
  saveCitizenReport 
} from '../data/citizenReports';
import { soundEffects } from '../utils/audio';

interface ReportFloodIncidentSectionProps {
  caseFile: CityCaseFile;
}

export const ReportFloodIncidentSection: React.FC<ReportFloodIncidentSectionProps> = ({
  caseFile,
}) => {
  // Form State
  const [location, setLocation] = useState('');
  const [waterDepth, setWaterDepth] = useState<WaterDepthLevel>('KNEE_DEEP');
  const [urgency, setUrgency] = useState<'MODERATE' | 'HIGH' | 'CRITICAL_RESCUE'>('HIGH');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission & Feed State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [reportsList, setReportsList] = useState<CitizenIncidentReport[]>([]);

  // Load existing reports on mount
  useEffect(() => {
    const loaded = getStoredCitizenReports();
    setReportsList(loaded);
  }, []);

  // Autofill location with current city basin
  const handleAutofillLocation = () => {
    soundEffects.playBlip();
    const suggested = `${caseFile.basinName.split('&')[0].trim()} corridor, ${caseFile.cityName}`;
    setLocation(suggested);
  };

  // Process selected or dropped file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageFileName(file.name);
      soundEffects.playBlip();
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  // Quick Preset Sample Image Selector
  const handleSelectPresetSample = (sample: typeof SAMPLE_WATER_LOGGING_IMAGES[0]) => {
    soundEffects.playBlip();
    setImagePreview(sample.url);
    setImageFileName(`${sample.id}.svg`);
    setWaterDepth(sample.depth);
    if (!description.trim()) {
      setDescription(sample.description);
    }
  };

  // Remove current uploaded image
  const handleRemoveImage = () => {
    soundEffects.playBlip();
    setImagePreview(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Incident Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      alert('Please provide both the flood location and an incident description.');
      return;
    }

    setIsSubmitting(true);
    soundEffects.playWarningAlert();

    const ticketNumber = `CITIZEN-REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} CST (Just Now)`;

    const newReport: CitizenIncidentReport = {
      id: `report-${Date.now()}`,
      ticketNumber,
      caseId: caseFile.id,
      cityName: caseFile.cityName,
      timestamp: timeStr,
      location: location.trim(),
      waterDepth,
      description: description.trim(),
      urgency,
      reporterName: reporterName.trim() || 'Anonymous Citizen Reporter',
      contactPhone: contactPhone.trim(),
      imageUrl: imagePreview || undefined,
      imageFileName: imageFileName || undefined,
      status: 'DISPATCHED',
      gpsCoordinates: `${caseFile.coordinates.lat.toFixed(4)}° N, ${caseFile.coordinates.lng.toFixed(4)}° W`
    };

    const updatedList = saveCitizenReport(newReport);
    setReportsList(updatedList);
    setSubmittedTicket(ticketNumber);
    setIsSubmitting(false);

    // Reset inputs
    setLocation('');
    setDescription('');
    setImagePreview(null);
    setImageFileName('');
    setReporterName('');
    setContactPhone('');
  };

  return (
    <div id="report-flood-incident" className="relative z-10 mb-8 rounded-2xl bg-[#0b0e17]/95 border border-cyan-500/50 p-5 lg:p-7 shadow-[0_0_35px_rgba(0,0,0,0.8)] font-mono-hud">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base lg:text-lg font-display font-bold text-white uppercase tracking-wider">
                REPORT A FLOOD INCIDENT (CITIZEN DISPATCH)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                LIVE CROWDSOURCING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload local water logging photos, geo-tag submerged streets, and feed ground-truth evidence directly to municipal rescue dispatchers.
            </p>
          </div>
        </div>

        {/* Current Basin Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111726] border border-cyan-900/60 text-xs">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300">Active Basin: <strong className="text-white">{caseFile.cityName}</strong></span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submittedTicket && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-500/70 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">
                REPORT LOGGED SUCCESSFULLY — DISPATCH TICKET #{submittedTicket}
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Your water logging evidence and photo have been transmitted to the municipal flood command center and USGS hydraulic teams.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedTicket(null)}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-500/50 font-bold shrink-0"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Two Column Layout: Incident Form on Left, Live Verified Citizen Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Submission Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {/* Location & Autofill */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Water Logging Location / Cross Streets *</span>
              </label>
              <button
                type="button"
                onClick={handleAutofillLocation}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-bold"
              >
                Autofill Current Basin
              </button>
            </div>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. N Lamar Blvd under railroad bridge, near 24th St"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#121828] border border-cyan-900/70 focus:border-cyan-400 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Water Depth & Urgency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5">
                Estimated Water Depth *
              </label>
              <select
                value={waterDepth}
                onChange={(e) => setWaterDepth(e.target.value as WaterDepthLevel)}
                className="w-full px-3 py-2 rounded-lg bg-[#121828] border border-cyan-900/70 focus:border-cyan-400 text-slate-200 text-xs focus:outline-none"
              >
                <option value="ANKLE_DEEP">Ankle Deep (~10 cm / Sidewalk Ponding)</option>
                <option value="KNEE_DEEP">Knee Deep (~30-50 cm / Curb Overtopped)</option>
                <option value="WAIST_DEEP">Waist Deep (~1 meter / Rushing Mudflow)</option>
                <option value="VEHICLE_SUBMERGED">Vehicles Submerged / Rushing Rapids (&gt;1.5m)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5">
                Emergency Priority Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none font-bold ${
                  urgency === 'CRITICAL_RESCUE'
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-300'
                    : urgency === 'HIGH'
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
                    : 'bg-[#121828] border-cyan-900/70 text-cyan-300'
                }`}
              >
                <option value="CRITICAL_RESCUE">🚨 Critical (Trapped Occupants / Swift Water)</option>
                <option value="HIGH">⚠️ High (Road Blocked / Vehicle Stalled)</option>
                <option value="MODERATE">ℹ️ Moderate (Street Water Logging / Impasse)</option>
              </select>
            </div>
          </div>

          {/* IMAGE UPLOAD WIDGET: Drag and Drop + File Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Water Logging Photo (Drag & Drop or Click)</span>
              </label>
              <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              id="citizen-flood-image-input"
            />

            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer text-center ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'border-slate-700 hover:border-cyan-500/60 bg-[#121826]/80 hover:bg-[#151e30]'
                }`}
              >
                <div className="p-3 rounded-full bg-cyan-950/80 text-cyan-400 mb-2 border border-cyan-500/30">
                  <Upload className="w-5 h-5 animate-bounce" />
                </div>
                <div className="text-xs font-bold text-slate-200">
                  Drag & Drop flood photo here, or <span className="text-cyan-400 underline">browse files</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Attach visual proof of submerged intersections, stalled cars, or overflowing culverts.
                </p>

                {/* Quick Presets for Instant Testing */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">
                    Or select a scenario preset image:
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {SAMPLE_WATER_LOGGING_IMAGES.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectPresetSample(sample)}
                        className="px-2.5 py-1 rounded bg-[#0d121c] hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-[10px] text-cyan-300 font-bold transition-colors"
                      >
                        + {sample.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Image Upload Preview Card */
              <div className="relative rounded-xl border border-cyan-500/60 bg-[#111726] p-3 shadow-lg flex items-center gap-4">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-black">
                  <img
                    src={imagePreview}
                    alt="Water logging evidence preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {imageFileName || 'water_logging_proof.jpg'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      ATTACHED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Image ready for transmission with forensic metadata.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-cyan-400 hover:underline font-bold mt-1"
                  >
                    Replace Image
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 transition-colors"
                  title="Remove uploaded image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              Incident Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe current conditions: e.g. 2 feet of swift brown water rushing across roadway, 1 sedan stalled with water to windows, occupants evacuated to median..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#121828] border border-cyan-900/70 focus:border-cyan-400 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 leading-relaxed"
            />
          </div>

          {/* Citizen Reporter Info (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Reporter Name / Call Sign (Optional)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Maria Gonzalez (Local Resident)"
                className="w-full px-3.5 py-2 rounded-lg bg-[#121828] border border-cyan-900/70 text-slate-200 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Contact Phone for Rescue Dispatch (Optional)
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. (512) 555-0199"
                className="w-full px-3.5 py-2 rounded-lg bg-[#121828] border border-cyan-900/70 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>TRANSMIT CITIZEN INCIDENT REPORT TO COMMAND</span>
            </button>
          </div>
        </form>

        {/* RIGHT: Live Verified Citizen Reports Gallery Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  VERIFIED CITIZEN REPORTS FEED
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                {reportsList.length} LOGGED
              </span>
            </div>

            {/* Scrollable feed cards */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {reportsList.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-xl bg-[#121724] border border-slate-800 hover:border-cyan-500/50 transition-all text-xs space-y-2"
                >
                  {/* Top Status & Timestamp */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400">
                      {report.ticketNumber}
                    </span>
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {report.timestamp}
                    </span>
                  </div>

                  {/* Location & Urgency Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-200 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{report.location}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 border ${
                      report.urgency === 'CRITICAL_RESCUE'
                        ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                        : report.urgency === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-cyan-300 border-cyan-800'
                    }`}>
                      {report.urgency === 'CRITICAL_RESCUE' ? 'CRITICAL' : report.urgency}
                    </span>
                  </div>

                  {/* Water Depth Badge */}
                  <div className="text-[10px] text-slate-400">
                    Depth: <strong className="text-cyan-300">
                      {report.waterDepth.replace('_', ' ')}
                    </strong>
                  </div>

                  {/* Uploaded Water Logging Image (if available) */}
                  {report.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black/60 max-h-36">
                      <img
                        src={report.imageUrl}
                        alt={`Flood report photo ${report.ticketNumber}`}
                        className="w-full h-28 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono-hud text-cyan-300 border border-cyan-500/30">
                        CITIZEN PHOTO
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 leading-snug">
                    "{report.description}"
                  </p>

                  {/* Reporter Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>By: {report.reporterName || 'Citizen'}</span>
                    <span className="text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Encrypted Citizen Telemetry</span>
            <span className="text-cyan-400">USGS Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
