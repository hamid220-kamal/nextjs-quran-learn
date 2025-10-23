// Utility functions for fetching Quran data from alquran.cloud API
// Documentation: https://alquran.cloud/api

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export interface ReciterEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

export interface ReciterWithMetadata extends ReciterEdition {
  averageDuration?: number;  // Average duration in seconds
  totalDuration?: number;    // Total duration for the surah
  languageNative?: string;   // Native name of the language
}

const LANGUAGE_NAMES: { [key: string]: string } = {
  ar: 'العربية',
  ur: 'اردو',
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
  zh: '中文',
};

/**
 * Fetch all available reciters with metadata
 * @returns Promise<ReciterWithMetadata[]>
 */
export async function fetchReciters(): Promise<ReciterWithMetadata[]> {
  try {
    console.log('Fetching reciters...');
    const response = await fetch('https://api.alquran.cloud/v1/edition/format/audio');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Raw API response:', result);

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid API response format');
    }

    // Filter and enhance reciter data
    const reciters = result.data
      .filter((reciter: ReciterEdition) => reciter.format === 'audio')
      .map((reciter: ReciterEdition) => {
        const lang = reciter.identifier.split('.')[0];
        return {
          ...reciter,
          languageNative: LANGUAGE_NAMES[lang] || lang.toUpperCase(),
          averageDuration: reciter.identifier.includes('Mujawwad') ? 45 : 25,
        };
      })
      .sort((a: ReciterWithMetadata, b: ReciterWithMetadata) => {
        if (a.language !== b.language) {
          return a.language === 'ar' ? -1 : b.language === 'ar' ? 1 : a.language.localeCompare(b.language);
        }
        return a.englishName.localeCompare(b.englishName);
      });

    console.log('Processed reciters:', reciters);
    return reciters;
  } catch (error) {
    console.error('Error fetching reciters:', error);
    throw error;
  }
}

/**
 * Get estimated duration for a surah by reciter
 * @param surahNumber - The surah number (1-114)
 * @param reciterId - The reciter's identifier
 * @returns Promise<number> - Estimated duration in seconds
 */
export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
}

export interface VerseWithTranslation extends Verse {
  translation: string;
}

export async function getReciterSurahDuration(surahNumber: number, reciterId: string): Promise<number> {
  try {
    const surahData = await fetchFromAPI(`/surah/${surahNumber}/quran-uthmani`);
    
    // Handle cases where we get an array of data
    const processedData = Array.isArray(surahData) ? surahData[0] : surahData;
    
    if (!processedData) {
      console.warn('No surah data received for surah:', surahNumber);
      return 0;
    }
    
    // If numberOfAyahs is not available, try to get the length from ayahs array
    const numberOfVerses = processedData.numberOfAyahs || (processedData.ayahs?.length) || 0;
    
    if (numberOfVerses === 0) {
      console.warn('Could not determine number of verses for surah:', surahNumber);
      return 0;
    }
    
    const isMujawwad = reciterId.toLowerCase().includes('mujawwad');
    const isMinshawi = reciterId.toLowerCase().includes('minshawi');
    
    // Estimate duration based on recitation style and number of verses
    let averageVerseTime = 25; // default
    if (isMujawwad) {
      averageVerseTime = 45;
    } else if (isMinshawi) {
      averageVerseTime = 35;
    }
    
    return numberOfVerses * averageVerseTime;
  } catch (error) {
    console.error('Error calculating surah duration:', error);
    return 0; // Return 0 instead of throwing to prevent breaking the UI
  }
}

/**
 * Fetch a specific verse with its translation
 */
export async function fetchVerseWithTranslation(
  surahNumber: number, 
  verseNumber: number, 
  reciterId: string
): Promise<VerseWithTranslation> {
  try {
    // Fetch Arabic verse and English translation in parallel
    const [verseData, translationData] = await Promise.all([
      fetchFromAPI(`/ayah/${surahNumber}:${verseNumber}/${reciterId}`),
      fetchFromAPI(`/ayah/${surahNumber}:${verseNumber}/en.sahih`)
    ]);

    return {
      number: verseData.number,
      numberInSurah: verseData.numberInSurah,
      text: verseData.text,
      audio: verseData.audio,
      translation: translationData.text
    };
  } catch (error) {
    console.error('Error fetching verse with translation:', error);
    throw error;
  }
}

