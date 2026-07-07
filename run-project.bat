@echo off
setlocal

set "SCRIPT=%~dp0scripts\run-project.ps1"

if not exist "%SCRIPT%" (
  echo [ERROR] Missing launcher script: %SCRIPT%
  pause
  exit /b 1
)

if /I "%~1"=="--check" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Check
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" %*
)

if errorlevel 1 (
  pause
  exit /b 1
)

exit /b 0
