# Quran Section API Documentation

This document outlines the API functions available in `quranSectionApi.ts` for fetching different sections of the Quran from the AlQuran.cloud API.

## Overview of Quran Structure

The Quran is organized into different hierarchical sections:

| Section | Total Count | Description |
|---------|-------------|-------------|
| Surah   | 114         | Chapters of the Quran |
| Juz     | 30          | Parts (equal divisions) |
| Manzil  | 7           | Divisions for week-long reading |
| Hizb    | 60          | Divisions (each with 4 quarters = 240 quarters total) |
| Ruku    | 556         | Sections marked by ع (ain) symbol |
| Page    | 604         | Pages in the standard Uthmani script |

## API Functions

All functions follow the same pattern:

1. Accept parameters for section number (e.g., juz number, manzil number, etc.)
2. Accept an optional edition parameter (default: "quran-uthmani")
3. Return the data field from the JSON response
4. Handle errors and non-OK responses gracefully

### Function List

```typescript
// Available editions from quranApi.ts
import { EDITIONS } from './quranApi';

// Pagination options interface
interface PaginationOptions {
  offset?: number;  // Starting position (0-based)
  limit?: number;   // Maximum number of verses to return
}

// Fetch a specific surah (chapter)
getSurahData(surah: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>

// Fetch a specific juz (part)
getJuzData(juz: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>

// Fetch a specific manzil (division)
getManzilData(manzil: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>

// Fetch a specific hizb (division)
getHizbData(hizb: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>

// Fetch a specific ruku (section)
getRukuData(ruku: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>

// Fetch a specific page
getPageData(page: number, edition = EDITIONS.ARABIC, options?: PaginationOptions): Promise<any>
```

## Response Data Structure

All functions return a Promise that resolves to the data object with the following structure:

```typescript
interface QuranSectionResponse {
  // Identifier fields - vary by section type
  number?: number;      // Section number (juz, manzil, etc.)
  name?: string;        // Arabic name (for Surahs)
  englishName?: string; // English name (for Surahs)
  
  // Content
  ayahs: Array<{
    number: number;        // Global ayah number
    text: string;          // Ayah text
    numberInSurah: number; // Ayah number within its surah
    juz: number;           // Juz number
    manzil: number;        // Manzil number
    page: number;          // Page number
    ruku: number;          // Ruku number
    hizbQuarter: number;   // Hizb quarter number
    sajda: boolean;        // Whether this ayah contains a sajda
    surah: {               // Surah metadata
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      revelationType: "Meccan" | "Medinan";
      numberOfAyahs: number;
    }
  }>
}
```

## Usage Examples

### Fetching a Surah (with Pagination)

```typescript
import { getSurahData } from '../utils/quranSectionApi';

async function displaySurah(surahNumber) {
  try {
    // Get Surah Al-Fatiha (1) in Arabic
    const surah = await getSurahData(1);
    console.log(`Surah ${surah.englishName}: ${surah.ayahs.length} verses`);
    
    // Process verses
    surah.ayahs.forEach(ayah => {
      console.log(`${ayah.numberInSurah}: ${ayah.text}`);
    });
  } catch (error) {
    console.error('Error fetching surah:', error);
  }
}

// Paginate results - get first 10 verses only
async function displayPaginatedSurah(surahNumber) {
  try {
    // Get first 10 verses from Surah Al-Baqarah (2)
    const firstPage = await getSurahData(2, EDITIONS.ARABIC, { limit: 10 });
    console.log(`First 10 verses of ${firstPage.englishName}`);
    
    // Get next 10 verses (verses 11-20)
    const secondPage = await getSurahData(2, EDITIONS.ARABIC, { offset: 10, limit: 10 });
    console.log(`Verses 11-20 of ${secondPage.englishName}`);
  } catch (error) {
    console.error('Error fetching paginated surah:', error);
  }
}
```

### Fetching a Juz with Translation

```typescript
import { getJuzData, EDITIONS } from '../utils/quranApi';

async function displayJuzWithTranslation(juzNumber) {
  try {
    // Get first Juz in Arabic and English
    const [arabicJuz, englishJuz] = await Promise.all([
      getJuzData(juzNumber),
      getJuzData(juzNumber, EDITIONS.ENGLISH)
    ]);
    
    // Combine Arabic text with English translation
    arabicJuz.ayahs.forEach((ayah, index) => {
      const translation = englishJuz.ayahs[index].text;
      console.log(`${ayah.surah.number}:${ayah.numberInSurah}`);
      console.log(`Arabic: ${ayah.text}`);
      console.log(`English: ${translation}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching juz with translation:', error);
  }
}
```

## API Base URL and Endpoints

All functions use the AlQuran.cloud API v1:

```
Base URL: https://api.alquran.cloud/v1
```

### Endpoints

- Surah: `/surah/{surah}/{edition}[?offset={offset}&limit={limit}]`
- Juz: `/juz/{juz}/{edition}[?offset={offset}&limit={limit}]`
- Manzil: `/manzil/{manzil}/{edition}[?offset={offset}&limit={limit}]`
- Hizb Quarter: `/hizbQuarter/{hizb}/{edition}[?offset={offset}&limit={limit}]`
- Ruku: `/ruku/{ruku}/{edition}[?offset={offset}&limit={limit}]`
- Page: `/page/{page}/{edition}[?offset={offset}&limit={limit}]`

## Available Editions

The default edition is `quran-uthmani` (Arabic). Other editions are available through the `EDITIONS` constant imported from `quranApi.ts`.

Popular editions include:

- `EDITIONS.ARABIC`: Uthmani script (default)
- `EDITIONS.ENGLISH`: Sahih International translation
- `EDITIONS.ENGLISH_PICKTHALL`: Pickthall translation
- `EDITIONS.FRENCH`: Hamidullah translation
- `EDITIONS.URDU`: Jalandhry translation

## Error Handling

All functions follow consistent error handling. If the API returns a non-OK status or if the request fails, the function will throw an error with details about what went wrong.

## Pagination

All API functions now support pagination through the optional `options` parameter:

```typescript
// Example pagination usage
const firstTenVerses = await getSurahData(2, EDITIONS.ARABIC, { limit: 10 });
const nextTenVerses = await getSurahData(2, EDITIONS.ARABIC, { offset: 10, limit: 10 });
```

The pagination options include:

- `offset`: Starting position for fetching verses (0-based index)
- `limit`: Maximum number of verses to fetch

Pagination is particularly useful for:

1. Displaying large surahs or sections in manageable chunks
2. Implementing "load more" or pagination UI components
3. Optimizing performance by loading only what's needed initially
4. Reducing data transfer for mobile devices or slow connections

## See Also

For complete working examples:
- `src/docs/quran-section-api-example.js` - Basic API usage examples
- `src/docs/quran-pagination-example.js` - Pagination-specific examples