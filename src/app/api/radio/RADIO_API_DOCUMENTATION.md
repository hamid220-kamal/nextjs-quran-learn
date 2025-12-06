# Radio Module Backend API Documentation

## Overview

The Radio Module Backend provides comprehensive RESTful APIs to fetch Quranic audio data, reciter information, chapters/surahs, stations, and more. It's designed to mirror the Quran.com/radio API structure while providing optimized caching and error handling.

## Base URL

```
/api/radio
```

## API Endpoints

### 1. Get All Reciters

Fetches all available Quran recitations with reciter details.

**Endpoint:** `GET /api/radio/reciters`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "AbdulBaset AbdulSamad",
      "arabicName": "عبد الباسط عبد الصمد",
      "style": "Mujawwad",
      "imageUrl": "https://static.qurancdn.com/images/reciters/1/...",
      "link": "/reciters/1"
    },
    {
      "id": 2,
      "name": "AbdulBaset AbdulSamad",
      "arabicName": "عبد الباسط عبد الصمد",
      "style": "Murattal",
      "imageUrl": "https://static.qurancdn.com/images/reciters/1/...",
      "link": "/reciters/2"
    }
    // ... more reciters
  ]
}
```

**Caching:** 1 hour (ISR)

---

### 2. Get All Chapters/Surahs

Fetches all Quranic chapters with metadata.

**Endpoint:** `GET /api/radio/chapters`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "revelation_order": 5,
      "revelation_place": "Makkah",
      "name_simple": "Al-Fatihah",
      "name_complex": "سورة الفاتحة",
      "name_arabic": "الفاتحة",
      "verses_count": 7,
      "pages": [1]
    },
    {
      "id": 2,
      "revelation_order": 87,
      "revelation_place": "Madinah",
      "name_simple": "Al-Baqarah",
      "name_complex": "سورة البقرة",
      "name_arabic": "البقرة",
      "verses_count": 286,
      "pages": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
    }
    // ... all 114 chapters
  ]
}
```

**Caching:** 24 hours (ISR)

---

### 3. Get Radio Stations

Fetches curated radio stations and featured content.

**Endpoint:** `GET /api/radio/stations`

**Response:**
```json
{
  "status": "success",
  "data": {
    "curatedStations": [
      {
        "id": "1",
        "title": "Popular Recitations",
        "description": "Daily curated feed of recitations",
        "image": "https://quran.com/_next/image?url=%2Fimages%2Fstations%2F1.jpeg&w=1080&q=75",
        "featured": true,
        "type": "curated",
        "content": "all"
      },
      {
        "id": "3",
        "title": "Surah Al-Kahf",
        "description": "Listen to Surah Al-Kahf on repeat",
        "image": "https://quran.com/_next/image?url=%2Fimages%2Fstations%2F3.jpeg&w=1080&q=75",
        "featured": true,
        "type": "surah",
        "content": "18"
      }
      // ... more stations
    ],
    "allStations": [
      // ... all stations combined
    ],
    "total": 5
  }
}
```

**Caching:** 1 hour (ISR)

---

### 4. Get Audio URLs

Fetches audio URLs for a specific reciter and surah, with optional verse range.

**Endpoint:** `GET /api/radio/audio`

**Query Parameters:**
- `reciterId` (required): Reciter ID (e.g., 1, 2, 3, etc.)
- `surahNumber` (required): Surah/Chapter number (1-114)
- `verseStart` (optional): Starting verse number (default: 1)
- `verseEnd` (optional): Ending verse number (default: last verse of surah)

**Example Request:**
```
GET /api/radio/audio?reciterId=7&surahNumber=1
GET /api/radio/audio?reciterId=7&surahNumber=2&verseStart=1&verseEnd=10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "reciterId": 7,
    "surahNumber": 1,
    "surahName": "Al-Fatihah",
    "surahNameArabic": "الفاتحة",
    "versesCount": 7,
    "audioPath": "Alafasy_128kbps",
    "audioUrls": [
      "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/001007.mp3"
    ],
    "verseNumbers": [1, 2, 3, 4, 5, 6, 7],
    "startVerse": 1,
    "endVerse": 7,
    "totalVerses": 7
  }
}
```

**Caching:** Default (no explicit ISR, but via fetch revalidation)

---

### 5. Search Radio Content

Searches for surahs and reciters based on a query.

**Endpoint:** `GET /api/radio/search`

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `type` (optional): Filter by type - 'surah', 'reciter', or 'all' (default: 'all')

**Example Requests:**
```
GET /api/radio/search?q=al-kahf
GET /api/radio/search?q=alafasy&type=reciter
GET /api/radio/search?q=maria&type=surah
```

**Response:**
```json
{
  "status": "success",
  "query": "al-kahf",
  "results": {
    "surahs": [
      {
        "id": 18,
        "name": "Al-Kahf",
        "arabicName": "الكهف",
        "versesCount": 110
      }
    ],
    "reciters": []
  },
  "total": 1
}
```

**Caching:** Runtime (no ISR)

---

### 6. Get All Juzs

Fetches all Quran Juzs (30 parts) with metadata.

