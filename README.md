# Flash Flood Detective - AI Incident Command Dashboard

Disaster Management, Flash Flood Early Warning & Citizen Crowdsourced Telemetry Dashboard.

---

## 🚀 How to Run in VS Code (Windows Laptop)

### 1. Requirements
- Install **Node.js** (LTS version) from https://nodejs.org/ (if not installed already).
- Open **VS Code**.

### 2. Quick Setup Commands
Open the terminal in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`), and run:

```bash
npm install
```

Once installed, start the development server:
```bash
npm run dev
```

### 3. View in Browser
Open your browser at:
`http://localhost:3000` (or `http://localhost:5173`)

---

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Dark Cyber HUD Theme)
- **Maps**: Leaflet + React-Leaflet (GIS Basin Polygons & Stream Gauges)
- **Charts**: Recharts (Hydrographs & Rainfall Prediction)
- **Icons**: Lucide-React
- **Audio Engine**: Web Audio API (Procedural Sonar & Warning Sirens)
- **Emergency Telemetry**: Clickable 1-Tap SOS Dispatch (`tel:` protocol)
- **Citizen Reporting**: Drag-and-drop Photo Upload & LocalStorage Persistence

---

## 🎤 Key Modules for Judges Presentation
1. **Multi-Source Telemetry Matrix**: Live Rainfall (mm/h), Soil Saturation Moisture (%), and River Stage vs. Flood Thresholds.
2. **AI Hydrological Verdict Engine**: Automatic real-time status calculation (`SAFE`, `INVESTIGATING`, `IMMEDIATE EVACUATION REQUIRED`).
3. **Interactive GIS Flood Map**: Dynamic markers with watershed basins and chokepoints.
4. **Citizen Incident Crowdsourcing**: Real-time photo evidence upload and community alert logging.
5. **SOS Emergency Hotline Dispatch**: Direct 1-tap dialer for 911, NDRF, Municipal Flood Control, and Red Cross Shelters.
