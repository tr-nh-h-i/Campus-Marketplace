[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Set-Location $PSScriptRoot

# Kiem tra Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:LOCALAPPDATA\Programs\MinGit\cmd\git.exe") {
        $env:PATH = "$env:LOCALAPPDATA\Programs\MinGit\cmd;$env:PATH"
    } else {
        Write-Host "[LOI] Khong tim thay Git tren he thong!" -ForegroundColor Red
        exit 1
    }
}

# Kiem tra .git
if (-not (Test-Path ".git")) {
    Write-Host "[THONG BAO] Chua co thu muc Git cuc bo, dang tu dong khoi tao..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>$null
    git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git
    git fetch origin main
    git branch -M main
    git reset origin/main
    Write-Host "[OK] Da ket noi kho Git cuc bo voi origin/main!" -ForegroundColor Green
    Write-Host ""
}

function Get-UnescapedText([string]$text) {
    return [System.Text.RegularExpressions.Regex]::Unescape($text)
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " CAMPUS MARKETPLACE - CONG CU DAY GIT HANG NGAY" -ForegroundColor Cyan
Write-Host " Nguoi thuc hien: Nguyen Vu Minh Nhat (MSSV: 1923050861)" -ForegroundColor Cyan
Write-Host " Repo: https://github.com/tr-nh-h-i/Campus-Marketplace.git" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

git config user.name "Nguyen Vu Minh Nhat"
git config user.email "1923050861@dntu.edu.vn"
git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git 2>$null

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " CHON NOI DUNG COMMIT HANG NGAY (NHAT - TIENG VIET):" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " [1] Ngay 22/10: feat: phat trien tien ich nen anh giam dung luong 93%"
Write-Host " [2] Ngay 23/10: feat: thiet ke banner canh bao offline kem moc thoi gian cap nhat"
Write-Host " [3] Ngay 24/10: feat: luu tru bo dem danh muc san pham vao AsyncStorage"
Write-Host " [4] Ngay 25/10: test: viet kiem thu tu dong cho quy tac giao hang KTX va ton kho"
Write-Host " [5] Ngay 26/10: test: viet kiem thu luong thao tac mua hang va thanh toan gio hang"
Write-Host " [6] Ngay 27/10: test: hoan thien bo kiem thu component va tuong phan mau sac"
Write-Host " [7] Tu go noi dung commit Tieng Viet tuy y"
Write-Host " [0] Thoat"
Write-Host "========================================================" -ForegroundColor Yellow

$choice = Read-Host "Nhap lua chon cua ban [1-7, hoac 0]"

if ($choice -eq "0") { exit }
$msg = ""
switch ($choice) {
    "1" { $msg = Get-UnescapedText "feat: ph\u00e1t tri\u1ec3n ti\u1ec7n \u00edch n\u00e9n \u1ea3nh gi\u1ea3m dung l\u01b0\u1ee3ng 93%" }
    "2" { $msg = Get-UnescapedText "feat: thi\u1ebft k\u1ebf banner c\u1ea3nh b\u00e1o offline k\u00e8m m\u1ed1c th\u1eddi gian c\u1eadp nh\u1eadt" }
    "3" { $msg = Get-UnescapedText "feat: l\u01b0u tr\u1eef b\u1ed9 \u0111\u1ec7m danh m\u1ee5c s\u1ea3n ph\u1ea9m v\u00e0o AsyncStorage" }
    "4" { $msg = Get-UnescapedText "test: vi\u1ebft ki\u1ec3m th\u1eed t\u1ef1 \u0111\u1ed9ng cho quy t\u1eafc giao h\u00e0ng KTX v\u00e0 t\u1ed3n kho" }
    "5" { $msg = Get-UnescapedText "test: vi\u1ebft ki\u1ec3m th\u1eed lu\u1ed3ng thao t\u00e1c mua h\u00e0ng v\u00e0 thanh to\u00e1n gi\u1ecf h\u00e0ng" }
    "6" { $msg = Get-UnescapedText "test: ho\u00e0n thi\u1ec7n b\u1ed9 ki\u1ec3m th\u1eed component v\u00e0 t\u01b0\u01a1ng ph\u1ea3n m\u00e0u s\u1eafc" }
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

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " HOAN TAT! Commit da duoc day len GitHub thanh cong." -ForegroundColor Green
    Write-Host " Kiem tra tai: https://github.com/tr-nh-h-i/Campus-Marketplace/commits/main" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host " [!] CHUA DAY LEN DUOC GITHUB!" -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host " Ly do: Git can xac thuc quyen push (Dang nhap GitHub hoac Token)." -ForegroundColor Yellow
    Write-Host ""
    $token = Read-Host " Dan GitHub Personal Access Token (PAT) vao day (hoac Enter de bo qua)"
    if (-not [string]::IsNullOrWhiteSpace($token)) {
        git remote set-url origin "https://$($token)@github.com/tr-nh-h-i/Campus-Marketplace.git"
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [OK] Day commit len GitHub thanh cong voi Token!" -ForegroundColor Green
        } else {
            Write-Host " [X] Token khong hop le hoac khong co quyen Write vao repo nay!" -ForegroundColor Red
        }
        git remote set-url origin https://github.com/tr-nh-h-i/Campus-Marketplace.git
    }
}
