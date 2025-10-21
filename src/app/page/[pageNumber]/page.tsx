

import { Metadata } from 'next';
import React from 'react';
import QuranPageClientWrapper from './QuranPageClientWrapper';

const TOTAL_PAGES = 604;
const DEFAULT_TRANSLATION = 'en.asad';
const DEFAULT_AUDIO = 'ar.alafasy';
const ARABIC_EDITION = 'quran-uthmani';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.alquran.cloud/v1';

type Edition = {
  identifier: string;
  language: string;
  name: string;
};

type Ayah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  surah: { number: number; name: string };
  page: number;
};

type PageData = {
  number: number;
  ayahs: Ayah[];
  edition: Edition | null;
};

async function fetchPage(page: number, edition: string): Promise<PageData> {
  const url = `${API_BASE}/page/${page}/${edition}`;
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const json = await res.json();
  return {
    number: page,
    ayahs: json.data.ayahs,
    edition: json.data.edition ?? null,
  };
}

async function fetchAyahAudioUrl(surahNumber: number, ayahNumber: number, audioEdition = DEFAULT_AUDIO): Promise<string | null> {
  const url = `${API_BASE}/ayah/${surahNumber}:${ayahNumber}/${audioEdition}`;
  const res = await fetch(url, { next: { revalidate: 21600 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.audio || null;
}

async function fetchAudioUrlsForPage(ayahs: Ayah[], audioEdition = DEFAULT_AUDIO): Promise<Record<number, string>> {
  const map: Record<number, string> = {};
  const batchSize = 8;
  for (let i = 0; i < ayahs.length; i += batchSize) {
    const batch = ayahs.slice(i, i + batchSize);
    await Promise.all(batch.map(async (a) => {
      try {
        const url = await fetchAyahAudioUrl(a.surah.number, a.numberInSurah, audioEdition);
        if (url) map[a.number] = url;
      } catch {}
    }));
  }
  return map;
}

interface PageViewProps {
  params: {
    pageNumber: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: PageViewProps): Promise<Metadata> {
  const pageNumber = parseInt(params.pageNumber);
  return {
    title: `Quran — Page ${pageNumber} / ${TOTAL_PAGES}`,
    description: `Quran page ${pageNumber}: Arabic text with translation and audio.`,
    keywords: `quran, page ${pageNumber}, quran page, mushaf page ${pageNumber}`,
    openGraph: {
      title: `Quran — Page ${pageNumber}`,
      description: `Quran page ${pageNumber}: Arabic text with translation and audio.`,
      url: `https://yourdomain.example/page/${pageNumber}`,
    },
  };
}


export default async function QuranPageView({ params, searchParams }: PageViewProps) {
  const pageNumber = parseInt(params.pageNumber);
  const translationEdition = typeof searchParams?.translation === 'string' ? searchParams.translation : DEFAULT_TRANSLATION;
  const audioEdition = typeof searchParams?.audio === 'string' ? searchParams.audio : DEFAULT_AUDIO;

  let arabicPage: PageData | null = null;
  let translationPage: PageData | null = null;
  let audioMap: Record<number, string> = {};
  try {
    [arabicPage, translationPage] = await Promise.all([
      fetchPage(pageNumber, ARABIC_EDITION),
      fetchPage(pageNumber, translationEdition).catch(() => null),
    ]);
    if (arabicPage) {
      audioMap = await fetchAudioUrlsForPage(arabicPage.ayahs, audioEdition);
    }
  } catch {}

  if (!arabicPage) {
    return <main className="max-w-2xl mx-auto p-8 text-center">Failed to load Quran page.</main>;
  }

  // Merge ayahs by global ayah number
  const ayahs = arabicPage.ayahs.map((a) => {
    const translationAyah = translationPage?.ayahs?.find((t: any) => t.number === a.number);
    return {
      number: a.number,
      arabic: a.text,
      translation: translationAyah?.text ?? undefined,
      surahNumber: a.surah.number,
      numberInSurah: a.numberInSurah,
      audioUrl: audioMap[a.number] ?? undefined,
    };
  });

  return (
    <QuranPageClientWrapper
      pageNumber={pageNumber}
      translationEdition={translationEdition}
      audioEdition={audioEdition}
      ayahs={ayahs}
    />
  );
}