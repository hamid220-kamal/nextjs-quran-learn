// Utility functions for fetching Quran data from alquran.cloud API
// Documentation: https://alquran.cloud/api

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const FALLBACK_API_URL = 'https://cdn.islamic.network/quran/api/v1';

// Configure fetch with retry logic and timeout
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error('All retry attempts failed');
};

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
export interface AudioSource {
  url: string;
  type: string;
}

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
  audioSources?: AudioSource[];
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
    // Try to fetch complete surah with translations in one request first
    try {
      const completeData = await fetchWithRetry(
        `${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.sahih`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await completeData.json();
      
      if (data?.data?.[0]?.ayahs && data?.data?.[1]?.ayahs) {
        const arabicVerses = data.data[0].ayahs;
        const translationVerses = data.data[1].ayahs;
        
        return arabicVerses.map((verse: any, index: number) => ({
          number: verse.number,
          numberInSurah: verse.numberInSurah,
          text: verse.text,
          audio: `https://cdn.islamic.network/quran/audio/128/${reciterId}/${verse.number}.mp3`,
          translation: translationVerses[index]?.text || 'Translation not available'
        }));
      }
    } catch (bulkError) {
      console.warn('Bulk fetch failed, falling back to batch mode:', bulkError);
    }

    // Fallback: Get the total number of verses and fetch in batches
    const surahData = await fetchWithRetry(
      `${API_BASE_URL}/surah/${surahNumber}`,
      { headers: { 'Accept': 'application/json' } }
    ).then(r => r.json());

    if (!surahData?.data?.numberOfAyahs) {
      throw new Error(`No surah data found for surah ${surahNumber}`);
    }

    const totalVerses = surahData.data.numberOfAyahs;
    const verses: VerseWithTranslation[] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < totalVerses; i += BATCH_SIZE) {
      const batchPromises = Array.from(
        { length: Math.min(BATCH_SIZE, totalVerses - i) },
        async (_, index) => {
          const verseNumber = i + index + 1;
          try {
            // Parallel fetch for Arabic and translation
            const [arabicRes, translationRes] = await Promise.all([
              fetchWithRetry(
                `${API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/${reciterId}`,
                { headers: { 'Accept': 'application/json' } }
              ),
              fetchWithRetry(
                `${API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/en.sahih`,
                { headers: { 'Accept': 'application/json' } }
              )
            ]);

            const [arabicData, translationData] = await Promise.all([
              arabicRes.json(),
              translationRes.json()
            ]);

            if (!arabicData?.data || !translationData?.data) {
              throw new Error(`Invalid response for verse ${verseNumber}`);
            }

            const audioSources = await getAyahAudioUrl(surahNumber, verseNumber, reciterId);
            return {
              number: arabicData.data.number,
              numberInSurah: arabicData.data.numberInSurah,
              text: arabicData.data.text,
              audio: audioSources[0].url, // Keep the primary source for backward compatibility
              audioSources: audioSources, // Add all available sources
              translation: translationData.data.text
            };
          } catch (error) {
            console.error(`Error fetching verse ${verseNumber}:`, error);
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

      // Backoff between batches
      if (i + BATCH_SIZE < totalVerses) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return verses;
  } catch (error) {
    console.error('Error fetching surah verses:', error);
    throw new Error(`Failed to fetch surah ${surahNumber}: ${error.message}`);
  }
}

/**
 * Helper function to handle API responses with fallback URLs
 */
async function fetchWithFallback(endpoint: string, retries = 3) {
  const urls = [
    `${API_BASE_URL}${endpoint}`,
    `${FALLBACK_API_URL}${endpoint}`
  ];
  
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetchWithRetry(url, {}, retries);
      const data = await response.json();
      if (data.code === 200 && data.data) {
        return data.data;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
      lastError = error;
      continue;
    }
  }
  throw lastError || new Error('All API endpoints failed');
}

/**
 * Helper function to handle API responses
 */
async function fetchFromAPI(endpoint: string) {
  try {
    return await fetchWithFallback(endpoint);
  } catch (error) {
    console.error(`Error in fetchFromAPI for ${endpoint}:`, error);
    throw new Error(`Failed to fetch data: ${error.message}`);
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
 * Audio format configuration with fallbacks
 */
interface AudioFormat {
  bitrate: string;
  extension: string;
  mimeType: string;
}

const AUDIO_FORMATS: AudioFormat[] = [
  { bitrate: '128kbps', extension: 'mp3', mimeType: 'audio/mpeg' },
  { bitrate: '64kbps', extension: 'mp3', mimeType: 'audio/mpeg' },
  { bitrate: '32kbps', extension: 'mp3', mimeType: 'audio/mpeg' },
  { bitrate: '192kbps', extension: 'ogg', mimeType: 'audio/ogg' }
];

/**
 * Get audio URL for a specific verse with format fallbacks
 * @param {number} surahNumber - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string} audioEdition - The audio edition to use
 * @returns {Promise<Array<{url: string, type: string}>>} - Array of audio sources with types
 */
export async function getAyahAudioUrl(surahNumber: number, ayahNumber: number, audioEdition = EDITIONS.AUDIO_ALAFASY) {
  try {
    // First try the API endpoint
    const data = await fetchFromAPI(`/ayah/${surahNumber}:${ayahNumber}/${audioEdition}`);
    if (data?.audio) {
      // If API returns a URL, use it as the primary source
      return [{
        url: data.audio,
        type: 'audio/mpeg' // Most API endpoints return MP3
      }];
    }
  } catch (error) {
    console.warn('API audio fetch failed, using fallback URLs:', error);
  }

  // Generate fallback URLs for different formats
  const verseNumber = surahNumber * 1000 + ayahNumber;
  const reciterCode = audioEdition.split('.')[1] || 'alafasy';
  
  // Return an array of audio sources with different formats
  // Create array of possible audio sources with fallbacks
  const sources = [
    // Primary source: everyayah.com MP3
    {
      url: `https://everyayah.com/data/${reciterCode}_128kbps/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`,
      type: 'audio/mpeg'
    },
    // Fallback 1: Islamic Network MP3
    {
      url: `https://cdn.islamic.network/quran/audio/128/${reciterCode}/${surahNumber * 1000 + ayahNumber}.mp3`,
      type: 'audio/mpeg'
    },
    // Fallback 2: everyayah.com lower bitrate
    {
      url: `https://everyayah.com/data/${reciterCode}_64kbps/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`,
      type: 'audio/mpeg'
    },
    // Fallback 3: Alternative CDN ogg format
    {
      url: `https://cdn.islamic.network/quran/audio/${reciterCode}/${surahNumber * 1000 + ayahNumber}.ogg`,
      type: 'audio/ogg'
    }
  ];

  // Return only unique, valid URLs
  return sources.filter((source, index, self) => 
    self.findIndex(s => s.url === source.url) === index
  );
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
