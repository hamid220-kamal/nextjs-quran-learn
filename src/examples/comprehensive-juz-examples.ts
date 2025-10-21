/**
 * Comprehensive example demonstrating various ways to fetch Juz data
 * 
 * This example shows:
 * 1. Fetching a juz with a single edition
 * 2. Fetching a juz with multiple translations
 * 3. Fetching a juz with pagination
 * 4. Fetching all juz at once
 */

import { getJuzData, getJuzWithTranslations, getAllJuzData } from '../utils/quranSectionApi';
import { EDITIONS } from '../utils/quranApi';

async function comprehensiveJuzExample() {
  try {
    console.log('===============================================');
    console.log('Comprehensive Juz API Examples');
    console.log('===============================================\n');
    
    // Example 1: Fetch Juz 30 with default Arabic edition
    console.log('EXAMPLE 1: Fetch Juz 30 with default Arabic edition');
    console.log('-------------------------------------------------');
    const juz30 = await getJuzData(30);
    console.log(`Juz 30: ${juz30.ayahs.length} ayahs`);
    console.log(`First ayah: ${juz30.ayahs[0].text.substring(0, 50)}...\n`);
    
    // Example 2: Fetch Juz 29 with English translation
    console.log('EXAMPLE 2: Fetch Juz 29 with English translation');
    console.log('-------------------------------------------------');
    const juz29English = await getJuzData(29, EDITIONS.ENGLISH);
    console.log(`Juz 29 (English): ${juz29English.ayahs.length} ayahs`);
    console.log(`First ayah: ${juz29English.ayahs[0].text.substring(0, 50)}...\n`);
    
    // Example 3: Fetch Juz 28 with multiple translations
    console.log('EXAMPLE 3: Fetch Juz 28 with multiple translations');
    console.log('-------------------------------------------------');
    const juz28Multi = await getJuzWithTranslations(28, [
      EDITIONS.ARABIC,
      EDITIONS.ENGLISH,
      EDITIONS.FRENCH
    ]);
    console.log(`Juz 28 (Multi): ${juz28Multi.ayahs.length} ayahs`);
    
    // Display first ayah with its translations
    const firstAyahMulti = juz28Multi.ayahs[0];
    console.log(`Arabic: ${firstAyahMulti.text.substring(0, 50)}...`);
    
    if (firstAyahMulti.translations) {
      firstAyahMulti.translations.forEach(trans => {
        console.log(`${trans.edition}: ${trans.text.substring(0, 50)}...`);
      });
    }
    console.log();
    
    // Example 4: Fetch Juz 27 with pagination
    console.log('EXAMPLE 4: Fetch Juz 27 with pagination');
    console.log('-------------------------------------------------');
    const juz27Paginated = await getJuzData(27, EDITIONS.ARABIC, { offset: 10, limit: 5 });
    console.log(`Juz 27 (Paginated): ${juz27Paginated.ayahs.length} ayahs`);
    juz27Paginated.ayahs.forEach((ayah, i) => {
      console.log(`Ayah ${i + 1}: Surah ${ayah.surah.number}:${ayah.numberInSurah}`);
    });
    console.log();
    
    // Example 5: Fetch all 30 Juz (limit to first ayah of each for brevity)
    console.log('EXAMPLE 5: Fetch all 30 Juz (first ayah only)');
    console.log('-------------------------------------------------');
    console.log('This will take some time...');
    const allJuzList = await getAllJuzData(EDITIONS.ARABIC, { limit: 1 });
    console.log(`Fetched all ${allJuzList.length} juz`);
    
    allJuzList.forEach((juz, i) => {
      console.log(`Juz ${i + 1}: First ayah from Surah ${juz.ayahs[0].surah.englishName}`);
    });
    
    console.log('\n===============================================');
    console.log('All examples completed successfully');
    console.log('===============================================');
    
    return {
      juz30,
      juz29English,
      juz28Multi,
      juz27Paginated,
      allJuzList
    };
  } catch (error) {
    console.error('Error in comprehensive Juz example:', error);
    throw error;
  }
}

// Execute the comprehensive example
comprehensiveJuzExample()
  .then(() => console.log('All examples completed without errors.'))
  .catch(error => console.error('Examples failed:', error));

// Export the example function
export default comprehensiveJuzExample;