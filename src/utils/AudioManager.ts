import { type AudioSource } from './quranApi';

export class AudioLoadError extends Error {
  constructor(
    message: string,
    public code?: number,
    public sourceUrl?: string,
    public originalError?: string
  ) {
    super(message);
    this.name = 'AudioLoadError';
  }
}

interface AudioCheckOptions {
  maxAttempts: number;
  timeout: number;
}

export class AudioManager {
  private static readonly TIMEOUT = 30000; // 30 seconds timeout
  private static readonly VALID_MIME_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/wav',
    'audio/x-wav',
    'audio/x-m4a',
    'audio/aac',
    'application/octet-stream' // Some CDNs use this
  ];

  private static readonly DEFAULT_CHECK_OPTIONS: AudioCheckOptions = {
    maxAttempts: 5, // Increased retries
    timeout: 10000  // Increased timeout
  };

  // Cache for successful audio loads
  private static audioCache: Map<string, HTMLAudioElement> = new Map();

  /**
   * Validate audio URL using HEAD request
   */
  private static async validateWithFallback(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout

    try {
      const headers = {
        'Accept': '*/*', // Accept any content type
        'Range': 'bytes=0-0'
      };

      // Try fetch with different strategies
      const strategies = [
        // Strategy 1: Simple HEAD request
        async () => {
          const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors' // Try no-cors first
          });
          return response;
        },
        
        // Strategy 2: GET with range
        async () => {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              ...headers,
              'Range': 'bytes=0-1024'
            },
            signal: controller.signal,
            mode: 'cors'
          });
          return response;
        },
        
        // Strategy 3: Direct audio element test
        async () => {
          return new Promise<Response>((resolve, reject) => {
            const audio = new Audio();
            audio.crossOrigin = 'anonymous';
            
            const audioTimeoutId = setTimeout(() => {
              cleanup();
              reject(new Error('Audio load timeout'));
            }, 5000);
            
            const cleanup = () => {
              audio.removeEventListener('loadedmetadata', handleLoad);
              audio.removeEventListener('error', handleError);
              clearTimeout(audioTimeoutId);
            };
            
            const handleLoad = () => {
              cleanup();
              resolve(new Response(null, { status: 200 }));
            };
            
            const handleError = () => {
              cleanup();
              reject(new Error('Audio load failed'));
            };
            
            audio.addEventListener('loadedmetadata', handleLoad);
            audio.addEventListener('error', handleError);
            
            try {
              audio.src = url;
            } catch (e) {
              cleanup();
              reject(e);
            }
          });
        }
      ];

      // Try each strategy
      for (const strategy of strategies) {
        try {
          const response = await strategy();
          if (response.ok || response.status === 206 || response.type === 'opaque') {
            clearTimeout(timeoutId);
            return response;
          }
        } catch (strategyError) {
          console.warn('Strategy failed:', strategyError);
          continue;
        }
      }

      throw new Error('All validation strategies failed');
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Validation timeout');
      }
      throw error;
    }
  }

  static async validateAudioUrl(url: string): Promise<boolean> {
    const maxAttempts = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Try different validation strategies
        const strategies = [
          // Strategy 1: Validate with fetch
          async () => {
            const response = await this.validateWithFallback(url);
            if (response.ok || response.status === 206) {
              const contentType = response.headers.get('content-type');
              // Accept any audio type or application/octet-stream
              return !contentType || 
                     contentType.includes('audio/') || 
                     contentType.includes('application/octet-stream') ||
                     this.VALID_MIME_TYPES.some(type => contentType.includes(type));
            }
            return false;
          },
          
          // Strategy 2: Direct audio element test
          async () => {
            const audio = new Audio();
            audio.crossOrigin = 'anonymous';
            audio.preload = 'metadata';
            audio.src = url;
            
            return new Promise<boolean>((resolve) => {
              const timeoutId = setTimeout(() => resolve(false), 5000);
              
              audio.addEventListener('loadedmetadata', () => {
                clearTimeout(timeoutId);
                resolve(true);
              }, { once: true });
              
              audio.addEventListener('error', () => {
                clearTimeout(timeoutId);
                resolve(false);
              }, { once: true });
              
              // Force load attempt
              audio.load();
            });
          },
          
          // Strategy 3: XMLHttpRequest with range request
          async () => {
            return new Promise<boolean>((resolve) => {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', url);
              xhr.setRequestHeader('Range', 'bytes=0-1024');
              
              xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
              xhr.onerror = () => resolve(false);
              xhr.timeout = 5000;
              xhr.ontimeout = () => resolve(false);
              
              try {
                xhr.send();
              } catch (e) {
                resolve(false);
              }
            });
          }
        ];
        
        // Try each strategy until one succeeds
        for (const strategy of strategies) {
          try {
            if (await strategy()) {
              return true;
            }
          } catch (strategyError) {
            console.warn(`Strategy failed:`, strategyError);
            continue;
          }
        }
        
        // If we get here, all strategies failed for this attempt
        if (attempt < maxAttempts - 1) {
          // Wait before next attempt with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
        
      } catch (error) {
        console.warn(`Validation attempt ${attempt + 1} failed for ${url}:`, error);
        lastError = error;
        
        if (attempt < maxAttempts - 1) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // If we get here, all attempts failed
    console.error(`All validation attempts failed for ${url}`, lastError);
    return false;
  }

  /**
   * Test if audio format is supported by the browser
   */
  static isFormatSupported(type: string): boolean {
    const audio = document.createElement('audio');
    const support = audio.canPlayType(type);
    return support !== '' && support !== 'no';
  }

  /**
   * Check audio source availability with retries
   */
  static async checkAudioSource(
    url: string, 
    options: AudioCheckOptions = this.DEFAULT_CHECK_OPTIONS
  ): Promise<boolean> {
    return this.validateAudioUrl(url);
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
    audio.preload = 'auto'; // Changed to auto for better loading
    audio.crossOrigin = 'anonymous';

    // Add debug event listeners
    audio.addEventListener('error', (e) => {
      const err = (e.target as HTMLAudioElement).error;
      console.warn('Audio error:', {
        code: err?.code,
        message: err?.message,
        url: audio.currentSrc || audio.src
      });
    });

    audio.addEventListener('loadstart', () => console.log('Audio loading started'));
    audio.addEventListener('loadedmetadata', () => console.log('Audio metadata loaded'));
    audio.addEventListener('canplay', () => console.log('Audio can start playing'));
    audio.addEventListener('canplaythrough', () => console.log('Audio can play through'));

    // Add all supported sources
    const supportedSources = sources.filter(source => this.isFormatSupported(source.type));
    
    if (supportedSources.length === 0) {
      console.warn('No supported audio sources found', { sources });
      // Add MP3 as fallback type if no supported types found
      supportedSources.push(...sources.map(source => ({ ...source, type: 'audio/mpeg' })));
    }

    supportedSources.forEach(source => {
      const sourceElement = document.createElement('source');
      sourceElement.src = source.url;
      sourceElement.type = source.type;
      sourceElement.addEventListener('error', (e) => {
        console.warn(`Source error for ${source.url}:`, e);
      });
      audio.appendChild(sourceElement);
    });

    return audio;
  }

  /**
   * Create and load an audio element with error handling and retries
   */
  static async createAndLoadAudio(sources: AudioSource[]): Promise<HTMLAudioElement> {
    // Generate cache key from source URLs
    const cacheKey = sources.map(s => s.url).join(',');
    
    // Try to get from cache first
    const cachedAudio = this.audioCache.get(cacheKey);
    if (cachedAudio) {
      console.log('Using cached audio');
      return cachedAudio;
    }

    // Initialize error tracking
    let lastError: Error | null = null;
    let loadingErrors: string[] = [];

    // Try each source with multiple strategies
    for (const source of sources) {
      try {
        // First check if the URL is accessible
        const isValid = await this.validateAudioUrl(source.url);
        if (!isValid) {
          console.warn(`Source URL not valid: ${source.url}`);
          continue;
        }

        // Create audio element with enhanced error handling
        const audio = new Audio();
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';

        // Add enhanced error handling
        audio.onerror = (event: Event) => {
          const target = event.target as HTMLMediaElement;
          const mediaError = target.error;
          console.error('Audio error:', {
            code: mediaError?.code,
            message: mediaError?.message,
            currentTime: target.currentTime,
            readyState: target.readyState,
            networkState: target.networkState,
            src: target.src
          });
        };

        console.log(`Attempting to load audio from ${source.url}`);

        const loadResult = await new Promise<HTMLAudioElement>((resolve, reject) => {
          const loadTimeout = setTimeout(() => {
            cleanup();
            reject(new Error('Audio load timeout'));
          }, this.TIMEOUT);

          let loadStarted = false;
          let metadataLoaded = false;
          let canPlay = false;
          let buffering = false;

          const handleLoadStart = () => {
            loadStarted = true;
            console.log(`Loading started for ${source.url}`);
          };

          const handleLoadedMetadata = () => {
            metadataLoaded = true;
            console.log('Metadata loaded:', {
              duration: audio.duration,
              readyState: audio.readyState
            });
          };

          const handleCanPlay = () => {
            canPlay = true;
            console.log('Can start playing');
          };

          const handleProgress = () => {
            try {
              const buffered = audio.buffered;
              if (buffered && buffered.length > 0) {
                const percent = (buffered.end(0) / audio.duration) * 100;
                console.log(`Loading progress: ${Math.round(percent)}%`);
                
                // If we've buffered enough to start playing
                if (percent >= 10 && canPlay) {
                  clearTimeout(loadTimeout);
                  cleanup();
                  resolve(audio);
                }
              }
            } catch (e) {
              console.warn('Error calculating buffer progress:', e);
            }
          };

          const handleSuccess = () => {
            console.log(`Successfully loaded audio from ${source.url}`);
            clearTimeout(loadTimeout);
            cleanup();
            resolve(audio);
          };

          const handleError = (e: Event) => {
            const target = e.target as HTMLMediaElement;
            const mediaError = target.error;
            const errorMsg = `Load failed: ${mediaError?.message || 'Unknown error'} (code: ${mediaError?.code || 'none'})`;
            const errorDetails = {
              loadStarted,
              metadataLoaded,
              canPlay,
              buffering,
              readyState: target.readyState,
              networkState: target.networkState,
              currentTime: target.currentTime,
              src: target.src
            };
            console.error('Audio load error details:', errorDetails);
            loadingErrors.push(errorMsg);
            clearTimeout(loadTimeout);
            cleanup();
            reject(new Error(errorMsg));
          };

          const cleanup = () => {
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('canplaythrough', handleSuccess);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('progress', handleProgress);
          };

          // Set source and type
          audio.src = source.url;
          
          // Add comprehensive event listeners
          audio.addEventListener('loadstart', handleLoadStart);
          audio.addEventListener('loadedmetadata', handleLoadedMetadata);
          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('canplaythrough', handleSuccess);
          audio.addEventListener('error', handleError);
          audio.addEventListener('progress', handleProgress);
          audio.addEventListener('waiting', () => {
            buffering = true;
            console.log('Audio buffering...');
          });
          audio.addEventListener('playing', () => {
            buffering = false;
            console.log('Audio playing...');
          });

          // Set source and force load
          try {
            audio.src = source.url;
            audio.load();
          } catch (e) {
            console.error('Error during audio.load():', e);
            cleanup();
            reject(new Error('Failed to initialize audio loading'));
          }
        });

        // If successful, cache and return
        this.audioCache.set(cacheKey, loadResult);
        return loadResult;

      } catch (error) {
        console.warn(`Failed to load audio from ${source.url}:`, error);
        lastError = error as Error;
        
        // Try alternate loading strategy with fetch
        try {
          console.log(`Attempting fetch strategy for ${source.url}`);
          const response = await fetch(source.url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const audio = new Audio(blobUrl);
          
          // Verify the audio can actually play
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Verify timeout')), 5000);
            
            audio.addEventListener('canplaythrough', () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });
            
            audio.addEventListener('error', () => {
              clearTimeout(timeout);
              reject(new Error('Verify failed'));
            }, { once: true });
            
            audio.load();
          });
          
          // If we get here, the audio is valid
          this.audioCache.set(cacheKey, audio);
          return audio;
        } catch (fetchError) {
          console.warn(`Fetch strategy failed for ${source.url}:`, fetchError);
          loadingErrors.push(fetchError.message);
        }
      }
    }

    // If we get here, all strategies failed
    const errorDetail = loadingErrors.join('; ');
    throw new AudioLoadError(
      'All audio sources failed to load',
      undefined,
      sources[0]?.url,
      errorDetail
    );
  }
}