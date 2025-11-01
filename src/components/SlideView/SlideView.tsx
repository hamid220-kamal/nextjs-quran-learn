'use client';

import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import './SlideView.css';

interface SlideViewProps {
  surahNumber: number;
  surahName: string;
  totalVerses: number;
  backgroundImageUrl: string;
  onBack: () => void;
}

interface Verse {
  number: number;
  text: string;
  translation: string;
}

import { createPortal } from 'react-dom';

export default function SlideView({
  surahNumber,
  surahName,
  totalVerses,
  backgroundImageUrl,
  onBack
}: SlideViewProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    async function fetchVerses() {
      try {
        setIsLoading(true);
        const [arabicResponse, translationResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`)
        ]);

        const arabicData = await arabicResponse.json();
        const translationData = await translationResponse.json();

        if (arabicData.code === 200 && translationData.code === 200) {
          const combinedVerses = arabicData.data.ayahs.map((verse: any, index: number) => ({
            number: verse.numberInSurah,
            text: verse.text,
            translation: translationData.data.ayahs[index].text
          }));
          setVerses(combinedVerses);
        } else {
          throw new Error('Failed to fetch verses');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load verses');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVerses();
  }, [surahNumber]);

  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout;
    if (isAutoPlay) {
      autoPlayInterval = setInterval(() => {
        setCurrentVerseIndex(prev => 
          prev < verses.length - 1 ? prev + 1 : 0
        );
      }, 5000); // Change verse every 5 seconds
    }
    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlay, verses.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextVerse();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousVerse();
      } else if (e.key === 'Escape') {
        onBack();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [verses.length]);

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextVerse(),
    onSwipedRight: () => goToPreviousVerse(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const goToNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    }
  };

  const goToPreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
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

  if (isLoading) {
    return (
      <div className="slide-view loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slide-view error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }

  const currentVerse = verses[currentVerseIndex];

  return typeof document !== 'undefined' ? createPortal(
    <div 
      className="slide-view" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImageUrl})`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      {...handlers}
    >
      <div className="slide-header">
        <button onClick={onBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="surah-info">
          <div className="surah-logo">
            {surahNumber}
          </div>
          <div className="surah-details">
            <h3 className="surah-name">{surahName}</h3>
            <span className="verse-count">
              {currentVerseIndex + 1} / {totalVerses}
            </span>
          </div>
        </div>
        <div className="controls">
          <button 
            onClick={toggleFullscreen} 
            className="control-button"
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="verse-navigation">
        <button 
          className="nav-button prev" 
          onClick={goToPreviousVerse}
          disabled={currentVerseIndex === 0}
          aria-label="Previous verse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="nav-button next" 
          onClick={goToNextVerse}
          disabled={currentVerseIndex === verses.length - 1}
          aria-label="Next verse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="verse-content">
        <div className="verse-number">{currentVerse?.number}</div>
        <div className="arabic-text">{currentVerse?.text}</div>
        <div className="translation-text">{currentVerse?.translation}</div>
      </div>
    </div>,
    document.body
  ) : null;
}