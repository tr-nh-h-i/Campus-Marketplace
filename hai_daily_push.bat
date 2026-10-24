@echo off
setlocal enabledelayedexpansion
title Campus Marketplace - Daily Push for Hai
cd /d "%~dp0"

echo ========================================================
echo  CAMPUS MARKETPLACE - DAILY GIT PUSH TOOL
echo  Author: Trinh The Thanh Hai (1923050080 - hai1-git)
echo  Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git
echo ========================================================
echo.

git config user.name "hai1-git"
git config user.email "github1hai@gmail.com"

rem Cap nhat remote sang link to chuc/nhom moi
git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>nul || git remote add origin https://github.com/tr-nh-h-i/Campus-Marketplace.git

echo ========================================================
echo  CHON NOI DUNG COMMIT THEO KE HOACH PHAN CONG:
echo ========================================================
echo  [1] Ngay 22/10: feat(auth): implement sessionSlice and role switching logic
echo  [2] Ngay 23/10: security(storage): enforce SecureStore encryption for JWT tokens
echo  [3] Ngay 24/10 (Hom nay): feat(store): optimize atomic selectors and persist partialize filter
echo  [4] Ngay 25/10 (Ngay mai): feat(navigation): integrate bottom tab bar and reactive cart badge
echo  [5] Ngay 26/10: feat(profile): finalize complete sign-out flow and team metadata
echo  [6] Ngay 27/10: docs: finalize project documentation and release readiness
echo  [7] Tu nhap commit message tuy y
echo  [0] Thoat
echo ========================================================
set /p CHOICE="Nhap lua chon cua ban [1-7, hoac 0]: "

if "%CHOICE%"=="0" goto exit_script
if "%CHOICE%"=="1" set MSG=feat(auth): implement sessionSlice and role switching logic
if "%CHOICE%"=="2" set MSG=security(storage): enforce SecureStore encryption for JWT tokens
if "%CHOICE%"=="3" set MSG=feat(store): optimize atomic selectors and persist partialize filter
if "%CHOICE%"=="4" set MSG=feat(navigation): integrate bottom tab bar and reactive cart badge
if "%CHOICE%"=="5" set MSG=feat(profile): finalize complete sign-out flow and team metadata
if "%CHOICE%"=="6" set MSG=docs: finalize project documentation and release readiness
if "%CHOICE%"=="7" (
    echo.
    set /p MSG="Nhap noi dung commit message: "
)

if "%MSG%"=="" (
    echo.
    echo Lua chon khong hop le! Vui long chay lai.
    goto end_script
)

echo.
echo [1/3] Dang luu commit cua ban vao Git cuc bo: "%MSG%"...
git add -A
git commit -m "%MSG%" --allow-empty

echo.
echo [2/3] Dang dong bo commit moi tu cac ban tren GitHub...
git fetch origin main
git merge origin/main -X ours --no-edit

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
