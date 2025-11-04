import { NextResponse } from 'next/server';

const AUDIO_CDN_URL = 'https://everyayah.com/data/Alafasy_128kbps';

// Mapping of reciter IDs to their CDN directories
const RECITER_DIRS = {
  '7': 'Alafasy_128kbps',     // Mishari Rashid Al-Afasy
  '1': 'Abdul_Basit_128kbps', // Abdul Basit
  '2': 'Minshawi_128kbps',    // Mohamed Siddiq Al-Minshawi
  // Add more reciters as needed
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const surahNumber = searchParams.get('surah');
    const verseNumber = searchParams.get('verse');
    const reciterId = searchParams.get('reciter');

    if (!surahNumber || !verseNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters: surah and verse numbers' },
        { status: 400 }
      );
    }

    // Use default reciter if not specified
    const reciterDir = reciterId ? RECITER_DIRS[reciterId] || RECITER_DIRS['7'] : RECITER_DIRS['7'];
    
    // Format numbers with padding (e.g., 1 -> 001)
    const paddedSurah = surahNumber.toString().padStart(3, '0');
    const paddedVerse = verseNumber.toString().padStart(3, '0');
    
    // Construct the audio URL (format: https://everyayah.com/data/Alafasy_128kbps/001001.mp3)
    const audioUrl = `https://everyayah.com/data/${reciterDir}/${paddedSurah}${paddedVerse}.mp3`;
    
    // Verify the audio URL is accessible
    try {
      const audioResponse = await fetch(audioUrl, { 
        method: 'HEAD',
        headers: {
          'Accept': 'audio/mpeg'  // Ensure we're requesting MP3 format
        }
      });

      if (!audioResponse.ok) {
        throw new Error(`Audio file not accessible: ${audioResponse.status}`);
      }

      // Verify content type is audio
      const contentType = audioResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('audio')) {
        console.warn('Warning: Content-Type is not audio:', contentType);
      }
    } catch (error) {
      console.error('Audio URL verification failed:', error);
      throw new Error('Audio file not accessible. Please try again later.');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        audioUrl,
        metadata: {
          surah: Number(surahNumber),
          verse: Number(verseNumber),
          reciter: reciterId || '7',
          format: 'mp3',
          quality: '128kbps'
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600',  // Cache for 1 hour
        'Access-Control-Allow-Origin': '*'        // Allow cross-origin requests
      }
    });

  } catch (error) {
    console.error('Audio API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}