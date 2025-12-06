@echo off
REM Simple Radio Backend Diagnostic Test

echo.
echo ================================================================
echo   Radio Backend Diagnostic Test
echo ================================================================
echo.

set BaseUrl=http://localhost:3000

echo [1/3] Testing Audio Endpoint...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/radio/audio?reciterId=1^&surahNumber=1' -TimeoutSec 10; Write-Host 'SUCCESS: Audio endpoint working' -ForegroundColor Green; Write-Host \"Surah: $($r.data.surahName)\" -ForegroundColor Yellow; Write-Host \"Verses: $($r.data.totalVerses)\" -ForegroundColor Yellow } catch { Write-Host 'FAILED: $_' -ForegroundColor Red }"

echo.
echo [2/3] Testing Reciters Endpoint...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/radio/reciters' -TimeoutSec 10; Write-Host 'SUCCESS: Reciters endpoint working' -ForegroundColor Green; Write-Host \"Found $($r.data.Count) reciters\" -ForegroundColor Yellow } catch { Write-Host 'FAILED: $_' -ForegroundColor Red }"

echo.
echo [3/3] Testing Audio Stream...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/api/radio/audio-stream?reciterId=1^&verseKey=1:1' -TimeoutSec 10; Write-Host 'SUCCESS: Audio stream responding' -ForegroundColor Green; Write-Host \"Size: $($r.Content.Length) bytes\" -ForegroundColor Yellow } catch { Write-Host 'FAILED: $_' -ForegroundColor Red }"

echo.
echo ================================================================
echo   Diagnostic Complete
echo ================================================================
echo.
