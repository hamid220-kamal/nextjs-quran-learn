/**
 * Radio Audio Backend Utilities
 * Fetches audio URLs and metadata for reciters and surahs
 */

export interface ReciterAudio {
  reciterId: string;
  reciterName: string;
  surahNumber: number;
  surahName: string;
  audioUrl: string;
}

export interface StationAudio {
  stationId: string;
  stationName: string;
  surahNumbers: number[];
  audioUrls: string[];
}

/**
 * Reciter ID to CDN identifier mapping
 */
const RECITER_MAPPING: { [key: string]: string } = {
  '1': 'ahmed_ibn_ali',           // Ahmed ibn Ali al-Ajmy
  '2': 'abdullah_ali_jabir',      // Abdullah Ali Jabir
  '3': 'bandar_balila',           // Bandar Baleela
  '4': 'maher_almuaiqly',         // Maher al-Muaiqly
  '5': 'abdul_basit_murattal',    // AbdulBaset AbdulSamad (Murattal)
  '5b': 'abdul_basit_mujawwad',   // AbdulBaset AbdulSamad (Mujawwad)
  '6': 'mahmoud_khalil',          // Mahmoud Khalil Al-Husary
  '7': 'mishari_alafasy',         // Mishari Rashid al-Afasy
  '8': 'abdul_rahman_sudais',     // Abdur-Rahman as-Sudais
  '9': 'siddiq_minshawi',         // Mohamed Siddiq al-Minshawi
  '10': 'abu_bakr_shatri',        // Abu Bakr al-Shatri
  '11': 'saad_alqureshi',         // Saad al-Ghamdi
  '12': 'hani_rifai',             // Hani ar-Rifai
  '13': 'khalifah_tunaiji',       // Khalifah al-Tunaiji
  '14': 'yasser_ad_dossary',      // Yasser Ad Dossary
};

/**
 * Surah ID mapping for curated stations
 */
const STATION_SURAHS: { [key: string]: number[] } = {
  '2': [36, 56, 67],              // Yaseen, Al-Waqiah, Al-Mulk
  '3': [18],                      // Surah Al-Kahf
  '4': [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114], // Juz Amma (30th Juz - Surahs 78-114)
  '5': [2],                       // Surah Al-Baqarah
};

/**
 * Get audio URL for a reciter and surah
 */
