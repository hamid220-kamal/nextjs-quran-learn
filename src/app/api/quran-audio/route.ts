import { NextResponse } from 'next/server';

const ALQURAN_BASE_URL = 'https://api.alquran.cloud/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const surahNumber = searchParams.get('surah');
    const verseNumber = searchParams.get('verse');
    const reciterId = searchParams.get('reciter');

    if (!surahNumber || !verseNumber || !reciterId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch audio URL from Alquran.cloud
    const response = await fetch(
      `${ALQURAN_BASE_URL}/ayah/${surahNumber}:${verseNumber}/audio/${reciterId}`
    );

    if (!response.ok) {
      throw new Error(`Alquran API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Verify the response has the expected structure
    if (data.code !== 200 || !data.data || !data.data.audio) {
      throw new Error('Invalid response from Alquran API');
    }

    // Test the audio URL availability
    const audioResponse = await fetch(data.data.audio, { method: 'HEAD' });
    if (!audioResponse.ok) {
      throw new Error('Audio file not accessible');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        audioUrl: data.data.audio,
        metadata: {
          surah: Number(surahNumber),
          verse: Number(verseNumber),
          reciter: reciterId
        }
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