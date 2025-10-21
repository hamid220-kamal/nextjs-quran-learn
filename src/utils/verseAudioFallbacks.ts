'use client';

// This file contains direct CDN URLs for specific problematic verses
// Used as a fallback when regular playback methods fail

// Import the verse mapping utility for correct absolute verse numbers
import { getAbsoluteVerseNumber } from './quranVerseMapping';

// Utility function to pad numbers with leading zeros
function padWithZeros(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

// Al-Fatiha (Surah 1) direct verse links from multiple CDNs
export const AL_FATIHA_DIRECT_URLS = {
  1: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001001.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001001.mp3',
    'https://server8.mp3quran.net/afs/001001.mp3',
    'https://server12.mp3quran.net/maher/001001.mp3'
  ],
  2: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001002.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001002.mp3',
    'https://server8.mp3quran.net/afs/001002.mp3',
    'https://server12.mp3quran.net/maher/001002.mp3'
  ],
  3: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001003.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001003.mp3',
    'https://server8.mp3quran.net/afs/001003.mp3',
    'https://server12.mp3quran.net/maher/001003.mp3',
    // Adding more sources specifically for verse 3 since it's problematic
    'https://verses.quran.com/Alafasy/mp3/001003.mp3',
    'https://server11.mp3quran.net/shatri/001003.mp3',
    'https://server7.mp3quran.net/shur/001003.mp3',
    'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001003.mp3'
  ],
  4: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001004.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001004.mp3',
    'https://server8.mp3quran.net/afs/001004.mp3',
    'https://server12.mp3quran.net/maher/001004.mp3'
  ],
  5: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001005.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001005.mp3',
    'https://server8.mp3quran.net/afs/001005.mp3',
    'https://server12.mp3quran.net/maher/001005.mp3'
  ],
  6: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001006.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001006.mp3',
    'https://server8.mp3quran.net/afs/001006.mp3',
    'https://server12.mp3quran.net/maher/001006.mp3'
  ],
  7: [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/001007.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/001007.mp3',
    'https://server8.mp3quran.net/afs/001007.mp3',
    'https://server12.mp3quran.net/maher/001007.mp3'
  ]
};

// Additional known problematic verses with direct URL fallbacks
export const PROBLEMATIC_VERSES: Record<string, string[]> = {
  // Surah 2
  '2:282': [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/289.mp3',
    'https://audio.qurancentral.com/mishary-rashid-alafasy/mishary-rashid-alafasy-002-282.mp3',
    'https://verses.quran.com/Alafasy/mp3/002282.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/002282.mp3',
    'https://server8.mp3quran.net/afs/002282.mp3'
  ],
  
  // Surah 3
  '3:93': [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/396.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/003093.mp3',
    'https://verses.quran.com/Alafasy/mp3/003093.mp3',
    'https://server8.mp3quran.net/afs/003093.mp3'
  ],
  
  // Surah 5 - Adding Al-Ma'idah verse 2
  '5:2': [
    'https://cdn.islamic.network/quran/audio/128/ar.alafasy/683.mp3',
    'https://www.everyayah.com/data/Alafasy_128kbps/005002.mp3',
    'https://verses.quran.com/Alafasy/mp3/005002.mp3',
    'https://server8.mp3quran.net/afs/005002.mp3',
    'https://audio.qurancdn.com/Alafasy/mp3/005002.mp3',
    'https://server12.mp3quran.net/maher/005002.mp3',
    'https://server11.mp3quran.net/shatri/005002.mp3',
    'https://server7.mp3quran.net/shur/005002.mp3'
  ]
};

/**
 * Get fallback URLs for a specific verse
 * @param surahNumber The surah number (1-114)
 * @param ayahNumber The ayah/verse number within the surah
 * @returns Array of URLs to try for this verse
 */
