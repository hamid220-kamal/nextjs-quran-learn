import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

interface CuratedStation {
  id: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  type: 'curated' | 'reciter' | 'surah' | 'juz';
  content?: string; // 'all' for all surahs, surah number, juz number, etc.
}

/**
 * GET /api/radio/stations
 * Returns curated radio stations and featured content
 * Matches Quran.com radio page structure
 */
export async function GET(_request: Request) {
  try {
    // Curated Stations - Exact Quran.com Radio Page stations
    const curatedStations: CuratedStation[] = [
      {
        id: '1',
        title: 'Popular Recitations',
        description: 'Daily curated feed of recitations',
        image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F1.jpeg&w=1080&q=75',
        featured: true,
        type: 'curated',
        content: 'all',
      },
      {
        id: '2',
        title: 'Yaseen, Al-Waqiah, Al-Mulk',
        description: 'The Surahs from a curation of reciters',
        image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F2.jpg&w=1080&q=75',
        featured: true,
        type: 'curated',
        content: '36,56,67', // Surah numbers
      },
      {
        id: '3',
        title: 'Surah Al-Kahf',
        description: 'Listen to Surah Al-Kahf on repeat',
        image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F3.jpeg&w=1080&q=75',
        featured: true,
        type: 'surah',
        content: '18', // Surah Al-Kahf
      },
      {
        id: '4',
        title: 'Juz Amma',
        description: 'Listen to the final Juz of the Quran',
        image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F4.jpeg&w=1080&q=75',
        featured: true,
        type: 'juz',
        content: '30', // Juz 30
      },
      {
        id: '5',
        title: 'Surah Al-Baqarah',
        description: 'The longest Surah of the Quran',
        image: 'https://quran.com/_next/image?url=%2Fimages%2Fstations%2F5.jpeg&w=1080&q=75',
        featured: true,
        type: 'surah',
        content: '2', // Surah Al-Baqarah
      },
    ];

    // Combine and return all stations
    const allStations = [...curatedStations];

    return NextResponse.json({
      status: 'success',
      data: {
        curatedStations: curatedStations.filter((s) => s.featured),
        allStations: allStations,
        total: allStations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch stations',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
