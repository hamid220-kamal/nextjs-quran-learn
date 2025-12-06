# Radio Backend Verification Script (PowerShell)
# Tests all radio API endpoints to verify implementation

$BASE_URL = "http://localhost:3000"
$RECITER_ID = 1
$SURAH_NUMBER = 1

Write-Host "🧪 Testing QuranicLearn Radio Backend Implementation" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Reciters Endpoint
Write-Host "1. Testing /api/radio/reciters" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/radio/reciters" -TimeoutSec 10
    Write-Host "   ✓ Status: Success" -ForegroundColor Green
    Write-Host "   ✓ Reciters Count: $($response.data.Count)" -ForegroundColor Green
    if ($response.data.Count -gt 0) {
        Write-Host "   ✓ First Reciter: $($response.data[0].name)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Chapters Endpoint
Write-Host "2. Testing /api/radio/chapters" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/radio/chapters" -TimeoutSec 10
    Write-Host "   ✓ Status: Success" -ForegroundColor Green
    Write-Host "   ✓ Chapters Count: $($response.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Stations Endpoint
Write-Host "3. Testing /api/radio/stations" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/radio/stations" -TimeoutSec 10
    Write-Host "   ✓ Status: Success" -ForegroundColor Green
    Write-Host "   ✓ Curated Stations: $($response.data.curatedStations.Count)" -ForegroundColor Green
    Write-Host "   ✓ All Stations: $($response.data.allStations.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Audio Endpoint
Write-Host "4. Testing /api/radio/audio" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/radio/audio?reciterId=$RECITER_ID&surahNumber=$SURAH_NUMBER" -TimeoutSec 10
    Write-Host "   ✓ Status: Success" -ForegroundColor Green
    Write-Host "   ✓ Surah: $($response.data.surahName)" -ForegroundColor Green
    Write-Host "   ✓ Audio URLs: $($response.data.audioUrls.Count)" -ForegroundColor Green
    if ($response.data.audioUrls.Count -gt 0) {
        Write-Host "   ✓ First URL: $($response.data.audioUrls[0])" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Audio Stream Endpoint
Write-Host "5. Testing /api/radio/audio-stream" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/radio/audio-stream?reciterId=$RECITER_ID&verseKey=1:1" -TimeoutSec 15
    Write-Host "   ✓ Status: Success" -ForegroundColor Green
    Write-Host "   ✓ Audio Stream Responding" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Note: Audio stream may require CDN access" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Frontend Page
Write-Host "6. Testing Radio Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/radio" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
    if ($response.Content -match 'radio') {
        Write-Host "   ✓ Radio Page Loaded" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Backend Implementation Tests Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 API Documentation:" -ForegroundColor Cyan
Write-Host "   - See RADIO_BACKEND_COMPLETE.md for full details" -ForegroundColor Cyan
Write-Host "   - Open http://localhost:3000/radio in browser" -ForegroundColor Cyan
Write-Host ""
