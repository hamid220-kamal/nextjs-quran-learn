/**
 * Quran Section API Interface
 * 
 * This file provides standardized functions for fetching different sections of the Quran
 * from the AlQuran.cloud API. Each function follows the same structure and error handling pattern.
 * 
 * Quran Organization:
 * - 114 Surahs (chapters)
 * - 30 Juz (parts)
 * - 7 Manzil (divisions)
 * - 60 Hizb (divisions, each with 4 quarters = 240 quarters total)
 * - 556 Ruku (sections)
 * - 604 Pages (in standard Uthmani script)
 */

import { EDITIONS } from './quranApi';

// Base URL for all API calls
const API_BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * Options for pagination
 */
interface PaginationOptions {
  offset?: number;
  limit?: number;
}

/**
 * Helper function to build endpoint URL with optional query parameters
 * @param {string} basePath - The base endpoint path
 * @param {PaginationOptions} options - Optional pagination parameters
 * @returns {string} - Complete endpoint with query string if needed
 */
function buildEndpoint(basePath: string, options?: PaginationOptions): string {
  if (!options || (options.offset === undefined && options.limit === undefined)) {
    return basePath;
  }
  
  const params = [];
  if (options.offset !== undefined) params.push(`offset=${options.offset}`);
  if (options.limit !== undefined) params.push(`limit=${options.limit}`);
  
  return params.length > 0 ? `${basePath}?${params.join('&')}` : basePath;
}

/**
 * Helper function to handle API responses
 * @param {string} endpoint - The API endpoint to call
 * @returns {Promise<any>} - The data field from the API response
 */
