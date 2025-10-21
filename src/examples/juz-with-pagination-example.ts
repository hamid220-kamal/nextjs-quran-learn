/**
 * Example demonstrating how to use the getJuzData function with pagination
 * 
 * This example shows how to fetch a portion of a juz with offset and limit parameters.
 */

import { getJuzData } from '../utils/quranSectionApi';
import { EDITIONS } from '../utils/quranApi';

async function fetchJuzWithPaginationExample() {
  try {
    // Define which juz to fetch and pagination parameters
    const juzNumber = 1;
    const offset = 5;    // Skip the first 5 verses
    const limit = 10;    // Fetch only 10 verses
    
    console.log(`Fetching Juz ${juzNumber} with pagination (offset=${offset}, limit=${limit})...`);
    
    // Fetch juz data with pagination
    const juzData = await getJuzData(
      juzNumber,
      EDITIONS.ARABIC,
      { offset, limit }
    );
    
    console.log('Successfully fetched paginated Juz data:');
    console.log(`Juz Number: ${juzData.number}`);
    console.log(`Fetched Ayahs: ${juzData.ayahs.length}`);
    
    // Check if the pagination worked as expected
    if (juzData.ayahs.length === limit) {
      console.log(`✅ Successfully fetched ${limit} ayahs as requested`);
    } else {
      console.log(`⚠️ Expected ${limit} ayahs but got ${juzData.ayahs.length}`);
    }
    
    // Display range of verses fetched
    const firstAyah = juzData.ayahs[0];
    const lastAyah = juzData.ayahs[juzData.ayahs.length - 1];
    
    console.log('\nRange of verses fetched:');
    console.log(`First: Surah ${firstAyah.surah.englishName} (${firstAyah.surah.number}), Verse ${firstAyah.numberInSurah}`);
    console.log(`Last: Surah ${lastAyah.surah.englishName} (${lastAyah.surah.number}), Verse ${lastAyah.numberInSurah}`);
    
    // Display fetched verses
    console.log('\nFetched Verses:');
    juzData.ayahs.forEach((ayah, index) => {
      console.log(`${index + 1}. Surah ${ayah.surah.number}:${ayah.numberInSurah} - ${ayah.text.substring(0, 50)}...`);
    });
    
    return juzData;
  } catch (error) {
    console.error('Error in Juz with pagination example:', error);
    throw error;
  }
}

// Execute the example function
fetchJuzWithPaginationExample()
  .then(() => console.log('Example completed successfully.'))
  .catch(error => console.error('Example failed:', error));

// Export the example function for use elsewhere
export default fetchJuzWithPaginationExample;