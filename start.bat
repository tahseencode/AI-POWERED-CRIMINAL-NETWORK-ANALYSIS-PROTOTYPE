@echo off
title AI Criminal Network Analysis Launcher
echo ========================================================
echo Starting AI Criminal Network Analysis Prototype (SIH26189)
echo ========================================================

echo [1/2] Starting Backend API Server (Port 8000)...
start "Backend API (Port 8000)" cmd /k "python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend UI Server (Port 5173)...
start "Frontend UI (Port 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul
start http://localhost:5173

echo ========================================================
echo Both servers are running in separate terminal windows.
echo Frontend UI: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ========================================================
