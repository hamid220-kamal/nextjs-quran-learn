// Run with: node test-juz-api-simple.js

// For Node.js versions that don't have native fetch
async function main() {
  // Define constants
  const API_BASE_URL = 'https://api.alquran.cloud/v1';
  
  // Simple fetch function that wraps the HTTP request
  async function simpleFetch(url) {
    const https = require('https');
    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
  // Test different Juz API endpoints
  console.log("Testing Juz API with different parameters...\n");
  
  try {
    // Test 1: Basic Juz endpoint
    console.log("Test 1: Fetching Juz 30 (basic)");
    const response1 = await simpleFetch(`${API_BASE_URL}/juz/30/quran-uthmani`);
    if (response1.code === 200) {
      console.log(`✅ Success! Got ${response1.data.ayahs.length} ayahs`);
      console.log(`First ayah: ${response1.data.ayahs[0].text.substring(0, 50)}...\n`);
    } else {
      console.log(`❌ Failed: ${response1.status}\n`);
    }
    
    // Test 2: Juz with translation
    console.log("Test 2: Fetching Juz 30 with Muhammad Asad's translation");
    const response2 = await simpleFetch(`${API_BASE_URL}/juz/30/en.asad`);
    if (response2.code === 200) {
      console.log(`✅ Success! Got ${response2.data.ayahs.length} ayahs`);
      console.log(`First ayah: ${response2.data.ayahs[0].text.substring(0, 50)}...\n`);
    } else {
      console.log(`❌ Failed: ${response2.status}\n`);
    }
    
    // Test 3: Juz with offset and limit
    console.log("Test 3: Fetching Juz 1 with offset=3 and limit=10");
    const response3 = await simpleFetch(`${API_BASE_URL}/juz/1/quran-uthmani?offset=3&limit=10`);
    if (response3.code === 200) {
      console.log(`✅ Success! Got ${response3.data.ayahs.length} ayahs`);
      const ayahNumbers = response3.data.ayahs.map(a => a.number).join(", ");
      console.log(`Ayah numbers: ${ayahNumbers}\n`);
    } else {
      console.log(`❌ Failed: ${response3.status}\n`);
    }
    
  } catch (error) {
    console.error("Error in API tests:", error);
  }
  
  console.log("\n===== Implementation Summary =====");
  console.log("1. The Quran API supports fetching juz data with various parameters:");
  console.log("   - Basic: /juz/{juzNumber}/{edition}");
  console.log("   - With pagination: /juz/{juzNumber}/{edition}?offset={offset}&limit={limit}");
  console.log("   - Multiple editions available (e.g., quran-uthmani, en.asad, en.sahih)");
  console.log("\n2. Our implementation provides:");
  console.log("   - fetchJuz() - For fetching a juz with optional pagination");
  console.log("   - fetchJuzWithTranslation() - For fetching a juz with both Arabic and translation");
  console.log("\n3. Usage examples:");
  console.log("   - Basic: fetchJuz(30)");
  console.log("   - With translation: fetchJuz(30, 'en.asad')");
  console.log("   - With pagination: fetchJuz(1, 'quran-uthmani', { offset: 3, limit: 10 })");
}

// Run the tests
main();