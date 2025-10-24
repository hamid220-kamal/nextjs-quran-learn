'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioSlideViewProps {
  surahNumber: number;
  onClose: () => void;
}

interface Ayah {
  number: number;
  text: string;
  translation: string;
  audio: string;
}

interface Reciter {
  identifier: string;
  name: string;
  language: string;
}

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, retrying...`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Failed to fetch after retries');
};

export default function AudioSlideView({ surahNumber, onClose }: AudioSlideViewProps) {
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completionTriggeredRef = useRef(false);

  useEffect(() => {
    fetchReciters();
  }, []);

  useEffect(() => {
    if (selectedReciter) {
      fetchAyah(currentAyahIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReciter, currentAyahIndex]);

  useEffect(() => {
    if (showCompletion) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showCompletion]);

  const fetchReciters = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse');
      const data = await response.json();
      const formattedReciters = data.data.map((reciter: any) => ({
        identifier: reciter.identifier,
        name: reciter.englishName,
        language: reciter.language
      }));
      setReciters(formattedReciters);
    } catch (error) {
      console.error('Error fetching reciters:', error);
    }
  };

  const fetchAyah = async (ayahNumber: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsAudioLoaded(false);
      
      // Fetch Arabic text and audio with retry
      const arabicResponse = await fetchWithRetry(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${selectedReciter}`
      );
      const arabicData = await arabicResponse.json();

      // Fetch English translation with retry
      const translationResponse = await fetchWithRetry(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`
      );
      const translationData = await translationResponse.json();

      if (!arabicData.data || !translationData.data) {
        throw new Error('Invalid API response format');
      }

      setCurrentAyah({
        number: ayahNumber,
        text: arabicData.data.text,
        translation: translationData.data.text,
        audio: arabicData.data.audio || ''
      });
      setTotalAyahs(arabicData.data.surah.numberOfAyahs);
    } catch (error) {
      console.error('Error fetching ayah:', error);
      setError('Error loading verse. Please try again.');
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReciterSelect = (reciterId: string) => {
    setSelectedReciter(reciterId);
    setCurrentAyahIndex(1);
    setShowCompletion(false);
    setIsPlaying(true);
    completionTriggeredRef.current = false;
  };

  const handleAudioEnd = () => {
    if (completionTriggeredRef.current) return;

    if (currentAyahIndex === totalAyahs) {
      // Last ayah completed - show completion screen
      completionTriggeredRef.current = true;
      setIsPlaying(false);
      
      // Brief pause before showing completion
      setTimeout(() => {
        setShowCompletion(true);
      }, 500);
      return;
    }

    // Move to next ayah automatically
    setCurrentAyahIndex((prev) => prev + 1);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.error('Playback error', e));
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentAyahIndex < totalAyahs) {
      setCurrentAyahIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentAyahIndex > 1) {
      setCurrentAyahIndex((prev) => prev - 1);
    }
  };

  const handlePlayAgain = () => {
    setShowCompletion(false);
    setCurrentAyahIndex(1);
    completionTriggeredRef.current = false;
    setIsPlaying(true);
  };

  const handleBackToSurah = () => {
    setShowCompletion(false);
    completionTriggeredRef.current = false;
    onClose(); // This should be handled by parent component to close the view
  };

  const filteredReciters = reciters.filter((reciter) =>
    reciter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="audio-slide-view" role="dialog" aria-modal="true">
      <button 
        onClick={onClose} 
        className="go-back-button" 
        aria-label="Go back"
      >
        <span className="back-icon">←</span>
        <span>Go Back</span>
      </button>

      <div className="content-container">
        <div className="reciter-panel" aria-hidden={showCompletion}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reciters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="reciter-search"
            />
          </div>
          <div className="reciters-list">
            {filteredReciters.map((reciter) => (
              <button
                key={reciter.identifier}
                onClick={() => handleReciterSelect(reciter.identifier)}
                className={`reciter-item ${selectedReciter === reciter.identifier ? 'selected' : ''}`}
              >
                {reciter.name} ({reciter.language})
              </button>
            ))}
          </div>
        </div>

        <div className="ayah-display" aria-live="polite">
          <div className="slide-container">
            {isLoading && (
              <div className="loading-indicator">
                Loading verse...
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <AnimatePresence mode="wait" initial={false}>
              {!showCompletion ? (
                currentAyah && (
                  <motion.div
                    key={`ayah-${currentAyah.number}`}
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ 
                      opacity: 0, 
                      x: '-100%',
                      transition: { 
                        duration: 0.7, 
                        ease: [0.32, 0.72, 0, 1] 
                      } 
                    }}
                    transition={{ 
                      duration: 0.7, 
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    className="ayah-content"
                  >
                    <div className="arabic-text">{currentAyah.text}</div>
                    <div className="translation-text">{currentAyah.translation}</div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="completion-container"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Surah complete"
                >
                  <div className="completion-message">
                    <h2>Surah Complete</h2>
                    <p>You have finished listening to the surah</p>
                  </div>
                  <div className="completion-buttons" role="group" aria-label="Completion actions">
                    <button 
                      onClick={handlePlayAgain} 
                      className="completion-btn play-again" 
                      autoFocus
                    >
                      PLAY SURAH AGAIN
                    </button>
                    <button 
                      onClick={handleBackToSurah} 
                      className="completion-btn back-to-surah"
                    >
                      BACK TO SURAH
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <audio
              ref={audioRef}
              src={currentAyah?.audio || undefined}
              onEnded={handleAudioEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => setIsAudioLoaded(true)}
              onError={(e) => {
                console.error('Audio loading error:', e);
                setIsAudioLoaded(false);
                setError('Error loading audio. Please try again.');
                setIsPlaying(false);
              }}
            />

            {!showCompletion && (
              <>
                <div className="controls">
                  <button 
                    onClick={handlePrevious} 
                    disabled={currentAyahIndex === 1}
                    aria-label="Previous verse"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={currentAyahIndex === totalAyahs}
                    aria-label="Next verse"
                  >
                    Next
                  </button>
                </div>

                <div className="ayah-counter">
                  Verse {currentAyahIndex} of {totalAyahs}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!showCompletion && (
        <button 
          onClick={onClose} 
          className="back-navigation-btn" 
          aria-label="Back to Surah"
        >
          <span className="back-arrow">←</span>
          <span>Back to Surah</span>
        </button>
      )}
      <style jsx>{`
        .go-back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1100;
        }

        .go-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .back-icon {
          font-size: 1.2rem;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}