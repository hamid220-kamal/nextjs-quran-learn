/**
 * Example usage of Quran section API functions
 * 
 * This file demonstrates how to use the quranSectionApi.ts functions
 * to fetch and display different sections of the Quran.
 */

// Import all the section fetch functions
import {
  getSurahData,
  getJuzData,
  getManzilData,
  getHizbData,
  getRukuData,
  getPageData
} from '../utils/quranSectionApi';

/**
 * Example function to fetch and process a Surah
 * @param {number} surahNumber - The surah number (1-114)
 */
async function fetchAndDisplaySurah(surahNumber) {
  try {
    const surahData = await getSurahData(surahNumber);
    console.log(`Displaying Surah ${surahData.englishName} (${surahData.name})`);
    console.log(`Revelation type: ${surahData.revelationType}`);
    console.log(`Number of verses: ${surahData.numberOfAyahs}`);
    
    // Process verses
    surahData.ayahs.forEach(ayah => {
      console.log(`${ayah.numberInSurah}: ${ayah.text}`);
    });
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error);
  }
}

/**
 * Example function to fetch and process a Juz
 * @param {number} juzNumber - The juz number (1-30)
 */
async function fetchAndDisplayJuz(juzNumber) {
  try {
    const juzData = await getJuzData(juzNumber);
    console.log(`Displaying Juz ${juzNumber}`);
    console.log(`Total verses: ${juzData.ayahs.length}`);
    
    // Group verses by surah for better display
    const verseBySurah = {};
    juzData.ayahs.forEach(ayah => {
      const surahNumber = ayah.surah.number;
      if (!verseBySurah[surahNumber]) {
        verseBySurah[surahNumber] = {
          name: ayah.surah.name,
          englishName: ayah.surah.englishName,
          verses: []
        };
      }
      verseBySurah[surahNumber].verses.push(ayah);
    });
    
    // Display verses grouped by surah
    Object.keys(verseBySurah).forEach(surahNumber => {
      const surah = verseBySurah[surahNumber];
      console.log(`Surah ${surah.englishName} (${surah.name})`);
      surah.verses.forEach(ayah => {
        console.log(`${ayah.surah.number}:${ayah.numberInSurah} - ${ayah.text}`);
      });
    });
  } catch (error) {
    console.error(`Error fetching Juz ${juzNumber}:`, error);
  }
}

/**
 * Example function to fetch and process a Manzil
 * @param {number} manzilNumber - The manzil number (1-7)
 */
async function fetchAndDisplayManzil(manzilNumber) {
  try {
    const manzilData = await getManzilData(manzilNumber);
    console.log(`Displaying Manzil ${manzilNumber}`);
    console.log(`Total verses: ${manzilData.ayahs.length}`);
    
    // Process verses
    // (Similar logic as Juz display, could be refactored into a helper function)
  } catch (error) {
    console.error(`Error fetching Manzil ${manzilNumber}:`, error);
  }
}

/**
 * Example function to fetch and process a Hizb
 * @param {number} hizbNumber - The hizb quarter number (1-240)
 */
async function fetchAndDisplayHizb(hizbNumber) {
  try {
    const hizbData = await getHizbData(hizbNumber);
    console.log(`Displaying Hizb Quarter ${hizbNumber}`);
    console.log(`Total verses: ${hizbData.ayahs.length}`);
    
    // Process verses
  } catch (error) {
    console.error(`Error fetching Hizb ${hizbNumber}:`, error);
  }
}

/**
 * Example function to fetch and process a Ruku
 * @param {number} rukuNumber - The ruku number (1-556)
 */
async function fetchAndDisplayRuku(rukuNumber) {
  try {
    const rukuData = await getRukuData(rukuNumber);
    console.log(`Displaying Ruku ${rukuNumber}`);
    console.log(`Total verses: ${rukuData.ayahs.length}`);
    
    // Process verses
  } catch (error) {
    console.error(`Error fetching Ruku ${rukuNumber}:`, error);
  }
}

/**
 * Example function to fetch and process a Page
 * @param {number} pageNumber - The page number (1-604)
 */
async function fetchAndDisplayPage(pageNumber) {
  try {
    const pageData = await getPageData(pageNumber);
    console.log(`Displaying Page ${pageNumber}`);
    console.log(`Total verses: ${pageData.ayahs.length}`);
    
    // Process verses
  } catch (error) {
    console.error(`Error fetching Page ${pageNumber}:`, error);
  }
}

// Main execution example
async function main() {
  try {
    // Example usage of all section fetch functions
    await fetchAndDisplaySurah(1);  // Al-Fatiha
    await fetchAndDisplayJuz(1);    // First Juz
    await fetchAndDisplayManzil(1); // First Manzil
    await fetchAndDisplayHizb(1);   // First Hizb Quarter
    await fetchAndDisplayRuku(1);   // First Ruku
    await fetchAndDisplayPage(1);   // First Page
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Call main function
main();