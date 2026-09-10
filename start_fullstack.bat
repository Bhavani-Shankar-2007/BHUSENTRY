@echo off
echo ================================================================
echo   BHUSENTRY Landslide Early Warning & Risk Monitoring System
echo   Starting Full Stack Application (Backend FastAPI + Frontend Vite)
echo ================================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "BHUSENTRY Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting React Vite Frontend on http://localhost:3000 ...
start "BHUSENTRY Frontend (Vite)" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo.
echo Full Stack BHUSENTRY is launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend Portal:  http://localhost:3000
echo ================================================================
