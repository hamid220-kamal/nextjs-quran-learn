'use client';

import { useState, useEffect, useRef } from 'react';
import getSurahAudioPlayer from '../../../utils/enhancedSurahAudio';
import './SurahAudioControls.css';

interface SurahAudioControlsProps {
  surah: {
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
  };
}

export default function SurahAudioControls({
  surah
}: SurahAudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use useRef to ensure stable reference to the audio player across renders
  const audioPlayerRef = useRef(getSurahAudioPlayer());
  
  // Get the audio player from our ref
  const audioPlayer = audioPlayerRef.current;
  
  // Set up event listeners
  useEffect(() => {
    // Register event listeners
    audioPlayer.onPlay(() => setIsPlaying(true));
    audioPlayer.onPause(() => setIsPlaying(false));
    audioPlayer.onEnd(() => setIsPlaying(false));
    audioPlayer.onLoading((loading) => setIsLoading(loading));
    audioPlayer.onError((error) => {
      console.error('Audio player error:', error);
      setError('Audio playback error. Trying another source...');
      // Clear error message after 3 seconds unless a new one appears
      setTimeout(() => setError(null), 3000);
    });
    return () => {
      // Clean up event listeners
      audioPlayer.onPlay(null);
      audioPlayer.onPause(null);
      audioPlayer.onEnd(null);
      audioPlayer.onLoading(null);
      audioPlayer.onError(null);
    };
  }, [audioPlayer]);

  // Play entire surah
  const playSurah = async () => {
    setError(null);
    
    try {
      await audioPlayer.playSurah(surah.number);
    } catch (error) {
      console.error(`Error playing surah ${surah.number}:`, error);
      setError('Could not play this Surah. Please try again later.');
    }
  };

  // Stop playback
  const stopPlayback = () => {
    audioPlayer.stop();
  };

  return (
    <div className="surah-audio-controls">
      <div className="controls-container">
        <div className="playback-buttons">
          {!isPlaying ? (
            <button 
              className={`play-button ${isLoading ? 'loading' : ''}`}
              onClick={playSurah}
              disabled={isLoading}
              aria-label="Play entire Surah"
            >
              {!isLoading && (
                <>
                  <span className="play-icon">▶</span>
                  <span>Auto-Play Surah</span>
                </>
              )}
            </button>
          ) : (
            <button 
              className="stop-button"
              onClick={stopPlayback}
              aria-label="Stop playback"
            >
              <span className="stop-icon">■</span>
              <span>Stop</span>
            </button>
          )}

          <a href="/quran" className="back-button">
            <span className="back-icon">←</span>
            <span>Back to Quran</span>
          </a>
        </div>
        
        {error && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}