Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  BHUSENTRY Landslide Early Warning & Risk Monitoring System" -ForegroundColor Green
Write-Host "  Starting Full Stack Application (Backend FastAPI + Frontend Vite)" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "Frontend"

Write-Host "`n[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; .\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/2] Starting React Vite Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"

Write-Host "`nFull Stack BHUSENTRY is up and running!" -ForegroundColor Green
Write-Host "Backend Swagger Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Frontend Portal:       http://localhost:3000" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
