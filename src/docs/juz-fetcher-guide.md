# Juz Data Fetcher Documentation

This documentation explains how to use the enhanced Juz data fetching functions in the Quran Learn application.

## Overview

The `enhancedJuzFetcher.ts` module provides several functions for fetching and processing Juz data from the AlQuran.cloud API. These functions allow you to:

1. Fetch data for a specific Juz with various options
2. Get Juz data with translations
3. Fetch multiple Juz in one request
4. Get audio URLs for Juz playback

## API Reference

### getJuzData(juzNumber, edition, options)

Fetches data for a specific Juz with various options.

```typescript
import { getJuzData } from '../utils/enhancedJuzFetcher';

// Basic usage
const juzData = await getJuzData(30); // Get Juz 30 in Arabic

// With translation edition
const juzDataEnglish = await getJuzData(30, 'en.asad'); // Get Juz 30 in Muhammad Asad's English translation

// With pagination
const juzDataPaginated = await getJuzData(30, 'en.asad', { 
  offset: 10, 
  limit: 20 
}); // Get verses 11-30 of Juz 30

// With metadata
const juzDataWithMeta = await getJuzData(30, 'en.asad', { 
  includeMetadata: true 
}); // Get Juz 30 with detailed metadata about surahs and verses
```

#### Parameters

- `juzNumber` (number): The Juz number (1-30)
- `edition` (string, optional): The Quran edition to use (default: 'quran-uthmani')
- `options` (object, optional):
  - `offset` (number): Skip this many verses
  - `limit` (number): Maximum number of verses to return
  - `includeMetadata` (boolean): Whether to include detailed metadata about the Juz

### getJuzWithTranslation(juzNumber, translationEdition, options)

Fetches a Juz with both Arabic text and translation.

```typescript
import { getJuzWithTranslation } from '../utils/enhancedJuzFetcher';

// Get Juz 30 with English translation
const juzWithTranslation = await getJuzWithTranslation(30, 'en.asad');

// Display both Arabic text and translation
juzWithTranslation.ayahs.forEach(ayah => {
  console.log('Arabic:', ayah.text);
  console.log('Translation:', ayah.translation);
});
```

#### Parameters

- `juzNumber` (number): The Juz number (1-30)
- `translationEdition` (string, optional): The translation edition (default: 'en.sahih')
- `options` (object, optional): Same as `getJuzData`

### getMultipleJuz(startJuz, count, edition, options)

Fetches multiple consecutive Juz in one call.

```typescript
import { getMultipleJuz } from '../utils/enhancedJuzFetcher';

// Get Juz 1-3 in Arabic
const multipleJuz = await getMultipleJuz(1, 3);

// Get Juz 28-30 in English with metadata
const lastThreeJuz = await getMultipleJuz(28, 3, 'en.asad', {
  includeMetadata: true
});
```

#### Parameters

- `startJuz` (number): The starting Juz number (1-30)
- `count` (number, optional): Number of Juz to fetch (default: 1)
- `edition` (string, optional): The Quran edition (default: 'quran-uthmani')
- `options` (object, optional): Same as `getJuzData`

### getJuzAudioUrls(juzNumber, reciter)

Gets an array of audio URLs for each verse in the Juz.

```typescript
import { getJuzAudioUrls } from '../utils/enhancedJuzFetcher';

// Get audio URLs for Juz 30 recited by Mishary Alafasy
const audioUrls = await getJuzAudioUrls(30, 'ar.alafasy');

// You can then use these URLs to play audio
const audio = new Audio(audioUrls[0]);
audio.play();
```

#### Parameters

- `juzNumber` (number): The Juz number (1-30)
- `reciter` (string, optional): The reciter ID (default: 'ar.alafasy')

### getCompleteJuzAudioUrl(juzNumber, reciter)

Gets the URL for the complete Juz audio file.

```typescript
import { getCompleteJuzAudioUrl } from '../utils/enhancedJuzFetcher';

// Get the URL for complete Juz 30 audio
const juzAudioUrl = getCompleteJuzAudioUrl(30, 'ar.alafasy');

// Play the complete Juz
const audio = new Audio(juzAudioUrl);
audio.play();
```

#### Parameters

- `juzNumber` (number): The Juz number (1-30)
- `reciter` (string, optional): The reciter ID (default: 'ar.alafasy')

## Juz Audio Player

The `juzAudioPlayer.ts` module provides a dedicated audio player for Juz recitations with fallback mechanisms.

### Basic Usage

```typescript
import getJuzAudioPlayer, { RECITERS } from '../utils/juzAudioPlayer';

// Create a player instance
const audioPlayer = getJuzAudioPlayer(RECITERS.ALAFASY);

// Play a complete Juz
audioPlayer.playJuz(30);

// Play a specific verse within a Juz
audioPlayer.playVerse(30, 114, 1); // Play Surah 114, Verse 1 from Juz 30

// Control playback
audioPlayer.pause();
audioPlayer.resume();
audioPlayer.stop();

// Listen to events
audioPlayer.onPlay(() => {
  console.log('Audio started playing');
});

audioPlayer.onError((error) => {
  console.error('Error playing audio:', error);
});

// Clean up when component unmounts
audioPlayer.cleanup();
```

### Available Reciters

```typescript
import { RECITERS } from '../utils/juzAudioPlayer';

// Available reciters
const reciters = {
  ALAFASY: RECITERS.ALAFASY,       // Mishary Alafasy
  MINSHAWI: RECITERS.MINSHAWI,     // Mohamed Minshawi
  HUSARY: RECITERS.HUSARY,         // Mahmoud Khalil Al-Husary
  SUDAIS: RECITERS.SUDAIS,         // Abdurrahman As-Sudais
  MUAIQLY: RECITERS.MUAIQLY        // Abdullah Al-Muaiqly
};
```

## Example Component

We've created a demonstration component that showcases how to use these functions. You can see it in action at `/quran/juz-demo`.

The demo component (`JuzDataDemo.tsx`) demonstrates:

1. Fetching Juz data with translations
2. Displaying Juz metadata and content
3. Playing complete Juz audio
4. Playing individual verses
5. Changing reciters

## Error Handling

All functions include proper error handling. Wrap your calls in try/catch blocks:

```typescript
try {
  const juzData = await getJuzData(30);
  // Use the data
} catch (error) {
  console.error('Error fetching Juz data:', error);
  // Handle the error (show message to user, etc.)
}
```

## Pagination

For large Juz, you can use pagination to fetch data in chunks:

```typescript
// Fetch first 20 verses
const firstPage = await getJuzData(1, 'en.asad', {
  limit: 20
});

// Fetch next 20 verses
const secondPage = await getJuzData(1, 'en.asad', {
  offset: 20,
  limit: 20
});
```