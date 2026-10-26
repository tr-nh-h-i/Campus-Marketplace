[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Set-Location $PSScriptRoot

function Get-UnescapedText([string]$text) {
    return [System.Text.RegularExpressions.Regex]::Unescape($text)
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " CAMPUS MARKETPLACE - CONG CU DAY GIT HANG NGAY" -ForegroundColor Cyan
Write-Host " Nguoi thuc hien: Trinh The Thanh Hai (MSSV: 1923050080)" -ForegroundColor Cyan
Write-Host " Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

git config user.name "hai1-git"
git config user.email "github1hai@gmail.com"
git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>$null

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " CHON NOI DUNG COMMIT HANG NGAY (HAI - TIENG VIET):" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " [1] Ngay 22/10: feat: xay dung phan quyen va chuyen doi vai tro Buyer - Seller"
Write-Host " [2] Ngay 23/10: security: cau hinh bao mat luu tru JWT token bang SecureStore"
Write-Host " [3] Ngay 24/10: feat: toi uu bo chon atomic va bo loc gio hang Zustand"
Write-Host " [4] Ngay 25/10: feat: tich hop thanh dieu huong bottom tabs va huy hieu gio hang"
Write-Host " [5] Ngay 26/10: feat: chuan hoa chi 3 thanh vien Son Hai Nhat va phan quyen admin"
Write-Host " [6] Ngay 27/10: docs: cap nhat tai lieu du an va checklist nop bai Canvas"
Write-Host " [7] Tu go noi dung commit Tieng Viet tuy y"
Write-Host " [0] Thoat"
Write-Host "========================================================" -ForegroundColor Yellow

$choice = Read-Host "Nhap lua chon cua ban [1-7, hoac 0]"

if ($choice -eq "0") { exit }
$msg = ""
switch ($choice) {
    "1" { $msg = Get-UnescapedText "feat: x\u00e2y d\u1ef1ng ph\u00e2n quy\u1ec1n v\u00e0 chuy\u1ec3n \u0111\u1ed5i vai tr\u00f2 Buyer - Seller" }
    "2" { $msg = Get-UnescapedText "security: c\u1ea5u h\u00ecnh b\u1ea3o m\u1eadt l\u01b0u tr\u1eef JWT token b\u1eb1ng SecureStore" }
    "3" { $msg = Get-UnescapedText "feat: t\u1ed1i \u01b0u b\u1ed9 ch\u1ecdn atomic v\u00e0 b\u1ed9 l\u1ecdc gi\u1ecf h\u00e0ng Zustand" }
    "4" { $msg = Get-UnescapedText "feat: t\u00edch h\u1ee3p thanh \u0111i\u1ec1u h\u01b0\u1edbng bottom tabs v\u00e0 huy hi\u1ec7u gi\u1ecf h\u00e0ng" }
    "5" { $msg = Get-UnescapedText "feat: chu\u1ea9n h\u00f3a \u0111\u00fang 3 th\u00e0nh vi\u00ean S\u01a1n H\u1ea3i Nh\u1eadt, ph\u00e2n quy\u1ec1n admin v\u00e0 ng\u01b0\u1eddi mua th\u01b0\u1eddng" }
    "6" { $msg = Get-UnescapedText "docs: c\u1eadp nh\u1eadt t\u00e0i li\u1ec7u d\u1ef1 \u00e1n v\u00e0 checklist n\u1ed9p b\u00e0i Canvas" }
    "7" {
        $msg = Read-Host "Nhap noi dung commit (Tieng Viet)"
    }
    default {
        Write-Host "Lua chon khong hop le!" -ForegroundColor Red
        exit
    }
}

if ([string]::IsNullOrWhiteSpace($msg)) {
    Write-Host "Noi dung commit trong!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "[1/3] Dang luu commit vao Git..." -ForegroundColor Green
git add -A

$tempMsg = Join-Path $env:TEMP "git_daily_msg.txt"
[System.IO.File]::WriteAllText($tempMsg, $msg, [System.Text.Encoding]::UTF8)
git commit -F $tempMsg --allow-empty
Remove-Item $tempMsg -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "[2/3] Dang dong bo commit moi tu cac ban tren GitHub..." -ForegroundColor Green
git fetch origin main
git merge origin/main -X ours --no-edit

Write-Host ""
Write-Host "[3/3] Dang day len GitHub (git push origin main)..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " HOAN TAT! Commit da duoc day len GitHub thanh cong." -ForegroundColor Green
Write-Host " Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
