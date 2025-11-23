export type AudioFile = {
  reciterId: number;
  surahId: number;
  url: string;
};

export async function fetchAudioForReciter(reciterId: number): Promise<AudioFile[]> {
  const edition = String(reciterId);
  const result: AudioFile[] = [];

  for (let surah = 1; surah <= 114; surah++) {
    result.push({
      reciterId,
      surahId: surah,
      url: `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${surah}.mp3`,
    });
  }

  return result;
}
