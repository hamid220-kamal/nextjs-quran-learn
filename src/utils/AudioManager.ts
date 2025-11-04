import { type AudioSource } from './quranApi';

export class AudioLoadError extends Error {
  constructor(
    message: string,
    public code?: number,
    public sourceUrl?: string
  ) {
    super(message);
    this.name = 'AudioLoadError';
  }
}

export class AudioManager {
  private static TIMEOUT = 15000; // 15 seconds timeout
  private static VALID_MIME_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/wav'
  ];

  /**
   * Validate audio URL using HEAD request
   */
  static async validateAudioUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Accept': 'audio/mpeg,audio/mp3,audio/ogg,audio/wav',
          'Range': 'bytes=0-0' // Only request first byte to check availability
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Audio validation failed for ${url}:`, response.status);
        return false;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !this.VALID_MIME_TYPES.some(type => contentType.includes(type))) {
        console.warn(`Invalid content type for ${url}:`, contentType);
        return false;
      }

      return true;
    } catch (error) {
      console.warn(`Error validating audio URL ${url}:`, error);
      return false;
    }
  }

  /**
   * Test if audio format is supported by the browser
   */
  static isFormatSupported(type: string): boolean {
    const audio = document.createElement('audio');
    return audio.canPlayType(type) !== '';
  }

  /**
   * Preload audio metadata to verify playability
   */
  static async preloadAudio(sources: AudioSource[]): Promise<HTMLAudioElement> {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    // Filter sources to only include supported formats
    const supportedSources = sources.filter(source => 
      this.isFormatSupported(source.type)
    );

    if (supportedSources.length === 0) {
      throw new AudioLoadError('No supported audio formats available');
    }

    // Try loading each source until one works
    for (const source of supportedSources) {
      try {
        const isValid = await this.validateAudioUrl(source.url);
        if (!isValid) continue;

        // Create a promise that resolves when the audio is ready or rejects on error
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new AudioLoadError('Audio load timeout', undefined, source.url));
          }, this.TIMEOUT);

          audio.src = source.url;

          const handleSuccess = () => {
            clearTimeout(timeoutId);
            cleanup();
            resolve(true);
          };

          const handleError = (e: ErrorEvent) => {
            clearTimeout(timeoutId);
            cleanup();
            reject(new AudioLoadError(
              'Failed to load audio',
              (e.target as HTMLAudioElement)?.error?.code,
              source.url
            ));
          };

          const cleanup = () => {
            audio.removeEventListener('canplaythrough', handleSuccess);
            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('canplaythrough', handleSuccess, { once: true });
          audio.addEventListener('error', handleError, { once: true });
          
          audio.load();
        });

        // If we get here, the source loaded successfully
        return audio;
      } catch (error) {
        console.warn(`Failed to load audio source ${source.url}:`, error);
        // Continue to next source
      }
    }

    throw new AudioLoadError('All audio sources failed to load');
  }

  /**
   * Play audio with proper error handling
   */
  static async playAudio(audio: HTMLAudioElement): Promise<void> {
    try {
      // Ensure audio is not in an error state
      if (audio.error) {
        throw new AudioLoadError('Audio is in error state', audio.error.code);
      }

      // Reset audio to start if it was previously played
      if (!audio.paused) {
        audio.pause();
      }
      audio.currentTime = 0;

      // Attempt to play with timeout
      const playPromise = audio.play();
      if (playPromise) {
        await Promise.race([
          playPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Play timeout')), this.TIMEOUT)
          )
        ]);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      throw new AudioLoadError(
        error.message || 'Failed to play audio',
        audio.error?.code
      );
    }
  }

  /**
   * Create audio element with sources and error handling
   */
  static createAudioElement(sources: AudioSource[]): HTMLAudioElement {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    // Add all supported sources
    sources
      .filter(source => this.isFormatSupported(source.type))
      .forEach(source => {
        const sourceElement = document.createElement('source');
        sourceElement.src = source.url;
        sourceElement.type = source.type;
        audio.appendChild(sourceElement);
      });

    return audio;
  }
}