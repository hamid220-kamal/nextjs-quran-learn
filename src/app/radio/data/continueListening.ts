export type ContinueItem = {
  stationId: string;
  title: string;
  reciter: string;
  progress: number; // 0–100
};

export const continueListening: ContinueItem[] = [
  {
    stationId: 'full-quran',
    title: 'Full Quran Radio',
    reciter: 'Reciter Placeholder',
    progress: 45,
  },
  {
    stationId: 'surah-kahf',
    title: 'Surah Al-Kahf',
    reciter: 'Reciter Placeholder',
    progress: 10,
  },
  {
    stationId: 'surah-yasin',
    title: 'Surah Yasin',
    reciter: 'Reciter Placeholder',
    progress: 60,
  },
];
