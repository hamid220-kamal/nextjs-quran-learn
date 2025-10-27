'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Verse } from '@/types/QuranTypes';

interface ScrollReadViewProps {
  surahNumber: number;
  surahName: string;
  totalVerses: number;
  backgroundImageUrl: string;
}

interface VerseData {
  number: number;
  arabic: string;
  translation: string;
}

export default function ScrollReadView({
  surahNumber,
  surahName,
  totalVerses,
  backgroundImageUrl,
}: ScrollReadViewProps) {
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchVerses();
  }, [surahNumber]);

  const fetchVerses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both Arabic and English translations
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`)
      ]);

      if (!arabicRes.ok || !translationRes.ok) {
        throw new Error('Failed to fetch verses');
      }

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      const combinedVerses = arabicData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation: translationData.data.ayahs[index].text
      }));

      setVerses(combinedVerses);
    } catch (err) {
      setError('Failed to load verses. Please try again.');
      console.error('Error fetching verses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerseClick = (verseNumber: number) => {
    setCurrentVerse(verseNumber);
    verseRefs.current[verseNumber - 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop + container.clientHeight / 2;

    let newCurrentVerse = 1;
    verseRefs.current.forEach((ref, index) => {
      if (ref && ref.offsetTop <= scrollPosition) {
        newCurrentVerse = index + 1;
      }
    });

    if (newCurrentVerse !== currentVerse) {
      setCurrentVerse(newCurrentVerse);
    }
  };

  return (
    <div className="scroll-read-view" style={{
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }} />

      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <h2>{surahName}</h2>
        <div>Verse {currentVerse} of {totalVerses}</div>
      </div>

      {/* Verses Container */}
      <div 
        onScroll={handleScroll}
        style={{
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {loading ? (
          <div style={{ color: 'white', textAlign: 'center' }}>
            Loading verses...
          </div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>
            {error}
          </div>
        ) : (
          verses.map((verse, index) => (
            <div
              key={verse.number}
              ref={el => verseRefs.current[index] = el}
              onClick={() => handleVerseClick(verse.number)}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: currentVerse === verse.number 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            >
              {/* Arabic Text */}
              <div style={{
                fontSize: '1.5rem',
                textAlign: 'right',
                direction: 'rtl',
                color: 'white',
                marginBottom: '1rem',
              }}>
                {verse.arabic}
              </div>

              {/* English Translation */}
              <div style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem',
                lineHeight: '1.6',
              }}>
                {verse.translation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}