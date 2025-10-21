// Run with: node test-juz-api-standalone.js

// Import the fetch API for Node.js
// For Node.js >= 18, comment out the next line and use the built-in fetch
import fetch from 'node-fetch';

// For ESM compatibility
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Constants (copied from quranApi.ts)
const API_BASE_URL = 'https://api.alquran.cloud/v1';

const EDITIONS = {
  ARABIC: 'quran-uthmani',
  ENGLISH: 'en.sahih',
};

// Helper function to handle API responses
async function fetchFromAPI(endpoint) {
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

// Function to fetch a specific juz by number with optional parameters
async function fetchJuz(juzNumber, edition = EDITIONS.ARABIC, options = {}) {
  const { offset, limit } = options;
  let endpoint = `/juz/${juzNumber}/${edition}`;
  
  // Add optional query parameters if provided
  const params = [];
  if (offset !== undefined) params.push(`offset=${offset}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return fetchFromAPI(endpoint);
}

// Function to fetch a specific juz with translation and optional parameters
async function fetchJuzWithTranslation(juzNumber, translationEdition = EDITIONS.ENGLISH, options = {}) {
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

// Test function
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