/**
 * Enhanced Juz Data Fetcher for AlQuran.cloud API
 * Provides advanced functions to fetch and process Juz data
 * with support for translations, audio, and pagination
 */

import { EDITIONS } from './quranApi';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * Helper function to handle API responses
 * @param endpoint API endpoint to fetch from
 * @returns Promise with the API response data
 */
async function fetchFromAPI(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (data.code === 200 && data.status === 'OK') {
      return data.data;
    } else {
      throw new Error(`API Error: ${data.status}`);
    }
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

// Interface for Juz fetch options
export interface JuzFetchOptions {
  offset?: number;
  limit?: number;
  includeMetadata?: boolean;
}

// Interface for Juz metadata
export interface JuzMetadata {
  juzNumber: number;
  firstVerseKey: string;
  lastVerseKey: string;
  totalVerses: number;
  totalSurahs: number;
  surahs: {
    number: number;
    name: string;
    englishName: string;
    verseCount: number;
    firstVerse: number;
    lastVerse: number;
  }[];
}

// Interface for Juz data
export interface JuzData {
  juzNumber: number;
  ayahs: {
    number: number;
    audio: string;
    audioSecondary: string[];
    text: string;
    translation?: string;
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean | {
      id: number;
      recommended: boolean;
      obligatory: boolean;
    };
  }[];
  surahs?: {
    [surahNumber: string]: {
      name: string;
      englishName: string;
      englishNameTranslation: string;
      revelationType: string;
      ayahs: number[];
    };
  };
  metadata?: JuzMetadata;
}

/**
 * Helper function to handle API errors consistently
 * @param error Error object or string
 * @param defaultMsg Default error message
 * @returns Formatted error message
 */
function formatError(error: any, defaultMsg: string): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return defaultMsg;
}

/**
 * Enhanced function to fetch a specific juz with multiple options
 * @param juzNumber The juz number (1-30)
 * @param edition The Quran edition to fetch (default: Arabic Uthmani text)
 * @param options Additional options like offset, limit, and metadata inclusion
 * @returns Promise with the juz data
 */
export async function getJuzData(
  juzNumber: number,
  edition: string = EDITIONS.ARABIC,
  options: JuzFetchOptions = {}
): Promise<JuzData> {
  try {
    // Validate juz number
    if (juzNumber < 1 || juzNumber > 30) {
      throw new Error(`Invalid juz number: ${juzNumber}. Must be between 1 and 30.`);
    }

    const { offset, limit, includeMetadata = false } = options;
    let endpoint = `/juz/${juzNumber}/${edition}`;
    
    // Add optional query parameters if provided
    const params = [];
    if (offset !== undefined) params.push(`offset=${offset}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    // Fetch juz data
    const juzData = await fetchFromAPI(endpoint);
    
    // Process the data to add additional information
    const processedData = {
      ...juzData,
      juzNumber,
    };
    
    // If includeMetadata flag is true, add detailed metadata about the juz
    if (includeMetadata) {
      // Extract unique surahs in this juz
      const surahsMap: { [key: number]: any } = {};
      
      juzData.ayahs.forEach((ayah) => {
        const surahNumber = ayah.surah.number;
        
        if (!surahsMap[surahNumber]) {
          surahsMap[surahNumber] = {
            name: ayah.surah.name,
            englishName: ayah.surah.englishName,
            englishNameTranslation: ayah.surah.englishNameTranslation,
            revelationType: ayah.surah.revelationType,
            ayahs: [],
          };
        }
        
        surahsMap[surahNumber].ayahs.push(ayah.numberInSurah);
      });
      
      // Create metadata about this juz
      const metadata: JuzMetadata = {
        juzNumber,
        firstVerseKey: `${juzData.ayahs[0]?.surah.number}:${juzData.ayahs[0]?.numberInSurah}`,
        lastVerseKey: `${juzData.ayahs[juzData.ayahs.length - 1]?.surah.number}:${juzData.ayahs[juzData.ayahs.length - 1]?.numberInSurah}`,
        totalVerses: juzData.ayahs.length,
        totalSurahs: Object.keys(surahsMap).length,
        surahs: Object.entries(surahsMap).map(([number, surah]: [string, any]) => ({
          number: parseInt(number),
          name: surah.name,
          englishName: surah.englishName,
          verseCount: surah.ayahs.length,
          firstVerse: Math.min(...surah.ayahs),
          lastVerse: Math.max(...surah.ayahs),
        })),
      };
      
      processedData.surahs = surahsMap;
      processedData.metadata = metadata;
    }
    
    return processedData as JuzData;
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber}:`, error);
    throw new Error(formatError(error, `Failed to fetch Juz ${juzNumber}`));
  }
}

