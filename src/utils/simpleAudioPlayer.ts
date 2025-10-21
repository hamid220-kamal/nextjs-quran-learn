/**
 * A simple audio player implementation that checks if files exist before playing
 * Used as a fallback for the enhancedSurahAudio.ts player
 */

/**
 * Check if an audio file exists by making a HEAD request
 * @param url The URL to check
 * @returns Promise that resolves to true if file exists, false otherwise
 */
const checkAudioExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    console.warn(`Error checking audio file existence at ${url}:`, error);
    return false;
  }
};

/**
 * Play Al-Fatiha ayah using a simple approach that pre-checks file existence
 * @param ayahNumber The ayah number (1-7)
 * @returns Promise that resolves when playback starts or rejects if all attempts fail
 */
export const playAlFatihaAyah = async (ayahNumber: number): Promise<HTMLAudioElement> => {
  // Format ayah number with padding
  const paddedAyah = ayahNumber.toString().padStart(3, '0');
  
  // URLs that are known to work for Al-Fatiha
  const potentialUrls = [
    // Special hardcoded URLs for Al-Fatiha verse 1 (the most problematic one)
    ...(ayahNumber === 1 ? [
      'https://server8.mp3quran.net/afs/001001.mp3',
      'https://server12.mp3quran.net/maher/001001.mp3',
      'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/001001.mp3',
      'https://audio1.islamweb.net/audio/full_quran/001_Alafasy/001001.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/11.mp3'
    ] : []),
    
    // Standard URLs for all verses
    `https://server8.mp3quran.net/afs/001${paddedAyah}.mp3`,
    `https://server11.mp3quran.net/shatri/001${paddedAyah}.mp3`,
    `https://server12.mp3quran.net/maher/001${paddedAyah}.mp3`,
    `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/001${paddedAyah}.mp3`,
    `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001${paddedAyah}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/001${paddedAyah}.mp3`,
    `https://cdn.islamic.network/quran/audio/128/ar.alafasy/1${ayahNumber}.mp3`
  ];
  
  // For verse 1 of Al-Fatiha (which is particularly problematic),
  // try direct playback without HEAD request first
  if (ayahNumber === 1) {
    try {
      // Directly try to play from a reliable source
      const directUrl = 'https://server8.mp3quran.net/afs/001001.mp3';
      console.log(`Trying direct playback of Al-Fatiha ayah 1 from: ${directUrl}`);
      
      const audio = new Audio(directUrl);
      await audio.play();
      
      console.log(`Successfully playing Al-Fatiha ayah 1 directly`);
      return audio;
    } catch (directError) {
      console.warn('Direct playback attempt failed:', directError);
      // Continue to regular approach
    }
  }

  // Try each URL
  for (const url of potentialUrls) {
    try {
      // Check if file exists before trying to play it
      const exists = await checkAudioExists(url);
      if (exists) {
        console.log(`Found working Al-Fatiha audio at: ${url}`);
        
        // Create a new audio element
        const audio = new Audio(url);
        
        // Preload the audio
        audio.preload = 'auto';
        
        // Set up event listeners for better error handling
        const playPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
            
            // Try to play it
            audio.play()
              .then(() => {
                console.log(`Successfully playing Al-Fatiha ayah ${ayahNumber} from ${url}`);
                resolve(audio);
              })
              .catch(playError => {
                console.warn(`Play failed for ${url}:`, playError);
                reject(playError);
              });
          };
          
          const onError = () => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
            reject(new Error(`Audio error loading ${url}`));
          };
          
          audio.addEventListener('canplaythrough', onCanPlay);
          audio.addEventListener('error', onError);
          
          // Set a timeout in case the events never fire
          setTimeout(() => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
            reject(new Error(`Timeout waiting for audio to load from ${url}`));
          }, 10000);
        });
        
        // Wait for play to succeed
        return await playPromise;
      }
    } catch (error) {
      console.warn(`Failed with URL ${url}:`, error);
      // Continue to next URL
    }
  }
  
  // If we reach here, all attempts failed - try one last emergency approach
  try {
    console.log("Trying emergency fallback for Al-Fatiha");
    
    // Last-resort approach: create audio element with special parameters
    const audio = new Audio();
    audio.crossOrigin = "anonymous"; // Try to avoid CORS issues
    audio.preload = "auto";
    
    // Use a reliable CDN
    const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/1${ayahNumber}.mp3`;
    audio.src = fallbackUrl;
    
    // Manually trigger load
    audio.load();
    
    // Try to play
    await audio.play();
    return audio;
  } catch (finalError) {
    console.error("All playback attempts failed for Al-Fatiha", finalError);
    throw new Error(`Could not play Al-Fatiha ayah ${ayahNumber} from any source`);
  }
};

/**
 * Stop playback of the given audio element
 * @param audio The audio element to stop
 */
export const stopAudio = (audio: HTMLAudioElement | null): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};