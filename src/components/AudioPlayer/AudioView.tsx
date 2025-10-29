import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  fetchReciters, 
  fetchSurahVersesWithTranslation,
  getReciterSurahDuration,
  type ReciterWithMetadata,
  type VerseWithTranslation 
} from '../../utils/quranApi';
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
  country?: string;
  style?: string;
}

type VerseDisplay = VerseWithTranslation;

export default function AudioView({ surahNumber, surahName, backgroundImage, onClose }: AudioViewProps) {
  const [reciters, setReciters] = useState<ReciterDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<ReciterDisplay | null>(null);
  const [currentVerse, setCurrentVerse] = useState<VerseDisplay | null>(null);
  const [verses, setVerses] = useState<VerseDisplay[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showReciterPanel, setShowReciterPanel] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadReciters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchReciters();
        console.log('Fetched reciters:', response);
        
        // Process all audio reciters with additional metadata
        const allReciters = response
          .filter(reciter => reciter.format === 'audio')
          .map(reciter => ({
            ...reciter,
            id: reciter.identifier,
            duration: 0,
            country: reciter.englishName.split('(')[1]?.replace(')', '') || '',
            style: reciter.type === 'versebyverse' ? 'Verse by Verse' : 'Complete'
          }));

        // Extract unique languages
        const languages = [...new Set(allReciters.map(r => r.language))];
        setAvailableLanguages(languages);
        setReciters(allReciters);
        
        // Then update durations in batches
        const batchSize = 5;
        for (let i = 0; i < allReciters.length; i += batchSize) {
          const batch = allReciters.slice(i, i + batchSize);
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

  const handleReciterSelect = async (reciter: ReciterDisplay) => {
    try {
      if (selectedReciter?.id === reciter.id) return;
      
      setLoading(true);
      setSelectedReciter(reciter);
      setCurrentVerse(null);
      
      const versesData = await fetchSurahVersesWithTranslation(surahNumber, reciter.identifier);
      
      // Handle both array and single object responses
      const processedVerses = Array.isArray(versesData) ? versesData : [versesData].filter(Boolean);
      
      if (processedVerses.length === 0) {
        console.warn('No verses received from API for surah:', surahNumber);
        setError('No verses available for this recitation. Please try another reciter.');
        return;
      }
      
      setVerses(processedVerses);
      setCurrentVerseIndex(0);
      setCurrentVerse(versesData[0]);
      setShowReciterPanel(false);
      
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      setError('Failed to load verses');
      console.error('Error loading verses:', err);
      setSelectedReciter(null);
      setVerses([]);
      setCurrentVerse(null);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentVerseIndex < verses.length - 1) {
      handleNext();
      setTimeout(handlePlay, 500);
    }
  };

  const filteredReciters = reciters.filter(reciter => {
    const matchesSearch = reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || reciter.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

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
      <div className="top-bar" style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 1001
      }}>
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
      <div className="main-content" style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden', 
        position: 'relative',
        transition: 'margin-right 0.3s ease'
      }}>
        {/* Main Verse Display */}
        <div className="verse-display" style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%'
        }}>
          {currentVerse ? (
            <motion.div
              key={currentVerse.numberInSurah}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="verse-content"
              style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '2rem 1rem',
                textAlign: 'center'
              }}
            >
              <div className="verse-number" style={{
                fontSize: '1.2rem',
                marginBottom: '3rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Verse {currentVerse.numberInSurah} of {verses.length}
              </div>
              <div className="arabic-text" style={{
                fontSize: '4rem',
                lineHeight: '2',
                marginBottom: '3rem',
                width: '90%',
                color: 'white'
              }}>
                {currentVerse.text}
              </div>
              <div className="translation-text" style={{
                fontSize: '1.5rem',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {currentVerse.translation}
              </div>
              <audio
                ref={audioRef}
                src={currentVerse.audio}
                onEnded={handleAudioEnded}
                style={{ display: 'none' }}
              />
            </motion.div>
          ) : (
            <div className="select-reciter-prompt" style={{ 
              textAlign: 'center', 
              marginTop: '2rem',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              {error ? (
                <div style={{ color: '#ff6b6b' }}>{error}</div>
              ) : (
                <div>Select a reciter to begin</div>
              )}
            </div>
          )}
        </div>

        {/* Reciter Selection Panel */}
        <motion.div 
          className="recitations-panel"
          initial={{ x: 0 }}
          animate={{ x: showReciterPanel ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ 
            position: 'fixed',
            right: 0,
            top: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            padding: '1.25rem',
            overflowY: 'auto',
            zIndex: 1001,
            boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Toggle Button */}
          {!showReciterPanel && selectedReciter && (
            <button
              onClick={() => setShowReciterPanel(true)}
              style={{
                position: 'absolute',
                left: '-40px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer',
                zIndex: 1002
              }}
            >
              ◀
            </button>
          )}

          <div className="recitations-header" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              <span className="recitation-icon">🎤</span> 
              Recitations
            </h3>
            <div className="filters">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-filter"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Languages</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <input 
                type="search" 
                placeholder="Search reciters..."
                className="reciter-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div className="reciters-list" style={{ paddingBottom: '2rem' }}>
            {loading ? (
              <div className="loading-state" style={{ 
                color: 'white', 
                textAlign: 'center', 
                padding: '2rem',
                fontSize: '1.1rem'
              }}>
                Loading reciters...
              </div>
            ) : error ? (
              <div className="error-state" style={{ 
                color: '#ff6b6b', 
                textAlign: 'center', 
                padding: '2rem',
                fontSize: '1.1rem'
              }}>
                {error}
              </div>
            ) : filteredReciters.map((reciter) => (
              <div 
                key={reciter.id} 
                className={`reciter-card ${selectedReciter?.id === reciter.id ? 'selected' : ''}`}
                onClick={() => handleReciterSelect(reciter)}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedReciter?.id === reciter.id ? 
                    'rgba(76, 175, 80, 0.15)' : 
                    'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  transform: selectedReciter?.id === reciter.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div className="reciter-info">
                  <div className="reciter-name" style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {reciter.englishName}
                  </div>
                  <div className="reciter-details" style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.4'
                  }}>
                    <span className="reciter-native-name">{reciter.name}</span>
                    {reciter.country && (
                      <span className="reciter-country" style={{ marginLeft: '0.5rem' }}>
                        ({reciter.country})
                      </span>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="reciter-style">{reciter.style}</span>
                      {reciter.duration && (
                        <span className="reciter-duration" style={{ marginLeft: '0.5rem' }}>
                          • {Math.floor(reciter.duration / 60)}:{String(reciter.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="reciter-language-badge" style={{
                  background: 'rgba(76, 175, 80, 0.15)',
                  color: '#4CAF50',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '0.75rem'
                }}>
                  {reciter.language.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Audio Controls */}
      {currentVerse && (
        <div className="audio-controls" style={{
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          zIndex: 1001
        }}>
          <button 
            className="control-btn"
            onClick={handlePrevious}
            disabled={currentVerseIndex === 0}
            style={{
              background: currentVerseIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: currentVerseIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Previous
          </button>
          <button 
            className="control-btn play-btn"
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              background: 'rgba(76, 175, 80, 0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 36px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              transform: isPlaying ? 'scale(0.98)' : 'scale(1)'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            className="control-btn"
            onClick={handleNext}
            disabled={currentVerseIndex === verses.length - 1}
            style={{
              background: currentVerseIndex === verses.length - 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: currentVerseIndex === verses.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}