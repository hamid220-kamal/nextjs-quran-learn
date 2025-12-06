#!/bin/bash
# Test Radio Backend - Bash version

echo "════════════════════════════════════════════════════════════"
echo "  Radio Backend Diagnostic Test"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${CYAN}[1/5] Testing API Base Connection${NC}"
if curl -s "$BASE_URL/api/radio/reciters" -o /dev/null -w "%{http_code}" | grep -q "200"; then
  echo -e "${GREEN}✓ Server is reachable${NC}"
else
  echo -e "${RED}✗ Server not responding${NC}"
  exit 1
fi

echo ""
echo -e "${CYAN}[2/5] Testing Reciters Endpoint${NC}"
RECITERS=$(curl -s "$BASE_URL/api/radio/reciters")
if echo "$RECITERS" | grep -q "id"; then
  echo -e "${GREEN}✓ Reciters endpoint working${NC}"
  echo -e "${YELLOW}  Sample:${NC} $(echo "$RECITERS" | head -c 100)..."
else
  echo -e "${RED}✗ Reciters endpoint failed${NC}"
fi

echo ""
echo -e "${CYAN}[3/5] Testing Audio Endpoint${NC}"
AUDIO=$(curl -s "$BASE_URL/api/radio/audio?reciterId=1&surahNumber=1")
if echo "$AUDIO" | grep -q "audioUrls"; then
  echo -e "${GREEN}✓ Audio endpoint working${NC}"
  FIRST_URL=$(echo "$AUDIO" | grep -o '"audioUrls":\[[^]]*\]' | head -c 100)
  echo -e "${YELLOW}  URLs returned:${NC} $FIRST_URL..."
else
  echo -e "${RED}✗ Audio endpoint failed${NC}"
  echo -e "${YELLOW}  Response:${NC} $(echo "$AUDIO" | head -c 200)..."
fi

echo ""
echo -e "${CYAN}[4/5] Testing Audio Stream Endpoint${NC}"
STREAM=$(curl -s "$BASE_URL/api/radio/audio-stream?reciterId=1&verseKey=1:1" -I)
if echo "$STREAM" | grep -q "200"; then
  echo -e "${GREEN}✓ Audio stream endpoint responding${NC}"
  echo -e "${YELLOW}  Headers:${NC}"
  echo "$STREAM" | head -5
else
  echo -e "${RED}✗ Audio stream endpoint failed${NC}"
  echo "$STREAM"
fi

echo ""
echo -e "${CYAN}[5/5] Testing Page Access${NC}"
PAGE=$(curl -s "$BASE_URL/radio" -o /dev/null -w "%{http_code}")
if [ "$PAGE" = "200" ]; then
  echo -e "${GREEN}✓ Radio page loading (HTTP $PAGE)${NC}"
else
  echo -e "${RED}✗ Radio page error (HTTP $PAGE)${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}Test Complete${NC}"
