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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrollView, setIsScrollView] = useState(false);
  
  // Add useEffect to handle body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleScrollView = () => {
    setIsScrollView(!isScrollView);
  };
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
    <div className="audio-slide-overlay" role="dialog" aria-modal="true">
      {/* Toggle Button - Moved outside audio-slide-view */}
      <button 
        className="menu-toggle-btn" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2"
          fill="none"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className="audio-slide-view">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <button onClick={onClose} className="sidebar-button">
              <span className="icon">←</span>
              <span>Go Back</span>
            </button>
            
            <button onClick={toggleFullscreen} className="sidebar-button">
              <span className="icon">{isFullscreen ? '⎌' : '↔'}</span>
              <span>Full Screen</span>
            </button>

            <button onClick={toggleScrollView} className="sidebar-button">
              <span className="icon">⇕</span>
              <span>Scroll View</span>
            </button>

            <button 
              onClick={() => setSelectedReciter('')} 
              className="sidebar-button"
            >
              <span className="icon">🎤</span>
              <span>Reciter</span>
            </button>
          </div>
        </div>

        <div className="top-navigation">
          <div className="nav-controls">
            <div className="nav-left">
              <button 
                className="menu-btn" 
                onClick={toggleSidebar}
                aria-label="Toggle menu"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
              <button 
                className="nav-button back-button" 
                onClick={onClose}
                aria-label="Back to Surah List"
              >
                <span className="icon">←</span>
                <span className="text">Back to Surah List</span>
              </button>
            </div>
            <button 
              className="nav-button bookmark-button"
              aria-label="Bookmark this surah"
            >
              <span className="icon">☆</span>
              <span className="text">Bookmark</span>
            </button>
          </div>
        </div>

        <div className={`content-container ${isScrollView ? 'scroll-view' : ''}`}>
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
        .audio-slide-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .menu-toggle-btn {
          position: absolute;
          left: 20px;
          top: 100px;
          z-index: 100000;
          background: #2196f3;
          border: none;
          border-radius: 8px;
          color: white;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .menu-toggle-btn:hover {
          background: #1976d2;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .menu-toggle-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .menu-toggle-btn svg {
          width: 24px;
          height: 24px;
          stroke: white;
          stroke-width: 2;
        }

        .audio-slide-view {
          position: fixed;
          left: 20px;
          top: 90px;
          z-index: 100000;
          background: #1e88e5;
          border: none;
          border-radius: 50%;
          color: white;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          font-size: 24px;
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
          background: #2196f3;
        }

        .sidebar-toggle:active {
          transform: scale(0.95);
        }

        .sidebar {
          position: fixed;
          left: -280px;
          top: 0;
          bottom: 0;
          width: 280px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 10000;
          transition: all 0.3s ease;
          padding-top: 100px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar.open {
          left: 0;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
        }

        .sidebar-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .sidebar-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .sidebar-button .icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .audio-slide-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
          height: 100%;
          padding-top: 80px;
        }

        .top-navigation {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          padding: 16px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 10000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nav-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-btn {
          background: #2196f3;
          border: none;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .menu-btn:hover {
          background: #1976d2;
          transform: translateY(-2px);
        }

        .menu-btn:active {
          transform: translateY(0);
        }

        .menu-btn svg {
          width: 24px;
          height: 24px;
        }

        .nav-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .nav-button .icon {
          font-size: 20px;
          line-height: 1;
        }

        .nav-button .text {
          font-weight: 500;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .bookmark-button {
          background: rgba(33, 150, 243, 0.3);
        }

        .bookmark-button:hover {
          background: rgba(33, 150, 243, 0.4);
        }

        .content-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          margin-top: 64px;
          transition: all 0.3s ease;
          margin-left: ${isSidebarOpen ? '280px' : '0'};
        }

        .content-container.scroll-view {
          height: auto;
          overflow-y: visible;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 240px;
            left: -240px;
          }
          .content-container {
            margin-left: 0;
          }
        }

        .surah-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-to-surah,
        .bookmark-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .back-to-surah:hover,
        .bookmark-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .back-to-surah span:first-child,
        .bookmark-button span:first-child {
          font-size: 20px;
          line-height: 1;
        }

        .bookmark-button {
          background: rgba(var(--primary-color-rgb, 33, 150, 243), 0.3);
        }

        .bookmark-button:hover {
          background: rgba(var(--primary-color-rgb, 33, 150, 243), 0.4);
        }
      `}</style>
    </div>
  );
}