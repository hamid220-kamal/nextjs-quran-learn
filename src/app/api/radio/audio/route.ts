import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

// The API returns relative URLs without a CDN base
// We'll construct full streaming URLs that work with Quran.com's infrastructure
// Using their official pattern from network inspection
const AUDIO_STREAM_BASE = '/api/radio/audio-stream';

// Reciter ID to Quran.com recitation ID mapping
const RECITER_RECITATION_MAP: Record<number, number> = {
  1: 1,   // AbdulBaset AbdulSamad - Mujawwad
  2: 2,   // AbdulBaset AbdulSamad - Murattal
  3: 3,   // Abdur-Rahman as-Sudais
  4: 4,   // Abu Bakr al-Shatri
  5: 5,   // Hani ar-Rifai
  6: 6,   // Mahmoud Khalil Al-Husary
  7: 7,   // Mishari Rashid al-Afasy
  8: 8,   // Mohamed Siddiq al-Minshawi - Mujawwad
  9: 9,   // Mohamed Siddiq al-Minshawi - Murattal
  10: 10, // Sa'ud ash-Shuraym
  11: 11, // Mohamed al-Tablawi
  12: 12, // Mahmoud Khalil Al-Husary - Muallim
  13: 13, // Saad al-Ghamdi
  14: 14, // Yasser Ad Dossary
};

/**
 * GET /api/radio/audio
 * Query params:
 *   - reciterId: Reciter ID (required)
 *   - surahNumber: Surah number (required)
 *   - verseStart: Starting verse number (optional)
 *   - verseEnd: Ending verse number (optional)
 *
 * Returns audio URLs via local streaming endpoint for Quranic audio
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reciterId = searchParams.get('reciterId');
    const surahNumber = searchParams.get('surahNumber');
    const verseStart = searchParams.get('verseStart');
    const verseEnd = searchParams.get('verseEnd');

    if (!reciterId || !surahNumber) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required parameters: reciterId and surahNumber',
        },
        { status: 400 }
      );
    }

    const reciterIdNum = parseInt(reciterId);
    const surahNum = parseInt(surahNumber);

    // Get recitation ID from mapping
    const recitationId = RECITER_RECITATION_MAP[reciterIdNum];
    if (recitationId === undefined) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Reciter ID ${reciterId} not found`,
        },
        { status: 404 }
      );
    }

    // Fetch surah metadata to get verse count and name
    const chapterResponse = await fetch(
      `${API_BASE_URL}/chapters/${surahNum}?language=en`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!chapterResponse.ok) {
      throw new Error('Failed to fetch surah data');
    }

    const chapterData = await chapterResponse.json();
    const chapter = chapterData.chapter;

    // Fetch audio files for this recitation and chapter
    const audioResponse = await fetch(
      `${API_BASE_URL}/recitations/${recitationId}/by_chapter/${surahNum}?language=en`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio files: ${audioResponse.status}`);
    }

    const audioData = await audioResponse.json();

    // Extract audio files and build stream URLs
    const audioUrls: string[] = [];
    const verseNumbers: number[] = [];
    const relativeUrls: string[] = [];

    if (audioData.audio_files && Array.isArray(audioData.audio_files)) {
      const startVerse = verseStart ? parseInt(verseStart) : 1;
      const endVerse = verseEnd ? parseInt(verseEnd) : chapter.verses_count;

      audioData.audio_files.forEach((file: any) => {
        const verseMatch = file.verse_key.match(/:(\d+)$/);
        if (verseMatch) {
          const verseNum = parseInt(verseMatch[1]);
          if (verseNum >= startVerse && verseNum <= endVerse) {
            // Store relative URL (from the API response)
            relativeUrls.push(file.url);
            verseNumbers.push(verseNum);

            // Build stream URL using our backend audio-stream endpoint
            const streamUrl = `/api/radio/audio-stream?reciterId=${reciterIdNum}&verseKey=${file.verse_key}`;
            audioUrls.push(streamUrl);
          }
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        reciterId: reciterIdNum,
        recitationId: recitationId,
        surahNumber: surahNum,
        surahName: chapter.name_simple,
        surahNameArabic: chapter.name_arabic,
        versesCount: chapter.verses_count,
        audioUrls: audioUrls,
        relativeUrls: relativeUrls, // Also provide relative URLs for debugging
        streamBase: AUDIO_STREAM_BASE,
        verseNumbers: verseNumbers,
        startVerse: verseStart ? parseInt(verseStart) : 1,
        endVerse: verseEnd ? parseInt(verseEnd) : chapter.verses_count,
        totalVerses: audioUrls.length,
      },
    });
  } catch (error) {
    console.error('Error fetching audio:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch audio',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
