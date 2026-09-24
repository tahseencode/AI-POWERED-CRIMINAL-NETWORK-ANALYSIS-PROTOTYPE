# PowerShell launcher for AI Criminal Network Analysis Prototype
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting AI Criminal Network Analysis Prototype (SIH26189) " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Start Backend in a dedicated window
Write-Host "[1/2] Starting Backend Server on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

# 2. Start Frontend in a dedicated window
Write-Host "[2/2] Starting Frontend Vite Server on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Start-Sleep -Seconds 2

# 3. Open browser
Start-Process "http://localhost:5173"

Write-Host "Done! Both servers are now running in separate terminal windows." -ForegroundColor Green
