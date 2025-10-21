/**
 * Enhanced Quran Surah Audio Player
 * Optimized for playing complete Surahs reliably
 * 
 * This player integrates with verseAudioFallbacks.ts for a comprehensive
 * audio fallback system that ensures reliable playback across all verses.
 */

// Import specialized handler for problematic verses
import { 
  playProblematicVerse, 
  isProblematicVerse,
  playVerse393, 
  isVerse393 
} from './problematicVerseHandler';

// Import absolute verse number mapping
import { getAbsoluteVerseNumber } from './quranVerseMapping';

// Note: We no longer need to maintain PROBLEMATIC_VERSES here
// All verse-specific fallbacks are now centralized in verseAudioFallbacks.ts

// Define available audio sources with fallback patterns
const AUDIO_SOURCES = {
  // Islamic Network CDN - Primary source
  ISLAMIC_NETWORK: {
    getUrl: (reciter: string, surahNumber: number) => 
      `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahNumber}.mp3`
  },
  // Islamic Network CDN - Alternative format
  ISLAMIC_NETWORK_ALT: {
    getUrl: (reciter: string, surahNumber: number) => 
      `https://cdn.islamic.network/quran/audio-surah/128/ar.${reciter}/${surahNumber}.mp3`
  },
  // QuranicAudio.com
  QURANIC_AUDIO: {
    getUrl: (reciter: string, surahNumber: number) => 
      `https://download.quranicaudio.com/quran/${reciter}/${surahNumber.toString().padStart(3, '0')}.mp3`
  },
  // MP3Quran.net
  MP3_QURAN: {
    getUrl: (reciter: string, surahNumber: number) => 
      `https://verse.mp3quran.net/arabic/${reciter}/${surahNumber.toString().padStart(3, '0')}.mp3`
  },
  // EveryAyah.com
  EVERY_AYAH: {
    getUrl: (reciter: string, surahNumber: number) => 
      `https://everyayah.com/data/${reciter}/surah_${surahNumber.toString().padStart(3, '0')}.mp3`
  }
};

// Map of reciter IDs to their codes in various APIs
const RECITERS = {
  'ar.alafasy': {
    name: 'Mishary Rashid Alafasy',
    code: 'alafasy',
  },
  'ar.minshawi': {
    name: 'Mohamed Siddiq Al-Minshawi',
    code: 'minshawi',
  },
  'ar.husary': {
    name: 'Mahmoud Khalil Al-Husary',
    code: 'husary',
  },
  'ar.muaiqly': {
    name: 'Maher Al Muaiqly',
    code: 'maher_al_muaiqly',
  },
  'ar.abdurrahmansudais': {
    name: 'Abdur-Rahman As-Sudais',
    code: 'abdurrahmaan_as-sudays',
  }
};

class EnhancedSurahAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private currentSurah: number | null = null;
  private currentReciterId: string = 'ar.alafasy';
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  
  // Callbacks
  private onPlayCallback: (() => void) | null = null;
  private onPauseCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onLoadingCallback: ((isLoading: boolean) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  
  constructor() {
    // Only create audio element in browser environment
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupAudioEventListeners();
      
      // Volume settings
      this.audioElement.volume = 1.0;
    }
  }
  
  /**
   * Set up audio element event listeners
   * This method can be called again if we need to recreate the audio element
   */
  private setupAudioEventListeners(): void {
    if (!this.audioElement) return;
    
    // Set up event listeners
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    });
    
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.onPlayCallback) this.onPlayCallback();
    });
    
    this.audioElement.addEventListener('pause', () => {
      if (this.audioElement?.ended) return; // Don't trigger pause callback on end
      this.isPlaying = false;
      if (this.onPauseCallback) this.onPauseCallback();
    });
    
    // Add loading state handler
    this.audioElement.addEventListener('waiting', () => {
      this.isLoading = true;
      if (this.onLoadingCallback) this.onLoadingCallback(true);
    });
    
    this.audioElement.addEventListener('canplay', () => {
      this.isLoading = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    });
  }
  
  /**
   * Set the reciter for audio playback
   * @param reciterId The ID of the reciter to use
   */
  setReciter(reciterId: string): void {
    if (RECITERS[reciterId]) {
      this.currentReciterId = reciterId;
    } else {
      console.warn(`Unknown reciter: ${reciterId}. Using default.`);
      this.currentReciterId = 'ar.alafasy';
    }
  }
  
  /**
   * Play a complete surah
   * @param surahNumber The number of the surah to play (1-114)
   */
  async playSurah(surahNumber: number): Promise<void> {
    if (!this.audioElement) return;
    
    try {
      // Signal loading started
      this.isLoading = true;
      if (this.onLoadingCallback) this.onLoadingCallback(true);
      
      // Stop any current playback
      this.stop();
      
      // Update current surah
      this.currentSurah = surahNumber;
      
      // Get reciter code
      const reciter = RECITERS[this.currentReciterId]?.code || 'alafasy';
      
      // Try each audio source until one works
      let playSuccess = false;
      const sources = Object.values(AUDIO_SOURCES);
      
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const url = source.getUrl(reciter, surahNumber);
        
        try {
          // Set the audio source
          this.audioElement.src = url;
          this.audioElement.load();
          
          // Wait for the audio to be ready to play
          await new Promise<void>((resolve, reject) => {
            if (!this.audioElement) {
              reject(new Error('Audio element not available'));
              return;
            }
            
            const canPlayHandler = () => {
              this.audioElement?.removeEventListener('canplaythrough', canPlayHandler);
              this.audioElement?.removeEventListener('error', errorHandler);
              resolve();
            };
            
            const errorHandler = () => {
              this.audioElement?.removeEventListener('canplaythrough', canPlayHandler);
              this.audioElement?.removeEventListener('error', errorHandler);
              clearTimeout(timeoutId);
              reject(new Error(`Failed to load audio from ${url}`));
            };
            
            this.audioElement.addEventListener('canplaythrough', canPlayHandler);
            this.audioElement.addEventListener('error', errorHandler);
            
            // Set timeout for loading - avoid hanging but give more time for slower connections
            const timeoutId = setTimeout(() => {
              reject(new Error('Audio loading timeout'));
            }, 15000); // Increased from 10s to 15s
          });
          
          // Start playback
          await this.audioElement.play();
          playSuccess = true;
          break;
        } catch (error) {
          console.warn(`Failed to play surah ${surahNumber} from source ${i+1}:`, error);
          // Continue to next source
        }
      }
      
      if (!playSuccess) {
        throw new Error(`Unable to play Surah ${surahNumber} from any source`);
      }
    } catch (error) {
      console.error(`Error playing surah ${surahNumber}:`, error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    } finally {
      this.isLoading = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    }
  }
  
  /**
   * Play a specific ayah/verse
   * @param surahNumber The number of the surah (1-114)
   * @param ayahNumber The number of the ayah within the surah
   */
  async playAyah(surahNumber: number, ayahNumber: number): Promise<void> {
    if (!this.audioElement) return;
    
    // For Surah Al-Fatiha (1), we use specialized function due to its importance
    if (surahNumber === 1 && ayahNumber >= 1 && ayahNumber <= 7) {
      return this.playAlFatihaVerse(ayahNumber);
    }
    
    // Check if this is a known problematic verse that has a specialized handler
    const verseKey = `${surahNumber}:${ayahNumber}`;
    
    // Handle verse 3:93 with specialized handler
    if (isVerse393(verseKey)) {
      console.log(`Using specialized handler for verse 3:93`);
      try {
        // Signal loading started
        this.isLoading = true;
        if (this.onLoadingCallback) this.onLoadingCallback(true);
        
        // Stop any current playback
        this.stop();
        
        // Get the audio element from the specialized handler
        const audioElement = await playVerse393();
        
        // Set up callbacks
        if (audioElement) {
          audioElement.onplay = () => {
            if (this.onPlayCallback) this.onPlayCallback();
          };
          audioElement.onended = () => {
            if (this.onEndCallback) this.onEndCallback();
          };
          audioElement.onerror = (e) => {
            if (this.onErrorCallback) this.onErrorCallback(new Error(`Audio error: ${e}`));
          };
        }
        
        // Reset loading state
        this.isLoading = false;
        if (this.onLoadingCallback) this.onLoadingCallback(false);
        return;
      } catch (error) {
        console.error(`Error playing verse 3:93 with specialized handler:`, error);
        // Will continue to standard approach if this fails
      }
    }
    
    // Handle other known problematic verses with specialized handler
    if (isProblematicVerse(verseKey)) {
      console.log(`Using specialized handler for problematic verse ${verseKey}`);
      try {
        // Signal loading started
        this.isLoading = true;
        if (this.onLoadingCallback) this.onLoadingCallback(true);
        
        // Stop any current playback
        this.stop();
        
        // Use specialized handler that tries multiple sources
        const audioElement = await playProblematicVerse(verseKey);
        
        // Set up callbacks
        if (audioElement) {
          audioElement.onplay = () => {
            if (this.onPlayCallback) this.onPlayCallback();
          };
          audioElement.onended = () => {
            if (this.onEndCallback) this.onEndCallback();
          };
          audioElement.onerror = (e) => {
            if (this.onErrorCallback) this.onErrorCallback(new Error(`Audio error: ${e}`));
          };
        }
        
        // Reset loading state
        this.isLoading = false;
        if (this.onLoadingCallback) this.onLoadingCallback(false);
        return;
      } catch (error) {
        console.error(`Error playing verse ${verseKey} with specialized handler:`, error);
        // Will continue to standard approach if this fails
      }
    }
    
    try {
      // Signal loading started
      this.isLoading = true;
      if (this.onLoadingCallback) this.onLoadingCallback(true);
      
      // Stop any current playback
      this.stop();
      
      // Update current position
      this.currentSurah = surahNumber;
      
      // Import the enhanced fallback system and verse mapping
      const { getVerseFallbackUrls, playVerseWithFallbacks } = await import('./verseAudioFallbacks');
      
      // Log the actual absolute verse number
      try {
        const absoluteNumber = getAbsoluteVerseNumber(surahNumber, ayahNumber);
        console.log(`Playing verse ${surahNumber}:${ayahNumber}, absolute number: ${absoluteNumber}`);
      } catch (error) {
        console.warn(`Could not calculate absolute number for ${surahNumber}:${ayahNumber}:`, error);
      }
      
      // Get all fallback URLs for this verse from our centralized system
      const fallbackUrls = getVerseFallbackUrls(surahNumber, ayahNumber);
      
      // Try playing with our enhanced fallback system
      const playSuccess = await playVerseWithFallbacks(
        this.audioElement,
        fallbackUrls,
        // Success callback
        () => {
          console.log(`Successfully playing ayah ${surahNumber}:${ayahNumber}`);
          
          // Ensure callbacks are triggered
          if (this.onPlayCallback) this.onPlayCallback();
          
          // Set up ended event for this specific playback
          const handleEnded = () => {
            this.audioElement?.removeEventListener('ended', handleEnded);
            if (this.onEndCallback) this.onEndCallback();
          };
          
          this.audioElement?.addEventListener('ended', handleEnded, { once: true });
        },
        // Error callback for logging
        (error) => {
          console.warn(`Fallback system failed for ayah ${surahNumber}:${ayahNumber}:`, error);
        }
      );
      
      // If all fallbacks failed
      if (!playSuccess) {
        // Try API-based approach as last resort
        try {
          console.log(`Trying API fallback for ayah ${surahNumber}:${ayahNumber}`);
          const fallbackUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/audio/ar.alafasy`;
          const response = await fetch(fallbackUrl);
          const data = await response.json();
          
          if (data.code === 200 && data.data && data.data.audio) {
            // Use the audio URL from the API response
            this.audioElement.src = data.data.audio;
            await this.audioElement.play();
            
            // Update state
            if (this.onPlayCallback) this.onPlayCallback();
            
            // Set up ended callback
            const handleApiEnded = () => {
              this.audioElement?.removeEventListener('ended', handleApiEnded);
              if (this.onEndCallback) this.onEndCallback();
            };
            
            this.audioElement?.addEventListener('ended', handleApiEnded, { once: true });
            
            console.log(`Successfully played ayah ${surahNumber}:${ayahNumber} using API fallback`);
            
            // Reset loading state
            this.isLoading = false;
            if (this.onLoadingCallback) this.onLoadingCallback(false);
            return;
          }
        } catch (apiError) {
          console.warn("API fallback failed:", apiError);
        }
        
        // If we reached here, everything failed - try specialized handler again for verse 5:2
        // This is an additional safety net specifically for verse 5:2 and other problematic verses
        if (verseKey === '5:2' || isProblematicVerse(verseKey)) {
          console.log(`Trying specialized handler again for verse ${verseKey} as last resort`);
          try {
            // For verse 5:2 specifically, use the specialized approach
            if (verseKey === '5:2') {
              // Create a new audio element to avoid issues with previous attempts
              const emergencyAudio = new Audio();
              
              // Set up one-time event listeners
              emergencyAudio.addEventListener('play', () => {
                if (this.onPlayCallback) this.onPlayCallback();
              }, { once: true });
              
              emergencyAudio.addEventListener('ended', () => {
                if (this.onEndCallback) this.onEndCallback();
              }, { once: true });
              
              emergencyAudio.addEventListener('error', (e) => {
                if (this.onErrorCallback) {
                  this.onErrorCallback(new Error(`Emergency audio error: ${e}`));
                }
              }, { once: true });
              
              // Last resort URLs specific to verse 5:2, using different reciters
              const lastResortUrls = [
                "https://server7.mp3quran.net/basit/005002.mp3", // Abdul Basit
                "https://server13.mp3quran.net/husr/005002.mp3", // Husary
                "https://server8.mp3quran.net/frs_a/005002.mp3", // Al-Fares
                "https://server11.mp3quran.net/shatri/005002.mp3", // Shatri
                "https://server12.mp3quran.net/maher/005002.mp3", // Maher
                "https://server10.mp3quran.net/minsh/005002.mp3", // Minshawi
                "https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/683" // Alquran.cloud absolute index
              ];
              
              // Try each last resort URL until one works
              for (const url of lastResortUrls) {
                try {
                  emergencyAudio.src = url;
                  emergencyAudio.load();
                  await emergencyAudio.play();
                  console.log(`Successfully played verse 5:2 with last resort URL: ${url}`);
                  
                  // Reset loading state and return
                  this.isLoading = false;
                  if (this.onLoadingCallback) this.onLoadingCallback(false);
                  return;
                } catch (urlError) {
                  console.warn(`Last resort URL failed for verse 5:2: ${url}`, urlError);
                }
              }
            } else if (isProblematicVerse(verseKey)) {
              // For other problematic verses, try the specialized handler again
              const audioElement = await playProblematicVerse(verseKey);
              
              if (audioElement) {
                audioElement.onplay = () => {
                  if (this.onPlayCallback) this.onPlayCallback();
                };
                audioElement.onended = () => {
                  if (this.onEndCallback) this.onEndCallback();
                };
                audioElement.onerror = (e) => {
                  if (this.onErrorCallback) {
                    this.onErrorCallback(new Error(`Audio error: ${e}`));
                  }
                };
                
                // Reset loading state
                this.isLoading = false;
                if (this.onLoadingCallback) this.onLoadingCallback(false);
                return;
              }
            }
          } catch (lastResortError) {
            console.error(`Last resort playback attempt failed for ${verseKey}:`, lastResortError);
          }
        }
        
        // If we still got here, everything failed
        const errorMsg = `Unable to play ayah ${surahNumber}:${ayahNumber} from any source`;
        console.error(errorMsg);
        
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(errorMsg));
        }
      }
      
    } catch (error) {
      console.error(`Error playing ayah ${surahNumber}:${ayahNumber}:`, error);
      
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
      }
    } finally {
      // Always reset loading state
      this.isLoading = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    }
  }
  
  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    if (!this.audioElement) return;
    
    if (this.isPlaying) {
      this.audioElement.pause();
    } else if (this.audioElement.readyState >= 2) { // HAVE_CURRENT_DATA or better
      this.audioElement.play().catch(error => {
        console.error('Error resuming playback:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
        }
      });
    }
  }
  
  /**
   * Stop playback
   */
  stop(): void {
    if (!this.audioElement) return;
    
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }
  
  /**
   * Register callback for play event
   */
  onPlay(callback: (() => void) | null): void {
    this.onPlayCallback = callback;
  }
  
  /**
   * Register callback for pause event
   */
  onPause(callback: (() => void) | null): void {
    this.onPauseCallback = callback;
  }
  
  /**
   * Register callback for end event
   */
  onEnd(callback: (() => void) | null): void {
    this.onEndCallback = callback;
  }
  
  /**
   * Register callback for loading state changes
   */
  onLoading(callback: ((isLoading: boolean) => void) | null): void {
    this.onLoadingCallback = callback;
  }
  
  /**
   * Register callback for errors
   */
  onError(callback: ((error: Error) => void) | null): void {
    this.onErrorCallback = callback;
  }
  
  /**
   * Get the currently playing surah number
   */
  getCurrentSurah(): number | null {
    return this.currentSurah;
  }
  
  /**
   * Check if audio is currently playing
   */
  isAudioPlaying(): boolean {
    return this.isPlaying;
  }
  
  /**
   * Check if audio is currently loading
   */
  isAudioLoading(): boolean {
    return this.isLoading;
  }
  
  /**
   * Set volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (!this.audioElement) return;
    
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * Get the current volume level
   */
  getVolume(): number {
    return this.audioElement?.volume || 1.0;
  }
  
  /**
   * Special method to play Al-Fatiha verses with guaranteed sources
   * This uses hardcoded, reliable URLs that are known to work
   * @param ayahNumber The ayah number in Surah Al-Fatiha (1-7)
   */
  private async playAlFatihaVerse(ayahNumber: number): Promise<void> {
    if (!this.audioElement) return;
    
    try {
      // Signal loading started
      this.isLoading = true;
      if (this.onLoadingCallback) this.onLoadingCallback(true);
      
      // Import the specialized fallback system dynamically
      const { getVerseFallbackUrls, playVerseWithFallbacks } = await import('./verseAudioFallbacks');
      
      // Stop any current playback
      this.stop();
      
      // Update current position
      this.currentSurah = 1; // Al-Fatiha is Surah 1
      
      // Create a new audio element to avoid any issues with the previous one
      if (!this.audioElement || this.audioElement.error) {
        this.audioElement = new Audio();
        this.setupAudioEventListeners();
      }
      
      // Get fallback URLs for Al-Fatiha specifically (Surah 1)
      const fallbackUrls = getVerseFallbackUrls(1, ayahNumber);
      
      // Try to play using our enhanced fallback system
      const playSuccess = await playVerseWithFallbacks(
        this.audioElement,
        fallbackUrls,
        // Success callback
        () => {
          console.log(`Successfully playing Al-Fatiha ayah ${ayahNumber}`);
          
          // Ensure the onPlay callback is triggered
          if (this.onPlayCallback) {
            this.onPlayCallback();
          }
          
          // Set up ended event for this specific playback
          const handleEnded = () => {
            this.audioElement?.removeEventListener('ended', handleEnded);
            if (this.onEndCallback) this.onEndCallback();
          };
          
          this.audioElement?.addEventListener('ended', handleEnded, { once: true });
        },
        // Error callback - just logs the error, we'll handle it below
        (error) => {
          console.warn(`Fallback system failed for Al-Fatiha ayah ${ayahNumber}:`, error);
        }
      );
      
      // If our fallback system failed, create a completely new Audio element as last resort
      if (!playSuccess) {
        try {
          console.log(`Trying emergency playback method for Al-Fatiha ayah ${ayahNumber}`);
          
          // Create an entirely new audio element disconnected from our events
          const emergencyAudio = new Audio();
          const paddedAyah = ayahNumber.toString().padStart(3, '0');
          
          // Special URL format specifically for problematic verse 3
          const emergencyUrl = ayahNumber === 3 
            ? `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/3` 
            : `https://cdn.islamic.network/quran/audio/128/ar.alafasy/1${ayahNumber}.mp3`;
          
          // Set up one-time event listeners for this emergency audio
          emergencyAudio.addEventListener('play', () => {
            if (this.onPlayCallback) this.onPlayCallback();
          }, { once: true });
          
          emergencyAudio.addEventListener('ended', () => {
            if (this.onEndCallback) this.onEndCallback();
          }, { once: true });
          
          // Try to play
          emergencyAudio.src = emergencyUrl;
          emergencyAudio.load();
          await emergencyAudio.play();
          return; // Return early since we've handled everything with our emergency audio
        } catch (emergencyError) {
          console.error(`Emergency playback failed for ayah ${ayahNumber}:`, emergencyError);
        }
      }
      
      // Handle final result if all methods failed
      if (!playSuccess) {
        const errorMsg = `Unable to play Al-Fatiha ayah ${ayahNumber} from any source`;
        console.error(errorMsg);
        
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(errorMsg));
        }
      }
      
      // Reset loading state
      this.isLoading = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    } catch (error) {
      console.error(`Error in playAlFatihaVerse for ayah ${ayahNumber}:`, error);
      
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
      }
      
      // Reset loading state
      this.isLoading = false;
      if (this.onLoadingCallback) this.onLoadingCallback(false);
    }
  }
}

// Singleton instance
let surahAudioPlayerInstance: EnhancedSurahAudioPlayer | null = null;

// Get or create player instance
export function getSurahAudioPlayer(): EnhancedSurahAudioPlayer {
  if (!surahAudioPlayerInstance) {
    surahAudioPlayerInstance = new EnhancedSurahAudioPlayer();
  }
  return surahAudioPlayerInstance;
}

export default getSurahAudioPlayer;