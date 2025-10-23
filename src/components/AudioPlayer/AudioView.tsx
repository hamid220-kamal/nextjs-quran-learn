import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  fetchReciters, 
  fetchSurahVersesWithTranslation,
  getReciterSurahDuration,
  type ReciterWithMetadata,
  type VerseWithTranslation 
} from '../../utils/quranAPI';
import './AudioView.css';

interface AudioViewProps {
  surahNumber: number;
  surahName: string;
  backgroundImage: string;
  onClose: () => void;
}

interface ReciterDisplay extends ReciterWithMetadata {
  id: string;
  duration?: number;
}

type VerseDisplay = VerseWithTranslation;

export default function AudioView({ surahNumber, surahName, backgroundImage, onClose }: AudioViewProps) {
  const [reciters, setReciters] = useState<ReciterDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<ReciterDisplay | null>(null);
  const [currentVerse, setCurrentVerse] = useState<VerseDisplay | null>(null);
  const [verses, setVerses] = useState<VerseDisplay[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadReciters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedReciters = await fetchReciters();
        
        // Filter and process reciters
        const arabicReciters = fetchedReciters
          .filter(reciter => 
            reciter.language === 'ar' && 
            reciter.format === 'audio' &&
            reciter.identifier.startsWith('ar.') // Ensure it's an Arabic recitation
          )
          .map(reciter => ({
            ...reciter,
            id: reciter.identifier,
            duration: 0 // Initialize with 0, will be updated later
          }));

        // First set the reciters without durations
        setReciters(arabicReciters);
        
        // Then update durations in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < arabicReciters.length; i += batchSize) {
          const batch = arabicReciters.slice(i, i + batchSize);
          const updatedBatch = await Promise.all(
            batch.map(async (reciter) => {
              try {
                const duration = await getReciterSurahDuration(surahNumber, reciter.identifier);
                return { ...reciter, duration };
              } catch (err) {
                console.warn(`Could not fetch duration for ${reciter.identifier}:`, err);
                return reciter;
              }
            })
          );
          
          // Update the reciters state with the new durations
          setReciters(prev => {
            const updated = [...prev];
            updatedBatch.forEach(updatedReciter => {
              const index = updated.findIndex(r => r.id === updatedReciter.id);
              if (index !== -1) {
                updated[index] = updatedReciter;
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('Error loading reciters:', err);
        setError('Failed to load reciters. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadReciters();
  }, [surahNumber]);

  // Handle reciter selection
  const handleReciterSelect = async (reciter: ReciterDisplay) => {
    try {
      if (selectedReciter?.id === reciter.id) return; // Don't reload if same reciter
      
      setLoading(true);
      setSelectedReciter(reciter);
      setCurrentVerse(null); // Clear current verse while loading
      
      // Fetch the verses for this reciter
      const versesData = await fetchSurahVersesWithTranslation(surahNumber, reciter.identifier);
      
      // Ensure we got valid data
      if (!versesData || !Array.isArray(versesData) || versesData.length === 0) {
        throw new Error('No verses received from API');
      }
      
      setVerses(versesData);
      setCurrentVerseIndex(0);
      setCurrentVerse(versesData[0]);
      
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      setError('Failed to load verses');
      console.error('Error loading verses:', err);
      // Reset states on error
      setSelectedReciter(null);
      setVerses([]);
      setCurrentVerse(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle audio playback
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
      setCurrentVerse(verses[currentVerseIndex + 1]);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
      setCurrentVerse(verses[currentVerseIndex - 1]);
      setIsPlaying(false);
    }
  };

  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentVerseIndex < verses.length - 1) {
      handleNext();
      setTimeout(handlePlay, 500); // Auto-play next verse after a short delay
    }
  };

  const filteredReciters = reciters.filter(reciter =>
    reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
        zIndex: 1000
      }}
    >
      {/* Top Bar */}
      <div className="top-bar" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="surah-info" style={{ color: 'white' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            <span>quranplayer</span> | <span>{surahName}</span>
          </Link>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Go back</span> →
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!selectedReciter ? (
          // Show reciter selection panel only when no reciter is selected
          <div className="recitations-panel">
            <div className="recitations-header">
              <h3>
                <span className="recitation-icon">🎤</span> 
                Recitations
              </h3>
              <div className="search-container">
                <input 
                  type="search" 
                  placeholder="Search"
                  className="reciter-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="reciters-list">
              {loading ? (
                <div className="loading-state">Loading reciters...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : filteredReciters.map((reciter) => (
                <div 
                  key={reciter.id} 
                  className="reciter-card"
                  onClick={() => handleReciterSelect(reciter)}
                >
                  <div className="reciter-info">
                    <div className="reciter-name">{reciter.englishName}</div>
                    <div className="reciter-details">
                      <span className="reciter-native-name">{reciter.name}</span>
                      <span className="reciter-language">{reciter.languageNative}</span>
                      {reciter.duration && (
                        <span className="reciter-duration">
                          {Math.floor(reciter.duration / 60)}:{String(reciter.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="reciter-number">
                    <span className="number-label">{reciter.language.toUpperCase()}</span>
                    <span className="number-value">{reciter.identifier.split('.')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Center - Verse Display */}
        <div className="verse-display">
          {currentVerse ? (
            <motion.div
              key={currentVerse.numberInSurah}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="verse-content"
            >
              <div className="verse-number">Verse {currentVerse.numberInSurah} of {verses.length}</div>
              <div className="arabic-text">{currentVerse.text}</div>
              <div className="translation-text">{currentVerse.translation}</div>
              <audio
                ref={audioRef}
                src={currentVerse.audio}
                onEnded={handleAudioEnded}
                style={{ display: 'none' }}
              />
            </motion.div>
          ) : selectedReciter ? (
            <div className="loading-verse">Loading verses...</div>
          ) : (
            <div className="select-reciter-prompt">Select a reciter to begin</div>
          )}
        </div>
      </div>

      {/* Audio Controls */}
      {currentVerse && (
        <div className="audio-controls">
          <button 
            className="control-btn"
            onClick={handlePrevious}
            disabled={currentVerseIndex === 0}
          >
            Previous
          </button>
          <button 
            className="control-btn play-btn"
            onClick={isPlaying ? handlePause : handlePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            className="control-btn"
            onClick={handleNext}
            disabled={currentVerseIndex === verses.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}