/**
 * Fetch all verses of a surah with translations
 */
/**
 * Fetch all verses of a surah with translations
 */
export async function fetchSurahVersesWithTranslation(
  surahNumber: number,
  reciterId: string
): Promise<VerseWithTranslation[]> {
  try {
    // Get the total number of verses in the surah
    const surahData = await fetchFromAPI(`/surah/${surahNumber}`);
    if (!surahData || !surahData.numberOfAyahs) {
      throw new Error(`No surah data found for surah ${surahNumber}`);
    }

    const totalVerses = surahData.numberOfAyahs;
    const verses: VerseWithTranslation[] = [];

    // Fetch verses in smaller batches to avoid overwhelming the API
    const BATCH_SIZE = 5;
    for (let i = 0; i < totalVerses; i += BATCH_SIZE) {
      const batchPromises = Array.from(
        { length: Math.min(BATCH_SIZE, totalVerses - i) },
        async (_, index) => {
          const verseNumber = i + index + 1;
          try {
            const [verseData, translationData] = await Promise.all([
              fetchFromAPI(`/ayah/${surahNumber}:${verseNumber}/${reciterId}`),
              fetchFromAPI(`/ayah/${surahNumber}:${verseNumber}/en.sahih`)
            ]);

            if (!verseData || !translationData) {
              throw new Error(`Failed to fetch verse ${verseNumber}`);
            }

            return {
              number: verseData.number,
              numberInSurah: verseData.numberInSurah,
              text: verseData.text,
              audio: verseData.audio || `https://cdn.islamic.network/quran/audio/128/${reciterId}/${verseData.number}.mp3`,
              translation: translationData.text
            };
          } catch (error) {
            console.error(`Error fetching verse ${verseNumber}:`, error);
            // Return a placeholder verse on error
            return {
              number: verseNumber,
              numberInSurah: verseNumber,
              text: 'Error loading verse',
              audio: '',
              translation: 'Error loading translation'
            };
          }
        }
      );

      const batchVerses = await Promise.all(batchPromises);
      verses.push(...batchVerses);

      // Add a small delay between batches to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return verses;
  } catch (error) {
    console.error('Error fetching surah verses:', error);
    throw error;
  }
}

/**
 * Helper function to handle API responses
 */
async function  fetchFromAPI(endpoint: string) {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid API response format');
    }

    if (data.code !== 200 || data.status !== 'OK') {
      throw new Error(`API error: ${data.status}`);
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error; // Propagate the error to handle it in the calling function
  }
}

/**
 * Available editions for translations and audio
 */
export const EDITIONS = {
  // Text editions
  ARABIC: 'quran-uthmani',
  // Popular translations
  ENGLISH: 'en.sahih',
  ENGLISH_PICKTHALL: 'en.pickthall',
  FRENCH: 'fr.hamidullah',
  SPANISH: 'es.asad',
  GERMAN: 'de.aburida',
  URDU: 'ur.jalandhry',
  // Audio editions
  AUDIO_ALAFASY: 'ar.alafasy',
  AUDIO_MINSHAWI: 'ar.minshawi',
  AUDIO_HUSARY: 'ar.husary',
  AUDIO_MUAIQLY: 'ar.abdulmuhsin',
  AUDIO_SUDAIS: 'ar.abdurrahmaansudais',
};

/**
 * Fetch surahs list (114 surahs)
 * Endpoint: https://api.alquran.cloud/v1/surah
 */
export async function fetchSurahs() {
  return fetchFromAPI('/surah');
}

/**
 * Fetch a specific surah by number
 * Endpoint: https://api.alquran.cloud/v1/surah/{surahNumber}
 */
export async function fetchSurah(surahNumber) {
  return fetchFromAPI(`/surah/${surahNumber}`);
}

/**
 * Fetch a list of all juz (30 juz)
 * Requires making 30 separate API calls
 */
