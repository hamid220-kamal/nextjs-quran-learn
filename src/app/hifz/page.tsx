


import { Metadata } from 'next';
import HifzClient from './HifzClient';
import './Hifz.css';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Quran Memorization (Hifz) — QuranLearn AI',
  description: 'Memorize the Quran with our AI-powered Hifz program. Advanced memorization techniques, spaced repetition, personalized plans, and progress tracking.',
  keywords: 'quran memorization, hifz, hifdh, quran learning, memorize quran online, quran memory techniques',
  openGraph: {
    title: 'Quran Memorization (Hifz) — QuranLearn AI',
    description: 'AI-powered Quran memorization program with personalized learning plans',
    type: 'website',
    images: [
      {
        url: '/hifz-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Hifz Program'
      }
    ]
  }
};

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Verse {
  id: number;
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
  audio: string;
  hidden: boolean;
  memorized: boolean;
}

interface MemorizationDay {
  day: number;
  verses: string;
  startVerse: number;
  endVerse: number;
  completed: boolean;
}

interface Progress {
  versesMemorized: number;
  percentComplete: number;
}

interface RevisionItem {
  surahNumber: number;
  surahName: string;
  verseNumbers: number[];
  lastReviewed: number;
}

export default function HifzPage() {
  return <HifzClient />;
}