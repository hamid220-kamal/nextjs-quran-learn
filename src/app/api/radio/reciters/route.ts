import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

export const revalidate = 3600; // Cache for 1 hour

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface ReciterResponse {
  code: number;
  status: string;
  data: {
    recitations: Reciter[];
  };
}

/**
 * GET /api/radio/reciters
 * Fetches all available Quran recitations/reciters from Quran.com API
 * Returns a list of reciters with their styles (Murattal, Mujawwad, Muallim, etc.)
 */
export async function GET(_request: Request) {
  try {
    // Fetch reciters from Quran.com API
    const response = await fetch(`${API_BASE_URL}/resources/recitations?language=en`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Quran.com API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform and enhance reciter data
    const enrichedReciters = data.recitations.map((reciter: Reciter) => ({
      id: reciter.id,
      name: reciter.translated_name?.name || reciter.reciter_name,
      arabicName: reciter.reciter_name,
      style: reciter.style || 'Murattal',
      imageUrl: `https://static.qurancdn.com/images/reciters/${reciter.id}/${reciter.reciter_name.toLowerCase().replace(/\s+/g, '-')}-profile.png`,
      link: `/reciters/${reciter.id}`,
    }));

    return NextResponse.json({
      status: 'success',
      data: enrichedReciters,
    });
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch reciters',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
