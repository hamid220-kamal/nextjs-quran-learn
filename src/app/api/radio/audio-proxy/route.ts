import { NextResponse, NextRequest } from 'next/server';

/**
 * Audio Proxy Endpoint
 * Proxies audio requests from Quran CDN with proper CORS headers
 * 
 * Usage: GET /api/radio/audio-proxy?url=<encoded_audio_url>
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing url parameter',
        },
        { status: 400 }
      );
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(audioUrl);

    // Validate it's a Quran CDN URL for security
    if (!isValidQuranCdnUrl(decodedUrl)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid audio URL',
        },
        { status: 400 }
      );
    }

    // Fetch the audio from the CDN
    const audioResponse = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!audioResponse.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Failed to fetch audio: ${audioResponse.status}`,
        },
        { status: audioResponse.status }
      );
    }

    // Get the audio buffer
    const audioBuffer = await audioResponse.arrayBuffer();

    // Return with proper CORS headers and audio headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'X-Audio-Proxy': 'true',
      },
    });
  } catch (error) {
    console.error('Error proxying audio:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to proxy audio',
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Validate that URL is from trusted Quran CDN
 */
function isValidQuranCdnUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validDomains = [
      'qurancdn.com',
      'static.qurancdn.com',
      'audio.qurancdn.com',
      'cdn.qurancdn.com',
      'everyayah.com',
      'cdn.everyayah.com',
      'quran.alafasy.com',
    ];

    return validDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}
