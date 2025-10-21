/**
 * Special handler for problematic verses
 * This module provides direct playback for verses that have issues with standard sources
 * 
 * Note: There seems to be a pattern of issues with verses in Surah 3 (Al-Imran),
 * specifically around verses 93-97. This handler provides multiple fallback sources
 * for these verses to ensure reliable playback.
 */

// Known working audio sources for verse 3:93
const VERSE_3_93_SOURCES = [
  'https://cdn.islamic.network/quran/audio/128/ar.alafasy/386.mp3', // Primary (absolute verse number)
  'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-003-093.mp3',
  'https://verses.quran.com/Alafasy/mp3/003093.mp3',
  'https://verses.quran.com/Alafasy/mp3/003_093.mp3',
  'https://www.everyayah.com/data/Alafasy_128kbps/003093.mp3'
];

// Known working audio sources for verse 3:94
const VERSE_3_94_SOURCES = [
  'https://cdn.islamic.network/quran/audio/128/ar.alafasy/387.mp3', // Primary (absolute verse number)
  'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-003-094.mp3',
  'https://verses.quran.com/Alafasy/mp3/003094.mp3',
  'https://verses.quran.com/Alafasy/mp3/003_094.mp3',
  'https://www.everyayah.com/data/Alafasy_128kbps/003094.mp3',
  'https://server8.mp3quran.net/afs/003094.mp3'
];

// Known working audio sources for verse 3:95
const VERSE_3_95_SOURCES = [
  'https://cdn.islamic.network/quran/audio/128/ar.alafasy/388.mp3', // Primary (absolute verse number)
  'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-003-095.mp3',
  'https://verses.quran.com/Alafasy/mp3/003095.mp3',
  'https://verses.quran.com/Alafasy/mp3/003_095.mp3',
  'https://www.everyayah.com/data/Alafasy_128kbps/003095.mp3',
  'https://server8.mp3quran.net/afs/003095.mp3',
  'https://audio.qurancdn.com/Alafasy/003095.mp3',
  // Additional sources for increased reliability
  'https://cdn.islamic.network/quran/audio/64/ar.alafasy/388.mp3', // Lower quality but faster loading
  'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/003095.mp3',
  'https://download.quranicaudio.com/quran/mishary_rashid_alafasy/003095.mp3',
  'https://www.islamcan.com/audio/quran/verse/arabic/mishary-rashid-alafasy/003095.mp3',
  'https://audio.islamicfinder.org/audio/surah/surah_003/ayat_095_mishary.mp3',
  'https://recitequran.com/audio/Mishary%20Rashid/003095.mp3',
  'https://qurango.net/radio/mishary_rashid_alafasy/003095.mp3'
];

// Known working audio sources for verse 3:97
const VERSE_3_97_SOURCES = [
  'https://cdn.islamic.network/quran/audio/128/ar.alafasy/390.mp3', // Primary (absolute verse number)
  'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-003-097.mp3',
  'https://verses.quran.com/Alafasy/mp3/003097.mp3',
  'https://verses.quran.com/Alafasy/mp3/003_097.mp3',
  'https://www.everyayah.com/data/Alafasy_128kbps/003097.mp3',
  'https://server8.mp3quran.net/afs/003097.mp3',
  'https://audio.qurancdn.com/Alafasy/003097.mp3'
];

// Mapping of problematic verses to their absolute verse numbers
const VERSE_ABSOLUTE_NUMBERS: Record<string, number> = {
  '3:93': 386,
  '3:94': 387,
  '3:95': 388,
  '3:97': 390,
  '5:2': 683  // Adding verse 5:2 absolute number
};

// Mapping of problematic verses to their sources
const PROBLEMATIC_VERSE_SOURCES: Record<string, string[]> = {
  '3:93': VERSE_3_93_SOURCES,
  '3:94': VERSE_3_94_SOURCES,
  '3:95': VERSE_3_95_SOURCES,
  '3:97': VERSE_3_97_SOURCES,
  
  // Adding Surah Al-Ma'idah (5) verse 2 which is particularly problematic
  '5:2': [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/683.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/005002.mp3',
    'https://verses.quran.com/Alafasy/mp3/005002.mp3',
    'https://server8.mp3quran.net/afs/005002.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/005002.mp3',
    'https://server12.mp3quran.net/maher/005002.mp3',
    'https://server11.mp3quran.net/shatri/005002.mp3',
    'https://server7.mp3quran.net/shur/005002.mp3',
    'https://server7.mp3quran.net/basit/005002.mp3',
    'https://server13.mp3quran.net/husr/005002.mp3',
    'https://server8.mp3quran.net/frs_a/005002.mp3',
    'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/683'
  ]
};

/**
 * Play a problematic verse using direct sources
 * @param verseKey The verse key in format surah:ayah (e.g., '3:93')
 * @returns Audio element if successful, otherwise throws an error
 */
