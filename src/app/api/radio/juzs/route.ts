import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

export const revalidate = 86400; // Cache for 24 hours

/**
 * GET /api/radio/juzs
 * Fetches all Quran Juzs (parts)
 * Returns metadata for each Juz including starting and ending verses
 */
export async function GET(_request: Request) {
  try {
    // Fetch juzs from Quran.com API
    const response = await fetch(`${API_BASE_URL}/juzs?language=en`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 }, // ISR: revalidate every 24 hours
    });

    if (!response.ok) {
      throw new Error(`Quran.com API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      data: data.juzs || [],
    });
  } catch (error) {
    console.error('Error fetching juzs:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch juzs',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
