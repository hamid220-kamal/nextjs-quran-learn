'use client';

import { useState, useEffect } from 'react';
import { EDITIONS } from '../../../utils/quranApi';
import getQuranAudioPlayer from '../../../utils/quranAudioPlayer';

import type { QuranAudioPlayer } from '../../../utils/quranAudioPlayer';

interface QuranAudioPlayerProps {
  surah: {
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
  };
  currentAyah?: number;
  onAyahChange?: (ayahNumber: number) => void;
  audioPlayerInstance?: QuranAudioPlayer;
}

export default function QuranAudioPlayerUI({
  surah,
  currentAyah = 1,
  onAyahChange,
  audioPlayerInstance
}: QuranAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(currentAyah);
  const [currentReciter, setCurrentReciter] = useState<string>(EDITIONS.AUDIO_ALAFASY);
  const [playingMode, setPlayingMode] = useState<'ayah' | 'surah'>('ayah');
  const [showControls, setShowControls] = useState(false);
  
  // Available reciters
  const reciters = [
    { key: EDITIONS.AUDIO_ALAFASY, name: 'Mishary Rashid Alafasy' },
    { key: EDITIONS.AUDIO_MINSHAWI, name: 'Mohamed Siddiq Al-Minshawi' },
    { key: EDITIONS.AUDIO_HUSARY, name: 'Mahmoud Khalil Al-Husary' },
    { key: EDITIONS.AUDIO_MUAIQLY, name: 'Maher Al Muaiqly' },
    { key: EDITIONS.AUDIO_SUDAIS, name: 'Abdur-Rahman As-Sudais' }
  ];
  
  // Get the audio player instance, either from props or create a new one
  const audioPlayer = audioPlayerInstance || getQuranAudioPlayer();
  
  // Set up event listeners
  useEffect(() => {
    // Set initial audio edition
    audioPlayer.setAudioEdition(currentReciter);
    
    // Register event listeners
    audioPlayer.onPlay(() => setIsPlaying(true));
    audioPlayer.onPause(() => setIsPlaying(false));
    audioPlayer.onLoading((loading) => setIsLoading(loading));
    
    return () => {
      // Clean up event listeners only, not the entire player
      audioPlayer.onPlay(null);
      audioPlayer.onPause(null);
      audioPlayer.onLoading(null);
      audioPlayer.onEnd(null);
    };
  }, [audioPlayer, currentReciter]);
  
  // Separate useEffect for the onEnd handler since it depends on more variables
  useEffect(() => {
    const handleEnd = () => {
      if (playingMode === 'ayah' && selectedAyah < surah.numberOfAyahs) {
        // Move to next ayah
        const nextAyah = selectedAyah + 1;
        setSelectedAyah(nextAyah);
        if (onAyahChange) onAyahChange(nextAyah);
      } else {
        setIsPlaying(false);
      }
    };
    
    audioPlayer.onEnd(handleEnd);
    
    return () => {
      // Clean up only this event listener
      audioPlayer.onEnd(null);
    };
  }, [audioPlayer, playingMode, selectedAyah, surah.numberOfAyahs, onAyahChange]);
  
  // Update audio edition when reciter changes
  useEffect(() => {
    audioPlayer.setAudioEdition(currentReciter);
  }, [audioPlayer, currentReciter]);
  
  // Play or pause audio
  const togglePlayPause = async () => {
    if (isPlaying) {
      audioPlayer.togglePlayPause();
    } else {
      setError(null);
      setIsLoading(true);
      
      try {
        if (playingMode === 'ayah') {
          await audioPlayer.playAyah(surah.number, selectedAyah);
        } else {
          await audioPlayer.playSurah(surah.number);
        }
      } catch (error) {
        console.error("Error toggling play/pause:", error);
        setError("Could not play audio. Please try another reciter.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Play a specific ayah
  const playAyah = async (ayahNumber: number) => {
    setSelectedAyah(ayahNumber);
    setPlayingMode('ayah');
    setError(null);
    setIsLoading(true);
    
    try {
      await audioPlayer.playAyah(surah.number, ayahNumber);
      if (onAyahChange) onAyahChange(ayahNumber);
    } catch (error) {
      console.error(`Error playing ayah ${ayahNumber}:`, error);
      setError(`Could not play verse ${ayahNumber}. Please try another reciter.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Play the entire surah
  const playSurah = async () => {
    setPlayingMode('surah');
    setError(null);
    setIsLoading(true);
    
    try {
      await audioPlayer.playSurah(surah.number);
    } catch (error) {
      console.error(`Error playing surah ${surah.number}:`, error);
      setError(`Could not play Surah ${surah.englishName}. Please try another reciter.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change reciter
  const handleReciterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentReciter(event.target.value);
  };
  
  return (
    <div className={`quran-audio-player ${showControls ? 'expanded' : 'collapsed'}`}>
      <div className="player-toggle" onClick={() => setShowControls(!showControls)}>
        {showControls ? 'Hide Audio Player' : 'Show Audio Player'}
      </div>
      
      {showControls && (
        <div className="player-controls">
          <div className="player-header">
            <h3>{surah.englishName} ({surah.name})</h3>
            <div className="reciter-selector">
              <label htmlFor="reciter-select">Reciter:</label>
              <select 
                id="reciter-select" 
                value={currentReciter} 
                onChange={handleReciterChange}
              >
                {reciters.map(reciter => (
                  <option key={reciter.key} value={reciter.key}>
                    {reciter.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="player-main">
            <button 
              className={`play-button ${isPlaying ? 'pause' : isLoading ? 'loading' : 'play'}`} 
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={isLoading}
            >
              {isLoading ? '⟳' : isPlaying ? '❚❚' : '▶'}
            </button>
            
            <div className="play-options">
              <button 
                className={`option-button ${playingMode === 'ayah' ? 'active' : ''}`}
                onClick={() => playAyah(selectedAyah)}
                disabled={isLoading}
              >
                Play Verse {selectedAyah}
              </button>
              <button 
                className={`option-button ${playingMode === 'surah' ? 'active' : ''}`}
                onClick={playSurah}
                disabled={isLoading}
              >
                Play Entire Surah
              </button>
            </div>
          </div>
          
          {error && (
            <div className="player-error">
              <p>{error}</p>
              <button 
                className="error-action" 
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="ayah-selector">
            <label>Select Verse:</label>
            <div className="ayah-numbers">
              {Array.from({ length: Math.min(20, surah.numberOfAyahs) }, (_, i) => (
                <button 
                  key={i + 1}
                  className={`ayah-number-button ${selectedAyah === i + 1 ? 'selected' : ''}`}
                  onClick={() => playAyah(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              {surah.numberOfAyahs > 20 && (
                <span className="more-ayahs">...{surah.numberOfAyahs}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}