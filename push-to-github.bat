@echo off
title Push Joywatch to GitHub
cd /d "%~dp0"
echo ===================================================
echo           Pushing Joywatch to GitHub
echo ===================================================
echo Target: https://github.com/Hagguop88/Joywatch-.git
echo Branch: main
echo.
echo If a GitHub Sign-In prompt or browser opens:
echo Simply click "Sign in with your browser" to approve!
echo.
echo ---------------------------------------------------
git push -u origin main
echo ---------------------------------------------------
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Your repository has been pushed to GitHub!
    echo Check it out at: https://github.com/Hagguop88/Joywatch-
) else (
    echo [NOTICE] If prompt was closed or authentication failed, you can run this file again anytime.
)
echo.
echo ===================================================
pause