export function getVerseFallbackUrls(surahNumber: number, ayahNumber: number): string[] {
  // Format the verse key (e.g., "5:2")
  const verseKey = `${surahNumber}:${ayahNumber}`;
  
  // Check if it's Al-Fatiha
  if (surahNumber === 1 && ayahNumber >= 1 && ayahNumber <= 7) {
    return AL_FATIHA_DIRECT_URLS[ayahNumber] || [];
  }
  
  // Check if it's a known problematic verse
  if (PROBLEMATIC_VERSES[verseKey]) {
    return PROBLEMATIC_VERSES[verseKey];
  }
  
  // If not a specifically handled verse, generate standard URLs
  const paddedSurah = padWithZeros(surahNumber, 3);
  const paddedAyah = padWithZeros(ayahNumber, 3);
  
  // Calculate the correct absolute verse number for Islamic Network API
  let absoluteVerseNumber;
  try {
    absoluteVerseNumber = getAbsoluteVerseNumber(surahNumber, ayahNumber);
    console.log(`Calculated absolute verse number for ${verseKey}: ${absoluteVerseNumber}`);
  } catch (error) {
    console.error(`Error calculating absolute verse number for ${verseKey}:`, error);
    absoluteVerseNumber = null;
  }
  
  // Create an array of URLs from different CDNs for this verse
  const urls = [];
  
  // Add Islamic Network API URL with correct absolute verse number
  if (absoluteVerseNumber) {
    urls.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${absoluteVerseNumber}.mp3`);
  }
  
  // Add the most reliable formats with consistent naming schemes
  urls.push(
    // EveryAyah format - most reliable across all verses
    `https://www.everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`,
    
    // MP3Quran Alafasy format - also very reliable
    `https://server8.mp3quran.net/afs/${paddedSurah}${paddedAyah}.mp3`,
    
    // Quran.com format
    `https://verses.quran.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`,
    
    // QuranCDN format
    `https://audio.qurancdn.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`
  );
  
  // Add API format that's resilient
  urls.push(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/audio/ar.alafasy`);
  
  // Alternative sources with different reciters for more reliability
  urls.push(
    `https://server12.mp3quran.net/maher/${paddedSurah}${paddedAyah}.mp3`,
    `https://server11.mp3quran.net/shatri/${paddedSurah}${paddedAyah}.mp3`,
    `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedSurah}${paddedAyah}.mp3`,
    `https://server13.mp3quran.net/husr/${paddedSurah}${paddedAyah}.mp3`
  );
  
  return urls;
}

/**
 * Function to play a specific verse from multiple fallback sources
 * @param audioElement The HTML audio element to use for playback
 * @param urls An array of URLs to try for playback
 * @param onSuccess Optional callback on successful playback
 * @param onError Optional callback on failed playback
 * @param verseKey Optional verse key for debugging (e.g. "1:1")
 * @returns Promise resolving to boolean indicating success or failure
 */
export async function playVerseWithFallbacks(
  audioElement: HTMLAudioElement,
  urls: string[],
  onSuccess?: () => void,
  onError?: (error: Error) => void,
  verseKey?: string
): Promise<boolean> {
  // Don't continue if we don't have an audio element or URLs
  if (!audioElement || !urls || urls.length === 0) {
    if (onError) onError(new Error("No audio element or URLs provided"));
    return false;
  }

  console.log(`[Verse ${verseKey || 'unknown'}] Attempting to play with ${urls.length} possible sources`);
  
  let playSuccess = false;
  let lastError: Error | null = null;
  
  // Maximum number of retries per URL
  const MAX_RETRIES_PER_URL = 2;

  // Try each URL in sequence
  for (let i = 0; i < urls.length; i++) {
    // For each URL, we'll try multiple times with increasing timeouts
    for (let retry = 0; retry < MAX_RETRIES_PER_URL; retry++) {
      try {
        // Stop any current playback and reset
        audioElement.pause();
        audioElement.currentTime = 0;
        
        // Calculate timeout based on retry attempt (8s, 12s, 15s)
        const timeout = 8000 + (retry * 4000);
        
        // Log the URL we're trying with current retry
        console.log(`[Verse ${verseKey || 'unknown'}] Trying source ${i+1}/${urls.length} (attempt ${retry+1}/${MAX_RETRIES_PER_URL}): ${urls[i]}`);
        
        // Set up a timeout promise to prevent infinite waiting
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error(`Loading timeout after ${timeout}ms`)), timeout);
        });

        // Set the source and start loading
        audioElement.src = urls[i];
        audioElement.load();
        
        // Wait for either successful loading or timeout
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            const canPlayHandler = () => {
              console.log(`[Verse ${verseKey || 'unknown'}] Source ${i+1} is ready to play`);
              audioElement.removeEventListener('canplaythrough', canPlayHandler);
              resolve();
            };
            audioElement.addEventListener('canplaythrough', canPlayHandler, { once: true });
            
            // Also listen for errors and abort events
            const errorHandler = (e: Event) => {
              console.warn(`[Verse ${verseKey || 'unknown'}] Error on source ${i+1}: ${e.type}`);
              audioElement.removeEventListener('error', errorHandler);
              reject(new Error(`Audio loading error: ${e.type}`));
            };
            audioElement.addEventListener('error', errorHandler, { once: true });
            
            const abortHandler = (e: Event) => {
              console.warn(`[Verse ${verseKey || 'unknown'}] Loading aborted for source ${i+1}`);
              audioElement.removeEventListener('abort', abortHandler);
              reject(new Error('Audio loading aborted'));
            };
            audioElement.addEventListener('abort', abortHandler, { once: true });
          }),
          timeoutPromise
        ]);
        
        // Try to play
        console.log(`[Verse ${verseKey || 'unknown'}] Attempting to play source ${i+1}`);
        await audioElement.play();
        
        // If we get here, playback started successfully
        console.log(`[Verse ${verseKey || 'unknown'}] ✓ Successfully playing from source ${i+1}`);
        playSuccess = true;
        if (onSuccess) onSuccess();
        return true; // Exit the function with success
      } catch (error) {
        console.warn(`[Verse ${verseKey || 'unknown'}] Failed attempt ${retry+1} for source ${i+1}:`, error);
        lastError = error as Error;
        // Continue to next retry or next source
      }
    }
  }

  // If we've exhausted all URLs and retries
  const errorMessage = `Failed to play verse ${verseKey || 'unknown'} from any of the ${urls.length} sources after multiple attempts`;
  console.error(errorMessage);
  
  if (!playSuccess && onError) {
    onError(lastError || new Error(errorMessage));
  }

  return playSuccess;
}

