# BHUSENTRY — Landslide Early Warning & Risk Monitoring System

BHUSENTRY is a full-stack AI-powered landslide hazard prediction, risk evaluation, and emergency early warning platform designed for disaster management authorities (NDMA, SDMAs, NDRF) and field response officers across the North Eastern Region (NER) and vulnerable Himalayan corridors of India.

---

## Architecture Overview

```
                          ┌────────────────────────┐
                          │   Frontend Portal      │
                          │ React 18 + Vite + Leaflet│
                          │   (Port: 5173)         │
                          └───────────┬────────────┘
                                      │
                               REST API Calls
                               (Axios / Bearer JWT)
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │    Backend Server      │
                          │ FastAPI + Scikit-learn │
                          │   (Port: 8000)         │
                          └─────┬────────────┬─────┘
                                │            │
               ┌────────────────┴──┐      ┌──┴──────────────────┐
               │ Machine Learning  │      │ Cloud & External    │
               │ Random Forest     │      │ - Supabase DB & Auth│
               │ Preprocessing     │      │ - Open-Meteo Weather│
               │ Geospatial Risk   │      │ - Sentinel Hub      │
               │ Classification    │      │ - xAI / Gemini AI   │
               └───────────────────┘      └─────────────────────┘
```

---

## Directory Structure

- `backend/`: FastAPI backend service with Scikit-learn ML inference model, Supabase PostgreSQL connector, JWT auth, and disaster response APIs.
- `Frontend/`: React 18 frontend dashboard built with Vite, Tailwind CSS, Lucide icons, Leaflet interactive maps, and Recharts analytics.
- `start_fullstack.bat` / `start_fullstack.ps1`: One-click scripts to launch both services in development mode.

---

## Quick Start (Run Both Services)

### Option 1: One-Click Launch Script
Double-click `start_fullstack.bat` or execute in PowerShell:
```powershell
.\start_fullstack.ps1
```

### Option 2: Manual Terminal Execution

#### 1. Start Backend:
```bash
cd backend
.\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Interactive API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative Redoc Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### 2. Start Frontend:
```bash
cd Frontend
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## Integrated API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Discovery** | `GET` | `/` | Root server status and API discovery |
| **Health** | `GET` | `/api/v1/health` | Basic service health verification |
| **Locations** | `GET` | `/api/v1/locations` | List monitored landslide zones and coordinates |
| **Locations** | `GET` | `/api/v1/locations/{id}` | Detailed telemetry for specific station |
| **Prediction** | `POST` | `/api/v1/predict` | Run Random Forest ML prediction on geotechnical inputs |
| **Alerts** | `GET` | `/api/v1/alerts` | List all active, acknowledged, and resolved warnings |
| **Alerts** | `PUT` | `/api/v1/alerts/{id}/acknowledge` | Mark warning as acknowledged |
| **Alerts** | `PUT` | `/api/v1/alerts/{id}/resolve` | Mark warning as resolved |
| **Analytics** | `GET` | `/api/v1/analytics/summary` | Overall disaster risk indicators |
| **Analytics** | `GET` | `/api/v1/analytics/state-risk` | State-wise landslide vulnerability distribution |
| **Analytics** | `GET` | `/api/v1/analytics/rainfall-risk` | Rainfall vs hazard index correlation |
| **AI Copilot**| `POST` | `/api/v1/ai/chat` | AI advisor copilot for emergency response officers |
| **Admin** | `GET` | `/api/v1/admin/users` | List registered operators and response teams |
| **Admin** | `GET` | `/api/v1/admin/system-health` | Telemetry for CPU, memory, DB, and ML model |
