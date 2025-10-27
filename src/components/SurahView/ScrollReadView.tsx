'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Verse } from '@/types/QuranTypes';
import styles from './ScrollReadView.module.css';

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
    <div 
      className={styles.scrollReadView} 
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className={styles.overlay} />

      <div className={styles.header}>
        <h2>{surahName}</h2>
        <div>Verse {currentVerse} of {totalVerses}</div>
      </div>

      <div 
        className={styles.versesContainer}
        onScroll={handleScroll}
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
              className={`${styles.verseCard} ${currentVerse === verse.number ? styles.active : ''}`}
            >
              <div className={styles.verseNumber}>Verse {verse.number}</div>
              <div className={styles.arabicText}>
                {verse.arabic}
              </div>
              <div className={styles.translationText}>
                {verse.translation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}