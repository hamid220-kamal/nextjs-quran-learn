/**
 * Example demonstrating how to use the getJuzWithTranslations function
 * 
 * This example shows how to fetch Juz 30 with Arabic text and English translation
 * and handle the combined data structure.
 */

import { getJuzWithTranslations } from '../utils/quranSectionApi';
import { EDITIONS } from '../utils/quranApi';

async function fetchJuzWithTranslationsExample() {
  try {
    console.log('Fetching Juz 30 with Arabic text and English translation...');
    
    // Fetch Juz 30 with Arabic text and English translation
    const juzData = await getJuzWithTranslations(
      30,                               // Juz number
      [EDITIONS.ARABIC, EDITIONS.ENGLISH], // Editions to fetch
      { limit: 5 }                      // Get only the first 5 verses (optional)
    );
    
    console.log('Successfully fetched Juz data:');
    console.log(`Juz Number: ${juzData.number}`);
    console.log(`Total Ayahs: ${juzData.ayahs.length}`);
    
    // Display the first ayah with its translation
    if (juzData.ayahs.length > 0) {
      const firstAyah = juzData.ayahs[0];
      console.log('\nFirst Ayah:');
      console.log(`Surah: ${firstAyah.surah.englishName} (${firstAyah.surah.name})`);
      console.log(`Verse Number: ${firstAyah.numberInSurah}`);
      console.log(`Arabic Text: ${firstAyah.text}`);
      
      if (firstAyah.translations && firstAyah.translations.length > 0) {
        console.log(`English Translation: ${firstAyah.translations[0].text}`);
      }
    }
    
    // Display all ayahs with their translations
    console.log('\nAll Fetched Ayahs:');
    juzData.ayahs.forEach((ayah, index) => {
      console.log(`\n--- Ayah ${index + 1} ---`);
      console.log(`Surah: ${ayah.surah.englishName} (${ayah.surah.name})`);
      console.log(`Verse Number: ${ayah.numberInSurah}`);
      console.log(`Arabic Text: ${ayah.text}`);
      
      if (ayah.translations && ayah.translations.length > 0) {
        console.log(`English Translation: ${ayah.translations[0].text}`);
      }
    });
    
    return juzData;
  } catch (error) {
    console.error('Error in Juz with translations example:', error);
    throw error;
  }
}

// Execute the example function
fetchJuzWithTranslationsExample()
  .then(() => console.log('Example completed successfully.'))
  .catch(error => console.error('Example failed:', error));

// Export the example function for use elsewhere
export default fetchJuzWithTranslationsExample;