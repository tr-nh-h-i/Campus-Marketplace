@echo off
setlocal enabledelayedexpansion
title Campus Marketplace - Daily Push for Nhat

chcp 65001 >nul

rem Tu dong dieu huong vao thu muc code neu chay tu Downloads
cd /d "%~dp0"
if exist "%~dp0Campus-Marketplace-main\.git" (
    cd /d "%~dp0Campus-Marketplace-main"
) else if exist "%~dp0Campus-Marketplace-main" (
    cd /d "%~dp0Campus-Marketplace-main"
)

rem Luon nap MinGit vao PATH de nhan dien day du git va git-credential-manager
if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\MinGit\mingw64\bin;!PATH!"
)

echo ========================================================
echo  CAMPUS MARKETPLACE - DAILY GIT PUSH TOOL
echo  Thanh vien: Nguyen Vu Minh Nhat (MSSV: 1923050861)
echo  Thu muc code: %CD%
echo  Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git
echo ========================================================
echo.

rem Kiem tra Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] Khong tim thay Git tren may!
    echo Vui long kiem tra lai duong dan Git.
    pause
    exit /b 1
)

rem Kiem tra thu muc .git
if not exist ".git" (
    echo [THONG BAO] Chua co thu muc Git cuc bo, dang tu dong khoi tao va dong bo...
    git init
    git remote add origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>nul || git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git
    git fetch origin main
    git branch -M main
    git reset origin/main
    echo [OK] Da ket noi kho Git voi GitHub origin/main thanh cong.
    echo.
)

git config user.name "Nguyen Vu Minh Nhat"
git config user.email "1923050861@dntu.edu.vn"
git config credential.helper manager
git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>nul

echo ========================================================
echo  CHON NOI DUNG COMMIT THEO KE HOACH PHAN CONG (NHAT):
echo ========================================================
echo  [1] Ngay 22/10: feat: phat trien tien ich nen anh giam dung luong 93%
echo  [2] Ngay 23/10: feat: thiet ke banner canh bao offline kem moc thoi gian cap nhat
echo  [3] Ngay 24/10: feat: luu tru bo dem danh muc san pham vao AsyncStorage
echo  [4] Ngay 25/10: test: viet kiem thu tu dong cho quy tac giao hang KTX va ton kho
echo  [5] Ngay 26/10: test: viet kiem thu luong thao tac mua hang va thanh toan gio hang
echo  [6] Ngay 27/10: test: hoan thien bo kiem thu component va tuong phan mau sac
echo  [7] Tu nhap commit message tuy y
echo  [0] Thoat
echo ========================================================
set /p CHOICE="Nhap lua chon cua ban [1-7, hoac 0]: "

if "%CHOICE%"=="0" goto exit_script
if "%CHOICE%"=="1" set MSG=feat: phat trien tien ich nen anh giam dung luong 93%
if "%CHOICE%"=="2" set MSG=feat: thiet ke banner canh bao offline kem moc thoi gian cap nhat
if "%CHOICE%"=="3" set MSG=feat: luu tru bo dem danh muc san pham vao AsyncStorage
if "%CHOICE%"=="4" set MSG=test: viet kiem thu tu dong cho quy tac giao hang KTX va ton kho
if "%CHOICE%"=="5" set MSG=test: viet kiem thu luong thao tac mua hang va thanh toan gio hang
if "%CHOICE%"=="6" set MSG=test: hoan thien bo kiem thu component va tuong phan mau sac
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
echo [1/3] Dang luu commit vao Git cuc bo: "%MSG%"...
git add -A
git commit -m "%MSG%" --allow-empty

echo.
echo [2/3] Dang dong bo commit moi tu cac ban tren GitHub...
git fetch origin main
git merge origin/main -X ours --no-edit

echo.
echo [3/3] Dang day len GitHub (git push origin main)...
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  HOAN TAT! Commit da duoc day len GitHub thanh cong.
    echo  Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  [!] CHUA DAY LEN DUOC GITHUB!
    echo ========================================================
    echo  Ly do: GitHub tu choi do chua xac thuc quyen Write tren repo.
    echo.
    echo  Cach xu ly:
    echo  1. Ban can co quyen Collaborator tren repo https://github.com/tr-nh-h-i/Campus-Marketplace
    echo  2. Hoac ban can GitHub Personal Access Token (PAT) cua ban hoac do nhom truong (Hai) cap.
    echo.
    set /p GHTOKEN="  >> Neu co Token, hay dan GitHub Token vao day (hoac Enter de bo qua): "
    if not "!GHTOKEN!"=="" (
        git remote set-url origin https://!GHTOKEN!@github.com/tr-nh-h-i/Campus-Marketplace.git
        git push origin main
        if !ERRORLEVEL! EQU 0 (
            echo.
            echo  [OK] DA DAY LEN GITHUB THANH CONG VOI TOKEN!
            echo  Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main
        ) else (
            echo.
            echo  [X] Token khong hop le hoac khong co quyen Write vao repo nay!
            echo  Vui long lien he nhom truong (hai1-git) moi ban vao lam Collaborator.
        )
        git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git
    )
)

:end_script
echo.
echo Nhan phim bat ky de thoat...
pause >nul
exit /b

:exit_script
exit /b
