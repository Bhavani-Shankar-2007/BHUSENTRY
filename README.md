# 🏔️ BHUSENTRY — AI Landslide Early Warning & Geospatial Risk Monitoring System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo%20Live-orange.svg)](https://open-meteo.com/)
[![NASA GIBS](https://img.shields.io/badge/Satellite-NASA%20GIBS%20%2F%20ESRI-0052CC.svg)](https://wiki.earthdata.nasa.gov/display/GIBS)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**BHUSENTRY** is an intelligent, full-stack geospatial landslide early warning and hazard assessment platform engineered for disaster management authorities (**NDMA**, **SDMAs**, **NDRF**, **District Emergency Operation Centers**) and field response officers. It safeguards vulnerable hilly corridors across the **North Eastern Region (NER)**, the **Himalayas**, and the **Western Ghats** of India.

---

## 📌 Key Highlights

- **🧠 Hybrid AI/Physics Geotechnical Prediction Engine**: Blends a 65% Scikit-Learn Random Forest ensemble with a 35% Mohr-Coulomb geotechnical physics formula calibrated against **Geological Survey of India (GSI)** LHEF hazard ratings and **IMD rainfall thresholds**.
- **🌦️ Live Real-Time Weather Integration**: Fetches dynamic precipitation (24h and 72h antecedent accumulation), soil moisture, temperature, and wind speed directly from the **Open-Meteo API** by geographic coordinates.
- **🛰️ Satellite Remote Sensing & GIS Layers**: Real-time integration with **NASA GIBS** (MODIS/VIIRS WMS layers) and **ESRI World Imagery** for live terrain visualization and NDVI vegetation index monitoring.
- **🚨 NDMA-Standard Risk Stratification**: Translates multi-factor risk scores into standardized disaster advisory levels:
  - `LOW` (< 0.25) — Normal baseline surveillance
  - `MODERATE` (0.25 – 0.54) — Advisory alert for vulnerable slopes
  - `HIGH` (0.55 – 0.79) — Evacuation warning & emergency team alert
  - `VERY HIGH` (≥ 0.80) — Imminent danger / catastrophic landslide warning
- **🤖 AI Disaster Copilot**: Context-aware emergency advisor powered by **Google Gemini** (with built-in offline expert heuristics) to generate SOP-driven evacuation and rescue advisories.
- **🗺️ Interactive React Dashboard**: Responsive GIS map built with **React 18 + Vite + Leaflet + Tailwind CSS**, featuring live telemetry gauges, satellite layer toggles, and incident response management.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       Frontend Dashboard (React 18)     │
                               │  Vite · Leaflet · TailwindCSS · Recharts│
                               │               (Port: 5173)              │
                               └────────────────────┬────────────────────┘
                                                    │
                                         REST API / Bearer JWT
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │        FastAPI Backend Engine           │
                               │      Pydantic v2 · Async Endpoints      │
                               │               (Port: 8000)              │
                               └──────┬─────────────┬─────────────┬──────┘
                                      │             │             │
        ┌─────────────────────────────┴┐     ┌──────┴──────┐     ┌┴──────────────────────────┐
        ▼                              ▼     ▼             ▼     ▼                           ▼
┌───────────────┐              ┌────────────────┐   ┌─────────────────┐             ┌─────────────────┐
│ Machine       │              │ Geotechnical   │   │ External APIs   │             │ Storage & Cloud │
│ Learning      │              │ Physics Model  │   │ · Open-Meteo    │             │ · Supabase DB   │
│ Random Forest │              │ Mohr-Coulomb & │   │ · NASA GIBS WMS │             │   (PostgreSQL)  │
│ (0.65 Weight) │              │ GSI (0.35 Wt)  │   │ · ESRI Imagery  │             │ · Supabase Auth │
└───────┬───────┘              └────────┬───────┘   │ · Google Gemini │             └─────────────────┘
        │                               │           └─────────────────┘
        └───────────────┬───────────────┘
                        ▼
         ┌─────────────────────────────┐
         │ Ensembled Probability Score │
         │   & Contributing Factors    │
         └─────────────────────────────┘
```

---

## 📊 Data Sources & Real-World Provenance

If asked about the authenticity and sources of data utilized by BHUSENTRY:

| Data Type | Primary Source | Integration Mechanism | Refresh Rate |
|---|---|---|---|
| **Live Precipitation & Weather** | [Open-Meteo](https://open-meteo.com/) (ECMWF, GFS, DWD, IMD feeds) | Coordinates-based REST query (`precipitation_sum`, `soil_moisture`) | Real-time on demand |
| **Satellite Base & Multi-spectral** | [NASA GIBS (EOSDIS)](https://wiki.earthdata.nasa.gov/display/GIBS) & [ESRI](https://services.arcgisonline.com/) | WMS / Tile Layer integration in Leaflet GIS | Daily / Near Real-time |
| **Slope, Elevation & Topography** | OpenTopography / SRTM 30m DEM & GSI Geological Maps | Geocoded station metadata & Digital Elevation Models | Static / High-Resolution |
| **Landslide Susceptibility Standards** | [Geological Survey of India (GSI)](https://www.gsi.gov.in/) & [NDMA](https://ndma.gov.in/) | LHEF (Landslide Hazard Evaluation Factor) scoring guidelines | Standardized |
| **Rainfall Danger Thresholds** | [India Meteorological Department (IMD)](https://mausam.imd.gov.in/) | 64.5mm (Heavy), 115.5mm (Very Heavy), 204.5mm (Extremely Heavy) | Operational standard |

---

## 🗂️ Project Directory Structure

```text
BHUSENTRY/
├── backend/                         # FastAPI Application Root
│   ├── app/
│   │   ├── api/                     # REST API Route Controllers
│   │   │   ├── admin.py             # System telemetry & user ops
│   │   │   ├── ai.py                # AI copilot & explainability routes
│   │   │   ├── alerts.py            # Alert notifications & status updates
│   │   │   ├── analytics.py         # Hazard distribution & risk metrics
│   │   │   ├── health.py            # Healthcheck & integration statuses
│   │   │   ├── locations.py         # Vulnerable slope stations & coordinates
│   │   │   ├── prediction.py        # ML prediction & live weather triggers
│   │   │   └── satellite.py         # NASA/ESRI imagery endpoint
│   │   ├── core/                    # App settings, logging, Supabase client
│   │   ├── integrations/            # Third-party integrations
│   │   │   ├── gemini.py            # Google Gemini AI LLM client
│   │   │   ├── open_meteo.py        # Live weather & rainfall connector
│   │   │   └── satellite_imagery.py # NASA GIBS & ESRI satellite providers
│   │   ├── ml/                      # Machine Learning & Physics core
│   │   │   ├── model.py             # Model training & synthetic data generation
│   │   │   ├── model.joblib         # Pre-trained Random Forest model
│   │   │   ├── predictor.py         # Ensemble predictor (ML + Physics + Factors)
│   │   │   └── preprocessing.py     # Feature extraction & normalization
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/                # Business logic services
│   │   └── utils/                   # Risk categorizers & helpers
│   ├── scripts/schema.sql           # Database DDL schema for Supabase
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Backend environment template
│
├── Frontend/                        # React Dashboard Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Sidebar, Stat Cards, Alerts
│   │   │   └── map/                 # Leaflet Risk Map & Satellite Layers
│   │   ├── pages/                   # Dashboard, Early Warning, Analytics, Copilot
│   │   └── services/                # API clients & regional hotspot data
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite configuration
│
├── start_fullstack.bat              # Windows batch launch script
├── start_fullstack.ps1              # Windows PowerShell launch script
└── README.md                        # Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Option 1: Automated Launch (Recommended)

From the project root directory, run:
```powershell
.\start_fullstack.ps1
```
*(Or double-click `start_fullstack.bat` on Windows)*

This script automatically activates the Python virtual environment, launches the FastAPI server on port 8000, and boots the React/Vite development server on port 5173.

---

### Option 2: Manual Step-by-Step Setup

#### 1. Backend Setup

```bash
cd backend

# Create and activate Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Windows
# source venv/bin/activate    # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env

# Run FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- 📖 **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📑 **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### 2. Frontend Setup

```bash
cd Frontend

# Install node packages
npm install

# Start Vite development server
npm run dev
```

- 🌐 **Web Dashboard**: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Environment Configuration

Copy `backend/.env.example` to `backend/.env` and supply your credentials:

```env
# Application
ENVIRONMENT=development
LOG_LEVEL=DEBUG
API_V1_STR=/api/v1
PROJECT_NAME="BHUSENTRY Landslide Early Warning System"

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Copilot (Optional, will use offline expert advisor if omitted)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# SMS Gateway (Optional)
MSG91_AUTH_KEY=your-msg91-key
```

---

## 📡 REST API Reference

| Domain | Method | Route | Description |
|---|---|---|---|
| **Discovery** | `GET` | `/` | API status & version details |
| **Health** | `GET` | `/api/v1/health` | Comprehensive health check (DB, Model, System) |
| **Health** | `GET` | `/api/v1/health/integrations` | Connectivity test for Open-Meteo, NASA, etc. |
| **Locations** | `GET` | `/api/v1/locations` | All monitored landslide hazard stations |
| **Locations** | `GET` | `/api/v1/locations/{id}` | Sensor telemetry and historical status of a station |
| **Prediction** | `POST` | `/api/v1/predict` | Run hybrid ML + Physics landslide hazard inference |
| **Prediction** | `GET` | `/api/v1/predict/location/{id}` | Live prediction combining sensor telemetry + Open-Meteo |
| **Satellite** | `GET` | `/api/v1/satellite/{id}` | NASA GIBS / ESRI satellite tiles, NDVI & indices |
| **Alerts** | `GET` | `/api/v1/alerts` | List all active, warning, and resolved emergency alerts |
| **Alerts** | `PUT` | `/api/v1/alerts/{id}/acknowledge` | Acknowledge alert by response officer |
| **Alerts** | `PUT` | `/api/v1/alerts/{id}/resolve` | Close resolved hazard incident |
| **Analytics** | `GET` | `/api/v1/analytics/summary` | Executive-level regional hazard indicators |
| **Analytics** | `GET` | `/api/v1/analytics/rainfall-risk` | Empirical correlation between rainfall and hazard index |
| **AI Copilot** | `POST` | `/api/v1/ai/chat` | Disaster copilot dialogue for evacuation advisory |
| **AI Copilot** | `POST` | `/api/v1/ai/explain/{id}` | Natural language breakdown of contributing factors |

---

## 🧪 Model Testing & Validation

You can verify the hybrid ML prediction pipeline with the following command:

```powershell
cd backend
.\venv\Scripts\python.exe -c "from app.ml.predictor import predictor_engine; print(predictor_engine.predict({'rainfall_24h_mm': 160.0, 'slope_deg': 38.0, 'soil_moisture': 0.78, 'pore_water_pressure_kpa': 22.0}))"
```

Expected Output:
```python
(
  0.59,               # Ensembled Risk Probability
  'HIGH',             # NDMA Risk Classification
  0.60,               # Model Confidence Score
  { ... },            # Feature Importance Breakdown
  [                   # Factor Explanations
    'Very heavy 24h rainfall (160.0 mm) — IMD Very Heavy classification; critical saturation threshold exceeded',
    'Steep slope gradient (38.0°) — exceeds critical mass-wasting angle for this soil type',
    'Near-saturated soil (78% moisture) — minimal remaining pore space; runoff conversion rapid',
    'Elevated pore water pressure (22.0 kPa) — weakening slope shear resistance'
  ]
)
```

---

## 👥 Target Users & Impact

- **National Disaster Management Authority (NDMA)**: Macroscopic hazard monitoring across multi-state Himalayan regions.
- **State Disaster Management Authorities (SDMAs)**: Actionable early warnings with 24h–72h lead time for localized alerts.
- **National Disaster Response Force (NDRF)**: Priority staging coordinates and live route accessibility advisories.
- **District Magistrates & Local Authorities**: Instant evacuation alerts and public advisories based on scientific thresholds.

---

## 📄 License
This project is licensed under the MIT License. Developed for SIH (Smart India Hackathon).
