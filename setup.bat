@echo off
:: Local AI Demo - Windows Setup Script
setlocal enabledelayedexpansion

echo 🤖 Local AI Demo - Windows Setup
echo ================================

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.x from https://python.org
    echo    Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
) else (
    echo ✅ Python is available
)

:: Check if curl is available (Windows 10 1803+ has curl built-in)
curl --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  curl not found. Trying to use PowerShell instead...
    set USE_POWERSHELL=1
) else (
    echo ✅ curl is available
    set USE_POWERSHELL=0
)

echo.
echo ℹ️  Setting up Ollama...

:: Check if Ollama is installed
ollama --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama not found. Please install it manually:
    echo.
    echo    1. Visit: https://ollama.ai/download
    echo    2. Download Ollama for Windows
    echo    3. Install and restart this script
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Ollama is installed
)

:: Pull model if not available
echo.
echo ℹ️  Checking for AI model...
ollama list | findstr "gemma3:1b" >nul
if errorlevel 1 (
    echo ℹ️  Downloading gemma3:1b model (this may take a few minutes)...
    ollama pull gemma3:1b
    if errorlevel 1 (
        echo ❌ Failed to download model
        pause
        exit /b 1
    ) else (
        echo ✅ Model downloaded successfully
    )
) else (
    echo ✅ gemma3:1b model is already available
)

:: Start Ollama with CORS
echo.
echo ℹ️  Starting Ollama with CORS enabled...

:: Kill existing Ollama processes
taskkill /f /im ollama.exe >nul 2>&1

:: Set CORS environment variables
set OLLAMA_ORIGINS=*
set OLLAMA_HOST=0.0.0.0:11434

:: Start Ollama in background
start /b ollama serve

:: Wait for startup
echo ℹ️  Waiting for Ollama to start...
timeout /t 5 /nobreak >nul

:: Test connection
if !USE_POWERSHELL! == 1 (
    powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }"
) else (
    curl -s http://127.0.0.1:11434/api/tags >nul
)

if errorlevel 1 (
    echo ❌ Failed to start Ollama
    echo    Check if Ollama is properly installed
    pause
    exit /b 1
) else (
    echo ✅ Ollama started successfully with CORS enabled!
)

:: Run diagnostics if available
echo.
if exist "check-setup.py" (
    echo ℹ️  Running setup diagnostics...
    python check-setup.py
) else (
    echo ⚠️  Setup checker not found, skipping diagnostics
)

:: Start demo server
echo.
echo ℹ️  Starting demo server...

:: Check if port 3000 is available
netstat -an | findstr ":3000" >nul
if not errorlevel 1 (
    echo ⚠️  Port 3000 is already in use
    echo ℹ️  You can manually start with: python -m http.server 3001
    pause
    exit /b 0
)

echo.
echo ✅ 🎉 Setup Complete!
echo.
echo ℹ️  Demo URL: http://localhost:3000
echo ℹ️  Configuration:
echo    Provider: Ollama
echo    Base URL: http://127.0.0.1:11434
echo    Model: gemma3:1b
echo.
echo ℹ️  Press Ctrl+C to stop the server
echo    Opening browser...

:: Open browser
start http://localhost:3000

:: Start the server
python -m http.server 3000