/**
 * Enhanced Juz Audio Player
 * Specialized player for handling Quranic Juz audio playback with multiple reciters
 * and error handling/fallback mechanisms
 */

import { playAlFatihaAyah, stopAudio } from './simpleAudioPlayer';

// Available audio sources for juz audio
export const JUZ_AUDIO_SOURCES = {
  // Primary audio sources - complete juz recitations
  PRIMARY: {
    getUrl: (reciter: string, juzNumber: number) => 
      `https://download.quranicaudio.com/quran/${reciter}/juz${juzNumber}.mp3`
  },
  // Secondary audio sources - verse by verse compilation
  SECONDARY: {
    getUrl: (reciter: string, juzNumber: number, surahNumber?: number, ayahNumber?: number) => {
      if (surahNumber && ayahNumber) {
        // If surah and ayah are provided, return specific ayah URL
        return `https://everyayah.com/data/${reciter}/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
      } else {
        // Otherwise return a generic juz URL from a different source
        return `https://verses.quran.com/juz/${juzNumber}/${reciter}.mp3`;
      }
    }
  },
  // Fallback audio sources
  FALLBACK: {
    getUrl: (reciter: string, juzNumber: number) => 
      `https://www.islamicnet.com/arabic-corpus/quran/mp3/${reciter}/juz_amma_juz_${juzNumber}.mp3`
  },
};

// Popular Quran reciters
export const RECITERS = {
  ALAFASY: 'ar.alafasy',
  MINSHAWI: 'ar.minshawi',
  HUSARY: 'ar.husary',
  SUDAIS: 'ar.abdurrahmaansudais',
  MUAIQLY: 'ar.abdulmuhsin',
};

/**
 * JuzAudioPlayer class for handling juz audio playback
 * Features:
 * - Multiple audio source fallbacks
 * - Event listeners for play/pause/error states
 * - Support for continuous playback of multiple juz
 */
class JuzAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private currentJuz: number | null = null;
  private isPlaying: boolean = false;
  private reciter: string = RECITERS.ALAFASY;
  private currentSource: keyof typeof JUZ_AUDIO_SOURCES = 'PRIMARY';
  private fallbackAttempts: number = 0;
  private maxFallbackAttempts: number = 3;
  
  // Event callbacks
  private onPlayCallback: (() => void) | null = null;
  private onPauseCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onLoadingCallback: ((juzNumber: number) => void) | null = null;
  
  constructor(reciter: string = RECITERS.ALAFASY) {
    this.reciter = reciter;
    
    // Create audio element on client-side only
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupEventListeners();
    }
  }
  
  /**
   * Set up event listeners for the audio element
   */
  private setupEventListeners(): void {
    if (!this.audioElement) return;
    
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.onPlayCallback) this.onPlayCallback();
    });
    
    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.onPauseCallback) this.onPauseCallback();
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    });
    
    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      
      // Try fallback sources if available
      if (this.fallbackAttempts < this.maxFallbackAttempts && this.currentJuz) {
        this.fallbackAttempts++;
        this.tryFallbackSource(this.currentJuz);
      } else {
        this.isPlaying = false;
        if (this.onErrorCallback) this.onErrorCallback('Failed to play audio after multiple attempts');
      }
    });
    
    this.audioElement.addEventListener('loadstart', () => {
      if (this.currentJuz !== null && this.onLoadingCallback) {
        this.onLoadingCallback(this.currentJuz);
      }
    });
  }
  
  /**
   * Try a fallback audio source
   * @param juzNumber The juz number to try fallback for
   */
  private tryFallbackSource(juzNumber: number): void {
    if (!this.audioElement) return;
    
    // Switch to next audio source based on fallback attempts
    const sources: (keyof typeof JUZ_AUDIO_SOURCES)[] = ['PRIMARY', 'SECONDARY', 'FALLBACK'];
    const nextSourceIndex = this.fallbackAttempts % sources.length;
    this.currentSource = sources[nextSourceIndex];
    
    // Get URL from the new source
    const url = JUZ_AUDIO_SOURCES[this.currentSource].getUrl(this.reciter, juzNumber);
    
    console.log(`Trying fallback source #${this.fallbackAttempts}: ${url}`);
    
    // Set new source and try to play
    this.audioElement.src = url;
    this.audioElement.load();
    this.audioElement.play().catch(err => {
      console.error('Error playing fallback source:', err);
    });
  }
  
  /**
   * Play a specific juz audio
   * @param juzNumber The juz number to play (1-30)
   */
  async playJuz(juzNumber: number): Promise<void> {
    if (!this.audioElement) {
      if (this.onErrorCallback) this.onErrorCallback('Audio player not initialized');
      return;
    }
    
    // Validate juz number
    if (juzNumber < 1 || juzNumber > 30) {
      if (this.onErrorCallback) this.onErrorCallback(`Invalid juz number: ${juzNumber}`);
      return;
    }
    
    // Stop any playing audio
    this.stop();
    
    // Reset fallback attempts
    this.fallbackAttempts = 0;
    this.currentSource = 'PRIMARY';
    this.currentJuz = juzNumber;
    
    try {
      // Get audio URL for this juz
      const url = JUZ_AUDIO_SOURCES.PRIMARY.getUrl(this.reciter, juzNumber);
      
      // Set source and play
      this.audioElement.src = url;
      this.audioElement.load();
      await this.audioElement.play();
    } catch (error) {
      console.error(`Error playing juz ${juzNumber}:`, error);
      // Initial error, try fallback
      this.fallbackAttempts++;
      this.tryFallbackSource(juzNumber);
    }
  }
  
  /**
   * Play a specific verse within a juz
   * @param juzNumber The juz number
   * @param surahNumber The surah number
   * @param ayahNumber The ayah number
   */
  async playVerse(juzNumber: number, surahNumber: number, ayahNumber: number): Promise<void> {
    if (!this.audioElement) {
      if (this.onErrorCallback) this.onErrorCallback('Audio player not initialized');
      return;
    }
    
    // Stop any playing audio
    this.stop();
    
    this.currentJuz = juzNumber;
    this.currentSource = 'SECONDARY';
    
    try {
      // Get URL for specific verse
      const url = JUZ_AUDIO_SOURCES.SECONDARY.getUrl(
        this.reciter, 
        juzNumber,
        surahNumber,
        ayahNumber
      );
      
      // Set source and play
      this.audioElement.src = url;
      this.audioElement.load();
      await this.audioElement.play();
    } catch (error) {
      console.error(`Error playing verse ${surahNumber}:${ayahNumber}:`, error);
      if (this.onErrorCallback) this.onErrorCallback(`Failed to play verse ${surahNumber}:${ayahNumber}`);
    }
  }
  
  /**
   * Pause audio playback
   */
  pause(): void {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
    }
  }
  
  /**
   * Resume audio playback if paused
   */
  resume(): void {
    if (this.audioElement && !this.isPlaying) {
      this.audioElement.play().catch(err => {
        console.error('Error resuming playback:', err);
      });
    }
  }
  
  /**
   * Toggle play/pause
   */
  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }
  
  /**
   * Stop audio playback completely
   */
  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
    }
  }
  
  /**
   * Change reciter
   * @param reciter New reciter ID
   */
  setReciter(reciter: string): void {
    this.reciter = reciter;
    
    // If currently playing, restart with new reciter
    const wasPlaying = this.isPlaying;
    const currentJuz = this.currentJuz;
    
    if (wasPlaying && currentJuz !== null) {
      this.stop();
      this.playJuz(currentJuz);
    }
  }
  
  /**
   * Set callback for play event
   * @param callback Function to call when audio plays
   */
  onPlay(callback: () => void): void {
    this.onPlayCallback = callback;
  }
  
  /**
   * Set callback for pause event
   * @param callback Function to call when audio pauses
   */
  onPause(callback: () => void): void {
    this.onPauseCallback = callback;
  }
  
  /**
   * Set callback for playback end
   * @param callback Function to call when audio ends
   */
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }
  
  /**
   * Set callback for error events
   * @param callback Function to call when audio errors occur
   */
  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }
  
  /**
   * Set callback for loading events
   * @param callback Function to call when audio starts loading
   */
  onLoading(callback: (juzNumber: number) => void): void {
    this.onLoadingCallback = callback;
  }
  
  /**
   * Clean up event listeners when component unmounts
   */
  cleanup(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement.load();
    }
  }
  
  /**
   * Check if audio is currently playing
   * @returns Boolean indicating playback state
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
  
  /**
   * Get the currently playing juz number
   * @returns Current juz number or null if none
   */
  getCurrentJuz(): number | null {
    return this.currentJuz;
  }
}

/**
 * Factory function to get a JuzAudioPlayer instance
 * @param reciter Optional reciter ID
 * @returns JuzAudioPlayer instance
 */
export default function getJuzAudioPlayer(reciter: string = RECITERS.ALAFASY): JuzAudioPlayer {
  return new JuzAudioPlayer(reciter);
}