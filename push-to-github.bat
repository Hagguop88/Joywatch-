@echo off
title Push Joywatch to GitHub
cd /d "%~dp0"
echo ===================================================
echo           Pushing Joywatch to GitHub
echo ===================================================
echo Target: https://github.com/Hagguop88/Joywatch-.git
echo Branch: main
echo.
git push -u origin main
echo.
echo ===================================================
echo Done! If successful, your repository is published!
echo ===================================================
pause
