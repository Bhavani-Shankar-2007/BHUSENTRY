# BHUSENTRY Deployment Guide

This guide outlines production deployment workflows for **BHUSENTRY** (FastAPI Backend + Vite/React Frontend).

---

## Architecture Overview

- **Frontend**: React (Vite, Tailwind CSS, Lucide Icons, Leaflet/MapLibre, Chart.js)
- **Backend**: FastAPI, Uvicorn, Scikit-learn (Random Forest Hazard Model), xAI Grok API, Open-Meteo Weather API, Supabase Auth & PostgreSQL
- **Default Ports**:
  - Frontend: `http://localhost:5173` (Dev) / `80` (Nginx Docker)
  - Backend: `http://localhost:8000` (API & Swagger Docs at `/docs`)

---

## Option 1: Docker Compose (Recommended)

Deploy the entire fullstack system with one command on any Linux/Windows VPS, AWS EC2, or DigitalOcean Droplet:

```bash
docker compose up -d --build
```

- **Frontend** will be live on `http://<YOUR_SERVER_IP>`
- **Backend API** will be live on `http://<YOUR_SERVER_IP>:8000/api/v1`
- **Swagger Docs** will be accessible at `http://<YOUR_SERVER_IP>:8000/docs`

To stop:
```bash
docker compose down
```

---

## Option 2: Split Cloud Deployment (Vercel/Netlify + Render/Railway)

### 1. Backend (Render / Railway / Fly.io / AWS EC2)
- **Root directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `PORT`: (Auto-set by platform)
  - `SUPABASE_URL`: `https://your-project.supabase.co`
  - `SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
  - `SUPABASE_SERVICE_ROLE_KEY`: `<your-supabase-service-role-key>`
  - `GROK_API_KEY`: `<your-grok-api-key>`
  - `XAI_API_KEY`: `<your-xai-api-key>`
  - `GEMINI_API_KEY`: `<your-gemini-api-key>`
  - `CORS_ORIGINS`: `https://your-frontend.vercel.app,*`

### 2. Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root directory**: `Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api/v1`
  - `VITE_ENABLE_MOCK_DATA`: `false`
  - `VITE_USE_OPEN_METEO`: `true`
  - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`

---

## Option 3: Local / Development Startup

### PowerShell (Windows):
```powershell
.\start_fullstack.ps1
```

### Windows Batch:
```cmd
start_fullstack.bat
```

---

## Health Check & Verification

- Backend Health: `GET /api/v1/health` or `GET /`
- AI Copilot: `POST /api/v1/ai/chat` with body `{"prompt": "Assess landslide risk in Wayanad"}`
- Live Locations: `GET /api/v1/locations`
- Risk Predictions: `POST /api/v1/predict`
