export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description?: string;
  totalDuas?: number;
  icon?: string;
}

export interface Dua {
  id: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  source?: string;
  audio?: string;
}

export interface ApiError {
  message: string;
  status: number;
}