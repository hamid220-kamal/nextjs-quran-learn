import { fetchChapters, Chapter } from './api/chapters';
import { fetchReciters, Reciter } from './api';

export type AudioFile = {
  reciterId: number;
  surahId: number;
  url: string;
  surahName: string;
};

export type RadioDataBundle = {
  chapters: Chapter[];
  reciter: Reciter | null;
  audio: AudioFile[];
};

export async function loadRadioData(reciterId: number): Promise<RadioDataBundle> {
  try {
    // Parallel fetch for speed
    const [chapters, reciters] = await Promise.all([
      fetchChapters(),
      fetchReciters()
    ]);

    const reciter = reciters.find(r => r.id === reciterId) || null;

    let audio: AudioFile[] = [];

    if (reciter && reciter.relative_path) {
      // Construct audio URLs using Quran.com pattern
      // Pattern: https://download.quranicaudio.com/quran/{relative_path}/{surah_id_padded}.mp3
      audio = chapters.map(chapter => {
        const paddedId = chapter.id.toString().padStart(3, '0');
        return {
          reciterId: reciter.id,
          surahId: chapter.id,
          url: `https://download.quranicaudio.com/quran/${reciter.relative_path}/${paddedId}.mp3`,
          surahName: chapter.name_simple
        };
      });
    } else {
      // Fallback or legacy handling if needed, but for now return empty if no relative_path
      console.warn(`No relative_path found for reciter ${reciterId}`);
    }

    return { chapters, reciter, audio };
  } catch (error) {
    console.error('Error loading radio data:', error);
    return { chapters: [], reciter: null, audio: [] };
  }
}
