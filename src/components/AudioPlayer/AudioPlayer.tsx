'use client';

import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

interface AudioPlayerProps {
  surah: number;
  verse: number;
  reciterId: string;
  onError?: (error: string) => void;
}

interface AudioResponse {
  status: 'success';
  data: {
    audioUrl: string;
    metadata: {
      surah: number;
      verse: number;
      reciter: string;
    }
  }
}
import { fetchQuranAudio } from '@/utils/quranAudio';

interface AudioPlayerProps {
  reciterId: string;
  surahNumber: number;
  verseNumber: number;
  onEnded: () => void;
  autoPlay?: boolean;
  totalVerses: number;
  onVerseChange: (verse: number) => void;
}

export default function AudioPlayer({ reciterId, surahNumber, verseNumber, onEnded, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowUp' && volume < 1) {
        e.preventDefault();
        setVolume(prev => Math.min(1, prev + 0.1));
      } else if (e.code === 'ArrowDown' && volume > 0) {
        e.preventDefault();
        setVolume(prev => Math.max(0, prev - 0.1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
      const fetchAudioUrl = async () => {
      try {
        console.log('Fetching audio for:', { surahNumber, verseNumber, reciterId });
        setError(null);
        setIsPlaying(false);
        setProgress(0);
        
        // Show loading state
        setAudioUrl('');
        
        const result = await fetchQuranAudio(surahNumber, verseNumber, reciterId);
        
        if (result.status === 'success' && result.data?.audioUrl) {
          const audioUrl = result.data.audioUrl;
          console.log('Received audio URL:', audioUrl);
          
          // Verify the audio URL is accessible and is an MP3
          try {
            const response = await fetch(audioUrl, {
              method: 'HEAD',
              headers: {
                'Accept': 'audio/mpeg',
                'Range': 'bytes=0-0' // Request just the first byte to check format
              }
            });

            if (!response.ok) {
              throw new Error('Audio file not accessible');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('audio')) {
              throw new Error('Invalid audio format');
            }

            // Create an Audio object to test playability
            // Test audio playability
            const testAudio = new Audio();
            try {
              await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                  reject(new Error('Audio load timed out'));
                }, 5000);

                testAudio.oncanplaythrough = () => {
                  clearTimeout(timeoutId);
                  resolve(true);
                };

                testAudio.onerror = () => {
                  clearTimeout(timeoutId);
                  reject(new Error('Failed to load audio source'));
                };

                testAudio.src = audioUrl;
              });
            } finally {
              testAudio.src = '';  // Clean up
            }

            // If we get here, the audio loaded successfully
            setAudioUrl(audioUrl);
            console.log('Audio URL validated and set:', audioUrl);          } catch (audioError) {
            console.error('Audio validation failed:', audioError);
            throw new Error('Audio format not supported');
          } finally {
            testAudio.src = ''; // Clean up
          }
        } else {
          throw new Error(result.error || 'Failed to fetch audio');
        }
      } catch (err) {
        console.error('Audio fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load audio');
        setAudioUrl('');
        
        // Try everyayah.com CDN URL directly
        try {
          const paddedSurah = surahNumber.toString().padStart(3, '0');
          const paddedVerse = verseNumber.toString().padStart(3, '0');
          const alternativeUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedVerse}.mp3`;
          
          console.log('Trying alternative URL:', alternativeUrl);
          const testAudio = new Audio();
          
          await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              testAudio.src = '';
              reject(new Error('Alternative audio load timed out'));
            }, 5000);

            testAudio.oncanplaythrough = () => {
              clearTimeout(timeoutId);
              resolve(true);
            };

            testAudio.onerror = () => {
              clearTimeout(timeoutId);
              reject(new Error('Failed to load alternative audio source'));
            };

            testAudio.src = alternativeUrl;
          });

          // If we get here, the alternative URL worked
          setAudioUrl(alternativeUrl);
          setError(null);
          console.log('Alternative audio URL set successfully');
        } catch (altError) {
          console.error('Alternative audio URL also failed:', altError);
          setError('Could not load audio from any source');
        }
      }
    };

    if (surahNumber && verseNumber && reciterId) {
      fetchAudioUrl();
    }
  }, [reciterId, surahNumber, verseNumber]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleCanPlay = () => {
        console.log('Audio can play now');
        if (autoPlay) {
          audio.play().catch(e => console.error('Auto-play failed:', e));
        }
      };

      const handleLoadedMetadata = () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      const handleEnded = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        onEnded();
      };

      const handleError = (e: ErrorEvent) => {
        console.error('Audio error:', e);
        setError(`Audio playback error: ${audio.error?.message || 'Unknown error'}`);
      };

      // Add all event listeners
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Clean up
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioUrl, autoPlay, onEnded]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * duration;
      audioRef.current.currentTime = newTime;
      setProgress(clickPosition * 100);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return <div className="audio-error">{error}</div>;
  }

  return (
    <div className="audio-player">
      <source 
        src={audioUrl} 
        type="audio/mpeg" 
      />
      <audio 
        ref={audioRef} 
        preload="auto"
        playsInline
        controlsList="nodownload"
        onError={(e) => {
          const audioElement = e.currentTarget;
          console.error('Audio element error:', {
            error: audioElement.error,
            networkState: audioElement.networkState,
            readyState: audioElement.readyState,
            src: audioElement.src
          });
          setError(`Failed to load audio: ${audioElement.error?.message || 'Unknown error'}`);
        }}
      />
      
      <div className="progress-container" onClick={handleProgressClick}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="controls">
        <button 
          className="play-pause-button" 
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        
        <div className="time-display">
          <span>{formatTime(duration * (progress / 100))}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume-control">
          <button 
            className="volume-button"
            onClick={() => setVolume(volume > 0 ? 0 : 1)}
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            )}
          </button>
          
          <div className="volume-slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              className="volume-slider"
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
