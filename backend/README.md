# BHUSENTRY - FastAPI Landslide Early Warning System Backend

Production-grade FastAPI + Supabase + Random Forest ML backend for the BHUSENTRY Landslide Early Warning & Risk Monitoring System.

## Architecture Overview

- **Framework**: FastAPI (Async, Pydantic v2, Dependency Injection)
- **Database & Auth**: Supabase PostgreSQL + PostGIS & Supabase Auth JWT validation
- **Machine Learning**: Scikit-Learn Random Forest Classifier model pre-warmed & persisted via `joblib`
- **Integrations**:
  - Live Weather & Precipitation: Open-Meteo API
  - Satellite Vegetation & InSAR: Sentinel Hub API
  - Terrain & DEM Elevation: OpenTopography API
  - AI Risk Explanation: xAI Grok / Google Gemini API
  - SMS Emergency Broadcasts: MSG91 API

---

## Developer Setup Guide

### 1. Requirements

- Python 3.10+
- virtualenv

### 2. Quickstart Execution

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create local environment file
cp .env.example .env

# Run FastAPI Development Server
uvicorn app.main:app --reload --port 8000
```

Interactive OpenAPI documentation is available at:
`http://127.0.0.1:8000/docs`

---

## Database Migration Instructions (Supabase)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Paste the contents of `backend/scripts/schema.sql`.
4. Click **Run**.

---

## API Route Specifications

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/integrations` - External services status
- `GET /api/v1/auth/me` - Authenticated user profile
- `GET /api/v1/locations` - Monitored vulnerability zones
- `POST /api/v1/predictions` - Run Random Forest ML risk inference
- `GET /api/v1/alerts` - List active & historical risk warnings
- `PUT /api/v1/alerts/{id}/acknowledge` - Officer alert acknowledgment
- `GET /api/v1/weather/{location_id}` - Open-Meteo live weather data
- `GET /api/v1/satellite/{location_id}` - Sentinel-2 satellite indices
- `GET /api/v1/terrain/{location_id}` - DEM elevation and slope angle
- `GET /api/v1/analytics/summary` - Executive risk analytics
- `POST /api/v1/ai/chat` - Copilot chatbot for officers
- `POST /api/v1/ai/explain/{prediction_id}` - AI factor breakdown
