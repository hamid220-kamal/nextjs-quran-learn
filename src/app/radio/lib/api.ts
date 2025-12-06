// API Configuration - Using Backend Routes
const BACKEND_API_BASE = '/api/radio';

export interface Reciter {
  id: number;
  name: string;
  arabicName?: string;
  style?: string;
  imageUrl?: string;
  link?: string;
}

export interface Station {
  id: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
  type?: 'curated' | 'reciter' | 'surah' | 'juz';
  content?: string;
}

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

export interface Juz {
  id: number;
  juz_number: number;
  verses_count: number;
  verses_range: string;
}

/**
 * Fetch all reciters from backend API
 */
export async function fetchReciters(): Promise<Reciter[]> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/reciters`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reciters: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return [];
  }
}

/**
 * Fetch all chapters/surahs from backend API
 */
export async function fetchChapters(): Promise<Chapter[]> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/chapters`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

/**
 * Fetch radio stations from backend API
 */
export async function fetchStations(): Promise<{ curatedStations: Station[]; allStations: Station[] }> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/stations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`);
    }

    const data = await response.json();
    return {
      curatedStations: data.data.curatedStations || [],
      allStations: data.data.allStations || [],
    };
  } catch (error) {
    console.error('Error fetching stations:', error);
    return { curatedStations: [], allStations: [] };
  }
}

/**
 * Fetch audio URLs for a specific reciter and surah
 */
export async function fetchAudio(
  reciterId: number,
  surahNumber: number,
  verseStart?: number,
  verseEnd?: number
): Promise<any> {
  try {
    const params = new URLSearchParams({
      reciterId: reciterId.toString(),
      surahNumber: surahNumber.toString(),
    });

    if (verseStart) params.append('verseStart', verseStart.toString());
    if (verseEnd) params.append('verseEnd', verseEnd.toString());

    const response = await fetch(`${BACKEND_API_BASE}/audio?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching audio:', error);
    throw error;
  }
}

/**
 * Convert CDN audio URL to proxy URL for CORS compatibility
 */
export function getProxiedAudioUrl(cdnUrl: string): string {
  try {
    const encoded = encodeURIComponent(cdnUrl);
    return `/api/radio/audio-proxy?url=${encoded}`;
  } catch (error) {
    console.error('Error proxying audio URL:', error);
    return cdnUrl; // Fallback to direct URL
  }
}

/**
 * Convert array of CDN URLs to proxied URLs
 */
export function getProxiedAudioUrls(cdnUrls: string[]): string[] {
  return cdnUrls.map((url) => getProxiedAudioUrl(url));
}

/**
 * Search for surahs and reciters
 */
export async function searchRadio(
  query: string,
  type: 'all' | 'surah' | 'reciter' = 'all'
): Promise<any> {
  try {
    const params = new URLSearchParams({
      q: query,
      type: type,
    });

    const response = await fetch(`${BACKEND_API_BASE}/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching radio:', error);
    throw error;
  }
}

/**
 * Fetch all Juzs
 */
export async function fetchJuzs(): Promise<Juz[]> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/juzs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch juzs: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching juzs:', error);
    return [];
  }
}

/**
 * Map reciter to station format
 */
export function mapReciterToStation(reciter: Reciter): Station {
  return {
    id: reciter.id.toString(),
    title: reciter.name,
    description: reciter.style || 'Murattal',
    image: reciter.imageUrl || `https://static.qurancdn.com/images/reciters/${reciter.id}/profile.png`,
    featured: false,
    type: 'reciter',
    content: 'all',
  };
}
