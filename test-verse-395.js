// Test script to verify problematic verse handler works for verse 3:95
import { playProblematicVerse } from './src/utils/problematicVerseHandler';

async function testVerse395() {
  console.log('Testing verse 3:95 with problematic verse handler...');
  
  try {
    const audio = await playProblematicVerse('3:95');
    console.log('SUCCESS: Verse 3:95 loaded successfully from source:', audio.src);
    return true;
  } catch (error) {
    console.error('FAILED: Could not play verse 3:95:', error);
    return false;
  }
}

testVerse395().then(success => {
  if (success) {
    console.log('Test passed! Verse 3:95 can be played.');
  } else {
    console.log('Test failed! Verse 3:95 cannot be played.');
  }
});