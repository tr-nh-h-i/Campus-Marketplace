@echo off
echo ========================================================
echo  CLEANING FAKE COMMITS AND RESETTING GITHUB REPO...
echo  Repo: https://github.com/hai1-git/Campus-Marketplace.git
echo ========================================================

cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0reset_clean_repo.ps1"

echo.
echo ========================================================
echo  Done! Press any key to exit...
pause >nul
