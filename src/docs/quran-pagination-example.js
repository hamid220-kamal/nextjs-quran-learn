/**
 * Example usage of Quran section API functions with pagination
 */
import {
  getSurahData,
  getJuzData,
  getManzilData,
  getHizbData,
  getRukuData,
  getPageData
} from '../utils/quranSectionApi';
import { EDITIONS } from '../utils/quranApi';

/**
 * Example function demonstrating pagination with Surah API
 */
async function surahPaginationExample() {
  try {
    console.log('--- Surah Pagination Example ---');
    
    // Get first 10 verses from Surah Al-Baqarah (Surah 2)
    console.log('Fetching first 10 verses from Surah Al-Baqarah:');
    const firstTenVerses = await getSurahData(2, EDITIONS.ARABIC, { limit: 10 });
    console.log(`Received ${firstTenVerses.ayahs.length} verses`);
    
    // Get next 10 verses (verses 11-20)
    console.log('\nFetching verses 11-20 from Surah Al-Baqarah:');
    const nextTenVerses = await getSurahData(2, EDITIONS.ARABIC, { offset: 10, limit: 10 });
    console.log(`Received ${nextTenVerses.ayahs.length} verses`);
    
    // Display verse numbers from both pages
    console.log('\nFirst page verse numbers:', firstTenVerses.ayahs.map(a => a.numberInSurah));
    console.log('Second page verse numbers:', nextTenVerses.ayahs.map(a => a.numberInSurah));
  } catch (error) {
    console.error('Error in surah pagination example:', error);
  }
}

/**
 * Example function demonstrating pagination with Juz API
 */
async function juzPaginationExample() {
  try {
    console.log('\n\n--- Juz Pagination Example ---');
    
    // Get first 20 verses from Juz 30
    console.log('Fetching first 20 verses from Juz 30:');
    const firstTwentyVerses = await getJuzData(30, EDITIONS.ARABIC, { limit: 20 });
    console.log(`Received ${firstTwentyVerses.ayahs.length} verses`);
    
    // Get next 20 verses
    console.log('\nFetching next 20 verses from Juz 30:');
    const nextTwentyVerses = await getJuzData(30, EDITIONS.ARABIC, { offset: 20, limit: 20 });
    console.log(`Received ${nextTwentyVerses.ayahs.length} verses`);
    
    // Display surah:verse format for each page
    console.log('\nFirst page verses:', firstTwentyVerses.ayahs.map(a => `${a.surah.number}:${a.numberInSurah}`));
    console.log('Second page verses:', nextTwentyVerses.ayahs.map(a => `${a.surah.number}:${a.numberInSurah}`));
  } catch (error) {
    console.error('Error in juz pagination example:', error);
  }
}

/**
 * Example function demonstrating pagination with translations
 */
async function translationPaginationExample() {
  try {
    console.log('\n\n--- Translation Pagination Example ---');
    
    // Get first 5 verses from Surah Al-Fatihah in English
    console.log('Fetching Surah Al-Fatihah in English:');
    const englishVerses = await getSurahData(1, EDITIONS.ENGLISH, { limit: 5 });
    
    // Get first 5 verses from Surah Al-Fatihah in French
    console.log('Fetching Surah Al-Fatihah in French:');
    const frenchVerses = await getSurahData(1, EDITIONS.FRENCH, { limit: 5 });
    
    // Display translations side by side
    console.log('\nEnglish vs French translations:');
    for (let i = 0; i < englishVerses.ayahs.length; i++) {
      console.log(`Verse ${i+1}:`);
      console.log(`English: ${englishVerses.ayahs[i].text}`);
      console.log(`French: ${frenchVerses.ayahs[i].text}`);
      console.log('---');
    }
  } catch (error) {
    console.error('Error in translation pagination example:', error);
  }
}

/**
 * Example function demonstrating pagination with other Quran sections
 */
async function otherSectionsPaginationExample() {
  try {
    console.log('\n\n--- Other Sections Pagination Example ---');
    
    // Get first 10 verses from Manzil 1
    console.log('Fetching first 10 verses from Manzil 1:');
    const manzilData = await getManzilData(1, EDITIONS.ARABIC, { limit: 10 });
    console.log(`Received ${manzilData.ayahs.length} verses from Manzil 1`);
    
    // Get first 10 verses from Hizb 1
    console.log('\nFetching first 10 verses from Hizb Quarter 1:');
    const hizbData = await getHizbData(1, EDITIONS.ARABIC, { limit: 10 });
    console.log(`Received ${hizbData.ayahs.length} verses from Hizb Quarter 1`);
    
    // Get first 10 verses from Ruku 1
    console.log('\nFetching first 10 verses from Ruku 1:');
    const rukuData = await getRukuData(1, EDITIONS.ARABIC, { limit: 10 });
    console.log(`Received ${rukuData.ayahs.length} verses from Ruku 1`);
    
    // Get first 10 verses from Page 1
    console.log('\nFetching first 10 verses from Page 1:');
    const pageData = await getPageData(1, EDITIONS.ARABIC, { limit: 10 });
    console.log(`Received ${pageData.ayahs.length} verses from Page 1`);
  } catch (error) {
    console.error('Error in other sections pagination example:', error);
  }
}

// Main function to run all examples
async function runAllExamples() {
  await surahPaginationExample();
  await juzPaginationExample();
  await translationPaginationExample();
  await otherSectionsPaginationExample();
  console.log('\nAll examples completed!');
}

// Run the examples when imported
runAllExamples().catch(console.error);

export {
  surahPaginationExample,
  juzPaginationExample,
  translationPaginationExample,
  otherSectionsPaginationExample
};