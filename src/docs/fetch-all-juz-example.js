/**
 * Example script demonstrating how to fetch all 30 Juz from the Quran API
 */
import { getAllJuzData } from '../utils/quranSectionApi';
import { EDITIONS } from '../utils/quranApi';

/**
 * Fetch and display information about all 30 Juz
 */
async function fetchAllJuzExample() {
  try {
    console.log('Fetching all 30 Juz from the Quran...');
    
    // Fetch all Juz with limited verses per Juz (for faster retrieval)
    const allJuz = await getAllJuzData(EDITIONS.ARABIC, { limit: 5 });
    
    console.log(`Successfully retrieved all ${allJuz.length} Juz`);
    
    // Display summary information for each Juz
    allJuz.forEach((juz, index) => {
      console.log(`\nJuz ${index + 1}:`);
      
      // Group verses by surah for better display
      const surahsInJuz = new Set();
      juz.ayahs.forEach(ayah => {
        surahsInJuz.add(ayah.surah.number);
      });
      
      const surahList = Array.from(surahsInJuz).map(Number).sort((a, b) => a - b);
      
      console.log(`Contains verses from Surah(s): ${surahList.join(', ')}`);
      console.log(`First verse: ${juz.ayahs[0].surah.englishName} (${juz.ayahs[0].surah.number}:${juz.ayahs[0].numberInSurah})`);
      console.log(`Sample text: ${juz.ayahs[0].text.substring(0, 50)}...`);
    });
    
    console.log('\nJuz distribution summary:');
    // Create a distribution map of which surahs appear in which juz
    const surahToJuzMap = {};
    
    allJuz.forEach((juz, juzIndex) => {
      const juzNumber = juzIndex + 1;
      
      // Use a Set to track unique surahs in this juz
      const surahsInCurrentJuz = new Set();
      juz.ayahs.forEach(ayah => {
        surahsInCurrentJuz.add(ayah.surah.number);
      });
      
      // Add to the mapping
      Array.from(surahsInCurrentJuz).forEach(surahNumber => {
        if (!surahToJuzMap[surahNumber]) {
          surahToJuzMap[surahNumber] = [];
        }
        surahToJuzMap[surahNumber].push(juzNumber);
      });
    });
    
    // Display some interesting statistics about the Juz distribution
    const surahsInMultipleJuz = Object.entries(surahToJuzMap)
      .filter(([_, juzList]) => juzList.length > 1)
      .sort((a, b) => a[0] - b[0]);
    
    console.log('Surahs that span multiple Juz:');
    surahsInMultipleJuz.forEach(([surahNumber, juzList]) => {
      const surahData = allJuz
        .find(juz => juz.ayahs.some(ayah => ayah.surah.number === Number(surahNumber)))
        ?.ayahs.find(ayah => ayah.surah.number === Number(surahNumber))?.surah;
      
      if (surahData) {
        console.log(`- Surah ${surahData.englishName} (${surahNumber}) appears in Juz: ${juzList.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('Error in fetchAllJuzExample:', error);
  }
}

// Run the example
fetchAllJuzExample().catch(console.error);

// Export for potential reuse
export { fetchAllJuzExample };