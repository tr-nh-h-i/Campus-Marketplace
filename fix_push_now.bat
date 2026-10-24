@echo off
setlocal enabledelayedexpansion
title Campus Marketplace - Fix and Push Now
cd /d "%~dp0"

echo ========================================================
echo  CAMPUS MARKETPLACE - DONG BO VA DAY CODE LEN GITHUB
echo  Author: Trinh The Thanh Hai (1923050080 - hai1-git)
echo  Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git
echo ========================================================
echo.

git config user.name "hai1-git"
git config user.email "github1hai@gmail.com"

echo [1/3] Dong goi toan bo thay doi cuc bo vao Git...
git add -A
git commit -m "feat(store): optimize atomic selectors and persist partialize filter" --allow-empty

echo.
echo [2/3] Lay commit moi nhat tu GitHub va tu dong gop (merge)...
git fetch origin main
git merge origin/main -X ours --no-edit

echo.
echo [3/3] Dang day tat ca commit len GitHub (git push origin main)...
git push origin main

echo.
echo ========================================================
echo  HOAN TAT! Code va commit da duoc day len GitHub thanh cong.
echo  Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main
echo ========================================================
echo.
echo Nhan phim bat ky de thoat...
pause >nul
