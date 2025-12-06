#!/usr/bin/env pwsh
<#
.SYNOPSIS
Radio Backend Diagnostic Test
Tests all radio API endpoints and identifies issues
#>

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Radio Backend Diagnostic Test" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$BaseUrl = "http://localhost:3000"
$timeout = 10

# Test 1: Server Connection
Write-Host "[1/5] Testing API Base Connection..." -ForegroundColor Cyan
try {
  $response = Invoke-WebRequest -Uri "$BaseUrl/api/radio/reciters" `
    -Method GET `
    -TimeoutSec $timeout `
    -ErrorAction Stop
  Write-Host "✓ Server is reachable (HTTP $($response.StatusCode))" -ForegroundColor Green
}
catch {
  Write-Host "✗ Server not responding: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test 2: Reciters Endpoint
Write-Host ""
Write-Host "[2/5] Testing Reciters Endpoint..." -ForegroundColor Cyan
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/radio/reciters" `
    -Method GET `
    -TimeoutSec $timeout
  if ($response.data -and $response.data.Count -gt 0) {
    Write-Host "✓ Reciters endpoint working" -ForegroundColor Green
    Write-Host "  Found $($response.data.Count) reciters" -ForegroundColor Yellow
    Write-Host "  First: $($response.data[0].name)" -ForegroundColor Yellow
  }
  else {
    Write-Host "✗ Reciters endpoint returned no data" -ForegroundColor Red
  }
}
catch {
  Write-Host "✗ Reciters endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Audio Endpoint
Write-Host ""
Write-Host "[3/5] Testing Audio Endpoint..." -ForegroundColor Cyan
try {
  $params = @{
    reciterId   = "1"
    surahNumber = "1"
  }
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/radio/audio" `
    -Method GET `
    -Body $params `
    -TimeoutSec $timeout
  
  if ($response.data.audioUrls -and $response.data.audioUrls.Count -gt 0) {
    Write-Host "✓ Audio endpoint working" -ForegroundColor Green
    Write-Host "  Surah: $($response.data.surahName)" -ForegroundColor Yellow
    Write-Host "  Verses: $($response.data.totalVerses)" -ForegroundColor Yellow
    Write-Host "  First URL: $($response.data.audioUrls[0])" -ForegroundColor Yellow
  }
  else {
    Write-Host "✗ Audio endpoint returned no URLs" -ForegroundColor Red
    Write-Host "  Response: $(ConvertTo-Json $response)" -ForegroundColor Gray
  }
}
catch {
  Write-Host "✗ Audio endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Audio Stream Endpoint  
Write-Host ""
Write-Host "[4/5] Testing Audio Stream Endpoint..." -ForegroundColor Cyan
try {
  $streamUrl = "$BaseUrl/api/radio/audio-stream?reciterId=1&verseKey=1:1"
  $response = Invoke-WebRequest -Uri $streamUrl `
    -Method GET `
    -TimeoutSec $timeout `
    -ErrorAction Stop
  
  $size = $response.Content.Length
  Write-Host "✓ Audio stream endpoint responding" -ForegroundColor Green
  Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Yellow
  Write-Host "  Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Yellow
  Write-Host "  Size: $size bytes" -ForegroundColor Yellow
  
  if ($size -eq 0) {
    Write-Host "⚠ WARNING: Audio stream is empty!" -ForegroundColor Red
  }
}
catch {
  Write-Host "✗ Audio stream endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Radio Page
Write-Host ""
Write-Host "[5/5] Testing Radio Page Access..." -ForegroundColor Cyan
try {
  $response = Invoke-WebRequest -Uri "$BaseUrl/radio" `
    -Method GET `
    -TimeoutSec $timeout `
    -ErrorAction Stop
  Write-Host "✓ Radio page loading (HTTP $($response.StatusCode))" -ForegroundColor Green
}
catch {
  Write-Host "✗ Radio page error: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Diagnostic Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open browser to http://localhost:3000/radio" -ForegroundColor Gray
Write-Host "  2. Open browser dev console (F12) to see errors" -ForegroundColor Gray
Write-Host "  3. Check Network tab to see API requests" -ForegroundColor Gray
Write-Host "  4. Check /public/radio-test.html for testing UI" -ForegroundColor Gray
Write-Host ""
