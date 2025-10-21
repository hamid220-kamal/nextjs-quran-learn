// Test file to demonstrate how to use the updated Juz API with various editions and pagination

import { fetchJuz, fetchJuzWithTranslation, EDITIONS } from '../src/utils/quranApi';

async function testJuzAPI() {
  console.log("Testing Juz API...");
  
  try {
    // Example 1: Fetch Juz 30 (basic)
    console.log("\nExample 1: Fetch Juz 30 (basic)");
    const juz30 = await fetchJuz(30);
    console.log(`Successfully fetched Juz 30 with ${juz30.ayahs.length} ayahs`);
    console.log("First ayah:", juz30.ayahs[0].text.substring(0, 50) + "...");
    
    // Example 2: Fetch Juz 30 with Muhammad Asad's translation
    console.log("\nExample 2: Fetch Juz 30 with Muhammad Asad's translation");
    const juz30Asad = await fetchJuz(30, "en.asad");
    console.log(`Successfully fetched Juz 30 (Asad translation) with ${juz30Asad.ayahs.length} ayahs`);
    console.log("First ayah:", juz30Asad.ayahs[0].text.substring(0, 50) + "...");
    
    // Example 3: Fetch Juz 1 with offset 3 and limit 10
    console.log("\nExample 3: Fetch Juz 1 with offset 3 and limit 10");
    const juz1Limited = await fetchJuz(1, EDITIONS.ARABIC, { offset: 3, limit: 10 });
    console.log(`Successfully fetched Juz 1 (limited) with ${juz1Limited.ayahs.length} ayahs`);
    console.log("Ayahs fetched:", juz1Limited.ayahs.map(a => a.number).join(", "));
    
    // Example 4: Fetch Juz 2 with translation and pagination
    console.log("\nExample 4: Fetch Juz 2 with translation and pagination");
    const juz2WithTranslation = await fetchJuzWithTranslation(2, EDITIONS.ENGLISH, { offset: 5, limit: 15 });
    console.log(`Successfully fetched Juz 2 (with translation) with ${juz2WithTranslation.ayahs.length} ayahs`);
    
    if (juz2WithTranslation.ayahs.length > 0) {
      const firstAyah = juz2WithTranslation.ayahs[0];
      console.log("First ayah text:", firstAyah.text.substring(0, 50) + "...");
      console.log("First ayah translation:", firstAyah.translation.substring(0, 50) + "...");
    }
    
  } catch (error) {
    console.error("Error testing Juz API:", error);
  }
}

// Run the test
testJuzAPI();

// Usage instructions
console.log("\n\nUsage Instructions:");
console.log("1. Basic usage: fetchJuz(juzNumber)");
console.log("2. With translation edition: fetchJuz(juzNumber, 'en.asad')");
console.log("3. With pagination: fetchJuz(juzNumber, EDITIONS.ARABIC, { offset: 3, limit: 10 })");
console.log("4. Combined: fetchJuzWithTranslation(juzNumber, EDITIONS.ENGLISH, { offset: 5, limit: 15 })");