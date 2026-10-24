# Script xoa sach commit ao va khoi tao lai 1 commit that duy nhat tu hai1-git
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " DANG XOA COMMIT AO VA TAO LAI LICH SU THAT..." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$repoPath = $PSScriptRoot
if (-not $repoPath) {
    $repoPath = "D:\AI-workspace\LT_Mobile\Campus-Marketplace"
}
Set-Location -Path $repoPath

# 1. Xoa thu muc .git cu de lam sach 100%
if (Test-Path ".git") {
    Write-Host "[1/5] Xoa lich su commit ao cu..." -ForegroundColor Green
    Remove-Item -Recurse -Force ".git"
}

# 2. Xoa cac script commit ao khong con dung den
if (Test-Path "push_to_github.ps1") { Remove-Item -Force "push_to_github.ps1" }
if (Test-Path "push_to_github.bat") { Remove-Item -Force "push_to_github.bat" }

# 3. Khoi tao Git repo moi tinh
Write-Host "[2/5] Khoi tao Git moi..." -ForegroundColor Green
git init
git config user.name "hai1-git"
git config user.email "github1hai@gmail.com"
git branch -M main

# 4. Add toan bo source code du an that vao 1 commit duy nhat
Write-Host "[3/5] Tao commit khoi tao duy nhat..." -ForegroundColor Green
git add .
git commit -m "feat: initial commit for Campus Marketplace DNTU"

# 5. Ket noi lai remote GitHub
$remoteUrl = "https://github.com/tr-nh-h-i/Campus-Marketplace.git"
Write-Host "[4/5] Ket noi remote: $remoteUrl ..." -ForegroundColor Green
git remote add origin $remoteUrl 2>$null
git remote set-url origin $remoteUrl

# 6. Force push len GitHub de de sach toan bo commit ao cu
Write-Host "[5/5] Day commit moi len GitHub (ghi de sach commit ao)..." -ForegroundColor Green
git push -u origin main --force

# Xoa tag v1.0.0 cu tren remote neu co
git push origin --delete v1.0.0 2>$null

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " DA XOA SACH COMMIT AO! REPO GIO DAY CHUAN 100%." -ForegroundColor Yellow
Write-Host " Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