export async function fetchAllJuz() {
  try {
    const juzPromises = Array.from({ length: 30 }, (_, i) => {
      const juzNumber = i + 1;
      return fetchFromAPI(`/juz/${juzNumber}`);
    });
    
    return await Promise.all(juzPromises);
  } catch (error) {
    console.error('Error fetching all juz:', error);
    throw error;
  }
}

/**
 * Options for fetching juz data
 */
interface JuzFetchOptions {
  offset?: number;
  limit?: number;
}

/**
 * Fetch a specific juz by number with optional offset and limit parameters
 * Endpoint: https://api.alquran.cloud/v1/juz/{juzNumber}[?offset={offset}&limit={limit}]
 * @param {number} juzNumber - The juz number (1-30)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {JuzFetchOptions} options - Optional parameters for offset and limit
 */
export async function fetchJuz(juzNumber: number, edition = EDITIONS.ARABIC, options: JuzFetchOptions = {}) {
  const { offset, limit } = options;
  let endpoint = `/juz/${juzNumber}/${edition}`;
  
  // Add optional query parameters if provided
  const params: string[] = [];
  if (offset !== undefined) params.push(`offset=${offset}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific juz with translation and optional offset and limit parameters
 * Endpoint: https://api.alquran.cloud/v1/juz/{juzNumber}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} juzNumber - The juz number (1-30)
 * @param {string} translationEdition - The translation edition to use (default: EDITIONS.ENGLISH)
 * @param {JuzFetchOptions} options - Optional parameters for offset and limit
 */
export async function fetchJuzWithTranslation(juzNumber: number, translationEdition = EDITIONS.ENGLISH, options: JuzFetchOptions = {}) {
  try {
    // Fetch both the Arabic and the translation in parallel
    const [arabicJuz, translationJuz] = await Promise.all([
      fetchJuz(juzNumber, EDITIONS.ARABIC, options),
      fetchJuz(juzNumber, translationEdition, options)
    ]);
    
    // Merge the Arabic text with translations
    const juzWithTranslation = { ...arabicJuz };
    
    // Add translations to each ayah
    juzWithTranslation.ayahs = arabicJuz.ayahs.map((ayah, index) => {
      return {
        ...ayah,
        translation: translationJuz.ayahs[index]?.text || 'Translation not available'
      };
    });
    
    return juzWithTranslation;
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber} with translation:`, error);
    throw error;
  }
}

/**
 * Fetch a specific page by number
 * Endpoint: https://api.alquran.cloud/v1/page/{pageNumber}
 * Total pages: 604
 */
export async function fetchPage(pageNumber) {
  return fetchFromAPI(`/page/${pageNumber}`);
}

/**
 * Fetch a specific manzil by number
 * Endpoint: https://api.alquran.cloud/v1/manzil/{manzilNumber}
 * Total manzils: 7
 */
export async function fetchManzil(manzilNumber) {
  return fetchFromAPI(`/manzil/${manzilNumber}`);
}

/**
 * Fetch a specific hizb quarter by number
 * Endpoint: https://api.alquran.cloud/v1/hizbQuarter/{hizbNumber}
 * Total hizb quarters: 240 (60 hizb * 4 quarters each)
 */
export async function fetchHizbQuarter(hizbNumber) {
  return fetchFromAPI(`/hizbQuarter/${hizbNumber}`);
}

/**
 * Fetch all manzil data (7 manzil)
 */
export async function fetchAllManzil() {
  try {
    const manzilPromises = Array.from({ length: 7 }, (_, i) => {
      const manzilNumber = i + 1;
      return fetchFromAPI(`/manzil/${manzilNumber}`);
    });
    
    return await Promise.all(manzilPromises);
  } catch (error) {
    console.error('Error fetching all manzil:', error);
    throw error;
  }
}

/**
 * Fetch all hizb data (60 hizb)
 * Note: The API provides hizbQuarter endpoints (240 total)
 * We'll get the main hizb (every 4th quarter)
 */
export async function fetchAllHizb() {
  try {
    const hizbPromises = Array.from({ length: 60 }, (_, i) => {
      const hizbNumber = (i * 4) + 1;  // Get the first quarter of each hizb
      return fetchFromAPI(`/hizbQuarter/${hizbNumber}`);
    });
    
    return await Promise.all(hizbPromises);
  } catch (error) {
    console.error('Error fetching all hizb:', error);
    throw error;
  }
}