**Endpoint:** `GET /api/radio/juzs`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "juz_number": 1,
      "verses_count": 148,
      "verses_range": "1:1-2:141"
    },
    {
      "id": 2,
      "juz_number": 2,
      "verses_count": 111,
      "verses_range": "2:142-2:252"
    }
    // ... 30 juzs total
  ]
}
```

**Caching:** 24 hours (ISR)

---

## Audio File Format

Audio files are hosted on `everyayah.com/data` CDN with the following naming convention:

```
https://everyayah.com/data/{RECITER_PATH}/{SURAH_PADDED}{VERSE_PADDED}.mp3
```

**Example:**
- Surah: 1 → `001`
- Verse: 5 → `005`
- Full: `https://everyayah.com/data/Alafasy_128kbps/001005.mp3`

### Supported Reciter IDs and Paths

| ID | Reciter Name | Audio Path | Quality |
|---|---|---|---|
| 1 | AbdulBaset AbdulSamad (Mujawwad) | `AbdulBaset_Murattal_192kbps` | 192 kbps |
| 2 | AbdulBaset AbdulSamad (Murattal) | `AbdulBaset_Murattal_192kbps` | 192 kbps |
| 3 | Abdur-Rahman as-Sudais | `Sudais_192kbps` | 192 kbps |
| 4 | Abu Bakr al-Shatri | `Abu_Bakr_al_Shatri_192kbps` | 192 kbps |
| 5 | Hani ar-Rifai | `Hani_Ar-Rifai_192kbps` | 192 kbps |
| 6 | Mahmoud Khalil Al-Husary | `Husary_128kbps` | 128 kbps |
| 7 | Mishari Rashid al-Afasy | `Alafasy_128kbps` | 128 kbps |
| 8 | Mohamed Siddiq al-Minshawi (Mujawwad) | `Minshawi_Mujawwad_192kbps` | 192 kbps |
| 9 | Mohamed Siddiq al-Minshawi (Murattal) | `Minshawi_Murattal_192kbps` | 192 kbps |
| 10 | Sa'ud ash-Shuraym | `Shuraym_192kbps` | 192 kbps |
| 11 | Mohamed al-Tablawi | `Mohamed_al_Tablawi_192kbps` | 192 kbps |
| 12 | Mahmoud Khalil Al-Husary (Muallim) | `Husary_128kbps` | 128 kbps |
| 13 | Saad al-Ghamdi | `Ghamdi_40kbps` | 40 kbps |
| 14 | Yasser Ad Dossary | `Dossary_192kbps` | 192 kbps |

---

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

**Error Response Format:**
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "error": "Technical error details"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `404`: Resource not found
- `500`: Server error

---

## Caching Strategy

- **Reciters:** 1 hour ISR (Incremental Static Regeneration)
- **Chapters:** 24 hours ISR
- **Stations:** 1 hour ISR
- **Juzs:** 24 hours ISR
- **Audio URLs:** Generated on-demand (no ISR)
- **Search:** Real-time (no ISR)

This ensures fresh data while minimizing API calls to external services.

---

## Frontend Integration

### Using the API

```typescript
import { fetchReciters, fetchAudio, searchRadio } from '@/app/radio/lib/api';

// Fetch reciters
const reciters = await fetchReciters();

// Fetch audio
const audioData = await fetchAudio(7, 1); // Reciter 7, Surah 1
const audioUrls = audioData.audioUrls;

// Search
const results = await searchRadio('al-kahf', 'surah');
```

### Using RadioManager

```typescript
import { radioManager } from '@/app/radio/lib/radioManager';

// Initialize
await radioManager.initialize();

// Get data
const reciters = radioManager.getReciters();
const chapters = radioManager.getChapters();
const popularReciters = radioManager.getPopularReciters(10);
```

---

## Rate Limiting

No explicit rate limiting is enforced, but please respect external APIs:

- **Quran.com API:** Reasonable limits (not documented)
- **everyayah.com CDN:** Audio streaming only

---

## Examples

### Play First Surah with Reciter 7

```typescript
const audioData = await fetchAudio(7, 1);
const audioElement = document.querySelector('audio');
audioElement.src = audioData.audioUrls[0];
audioElement.play();
```

### Search for "Kahf"

```typescript
const results = await searchRadio('kahf', 'surah');
console.log(results.surahs); // Returns matching surahs
```

### Get All Chapters and Juzs Structure

```typescript
import { getRadioData } from '@/app/radio/lib/radioManager';

const data = await getRadioData();
console.log(data.structure); // { chapters, juzs, totalVerses, ... }
```

---

## Related Files

- **API Routes:** `/src/app/api/radio/`
- **Frontend API Client:** `/src/app/radio/lib/api.ts`
- **RadioManager:** `/src/app/radio/lib/radioManager.ts`
- **Radio Page:** `/src/app/radio/page.tsx`

---

## Future Enhancements

- [ ] Bookmarks and favorites API
- [ ] User playlist management
- [ ] Recently played tracking
- [ ] Continue listening resume points
- [ ] Translation and tafsir APIs
- [ ] Advanced filtering (by style, revelation place, etc.)
- [ ] Pagination for large datasets
