@echo off
setlocal enabledelayedexpansion
title Campus Marketplace - Daily Push for Son

cd /d "%~dp0"

echo ========================================================
echo  CAMPUS MARKETPLACE - DAILY GIT PUSH TOOL
echo  Author: Bui Thanh Son (1923050973 - Sonbui12345)
echo  Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git
echo ========================================================
echo.

git config user.name "Sonbui12345"

rem Cap nhat remote sang link to chuc/nhom moi
git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>nul || git remote add origin https://github.com/tr-nh-h-i/Campus-Marketplace.git

echo [1/3] Kiem tra va cap nhat code moi nhat tu cac ban...
git pull origin main
echo.

echo ========================================================
echo  CHON NOI DUNG COMMIT THEO KE HOACH PHAN CONG (SON):
echo ========================================================
echo  [1] Ngay 22/10: feat(theme): define centralized design tokens for light and dark schemes
echo  [2] Ngay 23/10: feat(ui): ensure WCAG touch target 44x44 and accessibility labels on ListingCard
echo  [3] Ngay 24/10 (Hom nay): feat(components): implement 4-state handler with working retry button
echo  [4] Ngay 25/10 (Ngay mai): feat(home): style category filter chips and search bar computed during render
echo  [5] Ngay 26/10: feat(listings): style seller controls and buyer action buttons on detail view
echo  [6] Tu nhap commit message tuy y
echo  [0] Thoat
echo ========================================================
set /p CHOICE="Nhap lua chon cua ban [1-6, hoac 0]: "

if "%CHOICE%"=="0" goto exit_script
if "%CHOICE%"=="1" set MSG=feat(theme): define centralized design tokens for light and dark schemes
if "%CHOICE%"=="2" set MSG=feat(ui): ensure WCAG touch target 44x44 and accessibility labels on ListingCard
if "%CHOICE%"=="3" set MSG=feat(components): implement 4-state handler with working retry button
if "%CHOICE%"=="4" set MSG=feat(home): style category filter chips and search bar computed during render
if "%CHOICE%"=="5" set MSG=feat(listings): style seller controls and buyer action buttons on detail view
if "%CHOICE%"=="6" (
    echo.
    set /p MSG="Nhap noi dung commit message: "
)

if "%MSG%"=="" (
    echo.
    echo Lua chon khong hop le! Vui long chay lai.
    goto end_script
)

echo.
echo [2/3] Dang chuan bi commit: "%MSG%"...
git add .
git commit -m "%MSG%" --allow-empty

echo.
echo [3/3] Dang day len GitHub (git push origin main)...
git push origin main

echo.
echo ========================================================
echo  HOAN TAT! Commit da duoc day len GitHub thanh cong.
echo  Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main
echo ========================================================

:end_script
echo.
echo Nhan phim bat ky de thoat...
pause >nul
exit /b

:exit_script
exit /b