/**
 * Fetch all ruku data
 * Note: The AlQuran.cloud API doesn't have a direct endpoint for rukus
 * The ruku information is available in the metadata of ayahs
 * For our purposes, we'll use surah data and approximate the ruku count
 */
export async function getRukuInfo() {
  // The total number of rukus in the Quran is 556
  return {
    totalRuku: 556,
    // We can't easily get precise ruku data from the API
    // For detailed ruku information, we'd need to analyze ayah metadata
  };
}

/**
 * Fetch the complete Quran structure data
 * This provides counts of all major Quran divisions
 */
export async function fetchQuranStructure() {
  try {
    // Fetch surahs which is the most basic data we need
    const surahs = await fetchSurahs();
    
    return {
      surahs,
      totalSurahs: 114,
      totalJuz: 30,
      totalManzil: 7,
      totalHizb: 60,
      totalPages: 604,
      totalRuku: 556,
      apiBaseUrl: API_BASE_URL
    };
  } catch (error) {
    console.error('Error fetching Quran structure:', error);
    throw error;
  }
}

/**
 * Fetch the complete Quran text
 * Endpoint: https://api.alquran.cloud/v1/quran/{edition}
 */
export async function fetchCompleteQuran(edition = EDITIONS.ARABIC) {
  return fetchFromAPI(`/quran/${edition}`);
}

/**
 * Fetch a specific surah with a translation
 * Endpoint: https://api.alquran.cloud/v1/surah/{surahNumber}/{edition}
 */
export async function fetchSurahWithTranslation(surahNumber, translationEdition = EDITIONS.ENGLISH) {
  try {
    // Fetch both the Arabic and the translation in parallel
    const [arabicSurah, translationSurah] = await Promise.all([
      fetchFromAPI(`/surah/${surahNumber}/${EDITIONS.ARABIC}`),
      fetchFromAPI(`/surah/${surahNumber}/${translationEdition}`)
    ]);
    
    // Merge the Arabic text with translations
    const surahWithTranslation = { ...arabicSurah };
    
    // Add translations to each ayah
    surahWithTranslation.ayahs = arabicSurah.ayahs.map((ayah, index) => {
      return {
        ...ayah,
        translation: translationSurah.ayahs[index]?.text || 'Translation not available'
      };
    });
    
    return surahWithTranslation;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber} with translation:`, error);
    throw error;
  }
}

/**
 * Get audio URL for a specific verse
 * @param {number} surahNumber - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string} audioEdition - The audio edition to use
 * @returns {Promise<string>} - URL to the audio file
 */
export async function getAyahAudioUrl(surahNumber, ayahNumber, audioEdition = EDITIONS.AUDIO_ALAFASY) {
  try {
    const data = await fetchFromAPI(`/ayah/${surahNumber}:${ayahNumber}/${audioEdition}`);
    if (data && data.audio) {
      return data.audio;
    }
    throw new Error('Audio URL not found in API response');
  } catch (error) {
    console.error('Error fetching ayah audio URL:', error);
    // Return a fallback URL to prevent complete failure
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber * 1000 + ayahNumber}.mp3`;
  }
}

/**
 * Get audio URL for an entire surah
 * @param {number} surahNumber - The surah number (1-114)
 * @param {string} audioEdition - The audio edition to use
 * @returns {Promise<string>} - URL to the audio file
 */
export async function getSurahAudioUrl(surahNumber, audioEdition = EDITIONS.AUDIO_ALAFASY) {
  // For surah audio, we need to use a different approach
  // We'll directly use the known URL pattern for Islamic Network CDN
  const reciterCode = audioEdition.split('.')[1]; // Extract 'alafasy' from 'ar.alafasy'
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterCode}/${surahNumber}.mp3`;
}

/**
 * Fetch audio data for a specific surah
 * @param {number} surahNumber - The surah number (1-114)
 * @param {string} audioEdition - The audio edition to use
 */
export async function fetchSurahAudio(surahNumber, audioEdition = EDITIONS.AUDIO_ALAFASY) {
  return fetchFromAPI(`/surah/${surahNumber}/${audioEdition}`);
}
