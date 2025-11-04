import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  fetchReciters, 
  fetchSurahVersesWithTranslation,
  getReciterSurahDuration,
  type ReciterWithMetadata,
  type VerseWithTranslation,
  type AudioSource 
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showReciterPanel, setShowReciterPanel] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRequestRef = useRef<AbortController | null>(null);

  // Define loadReciters function that can be called from multiple places
  const loadReciters = React.useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try the main API endpoint
        let response;
        try {
          response = await fetch('https://api.alquran.cloud/v1/edition/format/audio');
          if (!response.ok) throw new Error('Primary API endpoint failed');
        } catch (error) {
          console.warn('Primary API failed, trying backup endpoint:', error);
          // Try backup endpoint
          response = await fetch('https://quran-api.azurewebsites.net/api/reciters');
          if (!response.ok) throw new Error('Backup API endpoint also failed');
        }

        const data = await response.json();
        
        // Handle different API response formats
        const recitersData = data.data || data.reciters || data;
        
        if (!recitersData || !Array.isArray(recitersData)) {
          throw new Error('Invalid response format from API');
        }
        
        console.log('Fetched reciters:', recitersData);
        
        // Process all audio reciters with additional metadata
        const allReciters = data.data
          .filter((reciter: any) => reciter.format === 'audio')
          .map((reciter: any) => ({
            identifier: reciter.identifier,
            name: reciter.name,
            englishName: reciter.englishName,
            format: 'audio',
            language: reciter.language || 'ar',
            type: reciter.type || 'versebyverse',
            id: reciter.identifier,
            duration: 0,
            country: (() => {
              const match = reciter.englishName.match(/\((.*?)\)/);
              return match ? match[1] : '';
            })(),
            style: reciter.type === 'versebyverse' ? 'Verse by Verse' : 'Complete'
          }))
          .sort((a: any, b: any) => {
            // Sort Arabic reciters first, then by language and name
            if (a.language !== b.language) {
              return a.language === 'ar' ? -1 : b.language === 'ar' ? 1 : 0;
            }
            return a.englishName.localeCompare(b.englishName);
          });

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
        setError(
          'Unable to load reciters. ' + 
          (err.message.includes('API endpoint failed') 
            ? 'The server is currently unavailable. Please try again in a few moments.' 
            : 'Please check your internet connection and try again.')
        );
        
        // Add retry button to error message
        setReciters([]); // Clear any partial data
      } finally {
        setLoading(false);
      }
  }, [surahNumber]);

  useEffect(() => {
    loadReciters();
  }, [loadReciters]);

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
      setCurrentVerse(processedVerses[0]);
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

  const handlePlay = async () => {
    if (!currentVerse?.audioSources?.length) {
      setError('No audio available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cancel any existing play request
      if (playRequestRef.current) {
        playRequestRef.current.abort();
      }

      // Create new abort controller for this play request
      playRequestRef.current = new AbortController();

      // Get AudioManager for robust playback handling
      const { AudioManager } = await import('../../utils/AudioManager');

      // Pre-validate and load audio
      const audio = await AudioManager.preloadAudio(currentVerse.audioSources);
      
      // Store reference and set up event listeners
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
      audioRef.current = audio;
      audio.addEventListener('ended', handleAudioEnded);
      
      // Replace any existing audio element
      const container = document.getElementById('audio-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(audio);
      }

      // Attempt playback
      await AudioManager.playAudio(audio);
      setIsPlaying(true);
    } catch (error: any) {
      console.error('Error playing audio:', error);
      
      let errorMessage = 'Unable to play audio. ';
      if (error.name === 'AudioLoadError') {
        if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          errorMessage += 'Audio format not supported.';
        } else if (error.code === MediaError.MEDIA_ERR_NETWORK) {
          errorMessage += 'Network error occurred.';
        } else if (error.code === MediaError.MEDIA_ERR_DECODE) {
          errorMessage += 'Audio decode error.';
        }
      } else if (error.name === 'AbortError') {
        console.log('Play request was aborted');
        return; // Don't show error for aborted requests
      }
      
      setError(errorMessage + ' Please try another reciter or verse.');
      setIsPlaying(false);
      
      // Increment load attempts
      setLoadAttempts(prev => {
        if (prev >= 2) { // After 3 attempts
          setError('Audio playback failed multiple times. Please try another reciter.');
        }
        return prev + 1;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = async () => {
    if (currentVerseIndex < verses.length - 1 && !isLoading) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setLoadAttempts(0);
      
      // Update verse
      const nextIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIndex);
      setCurrentVerse(verses[nextIndex]);
      
      // Preload next audio
      if (audioRef.current && verses[nextIndex]?.audioSources) {
        const { AudioManager } = await import('../../utils/AudioManager');
        const audio = await AudioManager.createAudioElement(verses[nextIndex].audioSources);
        audioRef.current = audio;
      }
    }
  };

  const handlePrevious = async () => {
    if (currentVerseIndex > 0 && !isLoading) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setLoadAttempts(0);
      
      // Update verse
      const prevIndex = currentVerseIndex - 1;
      setCurrentVerseIndex(prevIndex);
      setCurrentVerse(verses[prevIndex]);
      
      // Preload previous audio
      if (audioRef.current && verses[prevIndex]?.audioSources) {
        const { AudioManager } = await import('../../utils/AudioManager');
        const audio = await AudioManager.createAudioElement(verses[prevIndex].audioSources);
        audioRef.current = audio;
      }
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
        position: 'relative'
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
              {/* Audio container */}
              <div id="audio-container" style={{ display: 'none' }} />
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
          initial={{ x: showReciterPanel ? 0 : '100%' }}
          animate={{ x: showReciterPanel ? 0 : '100%' }}
          transition={{ duration: 0.3 }}
          style={{ 
            position: 'fixed',
            right: 0,
            top: '80px', // Below the top bar
            height: 'calc(100vh - 80px)',
            width: '400px',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem',
            overflowY: 'auto',
            zIndex: 1002,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Toggle Button */}
          {!showReciterPanel && (
            <button
              onClick={() => setShowReciterPanel(true)}
              style={{
                position: 'absolute',
                left: '-40px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '80px',
                fontSize: '1.2rem'
              }}
            >
              ◀
            </button>
          )}

          {/* Header */}
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🎤</span>
                Reciters
              </h3>
              <button
                onClick={() => setShowReciterPanel(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                ×
              </button>
            </div>

            {/* Search and Filters */}
            <div className="filters" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="all">All Languages</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'ar' ? 'Arabic' :
                     lang === 'en' ? 'English' :
                     lang === 'ur' ? 'Urdu' :
                     lang === 'fa' ? 'Persian' :
                     lang === 'tr' ? 'Turkish' :
                     lang.toUpperCase()}
                  </option>
                ))}
              </select>

              <div style={{ position: 'relative' }}>
                <input 
                  type="search" 
                  placeholder="Search reciters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingLeft: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.6)',
                  pointerEvents: 'none'
                }}>
                  🔍
                </span>
              </div>
            </div>
          </div>

          {/* Reciters List */}
          <div className="reciters-list" style={{ 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingRight: '8px'
          }}>
            {loading ? (
              <div style={{ 
                color: 'white', 
                textAlign: 'center', 
                padding: '2rem',
                fontSize: '1.1rem'
              }}>
                Loading reciters...
              </div>
            ) : error ? (
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ 
                  color: '#ff6b6b', 
                  fontSize: '1.1rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    loadReciters();
                  }}
                  style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    color: '#4CAF50',
                    border: '2px solid rgba(76, 175, 80, 0.3)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>↻</span>
                  Try Again
                </button>
              </div>
            ) : filteredReciters.length === 0 ? (
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                textAlign: 'center', 
                padding: '2rem',
                fontSize: '1.1rem'
              }}>
                No reciters found
              </div>
            ) : (
              filteredReciters.map((reciter) => (
                <div 
                  key={reciter.id} 
                  onClick={() => handleReciterSelect(reciter)}
                  style={{
                    background: selectedReciter?.id === reciter.id ? 
                      'rgba(76, 175, 80, 0.2)' : 
                      'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: `2px solid ${selectedReciter?.id === reciter.id ? 
                      'rgba(76, 175, 80, 0.3)' : 
                      'transparent'}`,
                    transform: selectedReciter?.id === reciter.id ? 'scale(1.02)' : 'scale(1)',
                    color: 'white'
                  }}
                  onMouseEnter={e => {
                    if (selectedReciter?.id !== reciter.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedReciter?.id !== reciter.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      {reciter.englishName}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontStyle: 'italic'
                    }}>
                      {reciter.name}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: 'rgba(76, 175, 80, 0.15)',
                      color: '#4CAF50',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {reciter.language === 'ar' ? 'Arabic' :
                       reciter.language === 'en' ? 'English' :
                       reciter.language === 'ur' ? 'Urdu' :
                       reciter.language === 'fa' ? 'Persian' :
                       reciter.language === 'tr' ? 'Turkish' :
                       reciter.language.toUpperCase()}
                    </span>
                    {reciter.style && (
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '0.8rem'
                      }}>
                        {reciter.style}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Audio Controls */}
        {currentVerse && (
          <div className="audio-controls" style={{
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1001
          }}>
            <button 
              className="control-btn"
              onClick={handlePrevious}
              disabled={currentVerseIndex === 0 || isLoading}
              style={{
                background: currentVerseIndex === 0 || isLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: currentVerseIndex === 0 || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <button 
              className="control-btn play-btn"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={isLoading}
              style={{
                background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 36px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
            </button>
            <button 
              className="control-btn"
              onClick={handleNext}
              disabled={currentVerseIndex === verses.length - 1 || isLoading}
              style={{
                background: (currentVerseIndex === verses.length - 1 || isLoading) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: (currentVerseIndex === verses.length - 1 || isLoading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}