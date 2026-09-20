@echo off
title Joywatch Web Launcher
cd /d "%~dp0\.."

echo ===================================================
echo              Starting Joywatch Web
echo ===================================================
echo Launching server and opening browser...

:: Open browser after 2 seconds in background
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:7700"

:: Start python server
python server.py
pause
