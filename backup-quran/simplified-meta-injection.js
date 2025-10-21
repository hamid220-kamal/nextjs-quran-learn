/*
 * Simplified Meta Information Injection Script
 * This script ensures the meta information (verses count and revelation type)
 * is consistently displayed across all devices and browsers.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Function to add meta info to cards
  function addMetaInfoToCards() {
    const cards = document.querySelectorAll('.quran-surah-card');
    
    cards.forEach(card => {
      // Skip if this card already has our meta info
      if (card.querySelector('.direct-meta-info')) return;
      
      // Get data from the card or data attributes
      const surahNumber = parseInt(card.querySelector('.quran-surah-number')?.textContent || '0', 10);
      if (!surahNumber) return;
      
      // Try to get meta content from data attribute first
      const metaContent = card.getAttribute('data-meta-content');
      const revelationType = card.getAttribute('data-revelation-type')?.toLowerCase();
      
      // Create meta info element
      const metaInfo = document.createElement('div');
      metaInfo.className = 'direct-meta-info';
      
      // Apply gradient based on revelation type
      if (revelationType === 'makkiyah' || (surahNumber && [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114].includes(surahNumber))) {
        metaInfo.classList.add('makkiyah-gradient');
      } else {
        metaInfo.classList.add('medinah-gradient');
      }
      
      // Set content based on available data
      let content = '';
      
      if (metaContent) {
        content = metaContent;
      } else {
        // Get verses count if available from card
        const versesCount = card.querySelector('.quran-surah-count')?.textContent?.trim() || '';
        
        // Determine revelation type
        let revType = '';
        if (revelationType) {
          revType = revelationType.charAt(0).toUpperCase() + revelationType.slice(1);
        } else {
          revType = (surahNumber && [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114].includes(surahNumber))
            ? 'Makkiyah'
            : 'Medinah';
        }
        
        // Build content string
        if (versesCount) {
          content = `${versesCount} • ${revType}`;
        } else {
          content = revType;
        }
      }
      
      metaInfo.textContent = content;
      card.appendChild(metaInfo);
    });
  }
  
  // Run initially and set up observer
  setTimeout(addMetaInfoToCards, 500); // Small delay for React to render
  
  // Watch for DOM changes
  const observer = new MutationObserver(function() {
    addMetaInfoToCards();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});