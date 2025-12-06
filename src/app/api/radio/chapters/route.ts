import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

export const revalidate = 3600; // Cache for 1 hour

export interface Chapter {
  id: number;
  revelation_order: number;
  revelation_place: string;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
}

/**
 * GET /api/radio/chapters
 * Fetches all Quran chapters/surahs
 * Returns chapter metadata including names, verse counts, and revelation info
 */
export async function GET(_request: Request) {
  try {
    // Fetch chapters from Quran.com API
    const response = await fetch(`${API_BASE_URL}/chapters?language=en`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Quran.com API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      data: data.chapters || [],
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch chapters',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
