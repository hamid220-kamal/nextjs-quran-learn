import type { AudioFile } from './loaders';

export type PlaylistTrack = {
  surahId: number;
  reciterId: number;
  url: string;
  title?: string;
};

export type StationConfig = {
  id: string;
  title: string;
  surahs: number[] | 'all';
  reciters: string[]; // Changed to string[] to match JSON/API
  behavior?: {
    loop?: boolean;
    shuffle?: boolean;
  };
};

export type Playlist = PlaylistTrack[];

export function buildPlaylist(
  station: StationConfig,
  audioFiles: AudioFile[]
): Playlist {
  const playlist: Playlist = [];

  if (station.surahs === 'all') {
    // Use all available audio files
    return audioFiles.map(file => ({
      surahId: file.surahId,
      reciterId: file.reciterId,
      url: file.url,
      title: file.surahName
    }));
  }

  // If specific surahs are listed
  if (Array.isArray(station.surahs)) {
    for (const surahId of station.surahs) {
      // Find matching audio file for this surah
      // We assume audioFiles are already filtered for the correct reciter by the loader
      const audio = audioFiles.find((file) => file.surahId === surahId);

      if (audio) {
        playlist.push({
          surahId,
          reciterId: audio.reciterId,
          url: audio.url,
          title: audio.surahName
        });
      }
    }
  }

  return playlist;
}