export function getReciterAudioUrl(reciterId: string, surahNumber: number): string {
  const reciterIdentifier = RECITER_MAPPING[reciterId] || reciterId;
  const paddedSurah = String(surahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${paddedSurah}.mp3`;
}

/**
 * Fetch audio for a specific reciter and surah
 */
export async function fetchReciterAudio(
  reciterId: string,
  reciterName: string,
  surahNumber: number,
  surahName: string
): Promise<ReciterAudio> {
  const audioUrl = getReciterAudioUrl(reciterId, surahNumber);
  
  return {
    reciterId,
    reciterName,
    surahNumber,
    surahName,
    audioUrl,
  };
}

/**
 * Fetch all audio URLs for a station
 */
export async function fetchStationAudio(
  stationId: string,
  stationName: string,
  reciterId: string
): Promise<StationAudio> {
  const surahNumbers = STATION_SURAHS[stationId] || [];
  const audioUrls = surahNumbers.map(surah => getReciterAudioUrl(reciterId, surah));

  return {
    stationId,
    stationName,
    surahNumbers,
    audioUrls,
  };
}

/**
 * Get surah name by number
 */
export const SURAH_NAMES: { [key: number]: string } = {
  1: 'Al-Fatiha',
  2: 'Al-Baqarah',
  3: 'Al-Imran',
  4: 'An-Nisa',
  5: 'Al-Maidah',
  6: 'Al-Anam',
  7: 'Al-Araf',
  8: 'Al-Anfal',
  9: 'At-Tawbah',
  10: 'Yunus',
  11: 'Hud',
  12: 'Yusuf',
  13: 'Ar-Rad',
  14: 'Ibrahim',
  15: 'Al-Hijr',
  16: 'An-Nahl',
  17: 'Al-Isra',
  18: 'Al-Kahf',
  19: 'Maryam',
  20: 'Ta-Ha',
  21: 'Al-Anbya',
  22: 'Al-Hajj',
  23: 'Al-Mu\'minun',
  24: 'An-Nur',
  25: 'Al-Furqan',
  26: 'Ash-Shu\'ara',
  27: 'An-Naml',
  28: 'Al-Qasas',
  29: 'Al-Ankabut',
  30: 'Ar-Rum',
  31: 'Luqman',
  32: 'As-Sajdah',
  33: 'Al-Ahzab',
  34: 'Saba',
  35: 'Fatir',
  36: 'Ya-Sin',
  37: 'As-Saffat',
  38: 'Sad',
  39: 'Az-Zumar',
  40: 'Ghafir',
  41: 'Ha-Mim',
  42: 'Ash-Shura',
  43: 'Az-Zukhruf',
  44: 'Ad-Dukhan',
  45: 'Al-Jathiyah',
  46: 'Al-Ahqaf',
  47: 'Muhammad',
  48: 'Al-Fath',
  49: 'Al-Hujurat',
  50: 'Qaf',
  51: 'Adh-Dhariyat',
  52: 'At-Tur',
  53: 'An-Najm',
  54: 'Al-Qamar',
  55: 'Ar-Rahman',
  56: 'Al-Waqiah',
  57: 'Al-Hadid',
  58: 'Al-Mujadilah',
  59: 'Al-Hashr',
  60: 'Al-Mumtahanah',
  61: 'As-Saff',
  62: 'Al-Jumu\'ah',
  63: 'Al-Munafiqun',
  64: 'At-Taghabun',
  65: 'At-Talaq',
  66: 'At-Tahrim',
  67: 'Al-Mulk',
  68: 'Al-Qalam',
  69: 'Al-Haqqah',
  70: 'Al-Ma\'arij',
  71: 'Nuh',
  72: 'Al-Jinn',
  73: 'Al-Muzzammil',
  74: 'Al-Muddaththir',
  75: 'Al-Qiyamah',
  76: 'Al-Insan',
  77: 'Al-Mursalat',
  78: 'An-Naba',
  79: 'An-Naziat',
  80: 'Abasa',
  81: 'At-Takwir',
  82: 'Al-Infitar',
  83: 'Al-Mutaffifin',
  84: 'Al-Inshiqaq',
  85: 'Al-Buruj',
  86: 'At-Tariq',
  87: 'Al-Ala',
  88: 'Al-Ghashiyah',
  89: 'Al-Fajr',
  90: 'Al-Balad',
  91: 'Ash-Shams',
  92: 'Al-Lail',
  93: 'Ad-Duha',
  94: 'Ash-Sharh',
  95: 'At-Tin',
  96: 'Al-Alaq',
  97: 'Al-Qadr',
  98: 'Al-Bayyinah',
  99: 'Az-Zalzalah',
  100: 'Al-Adiyat',
  101: 'Al-Qaria',
  102: 'At-Takathur',
  103: 'Al-Asr',
  104: 'Al-Humaza',
  105: 'Al-Fil',
  106: 'Quraysh',
  107: 'Al-Ma\'un',
  108: 'Al-Kawthar',
  109: 'Al-Kafirun',
  110: 'An-Nasr',
  111: 'Al-Lahab',
  112: 'Al-Ikhlas',
  113: 'Al-Falaq',
  114: 'An-Nas',
};

/**
 * Validate reciter exists and has audio available
 */
export function isValidReciter(reciterId: string): boolean {
  return reciterId in RECITER_MAPPING;
}

/**
 * Validate surah number
 */
export function isValidSurah(surahNumber: number): boolean {
  return surahNumber >= 1 && surahNumber <= 114;
}
