export interface QuranAudioResponse {
  status: 'success' | 'error';
  data?: {
    audioUrl: string;
    metadata: {
      surah: number;
      verse: number;
      reciter: string;
    };
  };
  error?: string;
  details?: string;
}

export async function fetchQuranAudio(
  surahNumber: number,
  verseNumber: number,
  reciterId: string
): Promise<QuranAudioResponse> {
  try {
    const response = await fetch(
      `/api/quran-audio?surah=${surahNumber}&verse=${verseNumber}&reciter=${reciterId}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Quran audio:', error);
    return {
      status: 'error',
      error: 'Failed to fetch audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}