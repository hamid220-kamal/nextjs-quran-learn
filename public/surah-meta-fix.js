/**
 * Surah Meta Fix Script
 * This script ensures all surah cards display the verses count and revelation type correctly.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for React to fully render the components
  setTimeout(function() {
    // Force update all meta information on cards
    const surahCards = document.querySelectorAll('.quran-surah-card');
    
    surahCards.forEach(card => {
      // Skip if this card already has a fixed meta info
      if (card.querySelector('.fixed-meta-info')) return;
      
      // Find the existing meta text if any
      const existingMeta = card.querySelector('.quran-surah-meta-text, .direct-meta-info');
      
      // If no meta info exists or it's hidden/not showing correctly, create a new one
      if (!existingMeta || window.getComputedStyle(existingMeta).opacity === '0' || existingMeta.offsetHeight < 5) {
        // Try to gather information from the card
        const surahNumber = parseInt(card.querySelector('.quran-surah-number')?.textContent || '0', 10);
        if (!surahNumber) return;
        
        // Get verses count if available
        const versesElement = card.querySelector('.quran-surah-count');
        const versesCount = versesElement ? versesElement.textContent.trim() : '';
        
        // Determine revelation type based on surah number (hardcoded for key surahs)
        const isMakkiyah = [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114].includes(surahNumber);
        
        // Create the meta info element
        const metaInfo = document.createElement('div');
        metaInfo.className = 'fixed-meta-info direct-meta-info ' + (isMakkiyah ? 'makkiyah-gradient' : 'medinah-gradient');
        // Ensure proper positioning
        metaInfo.style.bottom = '40px';
        
        // Determine content based on available data
        let content = '';
        if (versesCount) {
          content = `${versesCount} • ${isMakkiyah ? 'Makkiyah' : 'Medinah'}`;
        } else {
          // Hardcoded fallback for common surahs
          switch(surahNumber) {
            case 1: content = '7 Verses • Makkiyah'; break;
            case 2: content = '286 Verses • Medinah'; break;
            case 3: content = '200 Verses • Medinah'; break;
            case 4: content = '176 Verses • Medinah'; break;
            case 5: content = '120 Verses • Medinah'; break;
            default: content = isMakkiyah ? 'Makkiyah' : 'Medinah';
          }
        }
        
        metaInfo.textContent = content;
        card.appendChild(metaInfo);
      } else {
        // Ensure existing meta has proper styling
        existingMeta.classList.add('fixed-meta-info');
        
        // Check if it has proper gradient class
        const hasGradientClass = existingMeta.classList.contains('makkiyah-gradient') || 
                               existingMeta.classList.contains('medinah-gradient');
        
        if (!hasGradientClass) {
          const surahNumber = parseInt(card.querySelector('.quran-surah-number')?.textContent || '0', 10);
          const isMakkiyah = [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114].includes(surahNumber);
          
          if (isMakkiyah) {
            existingMeta.classList.add('makkiyah-gradient');
          } else {
            existingMeta.classList.add('medinah-gradient');
          }
        }
      }
    });
  }, 1000); // Delay to ensure React has fully rendered
});

// Also watch for DOM changes to apply to dynamically added cards
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length) {
      // Re-run the fix if new nodes are added
      setTimeout(function() {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
      }, 500);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });