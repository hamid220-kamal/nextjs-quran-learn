import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quran.com/api/v4';

/**
 * GET /api/radio/search
 * Query params:
 *   - q: Search query (required) - can search for surahs, reciters, etc.
 *   - type: 'surah' | 'reciter' | 'all' (optional, default: 'all')
 *
 * Returns search results matching the query
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Search query must be at least 2 characters',
        },
        { status: 400 }
      );
    }

    const results: any = {
      surahs: [],
      reciters: [],
    };

    // Search surahs if type is 'all' or 'surah'
    if (type === 'all' || type === 'surah') {
      try {
        const chaptersResponse = await fetch(
          `${API_BASE_URL}/chapters?language=en`,
          {
            next: { revalidate: 86400 },
          }
        );

        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json();
          const chapters = chaptersData.chapters || [];

          results.surahs = chapters
            .filter(
              (ch: any) =>
                ch.name_simple.toLowerCase().includes(query.toLowerCase()) ||
                ch.name_arabic.includes(query) ||
                ch.name_complex.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10)
            .map((ch: any) => ({
              id: ch.id,
              name: ch.name_simple,
              arabicName: ch.name_arabic,
              versesCount: ch.verses_count,
            }));
        }
      } catch (error) {
        console.error('Error searching surahs:', error);
      }
    }

    // Search reciters if type is 'all' or 'reciter'
    if (type === 'all' || type === 'reciter') {
      try {
        const recitersResponse = await fetch(
          `${API_BASE_URL}/resources/recitations?language=en`,
          {
            next: { revalidate: 3600 },
          }
        );

        if (recitersResponse.ok) {
          const recitersData = await recitersResponse.json();
          const recitations = recitersData.recitations || [];

          results.reciters = recitations
            .filter(
              (r: any) =>
                r.translated_name?.name.toLowerCase().includes(query.toLowerCase()) ||
                r.reciter_name.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10)
            .map((r: any) => ({
              id: r.id,
              name: r.translated_name?.name || r.reciter_name,
              arabicName: r.reciter_name,
              style: r.style || 'Murattal',
            }));
        }
      } catch (error) {
        console.error('Error searching reciters:', error);
      }
    }

    return NextResponse.json({
      status: 'success',
      query: query,
      results: results,
      total: results.surahs.length + results.reciters.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Search failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