export async function playProblematicVerse(verseKey: string): Promise<HTMLAudioElement> {
  if (!isProblematicVerse(verseKey)) {
    throw new Error(`Verse ${verseKey} is not registered as problematic`);
  }
  
  console.log(`Using specialized handler for verse ${verseKey}`);
  let sources = PROBLEMATIC_VERSE_SOURCES[verseKey];
  
  // Generate additional fallback sources based on patterns
  // This helps when the original sources might not work
  const [surahNumber, ayahNumber] = verseKey.split(':').map(Number);
  const paddedSurah = surahNumber.toString().padStart(3, '0');
  const paddedAyah = ayahNumber.toString().padStart(3, '0');
  const absoluteNumber = VERSE_ABSOLUTE_NUMBERS[verseKey];
  
  // Add dynamically generated sources
  const dynamicSources = [
    // Various absolute verse number formats
    `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${absoluteNumber}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/${paddedSurah}_${paddedAyah}.mp3`,
    `https://verses.quran.com/Alafasy/ogg/${paddedSurah}${paddedAyah}.ogg`,
    
    // Various reciters and formats
    `https://audio.islamicfinder.org/audio/surah/surah_${paddedSurah}/ayat_${paddedAyah}_alafasy.mp3`,
    `https://everyayah.com/data/ahmed_ibn_ali_al_ajamy_128kbps/${paddedSurah}${paddedAyah}.mp3`,
    `https://everyayah.com/data/Ghamadi_40kbps/${paddedSurah}${paddedAyah}.mp3`,
    `https://everyayah.com/data/Husary_128kbps/${paddedSurah}${paddedAyah}.mp3`,
    
    // Try different CDNs
    `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${absoluteNumber}`,
    `https://cdn.qurancdn.com/audio/${paddedSurah}/${paddedAyah}.mp3`,
    
    // Add MP3Quran alternatives
    `https://server7.mp3quran.net/shur/${paddedSurah}${paddedAyah}.mp3`,
    `https://server8.mp3quran.net/frs_a/${paddedSurah}${paddedAyah}.mp3`,
    `https://server11.mp3quran.net/yasser/${paddedSurah}${paddedAyah}.mp3`,
    
    // Alternative hostname formats
    `https://media.blubrry.com/muslim_central/audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-${paddedSurah}-${paddedAyah}.mp3`
  ];
  
  // Combine original sources with dynamic ones
  sources = [...sources, ...dynamicSources];
  
  // Try each source in sequence until one works
  for (const source of sources) {
    try {
      console.log(`Trying source for ${verseKey}: ${source}`);
      const audio = new Audio(source);
      
      // Wait for the audio to be ready or fail
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Audio loading timeout')), 8000); // Extended timeout for reliability
        
        audio.oncanplay = () => {
          clearTimeout(timeout);
          console.log(`Audio canplay event triggered for ${verseKey}`);
          resolve();
        };
        
        audio.onloadeddata = () => {
          console.log(`Audio data loaded for ${verseKey}`);
        };
        
        audio.onerror = (e) => {
          clearTimeout(timeout);
          console.error(`Audio error for ${verseKey}:`, e);
          reject(new Error(`Failed to load audio from ${source}`));
        };
        
        // Force load attempt
        audio.load();
      });
      
      // Try playing
      await audio.play();
      
      // If we got here, it worked!
      console.log(`Successfully played verse ${verseKey} with source: ${source}`);
      return audio;
      
    } catch (error) {
      console.warn(`Source failed for ${verseKey}: ${source}`, error);
      // Continue to next source
    }
  }
  
  // If all sources failed
  throw new Error(`All sources failed for verse ${verseKey}`);
}

/**
 * Get the absolute verse number for a given verse key
 * @param verseKey The verse key in format surah:ayah (e.g., '3:93')
 * @returns The absolute verse number or undefined if not found
 */
export function getVerseAbsoluteNumber(verseKey: string): number | undefined {
  return VERSE_ABSOLUTE_NUMBERS[verseKey];
}

/**
 * Checks if a verse key is in our list of problematic verses
 * @param verseKey The verse key in format surah:ayah (e.g., '3:93')
 */
export function isProblematicVerse(verseKey: string): boolean {
  return verseKey in PROBLEMATIC_VERSE_SOURCES;
}

// Legacy functions for backward compatibility
export const playVerse393 = () => playProblematicVerse('3:93');
export const isVerse393 = (verseKey: string) => verseKey === '3:93';
export const getVerse393AbsoluteNumber = () => VERSE_ABSOLUTE_NUMBERS['3:93'];

// Specialized functions for frequently problematic verses
export const playVerse395 = () => playProblematicVerse('3:95');
export const isVerse395 = (verseKey: string) => verseKey === '3:95';
export const playVerse397 = () => playProblematicVerse('3:97');
export const isVerse397 = (verseKey: string) => verseKey === '3:97';

// Export everything
export default {
  playProblematicVerse,
  getVerseAbsoluteNumber,
  isProblematicVerse,
  playVerse393,
  isVerse393,
  getVerse393AbsoluteNumber,
  playVerse395,
  isVerse395,
  playVerse397,
  isVerse397,
  PROBLEMATIC_VERSE_SOURCES,
  VERSE_ABSOLUTE_NUMBERS
};