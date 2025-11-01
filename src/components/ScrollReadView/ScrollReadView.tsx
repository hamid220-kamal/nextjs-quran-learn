'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './ScrollReadView.module.css';
import { fetchSurahVersesWithTranslation } from '../../utils/quranApi';

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

  // Measure the site's global navbar (if present) and set a CSS variable so
  // the local header can position itself correctly below it. This avoids hard
  // coding heights and fixes overlap on small screens.
  useEffect(() => {
    function setGlobalNavbarHeight() {
      try {
        // Try common selectors used in this repo
        const navbar = document.querySelector('.navbar') as HTMLElement | null;
        const alt = document.querySelector('[data-global-navbar]') as HTMLElement | null;
        const target = navbar ?? alt;
        const height = target ? target.getBoundingClientRect().height : 0;
        document.documentElement.style.setProperty('--global-navbar-height', `${height}px`);
      } catch (e) {
        // ignore
      }
    }

    setGlobalNavbarHeight();
    window.addEventListener('resize', setGlobalNavbarHeight);
    const mo = new MutationObserver(setGlobalNavbarHeight);
    const observed = document.querySelector('.navbar') || document.querySelector('[data-global-navbar]');
    if (observed) mo.observe(observed, { attributes: true, childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', setGlobalNavbarHeight);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchVerses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the shared quran API util which fetches Arabic + English translation
        // Provide a sensible default reciter id for audio-related fields if needed
        const DEFAULT_RECITER_ID = 'ar.alafasy';
        const data = await fetchSurahVersesWithTranslation(surahNumber, DEFAULT_RECITER_ID);

        // Map the utility's VerseWithTranslation -> local Verse shape
        const mapped = data.map((v: any) => ({
          number: v.numberInSurah || v.number || v.numberInSurah,
          text: v.text || v.arabic || '',
          translation: v.translation || v.translationText || ''
        }));

        setVerses(mapped);
      } catch (err: any) {
        // Provide more context for easier debugging
        setError(err?.message || String(err) || 'Unknown error while fetching verses');
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [surahNumber]);

  const handleNextVerse = () => {
    if (currentVerse < totalVerses) {
      setCurrentVerse((prev) => prev + 1);
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.readerContainer}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>← Go back</button>
        <div className={styles.surahInfo}>
          <h1 className={styles.surahTitle}>{surahName}</h1>
          <p className={styles.verseCount}>{totalVerses} Verses</p>
        </div>
      </header>
      <div className={styles.versesContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>Loading...</div>
        ) : error ? (
          <div className={styles.errorContainer}>{error}</div>
        ) : (
          verses.map((verse) => (
            <div key={verse.number} className={styles.verseCard}>
              <span className={styles.verseNumber}>{verse.number}</span>
              <p className={styles.arabicText}>{verse.text}</p>
              <p className={styles.translationText}>{verse.translation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
