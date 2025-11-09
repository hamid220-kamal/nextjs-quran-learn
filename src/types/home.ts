export interface LastRead {
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  ayah: number;
  timestamp: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ReadingPreferences {
  translation: string;
  reciter: string;
  fontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
}