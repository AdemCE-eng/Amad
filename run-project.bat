@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "JAVA_DIR=C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin"

title Amad One-Click Launcher

if exist "%JAVA_DIR%\java.exe" (
  set "PATH=%PATH%;%JAVA_DIR%"
)

if /I "%~1"=="--check" (
  call :require_tools --check
  if errorlevel 1 exit /b 1
  if not exist "%BACKEND_DIR%\package.json" (
    echo [ERROR] Missing backend\package.json.
    exit /b 1
  )
  if not exist "%FRONTEND_DIR%\package.json" (
    echo [ERROR] Missing frontend\package.json.
    exit /b 1
  )
  echo [OK] Launcher check passed.
  exit /b 0
)

echo.
echo ========================================
echo   Amad - one-click local launcher
echo ========================================
echo.

call :require_tools
if errorlevel 1 (
  echo.
  pause
  exit /b 1
)

if not exist "%BACKEND_DIR%\.env" (
  echo [SETUP] Creating backend\.env from backend\.env.example
  copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
)

if not exist "%BACKEND_DIR%\node_modules" (
  echo [SETUP] Installing backend dependencies...
  call npm --prefix "%BACKEND_DIR%" install
  if errorlevel 1 goto fail
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo [SETUP] Installing frontend dependencies...
  call npm --prefix "%FRONTEND_DIR%" install
  if errorlevel 1 goto fail
)

echo [START] Firebase Realtime Database emulator
start "Amad Firebase Emulator" /D "%ROOT%" cmd /k firebase emulators:start --only database

echo [WAIT] Waiting for Firebase on 127.0.0.1:9000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "for ($i = 0; $i -lt 30; $i++) { try { $client = [System.Net.Sockets.TcpClient]::new('127.0.0.1', 9000); $client.Close(); exit 0 } catch { Start-Sleep -Seconds 1 } }; exit 1"
if errorlevel 1 (
  echo [ERROR] Firebase emulator did not start on port 9000.
  echo Check the 'Amad Firebase Emulator' window for details.
  pause
  exit /b 1
)

echo [SETUP] Seeding demo data...
call npm --prefix "%BACKEND_DIR%" run seed
if errorlevel 1 goto fail

echo [START] Backend and Cheat Controller on http://localhost:3000/
start "Amad Backend + Cheat Controller" /D "%BACKEND_DIR%" cmd /k npm run dev

echo [START] React frontend on http://localhost:5173/
start "Amad React Frontend" /D "%FRONTEND_DIR%" cmd /k npm run dev -- --host 127.0.0.1 --port 5173 --strictPort

echo [OPEN] Opening browser tabs...
timeout /t 4 /nobreak >nul
start "" "http://localhost:3000/"
start "" "http://localhost:5173/"

echo.
echo Done. Keep the three service windows open while using the demo.
echo Close those windows to stop the project.
echo.
pause
exit /b 0

:require_tools
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is required. Install Node.js 20+ and run this again.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm is required. Reinstall Node.js with npm enabled.
  exit /b 1
)

where java >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Java is required for the Firebase emulator.
  echo Install a JDK/JRE 17+ or update JAVA_DIR inside this file.
  exit /b 1
)

where firebase >nul 2>&1
if errorlevel 1 (
  if /I "%~1"=="--check" (
    echo [WARN] Firebase CLI is missing. A normal launch will run: npm install -g firebase-tools
    exit /b 0
  )
  echo [SETUP] Firebase CLI not found. Installing firebase-tools globally...
  call npm install -g firebase-tools
  if errorlevel 1 (
    echo [ERROR] Could not install firebase-tools.
    exit /b 1
  )
)

exit /b 0

:fail
echo.
echo [ERROR] Launch failed. Check the message above.
pause
exit /b 1