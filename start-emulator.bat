@echo off
set "PATH=%PATH%;C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin"
cd /d "%~dp0"
firebase emulators:start --only database
