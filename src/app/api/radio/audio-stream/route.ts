import { NextResponse, NextRequest } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

// Reciter ID to Quran.com recitation ID mapping
const RECITER_RECITATION_MAP: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14,
};

/**
 * Audio Stream Endpoint
 * Serves Quran audio verses from multiple sources
 * Falls back to direct streaming if CDN unavailable
 * 
 * Usage: GET /api/radio/audio-stream?reciterId=1&verseKey=1:1
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reciterId = searchParams.get('reciterId');
    const verseKey = searchParams.get('verseKey');

    console.log(`[audio-stream] Request: reciterId=${reciterId}, verseKey=${verseKey}`);

    if (!reciterId || !verseKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing parameters: reciterId and verseKey',
        },
        { status: 400 }
      );
    }

    const reciterIdNum = parseInt(reciterId);
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

    // Parse verse key (e.g., "1:1" -> surah 1, verse 1)
    const [surahStr, verseStr] = verseKey.split(':');
    const surahNum = parseInt(surahStr);
    const verseNum = parseInt(verseStr);

    if (isNaN(surahNum) || isNaN(verseNum)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid verse key format',
        },
        { status: 400 }
      );
    }

    console.log(
      `[audio-stream] Fetching from Quran.com API: recitation ${recitationId}, surah ${surahNum}, verse ${verseNum}`
    );

    // Fetch the audio file data from Quran.com API
    const audioResponse = await fetch(
      `${API_BASE_URL}/recitations/${recitationId}/by_chapter/${surahNum}?language=en`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!audioResponse.ok) {
      console.error(
        `[audio-stream] Failed to fetch from Quran.com API: ${audioResponse.status}`
      );
      throw new Error(`Failed to fetch audio metadata: ${audioResponse.status}`);
    }

    const audioData = await audioResponse.json();

    // Find the audio file for this specific verse
    let audioUrl: string | null = null;
    if (audioData.audio_files) {
      const audioFile = audioData.audio_files.find(
        (f: any) => f.verse_key === verseKey
      );
      if (audioFile && audioFile.url) {
        audioUrl = audioFile.url;
        console.log(`[audio-stream] Found audio URL: ${audioUrl}`);
      }
    }

    if (!audioUrl) {
      console.warn(`[audio-stream] No audio found for verse ${verseKey}`);
      return NextResponse.json(
        {
          status: 'error',
          message: `Audio not found for verse ${verseKey}`,
        },
        { status: 404 }
      );
    }

    // Strategy 1: Try standard Quran.com CDN bases
    const cdnBases = [
      'https://cdnsb.qurancdn.com/quran',
      'https://media.quran.com/quran',
      'https://quranaudiocdn.com/quran',
      'https://audio.qurancdn.com/quran',
      'https://download.quran.com/quran',
      'https://quran.com/audio',
    ];

    let audioBuffer: ArrayBuffer | null = null;
    let contentType = 'audio/mpeg';
    let lastError: Error | null = null;

    for (const cdnBase of cdnBases) {
      try {
        const fullUrl = `${cdnBase}/${audioUrl}`;
        console.log(`[audio-stream] Attempting CDN: ${cdnBase}`);

        const cdnResponse = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://quran.com/',
            'Accept': 'audio/mpeg, audio/*, */*',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (cdnResponse.ok && cdnResponse.body) {
          audioBuffer = await cdnResponse.arrayBuffer();
          contentType = cdnResponse.headers.get('content-type') || 'audio/mpeg';
          console.log(
            `[audio-stream] ✓ Successfully fetched audio from ${cdnBase} (${audioBuffer.byteLength} bytes)`
          );
          break;
        } else {
          console.warn(
            `[audio-stream] CDN response not ok: ${cdnBase} returned ${cdnResponse.status}`
          );
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `[audio-stream] Failed to fetch from ${cdnBase}: ${lastError.message}`
        );
      }
    }

    // Strategy 2: If all CDN sources fail, try direct API stream as fallback
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.log(`[audio-stream] All CDNs failed, trying direct audio endpoint...`);
      try {
        // Try to construct direct audio URL from API
        const directUrl = `https://verses.quran.com/random/${audioUrl}`;
        const directResponse = await fetch(directUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0...',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (directResponse.ok) {
          audioBuffer = await directResponse.arrayBuffer();
          contentType = directResponse.headers.get('content-type') || 'audio/mpeg';
          console.log(
            `[audio-stream] ✓ Direct URL worked (${audioBuffer.byteLength} bytes)`
          );
        }
      } catch (error) {
        console.warn(`[audio-stream] Direct URL also failed`);
      }
    }

    // If still no audio, return error with helpful message
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.error(
        `[audio-stream] Failed to fetch audio from all sources. Last error: ${lastError?.message}`
      );
      return NextResponse.json(
        {
          status: 'error',
          message: 'Audio unavailable',
          detail: 'Quran.com CDN is currently unreachable. This may be a temporary DNS or network issue.',
          debug: {
            verse: verseKey,
            reciter: reciterIdNum,
            audioUrl: audioUrl,
            lastError: lastError?.message,
          },
        },
        { status: 503 }
      );
    }

    // Return audio with proper headers for browser playback
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': audioBuffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Cache-Control': 'public, max-age=2592000', // Cache for 30 days
        'Accept-Ranges': 'bytes',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[audio-stream] Error streaming audio:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to stream audio',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  });
}
