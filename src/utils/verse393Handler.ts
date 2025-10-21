/**
 * Special handler for problematic verse 3:93
 * This module provides direct playback for verse 3:93 which has issues with standard sources
 */

// Known working audio sources for verse 3:93
const VERSE_3_93_SOURCES = [
  'https://cdn.islamic.network/quran/audio/128/ar.alafasy/386.mp3', // Primary (absolute verse number)
  'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-003-093.mp3',
  'https://verses.quran.com/Alafasy/mp3/003093.mp3',
  'https://verses.quran.com/Alafasy/mp3/003_093.mp3',
  'https://www.everyayah.com/data/Alafasy_128kbps/003093.mp3'
];

/**
 * Play verse 3:93 using direct sources
 * @returns Audio element if successful, otherwise throws an error
 */
export async function playVerse393(): Promise<HTMLAudioElement> {
  console.log('Using specialized handler for verse 3:93');
  
  // Try each source in sequence until one works
  for (const source of VERSE_3_93_SOURCES) {
    try {
      console.log(`Trying source for 3:93: ${source}`);
      const audio = new Audio(source);
      
      // Wait for the audio to be ready or fail
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Audio loading timeout')), 5000);
        
        audio.oncanplay = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        audio.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load audio from ${source}`));
        };
        
        // Force load attempt
        audio.load();
      });
      
      // Try playing
      await audio.play();
      
      // If we got here, it worked!
      console.log(`Successfully played verse 3:93 with source: ${source}`);
      return audio;
      
    } catch (error) {
      console.warn(`Source failed for 3:93: ${source}`, error);
      // Continue to next source
    }
  }
  
  // If all sources failed
  throw new Error('All sources failed for verse 3:93');
}

/**
 * Get the absolute verse number for verse 3:93 (386)
 * This can be used with APIs that require absolute verse numbers
 */
export function getVerse393AbsoluteNumber(): number {
  return 386;
}

/**
 * Checks if a verse key is 3:93
 * @param verseKey The verse key in format surah:ayah (e.g., '3:93')
 */
export function isVerse393(verseKey: string): boolean {
  return verseKey === '3:93';
}

export default {
  playVerse393,
  getVerse393AbsoluteNumber,
  isVerse393,
  VERSE_3_93_SOURCES
};