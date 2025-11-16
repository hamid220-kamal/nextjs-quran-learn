import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './AudioView.css';

interface AudioViewProps {
  surahNumber: number;
  surahName: string;
  backgroundImage: string;
  onClose: () => void;
}

interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio: string;
}

interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
  format: string;
  language: string;
}

export default function AudioView({ surahNumber, surahName, backgroundImage, onClose }: AudioViewProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [showReciters, setShowReciters] = useState(true);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Fetch reciters when component mounts
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/edition/format/audio');
        if (!response.ok) {
          throw new Error('Failed to fetch reciters');
        }
        const data = await response.json();
        setReciters(data.data.filter((reciter: any) => reciter.format === 'audio'));
      } catch (err) {
        console.error('Error fetching reciters:', err);
        setError('Failed to load reciters. Please try again later.');
      }
    };

    fetchReciters();
  }, []);

  // Fetch verses when component mounts
  useEffect(() => {
    const fetchVerses = async () => {
      if (!selectedReciter) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch Arabic text and translation
        const [arabicResponse, translationResponse, reciterResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter.identifier}`)
        ]);

        if (!arabicResponse.ok || !translationResponse.ok) {
          throw new Error('Failed to fetch verses');
        }

        const arabicData = await arabicResponse.json();
        const translationData = await translationResponse.json();

        const reciterData = await reciterResponse.json();
        
        // Process verses and add audio URLs from selected reciter
        const processedVerses = arabicData.data.ayahs.map((ayah: any, index: number) => {
          const reciterAyah = reciterData.data.ayahs[index];
          return {
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: ayah.text,
            translation: translationData.data.ayahs[index].text,
            audio: reciterAyah.audio // Use the selected reciter's audio URL
          };
        });

        setVerses(processedVerses);
      } catch (err) {
        setError('Failed to load verses. Please try again later.');
        console.error('Error fetching verses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedReciter) {
      fetchVerses();
    }
  }, [surahNumber, selectedReciter]);

  // Handle audio playback
  const handlePlay = async () => {
    if (!verses[currentVerseIndex]?.audio || !selectedReciter) {
      setError('No audio available for this verse or no reciter selected');
      return;
    }

    if (showReciters) {
      setError('Please select a reciter first');
      return;
    }

    try {
      setError(null);
      setIsAudioLoading(true);

      // If there's a pending play promise, wait for it
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
      }

      // Create new audio instance if needed
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Set up audio
      audioRef.current.src = verses[currentVerseIndex].audio;
      audioRef.current.preload = 'auto';

      // Set up event listeners
      audioRef.current.oncanplay = async () => {
        try {
          setIsAudioLoading(false);
          setIsPlaying(true);
          const playPromise = audioRef.current?.play();
          if (playPromise) {
            playPromiseRef.current = playPromise;
          }
          await playPromiseRef.current;
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
            setError('Failed to play audio. Please try again.');
          }
        } finally {
          playPromiseRef.current = null;
        }
      };

      audioRef.current.onended = handleAudioEnded;
      audioRef.current.onerror = (e) => {
        console.error('Audio loading error:', e);
        setIsAudioLoading(false);
        setIsPlaying(false);
        setError('Error loading audio. Please try again.');
      };

      // Play audio
      await audioRef.current.play();
      setIsPlaying(true);
      
      // Set current verse and update UI
      setCurrentVerse(verses[currentVerseIndex]);
      setLoadAttempts(0);

      // Set up continuous playback handler
      audioRef.current.onended = () => {
        handleAudioEnded();
      };
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      
      // Handle retry logic with exponential backoff
      if (loadAttempts < 3) {
        setLoadAttempts(prev => prev + 1);
        setTimeout(handlePlay, Math.pow(2, loadAttempts) * 1000);
      }
    }
  };

  const handlePause = async () => {
    try {
      // If there's a pending play promise, wait for it before pausing
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        playPromiseRef.current = null;
      }
    } catch (err) {
      console.error('Error pausing audio:', err);
    }
  };

  // Effect to handle audio state changes and initialization
  useEffect(() => {
    let mounted = true;

    const initializeAudio = async () => {
      if (!verses[currentVerseIndex]?.audio || !mounted) return;

      try {
        setIsAudioLoading(true);
        setError(null);

        // If there's a pending play promise, wait for it
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        // Clean up previous audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.oncanplay = null;
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        }

        // Create new audio instance
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = verses[currentVerseIndex].audio;

        // Set up event listeners
        audio.oncanplay = async () => {
          if (!mounted) return;
          
          setIsAudioLoading(false);
          
          if (isPlaying) {
            try {
              playPromiseRef.current = audio.play();
              await playPromiseRef.current;
            } catch (err) {
              if (err instanceof Error && err.name !== 'AbortError' && mounted) {
                console.error('Error auto-playing audio:', err);
                setIsPlaying(false);
                setError('Failed to auto-play audio. Please try manually.');
              }
            } finally {
              if (mounted) {
                playPromiseRef.current = null;
              }
            }
          }
        };

        audio.onended = () => {
          if (mounted) {
            handleAudioEnded();
          }
        };

        audio.onerror = (e) => {
          if (mounted) {
            console.error('Audio loading error:', e);
            setIsAudioLoading(false);
            setIsPlaying(false);
            setError('Error loading audio. Please try again.');
          }
        };

        audioRef.current = audio;

      } catch (err) {
        if (mounted) {
          console.error('Error initializing audio:', err);
          setIsAudioLoading(false);
          setIsPlaying(false);
          setError('Failed to initialize audio. Please try again.');
        }
      }
    };

    initializeAudio();

    // Cleanup function
    return () => {
      mounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.oncanplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }
      playPromiseRef.current = null;
    };
  }, [currentVerseIndex, verses, isPlaying]);

  const handleNext = async () => {
    if (currentVerseIndex < verses.length - 1 && !isLoading && !isAudioLoading) {
      try {
        // If there's a pending play promise, wait for it
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        // Stop current playback
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Reset play promise
        playPromiseRef.current = null;
        
        // Update verse index
        const nextIndex = currentVerseIndex + 1;
        setCurrentVerseIndex(nextIndex);
        setCurrentVerse(verses[nextIndex]);
        setLoadAttempts(0);
        
        // Audio playback will be handled by useEffect
      } catch (err) {
        console.error('Error handling next verse:', err);
      }
    }
  };

  const handlePrevious = async () => {
    if (currentVerseIndex > 0 && !isLoading && !isAudioLoading) {
      try {
        // If there's a pending play promise, wait for it
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        // Stop current playback
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Reset play promise
        playPromiseRef.current = null;
        
        // Update verse index
        const prevIndex = currentVerseIndex - 1;
        setCurrentVerseIndex(prevIndex);
        setCurrentVerse(verses[prevIndex]);
        setLoadAttempts(0);
        
        // Audio playback will be handled by useEffect
      } catch (err) {
        console.error('Error handling previous verse:', err);
      }
    }
  };

  const handleAudioEnded = async () => {
    // Don't set playing to false here to maintain continuous state
    if (currentVerseIndex < verses.length - 1) {
      try {
        // Small delay for smoother transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Move to next verse maintaining play state
        await handleNext();
      } catch (err) {
        console.error('Error in continuous playback:', err);
        setError('Error in continuous playback. Please try again.');
        setIsPlaying(false);
      }
    } else {
      // End of surah reached
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Initialize audio and handle verse changes
  useEffect(() => {
    // Set initial verse when verses are loaded
    if (verses.length > 0 && currentVerseIndex >= 0 && currentVerseIndex < verses.length) {
      setCurrentVerse(verses[currentVerseIndex]);
      
      // Initialize audio element
      if (!audioRef.current) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = verses[currentVerseIndex].audio;
        audio.onended = handleAudioEnded;
        audioRef.current = audio;
      }
    }
    
    // Clean up function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    };
  }, [verses, currentVerseIndex]);

  return (
    <motion.div 
      className="audio-view-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Bar */}
      <div className="top-bar">
        {/* Go Back Button - Left, spans 2 rows */}
        <button className="go-back-btn" onClick={onClose}>Go Back</button>
        
        {/* Surah Name - Center */}
        <div className="surah-info">
          <span>{surahName}</span>
        </div>
        
        {/* Change Reciter Button - Right, Row 1 */}
        {selectedReciter && !showReciters && (
          <button 
            className="change-reciter"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              setIsPlaying(false);
              setShowReciters(true);
              setVerses([]);
              setCurrentVerseIndex(0);
            }}
          >
            Change Reciter
          </button>
        )}
        
        {/* Current Reciter - Right, Row 2 */}
        {selectedReciter && !showReciters && (
          <div className="current-reciter">
            <span>{selectedReciter.englishName}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showReciters && (
          <div className="recitations-panel">
            <div className="recitations-header">
              <h3>Select a Reciter</h3>
              <div className="search-container">
                <input
                  type="search"
                  className="reciter-search"
                  placeholder="Search reciters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="reciters-list">
              {reciters
                .filter(reciter => 
                  reciter.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((reciter) => (
                  <div
                    key={reciter.identifier}
                    className={`reciter-card ${selectedReciter?.identifier === reciter.identifier ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedReciter(reciter);
                      setShowReciters(false);
                    }}
                  >
                    <div className="reciter-info">
                      <div className="reciter-name">{reciter.englishName}</div>
                      <div className="reciter-details">
                        <span className="reciter-native-name">{reciter.name}</span>
                        <span className="reciter-language">{reciter.language}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-state">Loading verses...</div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            {!showReciters && selectedReciter && (
              <>
                {/* Current Verse Display */}
                <div className="verse-display">
                  <div className="verse-content">
                    <div className="verse-number">
                      Verse {verses[currentVerseIndex]?.numberInSurah} of {verses.length}
                    </div>
                    <div className="arabic-text">
                      {verses[currentVerseIndex]?.text}
                    </div>
                    <div className="translation-text">
                      {verses[currentVerseIndex]?.translation}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Audio Controls */}
            <div className="audio-controls">
              <button 
                onClick={handlePrevious}
                disabled={currentVerseIndex === 0 || isLoading || isAudioLoading}
                className={isAudioLoading ? 'loading' : ''}
              >
                Previous
              </button>
              <button 
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={isLoading || isAudioLoading}
                className={`play-btn ${isAudioLoading ? 'loading' : ''}`}
              >
                {isAudioLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </button>
              <button 
                onClick={handleNext}
                disabled={currentVerseIndex === verses.length - 1 || isLoading || isAudioLoading}
                className={isAudioLoading ? 'loading' : ''}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}