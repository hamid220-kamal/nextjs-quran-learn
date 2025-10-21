# Quran Translation and Audio Features

This document provides an overview of the translation and audio features implemented in the Quran Learn application.

## Features

### Translation Features
- Multiple language translations (English, French, Spanish, German, Urdu)
- Toggle translations on/off
- Dynamic language switching without page reload
- Translation selector dropdown

### Audio Features
- Verse-by-verse audio playback
- Full surah recitation
- Multiple reciters available:
  - Mishary Rashid Alafasy
  - Mohamed Siddiq Al-Minshawi
  - Mahmoud Khalil Al-Husary
  - Maher Al Muaiqly
  - Abdur-Rahman As-Sudais
- Audio player UI with play/pause controls
- Verse highlighting during playback

## Implementation Details

### Core Components

1. **TranslationSelector**
   - Purpose: Allow users to select from multiple language translations
   - File: `src/app/surah/[surahNumber]/TranslationSelector.tsx`
   - Key features:
     - Dropdown selection
     - Language options from EDITIONS constant
     - Callback for language change

2. **QuranAudioPlayerUI**
   - Purpose: Provide UI controls for audio playback
   - File: `src/app/surah/[surahNumber]/QuranAudioPlayerUI.tsx`
   - Key features:
     - Play/pause verse audio
     - Play entire surah
     - Select specific verses
     - Choose different reciters

### Utilities

1. **quranAudioPlayer.ts**
   - Purpose: Singleton service for managing audio playback
   - File: `src/utils/quranAudioPlayer.ts`
   - Key features:
     - Verse-by-verse playback
     - Full surah playback
     - Queue management for continuous playback
     - Event system for play/pause/end events

2. **quranApi.ts**
   - Purpose: API integration with alquran.cloud
   - File: `src/utils/quranApi.ts`
   - Key endpoints:
     - Fetching translations
     - Retrieving audio URLs
     - Combining Arabic with translations

### CSS Styling
- Audio and translation UI styling in `src/app/surah/[surahNumber]/AudioTranslationControls.css`
- CSS variables defined in `src/app/css-variables.css`
- Responsive design for mobile and desktop

## API Integration

The implementation uses the alquran.cloud API with the following endpoints:

- Translations: `https://api.alquran.cloud/v1/surah/{surahNumber}/{translationEdition}`
- Verse audio: `https://api.alquran.cloud/v1/ayah/{surahNumber}:{ayahNumber}/{audioEdition}`
- Surah audio: `https://api.alquran.cloud/v1/surah/{surahNumber}/{audioEdition}`

## Future Enhancements

- Continuous playback across surahs
- Improved audio seeking capabilities
- User preferences for default translations and reciters
- Download functionality for offline use
- Multiple translations displayed simultaneously