'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './ScrollReadView.module.css';

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
    async function fetchVerses() {
      try {
        setLoading(true);
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

  const scrollToVerse = useCallback((verseNumber: number) => {
    const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.readerContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading Surah {surahName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.readerContainer}>
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Error Loading Surah</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.backButton} onClick={onBack}>Return to Surah List</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.readerContainer}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton} aria-label={`Back to surah list`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className={styles.backLabel}>Back</span>
        </button>
        <div className={styles.surahInfo}>
          <h1 className={styles.surahTitle}>{surahName}</h1>
          <div className={styles.verseCount}>
            Verse {currentVerse} of {totalVerses}
          </div>
        </div>
        <div style={{ width: '80px' }} /> {/* Balance header layout */}
      </div>

      <div ref={containerRef} className={styles.versesContainer}>
        {verses.map((verse) => (
          <div
            key={verse.number}
            data-verse={verse.number}
            className={styles.verseCard}
          >
            <span className={styles.verseNumber}>{verse.number}</span>
            <div className={styles.arabicText}>{verse.text}</div>
            <div className={styles.translationText}>{verse.translation}</div>
          </div>
        ))}
      </div>

      <div className={styles.navigationControls}>
        <button
          className={styles.navButton}
          onClick={() => {
            if (currentVerse > 1) {
              setCurrentVerse(prev => prev - 1);
              scrollToVerse(currentVerse - 1);
            }
          }}
          disabled={currentVerse === 1}
        >
          Previous
        </button>
        <button
          className={styles.navButton}
          onClick={() => {
            if (currentVerse < totalVerses) {
              setCurrentVerse(prev => prev + 1);
              scrollToVerse(currentVerse + 1);
            }
          }}
          disabled={currentVerse === totalVerses}
        >
          Next
        </button>
      </div>
    </div>
  );
}
