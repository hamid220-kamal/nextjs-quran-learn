'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRukuData } from '@/utils/quranApi';
import QuranVerseCard from '@/components/QuranVerseCard';
import styles from '../styles/ruku.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';

interface QuranVerse {
  number: number;
  text: string;
  translation: string;
  audio: string;
}

interface RukuData {
  rukuNumber: number;
  surahNumber: number;
  startVerse: number;
  endVerse: number;
  verses: QuranVerse[];
}

export default function RukuPage() {
  const params = useParams();
  const rukuId = parseInt(params.id as string);
  const [rukuData, setRukuData] = useState<RukuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRukuData = async () => {
      try {
        setIsLoading(true);
        // Call your API to get the Ruku data
        const response = await fetch(`/api/ruku/${rukuId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Ruku data');
        }
        const data = await response.json();
        setRukuData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (rukuId) {
      fetchRukuData();
    }
  }, [rukuId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!rukuData) {
    return <div className={styles.error}>Ruku not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ruku {rukuData.rukuNumber}</h1>
        <div className={styles.metadata}>
          <span>Surah {rukuData.surahNumber}</span>
          <span>•</span>
          <span>Verses {rukuData.startVerse}-{rukuData.endVerse}</span>
        </div>
      </div>

      <div className={styles.versesContainer}>
        {rukuData.verses.map((verse) => (
          <QuranVerseCard
            key={verse.number}
            verseNumber={verse.number}
            arabicText={verse.text}
            translation={verse.translation}
            audioUrl={verse.audio}
          />
        ))}
      </div>
    </div>
  );
}