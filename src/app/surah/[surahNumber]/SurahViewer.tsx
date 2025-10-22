'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchSurah, fetchSurahWithTranslation, EDITIONS } from '../../../utils/quranApi';
import SurahAudioControls from './SurahAudioControls';
import getSurahAudioPlayer from '../../../utils/enhancedSurahAudio';
import { playAlFatihaAyah, stopAudio } from '../../../utils/simpleAudioPlayer';
import './SurahViewer.css';
import './AudioTranslationControls.css';
import './audio-button.css';
import './SurahAudioControls.css';
import './SurahControlsLayout.css';

interface SurahViewerProps {
  surahNumber: number;
}

export default function SurahViewer({ surahNumber }: SurahViewerProps) {
  // State to track the currently playing verse during auto-play
  // Used for highlighting and button synchronization
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [surah, setSurah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Translation is always shown
  const [currentTranslation] = useState(EDITIONS.ENGLISH);
  
  // Verse audio playback state
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [loadingVerse, setLoadingVerse] = useState<number | null>(null);
  
  // Use ref for stable audio player reference
  const verseAudioPlayerRef = useRef(getSurahAudioPlayer());
  
  // Set up audio player event listeners for verse-specific playback
  useEffect(() => {
    const audioPlayer = verseAudioPlayerRef.current;
    
    // Register event listeners
    audioPlayer.onPlay(() => {
      // Clear loading state
      setLoadingVerse(null);
    });
    
    audioPlayer.onPause(() => {
      // Clear playing state
      setPlayingVerse(null);
    });
    
    audioPlayer.onEnd(() => {
      // Clear playing state
      setPlayingVerse(null);
    });
    
    audioPlayer.onError(() => {
      // Clear states on error
      setLoadingVerse(null);
      setPlayingVerse(null);
    });
    
    return () => {
      // Clean up event listeners and stop any playing audio
      audioPlayer.onPlay(null);
      audioPlayer.onPause(null);
      audioPlayer.onEnd(null);
      audioPlayer.onError(null);
      audioPlayer.stop();
      
      // Also clean up any active Al-Fatiha audio
      stopAudio(activeAudioRef.current);
      activeAudioRef.current = null;
    };
  }, []);
  
  // Cleanup when component unmounts or surah changes
  useEffect(() => {
    return () => {
      // Stop any active Al-Fatiha audio when component unmounts or surah changes
      stopAudio(activeAudioRef.current);
      activeAudioRef.current = null;
    };
  }, [surahNumber]);
  
  useEffect(() => {
    const loadSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch surah with translation
        const surahData = await fetchSurahWithTranslation(surahNumber, currentTranslation);
        setSurah(surahData);
      } catch (err) {
        setError(`Failed to load Surah ${surahNumber}. Please try again.`);
        console.error(`Error loading Surah ${surahNumber}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSurah();
  }, [surahNumber, currentTranslation]); // fetchSurahWithTranslation is stable, it's imported
  
  // State for error notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Reference for active audio elements (for Al-Fatiha special handling)
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Handle playing a specific verse
  // If auto-play is active, clicking a verse button overrides auto-play
  const playVerse = async (ayahNumber: number, index?: number) => {
    // Clear any previous error messages
    setErrorMessage(null);
    
    try {
      // If auto-play is active, override and stop auto-play
      if (currentVerseIndex !== null) {
        setCurrentVerseIndex(null);
      }
      // Special handling for Al-Fatiha
      if (surahNumber === 1) {
        // If this verse is already playing, stop it
        if (playingVerse === ayahNumber) {
          stopAudio(activeAudioRef.current);
          activeAudioRef.current = null;
          setPlayingVerse(null);
          return;
        }
        
        // If any other verse is playing, stop it first
        if (playingVerse !== null) {
          stopAudio(activeAudioRef.current);
          activeAudioRef.current = null;
          setPlayingVerse(null);
        }
        
        // Set loading state
        setLoadingVerse(ayahNumber);
        console.log(`Loading Al-Fatiha verse ${ayahNumber} using simple player`);
        
        let retryCount = 0;
        const maxRetries = 2;
        
        const tryPlayAlFatiha = async (): Promise<void> => {
          try {
            // Try to play using the simple player
            const audioElement = await playAlFatihaAyah(ayahNumber);
            
            // Store the audio element reference
            activeAudioRef.current = audioElement;
            
            // Set up event listeners
            audioElement.addEventListener('ended', () => {
              setPlayingVerse(null);
              activeAudioRef.current = null;
              setCurrentVerseIndex(null); // Remove highlight when audio ends
            });
            
            audioElement.addEventListener('error', () => {
              console.warn(`Audio element error for Al-Fatiha ayah ${ayahNumber}`);
              setPlayingVerse(null);
              activeAudioRef.current = null;
              setLoadingVerse(null);
            });
            
        // Update state
        setPlayingVerse(ayahNumber);
        setLoadingVerse(null);
        if (typeof index === 'number') setCurrentVerseIndex(index);
          } catch (error) {
            // Attempt retry if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++;
              setErrorMessage(`Retrying verse ${ayahNumber}... (${retryCount}/${maxRetries})`);
              
              // Wait a moment before retrying
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Try again
              return tryPlayAlFatiha();
            }
            
            console.error(`Simple player failed for Al-Fatiha ayah ${ayahNumber} after ${retryCount} retries:`, error);
            
            // Special message for verse 1, which is particularly problematic
            if (ayahNumber === 1) {
              setErrorMessage(`Note: Audio for the first verse may not be available. Try other verses.`);
            } else {
              setErrorMessage(`Could not play verse ${ayahNumber}. Please try again later.`);
            }
            
            setLoadingVerse(null);
            
            // Clear error message after a few seconds
            setTimeout(() => {
              setErrorMessage(null);
            }, 6000);
          }
        };
        
        // Start the play attempt process
        await tryPlayAlFatiha();
        return; // Exit early - we handled Al-Fatiha specially
      }
      
      // Regular handling for other surahs
      const audioPlayer = verseAudioPlayerRef.current;
      
      // If this verse is already playing, stop it
      if (playingVerse === ayahNumber) {
        audioPlayer.stop();
        setPlayingVerse(null);
        return;
      }
      
      // If any other verse is playing, stop it first
      if (playingVerse !== null) {
        audioPlayer.stop();
        setPlayingVerse(null);
      }
      
      // Set loading state
      setLoadingVerse(ayahNumber);
      
      // Attempt counter to track retries
      let attempts = 0;
      const maxAttempts = 3;
      
      // Setup error handler that will retry automatically
      const errorHandler = async (err: Error) => {
        attempts++;
        console.warn(`Error playing verse ${ayahNumber} (attempt ${attempts}/${maxAttempts}):`, err);
        
        if (attempts < maxAttempts) {
          // Show retry message
          setErrorMessage(`Retrying verse ${ayahNumber}... (${attempts}/${maxAttempts})`);
          
          // Wait a moment before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Try again with a different reciter
          try {
            await audioPlayer.playAyah(surahNumber, ayahNumber);
            // Success!
            setPlayingVerse(ayahNumber);
            setErrorMessage(null);
          } catch (retryError) {
            // Let the error handler handle it (will increment attempts)
            console.warn("Retry failed:", retryError);
          }
        } else {
          // Give up after max attempts
          console.error(`Failed to play verse ${ayahNumber} after ${maxAttempts} attempts`);
          setErrorMessage(`Could not play verse ${ayahNumber}. Try again later or choose a different verse.`);
          setLoadingVerse(null);
          
          // Clear error message after a few seconds
          setTimeout(() => {
            setErrorMessage(null);
          }, 6000);
        }
      };
      
      // Register error handler
      audioPlayer.onError(errorHandler);
      
      // First attempt to play the verse
      try {
        await audioPlayer.playAyah(surahNumber, ayahNumber);
        
        // Update playing state on success
        setPlayingVerse(ayahNumber);
        setLoadingVerse(null);
      } catch (error) {
        // The error handler will take care of retries
        // This catch block handles errors not caught by the onError callback
        console.error(`Unexpected error playing verse ${ayahNumber}:`, error);
        setErrorMessage(`Could not play verse ${ayahNumber}. Please try again later.`);
        setLoadingVerse(null);
        
        // Clear error message after a few seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 6000);
      }
    } catch (outerError) {
      // This catches any errors outside the main try block
      console.error(`Critical error in playVerse for verse ${ayahNumber}:`, outerError);
      setErrorMessage(`Could not play verse ${ayahNumber}. Please try again later.`);
      setLoadingVerse(null);
      
      // Clear error message after a few seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 6000);
    }
  };
  
  if (loading) {
    return (
      <div className="surah-loading">
        <div className="spinner"></div>
        <p>Loading Surah {surahNumber}...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="surah-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  if (!surah) {
    return (
      <div className="surah-error">
        <p>Surah not found</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }
  
  return (
    <div className="surah-page-container">
      {/* Navigation Controls */}
      <div className="surah-controls">
        <button className="back-to-surah" onClick={() => window.history.back()}>
          <span>←</span>
          <span>Back to Surah List</span>
        </button>
        <button className="bookmark-button">
          <span>☆</span>
          <span>Bookmark</span>
        </button>
      </div>

      <div className="surah-viewer">
        {/* Surah Header */}
        <div className="surah-header">
          <div className="surah-name">
            <h1 className="arabic-name">{surah.name}</h1>
            <h2 className="english-name">{surah.englishName}</h2>
            <p className="name-translation">{surah.englishNameTranslation}</p>
          </div>
          
          <div className="surah-info">
            <div className="info-item">
              <span className="info-label">Revelation Type:</span>
              <span className="info-value">{surah.revelationType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Verses:</span>
              <span className="info-value">{surah.numberOfAyahs}</span>
            </div>
          </div>
        </div>
        
        {/* Audio Controls */}
        <SurahAudioControls
          surah={surah}
        />
        
        {/* Error notification */}
        {errorMessage && (
          <div className={`audio-error-notification ${errorMessage.includes('Retrying') ? 'retrying' : ''}`}>
            <span className="error-icon">{errorMessage.includes('Retrying') ? '↻' : '!'}</span>
            <span>{errorMessage}</span>
            {!errorMessage.includes('Retrying') && (
              <button 
                className="dismiss-error"
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        {/* Bismillah */}
        {surah.number !== 1 && surah.number !== 9 && (
          <div className="bismillah" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
        
        {/* Ayahs (Verses) */}
        <div className="ayah-list">
          {surah.ayahs.map((ayah, index) => (
            <article
              key={ayah.number}
              className={`ayah-item${currentVerseIndex === index ? ' active-verse' : ''}`}
              aria-current={currentVerseIndex === index ? 'true' : undefined}
              tabIndex={0}
            >
              <div className="ayah-number">
                <span>{ayah.numberInSurah}</span>
                <button
                  className={`verse-audio-btn${playingVerse === ayah.numberInSurah ? ' playing' : ''} ${loadingVerse === ayah.numberInSurah ? 'loading' : ''}`}
                  onClick={() => playVerse(ayah.numberInSurah, index)}
                  disabled={loadingVerse !== null && loadingVerse !== ayah.numberInSurah}
                  aria-label={playingVerse === ayah.numberInSurah ? `Pause verse ${ayah.numberInSurah}` : `Play verse ${ayah.numberInSurah}`}
                  aria-pressed={playingVerse === ayah.numberInSurah}
                >
                  {loadingVerse === ayah.numberInSurah ? '' : 
                   playingVerse === ayah.numberInSurah ? '⏸' : '▶'}
                </button>
              </div>
              <div className="ayah-content">
                <p className="ayah-text" dir="rtl">{ayah.text}</p>
                <p className="ayah-translation">
                  {ayah.translation}
                </p>
              </div>
            </article>
          ))}
        </div>
        
        <div className="surah-navigation">
          {surah.number > 1 && (
            <a 
              href={`/surah/${surah.number - 1}`} 
              className="nav-button prev-button"
            >
              <span className="nav-icon">←</span>
              <span>Previous Surah</span>
            </a>
          )}
          
          <a href="/quran" className="nav-button home-button">
            <span className="nav-icon">◆</span>
            <span>Back to Quran</span>
          </a>
          
          {surah.number < 114 && (
            <a 
              href={`/surah/${surah.number + 1}`} 
              className="nav-button next-button"
            >
              <span>Next Surah</span>
              <span className="nav-icon">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}