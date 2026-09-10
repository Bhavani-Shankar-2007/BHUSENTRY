# AI-Based Early Warning & Landslide Risk Monitoring System (NER)
### Smart India Hackathon (SIH) 2026 Prototype • Frontend Edition

A modern, responsive, GIS-enabled web interface designed for disaster risk reduction and early landslide warning across the 8 North Eastern States of India (Assam, Meghalaya, Sikkim, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura).

---

## 🌟 Key Highlights for SIH Presentation
- **Theme**: Nature + Technology + AI + GIS.
- **Top 3 Showcase Pages**:
  1. **Main Dashboard**: Real-time summary cards, mini Leaflet GIS preview, 7-day rainfall vs risk correlation, live warnings.
  2. **Risk Map (GIS)**: Full-screen OpenStreetMap with custom color-coded risk markers, hazard radii, search, and slide-over telemetry drawer.
  3. **AI Risk Prediction**: Interactive geotechnical simulator with animated semi-circular radial gauge (0.00 – 1.00 score) and 1-click test scenarios.
- **Strict Compliance**: All risk metrics pair distinct colors with unambiguous text labels: `LOW`, `MODERATE`, `HIGH`, `VERY HIGH`. Includes statutory prototype disclaimers.
- **Role-Based Demonstration**: 1-click quick switching between **Officer**, **Admin**, and **Public User** roles.

---

## 🛠️ Technology Stack
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **GIS Mapping**: Leaflet & React-Leaflet with OpenStreetMap tiles
- **Data Visualization**: Recharts (Donut, Composed Line+Bar, Stacked Bar, Area Charts)
- **Icons**: Lucide React
- **API Client**: Axios (configured with mock data and future FastAPI toggle)

---

## 📁 Beginner-Friendly Folder Structure

```text
src/
├── components/
│   ├── common/             # Reusable UI widgets
│   │   ├── Button.jsx      # Multi-variant button with loading state
│   │   ├── Card.jsx        # Rounded modern card container
│   │   ├── DisclaimerBanner.jsx # Mandatory SIH prototype disclaimer
│   │   ├── Modal.jsx       # Alert details and user registration dialogs
│   │   ├── RiskBadge.jsx   # Standardized LOW/MOD/HIGH/VERY HIGH pill badges
│   │   ├── RiskMeter.jsx   # Semi-circular animated risk gauge meter
│   │   └── SearchBar.jsx   # Instant search input with clear trigger
│   ├── layout/             # Application framework
│   │   ├── DashboardLayout.jsx # Shell with responsive drawer
│   │   ├── Footer.jsx      # Application and landing footer
│   │   ├── Navbar.jsx      # Landing page navigation bar
│   │   ├── Sidebar.jsx     # Dark Navy GIS navigation sidebar
│   │   └── Topbar.jsx      # Active alert counter & user role switcher
│   ├── map/                # Geospatial mapping components
│   │   ├── LocationSidePanel.jsx # Slide-out station telemetry drawer
│   │   ├── MapLegend.jsx   # Visual risk threshold guide
│   │   └── RiskMap.jsx     # Leaflet container with custom pulsing markers
│   └── charts/             # Recharts components
│       ├── RainfallTrendChart.jsx # 7-day precipitation vs risk composed chart
│       ├── RiskDonutChart.jsx     # Regional risk distribution donut
│       └── StateRiskBarChart.jsx  # State-wise risk stacked bar chart
├── context/
│   ├── AlertContext.jsx    # Global alert state & notification badge counter
│   └── AuthContext.jsx     # Role switching (Officer, Admin, Public)
├── data/                   # Realistic North Eastern Region mock datasets
│   ├── mockAlerts.js       # Active and resolved hazard advisories
│   ├── mockAnalytics.js    # Chart series data and KPI metrics
│   ├── mockLocations.js    # 12 NER stations (Gangtok, Sohra, Aizawl, etc.)
│   └── mockUsers.js        # Demo accounts for SIH evaluation
├── pages/                  # The 10 application views
│   ├── AdminPage.jsx       # User administration & system health
│   ├── AIPredictionPage.jsx# Interactive AI risk prediction simulator
│   ├── AlertsPage.jsx      # Alert management & SOP directives
│   ├── AnalyticsPage.jsx   # Precipitation & historical risk trends
│   ├── DashboardPage.jsx   # Main executive monitoring dashboard
│   ├── LandingPage.jsx     # Public portal & project introduction
│   ├── LocationDetailPage.jsx # Station deep-dive & historical logs
│   ├── LocationsPage.jsx   # Monitored locations directory (Table/Grid)
│   ├── LoginPage.jsx       # Authentication UI with 1-click role fill
│   └── RiskMapPage.jsx     # Full GIS monitoring workspace
├── services/               # Clean API service layer (Axios)
│   ├── alertService.js     # Alert management & status updates
│   ├── api.js              # Axios instance & mock/real toggle
│   ├── locationService.js  # Station query & filtering
│   └── predictionService.js# AI inference simulator
├── App.jsx                 # Route declarations
├── index.css               # Tailwind directives & pulsing marker CSS
└── main.jsx                # React DOM entry point
```

---

## 🚀 How to Run Locally

### 1. Prerequisite: Node.js
If Node.js is not yet installed on your system:
1. Download the LTS version from [https://nodejs.org/](https://nodejs.org/).
2. Run the installer (make sure the checkbox *"Add to PATH"* is checked).
3. Restart your terminal or VS Code.

### 2. Install Dependencies
Open PowerShell or your command prompt in this project folder and run:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🔌 Connecting to Your Teammate's FastAPI Backend (Later)

Currently, the application runs entirely on realistic mock data situated in `src/data/`.

When your backend teammate has the FastAPI endpoints ready:
1. Open `.env.example` and copy it to a new file named `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_ENABLE_MOCK_DATA=false
   ```
2. The services in `src/services/` (`locationService.js`, `alertService.js`, `predictionService.js`) will immediately route all calls to your backend without needing any changes in your UI components!
