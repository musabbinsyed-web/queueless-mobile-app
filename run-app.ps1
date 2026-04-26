# ============================================
# QueueLess - Run Everything Script
# ============================================
# This script starts the Android emulator,
# Metro bundler, builds the app, and launches
# it on the emulator — all in one go.
# 
# Usage: Right-click -> Run with PowerShell
#   OR:  powershell -ExecutionPolicy Bypass -File run-app.ps1
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   QueueLess - Starting Everything...   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Set up Android environment variables ---
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin"

Write-Host "[1/5] Android SDK: $env:ANDROID_HOME" -ForegroundColor Yellow

# --- 2. Pick and start the emulator ---
Write-Host "[2/5] Checking for running emulator..." -ForegroundColor Yellow

$devices = adb devices 2>$null | Select-String "emulator"
if ($devices) {
    Write-Host "       Emulator already running. Skipping launch." -ForegroundColor Green
} else {
    # Get available AVDs
    $avds = emulator -list-avds 2>$null
    if (-not $avds) {
        Write-Host "       ERROR: No Android Virtual Devices found!" -ForegroundColor Red
        Write-Host "       Create one in Android Studio first." -ForegroundColor Red
        exit 1
    }

    # Pick the first AVD
    $avdName = ($avds -split "`n")[0].Trim()
    Write-Host "       Starting emulator: $avdName" -ForegroundColor Green

    # Start emulator in background
    Start-Process -FilePath "emulator" -ArgumentList "-avd", $avdName, "-no-snapshot-load" -WindowStyle Minimized

    # Wait for emulator to boot
    Write-Host "       Waiting for emulator to come online..." -ForegroundColor Yellow
    $timeout = 120
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 3
        $elapsed += 3
        $bootCheck = adb shell getprop sys.boot_completed 2>$null
        if ($bootCheck -match "1") {
            Write-Host "       Emulator is ready!" -ForegroundColor Green
            break
        }
        Write-Host "       Still booting... ($elapsed`s)" -ForegroundColor DarkGray
    }

    if ($elapsed -ge $timeout) {
        Write-Host "       WARNING: Emulator boot timed out. Continuing anyway..." -ForegroundColor Red
    }
}

# --- 3. Start Metro bundler in a new terminal ---
Write-Host "[3/5] Starting Metro bundler..." -ForegroundColor Yellow

$metroRunning = $false
try {
    $tcp = Test-NetConnection -ComputerName localhost -Port 8081 -WarningAction SilentlyContinue
    if ($tcp.TcpTestSucceeded) { $metroRunning = $true }
} catch {}

if ($metroRunning) {
    Write-Host "       Metro already running on port 8081. Skipping." -ForegroundColor Green
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; npm start -- --reset-cache" -WindowStyle Normal
    Write-Host "       Metro bundler started in new terminal." -ForegroundColor Green
    Start-Sleep -Seconds 5
}

# --- 4. Build and install the app ---
Write-Host "[4/5] Building and installing app on emulator..." -ForegroundColor Yellow
Write-Host "       (This may take a few minutes on first build)" -ForegroundColor DarkGray

Set-Location $PSScriptRoot
npm run android

# --- 5. Done! ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   QueueLess is running!                " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tips:" -ForegroundColor Cyan
Write-Host "  r  - Reload the app (in Metro terminal)" -ForegroundColor White
Write-Host "  d  - Open Dev Menu" -ForegroundColor White
Write-Host "  j  - Open DevTools" -ForegroundColor White
Write-Host ""