/**
 * Fetch a juz with its translation side by side
 * @param juzNumber The juz number (1-30)
 * @param translationEdition The translation edition (default: English - Saheeh International)
 * @param options Additional options like offset, limit, and metadata inclusion
 * @returns Promise with juz data including translations
 */
export async function getJuzWithTranslation(
  juzNumber: number,
  translationEdition: string = EDITIONS.ENGLISH,
  options: JuzFetchOptions = {}
): Promise<JuzData> {
  try {
    // Fetch both Arabic text and translation in parallel
    const [arabicJuz, translationJuz] = await Promise.all([
      getJuzData(juzNumber, EDITIONS.ARABIC, options),
      getJuzData(juzNumber, translationEdition, options)
    ]);
    
    // Merge the Arabic text with translations
    const mergedJuz = { ...arabicJuz };
    
    // Add translations to each ayah
    mergedJuz.ayahs = arabicJuz.ayahs.map((ayah, index) => {
      return {
        ...ayah,
        translation: translationJuz.ayahs[index]?.text || 'Translation not available'
      };
    });
    
    return mergedJuz;
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber} with translation:`, error);
    throw new Error(formatError(error, `Failed to fetch Juz ${juzNumber} with translation`));
  }
}

/**
 * Fetch multiple juz in one call
 * @param startJuz Starting juz number
 * @param count Number of consecutive juz to fetch
 * @param edition Quran edition to use
 * @param options Additional fetch options
 * @returns Promise with array of juz data
 */
export async function getMultipleJuz(
  startJuz: number,
  count: number = 1,
  edition: string = EDITIONS.ARABIC,
  options: JuzFetchOptions = {}
): Promise<JuzData[]> {
  try {
    // Validate parameters
    if (startJuz < 1 || startJuz > 30) {
      throw new Error(`Invalid start juz number: ${startJuz}. Must be between 1 and 30.`);
    }
    
    if (count < 1 || startJuz + count - 1 > 30) {
      throw new Error(`Invalid juz count: ${count}. Must be at least 1 and cannot exceed juz 30.`);
    }
    
    // Create an array of promises for each juz
    const juzPromises = Array.from({ length: count }, (_, index) => {
      const juzNumber = startJuz + index;
      return getJuzData(juzNumber, edition, options);
    });
    
    // Fetch all juz in parallel
    return await Promise.all(juzPromises);
  } catch (error) {
    console.error(`Error fetching multiple juz:`, error);
    throw new Error(formatError(error, `Failed to fetch multiple juz`));
  }
}

/**
 * Get all audio URLs for a specific juz
 * @param juzNumber The juz number (1-30)
 * @param reciter Reciter ID (default: 'ar.alafasy')
 * @returns Promise with array of audio URLs
 */
export async function getJuzAudioUrls(
  juzNumber: number,
  reciter: string = 'ar.alafasy'
): Promise<string[]> {
  try {
    // Get juz data to know which surahs and verses are included
    const juzData = await getJuzData(juzNumber, EDITIONS.ARABIC, { includeMetadata: true });
    
    // Generate audio URLs for each ayah
    const audioUrls = juzData.ayahs.map(ayah => {
      const surahNumber = ayah.surah.number;
      const ayahNumber = ayah.numberInSurah;
      // Format matches the EveryAyah audio URL pattern
      return `https://everyayah.com/data/${reciter}/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`;
    });
    
    return audioUrls;
  } catch (error) {
    console.error(`Error getting juz audio URLs:`, error);
    throw new Error(formatError(error, `Failed to get audio URLs for Juz ${juzNumber}`));
  }
}

/**
 * Get the complete audio URL for an entire juz
 * Note: Not all reciters have complete juz audio files available
 * 
 * @param juzNumber The juz number (1-30)
 * @param reciter Reciter ID (default: 'ar.alafasy')
 * @returns URL for the complete juz audio file
 */
export function getCompleteJuzAudioUrl(
  juzNumber: number,
  reciter: string = 'ar.alafasy'
): string {
  // Validate juz number
  if (juzNumber < 1 || juzNumber > 30) {
    throw new Error(`Invalid juz number: ${juzNumber}. Must be between 1 and 30.`);
  }
  
  // Return URL for complete juz audio
  // Format: https://download.quranicaudio.com/quran/[reciter]/juz[number].mp3
  return `https://download.quranicaudio.com/quran/${reciter.replace('ar.', '')}/juz${juzNumber}.mp3`;
}

export default {
  getJuzData,
  getJuzWithTranslation,
  getMultipleJuz,
  getJuzAudioUrls,
  getCompleteJuzAudioUrl
};