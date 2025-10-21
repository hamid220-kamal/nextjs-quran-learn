export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface SurahResponse {
  surahs: Surah[];
  edition: any;
}

export interface QuranAPIResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean;
  audio?: string;
  translation?: string;
  surahNumber?: number;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}