/**
 * Preload audio files in the background to improve auto-play experience
 * @param surahNumber The surah number
 * @param ayahNumbers Array of ayah numbers to preload
 * @param limit Maximum number of verses to preload (to avoid overloading the browser)
 * @returns Promise that resolves when preloading is complete
 */
export async function preloadVerseAudio(
  surahNumber: number,
  ayahNumbers: number[],
  limit: number = 3
): Promise<void> {
  // Limit the number of verses to preload
  const versesToPreload = ayahNumbers.slice(0, limit);
  
  console.log(`[Preloader] Preloading ${versesToPreload.length} verses from Surah ${surahNumber}`);
  
  // Create hidden audio elements for preloading
  const preloadPromises = versesToPreload.map(ayahNumber => {
    return new Promise<void>((resolve) => {
      // Get URLs for this verse
      const urls = getVerseFallbackUrls(surahNumber, ayahNumber);
      if (!urls || urls.length === 0) {
        console.log(`[Preloader] No URLs found for ${surahNumber}:${ayahNumber}`);
        resolve();
        return;
      }
      
      // Use only the first URL (most reliable one) for preloading
      const preloadUrl = urls[0];
      
      // Create a temporary audio element for preloading
      const tempAudio = new Audio();
      
      // Set up event handlers
      const onLoaded = () => {
        console.log(`[Preloader] Preloaded ${surahNumber}:${ayahNumber}`);
        cleanup();
        resolve();
      };
      
      const onError = () => {
        console.log(`[Preloader] Failed to preload ${surahNumber}:${ayahNumber}`);
        cleanup();
        resolve(); // Resolve anyway to continue with others
      };
      
      const cleanup = () => {
        tempAudio.removeEventListener('canplaythrough', onLoaded);
        tempAudio.removeEventListener('error', onError);
        tempAudio.src = ''; // Clear source to help garbage collection
      };
      
      // Add event listeners
      tempAudio.addEventListener('canplaythrough', onLoaded, { once: true });
      tempAudio.addEventListener('error', onError, { once: true });
      
      // Start preloading
      console.log(`[Preloader] Starting preload for ${surahNumber}:${ayahNumber}: ${preloadUrl}`);
      tempAudio.preload = 'auto';
      tempAudio.src = preloadUrl;
      tempAudio.load();
      
      // Set a timeout to avoid hanging on slow connections
      setTimeout(() => {
        if (!tempAudio.readyState) {
          console.log(`[Preloader] Timeout for ${surahNumber}:${ayahNumber}`);
          cleanup();
          resolve();
        }
      }, 5000);
    });
  });
  
  // Wait for all preload operations to complete or timeout
  await Promise.all(preloadPromises);
  console.log(`[Preloader] Completed preloading for Surah ${surahNumber}`);
}