async function fetchFromAPI(endpoint: string) {
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

/**
 * Fetch a specific surah by number
 * Endpoint: https://api.alquran.cloud/v1/surah/{surah}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} surah - The surah number (1-114)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Surah data including ayahs
 */
export async function getSurahData(surah: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/surah/${surah}/${edition}`, options);
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific juz by number
 * Endpoint: https://api.alquran.cloud/v1/juz/{juz}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} juz - The juz number (1-30)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Juz data including ayahs
 */
export async function getJuzData(juz: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/juz/${juz}/${edition}`, options);
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific manzil by number
 * Endpoint: https://api.alquran.cloud/v1/manzil/{manzil}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} manzil - The manzil number (1-7)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Manzil data including ayahs
 */
export async function getManzilData(manzil: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/manzil/${manzil}/${edition}`, options);
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific juz with multiple editions (Arabic + translations)
 * This function fetches the same juz in multiple editions and merges the translations into one response
 * @param {number} juz - The juz number (1-30)
 * @param {string[]} editions - Array of edition codes to fetch (e.g., ['quran-uthmani', 'en.sahih'])
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Juz data with translations merged into each ayah
 */
export async function getJuzWithTranslations(juz: number, editions: string[] = [EDITIONS.ARABIC, EDITIONS.ENGLISH], options?: PaginationOptions) {
  try {
    // Ensure the first edition is Arabic for base structure
    if (!editions.includes(EDITIONS.ARABIC)) {
      editions = [EDITIONS.ARABIC, ...editions];
    }
    
    // Fetch all editions in parallel
    const editionsPromises = editions.map(edition => getJuzData(juz, edition, options));
    const editionsData = await Promise.all(editionsPromises);
    
    // The first edition (Arabic) will be our base
    const baseJuzData = editionsData[0];
    
    // Process only if we have more than one edition
    if (editionsData.length > 1) {
      // Create a map of all ayahs by their key (surah:ayah)
      const translationsByKey = {};
      
      // Start from index 1 to skip the base edition
      for (let i = 1; i < editionsData.length; i++) {
        const editionData = editionsData[i];
        
        // Map each ayah translation by key
        editionData.ayahs.forEach(ayah => {
          const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
          
          if (!translationsByKey[key]) {
            translationsByKey[key] = [];
          }
          
          translationsByKey[key].push({
            edition: editions[i],
            text: ayah.text
          });
        });
      }
      
      // Add translations to each ayah in the base data
      baseJuzData.ayahs = baseJuzData.ayahs.map(ayah => {
        const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
        
        if (translationsByKey[key]) {
          // Add translations array to ayah
          return {
            ...ayah,
            translations: translationsByKey[key]
          };
        }
        
        return ayah;
      });
    }
    
    return baseJuzData;
  } catch (error) {
    console.error(`Error fetching juz ${juz} with translations:`, error);
    throw error;
  }
}

/**
 * Fetch all 30 Juz from the Quran
 * This function fetches all 30 Juz in parallel
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any[]>} - Array of all 30 Juz data
 */
export async function getAllJuzData(edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  try {
    // Create an array of promises for each juz (1-30)
    const juzPromises = Array.from({ length: 30 }, (_, index) => {
      const juzNumber = index + 1; // Juz numbers start from 1
      return getJuzData(juzNumber, edition, options);
    });
    
    // Execute all promises in parallel and wait for all to complete
    const allJuzData = await Promise.all(juzPromises);
    
    console.log(`Successfully fetched all 30 Juz in ${edition} edition`);
    return allJuzData;
  } catch (error) {
    console.error('Error fetching all Juz data:', error);
    throw error;
  }
}

/**
 * Fetch a specific manzil with multiple editions (Arabic + translations)
 * This function fetches the same manzil in multiple editions and merges the translations into one response
 * @param {number} manzil - The manzil number (1-7)
 * @param {string[]} editions - Array of edition codes to fetch (e.g., ['quran-uthmani', 'en.sahih'])
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Manzil data with translations merged into each ayah
 */
export async function getManzilWithTranslations(manzil: number, editions: string[] = [EDITIONS.ARABIC, EDITIONS.ENGLISH], options?: PaginationOptions) {
  try {
    // Fetch the manzil in each requested edition
    const editionsPromises = editions.map(edition => getManzilData(manzil, edition, options));
    const editionsData = await Promise.all(editionsPromises);
    
    // Use the first edition (typically Arabic) as the base
    const baseManzilData = editionsData[0];
    
    // If we have multiple editions, merge the translations
    if (editionsData.length > 1) {
      // Create a map of translations by ayah key
      const translationsByKey = {};
      
      // For each additional edition (translation)
      for (let i = 1; i < editionsData.length; i++) {
        const translationData = editionsData[i];
        const edition = editions[i];
        
        // Map each ayah's translation by its unique key (surah:ayah)
        translationData.ayahs.forEach(ayah => {
          const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
          
          if (!translationsByKey[key]) {
            translationsByKey[key] = [];
          }
          
          translationsByKey[key].push({
            edition: edition,
            text: ayah.text
          });
        });
      }
      
      // Add translations to each ayah in the base data
      baseManzilData.ayahs = baseManzilData.ayahs.map(ayah => {
        const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
        
        if (translationsByKey[key]) {
          // Add translations array to ayah
          return {
            ...ayah,
            translations: translationsByKey[key]
          };
        }
        
        return ayah;
      });
    }
    
    return baseManzilData;
  } catch (error) {
    console.error(`Error fetching manzil ${manzil} with translations:`, error);
    throw error;
  }
}

/**
 * Fetch a specific hizb quarter by number
 * Endpoint: https://api.alquran.cloud/v1/hizbQuarter/{hizb}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} hizb - The hizb quarter number (1-240)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Hizb quarter data including ayahs
 */
export async function getHizbData(hizb: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/hizbQuarter/${hizb}/${edition}`, options);
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific ruku by number
 * Endpoint: https://api.alquran.cloud/v1/ruku/{ruku}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} ruku - The ruku number (1-556)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Ruku data including ayahs
 */
export async function getRukuData(ruku: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/ruku/${ruku}/${edition}`, options);
  return fetchFromAPI(endpoint);
}

/**
 * Fetch a specific page by number
 * Endpoint: https://api.alquran.cloud/v1/page/{page}/{edition}[?offset={offset}&limit={limit}]
 * @param {number} page - The page number (1-604)
 * @param {string} edition - The edition to use (default: quran-uthmani)
 * @param {PaginationOptions} options - Optional pagination parameters (offset and limit)
 * @returns {Promise<any>} - Page data including ayahs
 */
export async function getPageData(page: number, edition = EDITIONS.ARABIC, options?: PaginationOptions) {
  const endpoint = buildEndpoint(`/page/${page}/${edition}`, options);
  return fetchFromAPI(endpoint);
}