'use client';

import React, { useEffect, useState, useRef } from 'react';
import './ScrollReadView.css';

interface ScrollReadViewProps {
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

export default function ScrollReadView({ 
  surahNumber, 
  surahName, 
  totalVerses,
  backgroundImageUrl,
  onBack 
}: ScrollReadViewProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchVerses() {
      try {
        setLoading(true);
        // Fetch both Arabic and English translations
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
        setLoading(false);
      }
    }

    fetchVerses();
  }, [surahNumber]);

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const verses = container.querySelectorAll('.verse-container');
      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.clientHeight;
      const viewportCenter = containerTop + (containerHeight / 2);

      let closestVerse = verses[0];
      let minDistance = Infinity;

      verses.forEach((verse) => {
        const verseRect = verse.getBoundingClientRect();
        const verseCenter = verseRect.top + (verseRect.height / 2);
        const distance = Math.abs(verseCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestVerse = verse;
        }
      });

      const verseNumber = parseInt(closestVerse.getAttribute('data-verse-number') || '1');
      setCurrentVerse(verseNumber);
    }

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="scroll-read-view loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scroll-read-view error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-read-view" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="scroll-read-header">
        <button onClick={onBack} className="back-button" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="surah-info">
          <div className="surah-logo">
            <span>📖</span>
          </div>
          <h2 className="surah-name">{surahName}</h2>
        </div>
        <div style={{ width: '48px' }}></div> {/* Spacer for grid alignment */}
      </div>

      <div className="verses-container" ref={containerRef}>
        {verses.map((verse) => (
          <div 
            key={verse.number}
            className={`verse-container ${currentVerse === verse.number ? 'active' : ''}`}
            data-verse-number={verse.number}
          >
            <div className="verse-number">{verse.number}</div>
            <div className="verse-content">
              <div className="arabic-text">{verse.text}</div>
              <div className="translation-text">{verse.translation}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}