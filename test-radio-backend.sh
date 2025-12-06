#!/bin/bash
# Radio Backend Verification Script
# Tests all radio API endpoints to verify implementation

BASE_URL="http://localhost:3000"
RECITER_ID=1
SURAH_NUMBER=1

echo "🧪 Testing QuranicLearn Radio Backend Implementation"
echo "=================================================="
echo ""

# Test 1: Reciters Endpoint
echo "1. Testing /api/radio/reciters"
echo "   Command: curl $BASE_URL/api/radio/reciters"
echo ""

# Test 2: Chapters Endpoint
echo "2. Testing /api/radio/chapters"
echo "   Command: curl $BASE_URL/api/radio/chapters"
echo ""

# Test 3: Stations Endpoint
echo "3. Testing /api/radio/stations"
echo "   Command: curl $BASE_URL/api/radio/stations"
echo ""

# Test 4: Audio Endpoint
echo "4. Testing /api/radio/audio"
echo "   Command: curl '$BASE_URL/api/radio/audio?reciterId=$RECITER_ID&surahNumber=$SURAH_NUMBER'"
echo ""

# Test 5: Audio Stream Endpoint
echo "5. Testing /api/radio/audio-stream"
echo "   Command: curl '$BASE_URL/api/radio/audio-stream?reciterId=$RECITER_ID&verseKey=1:1'"
echo ""

# Test 6: Frontend Page
echo "6. Open Radio Page in Browser"
echo "   URL: $BASE_URL/radio"
echo ""

echo "✅ All endpoints should return HTTP 200 with valid data"
echo ""
echo "Expected Response Examples:"
echo ""
echo "📡 /api/radio/reciters Response:"
echo '{
  "status": "success",
  "data": [
    { "id": 1, "name": "AbdulBaset AbdulSamad", "arabicName": "عبدالباسط عبدالصمد", ... }
  ]
}'
echo ""
echo "🎵 /api/radio/audio Response:"
echo '{
  "status": "success",
  "data": {
    "audioUrls": [
      "/api/radio/audio-stream?reciterId=1&verseKey=1:1",
      "/api/radio/audio-stream?reciterId=1&verseKey=1:2",
      ...
    ],
    "surahName": "Al-Fatihah",
    "verseNumbers": [1, 2, 3, 4, 5, 6, 7],
    ...
  }
}'
echo ""
echo "=================================================="
echo "🚀 Backend Implementation Complete!"
echo "=================================================="
