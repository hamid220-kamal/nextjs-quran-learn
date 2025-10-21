/**
 * ENHANCED EMERGENCY FIX
 * This script directly injects the meta information (verses count + revelation type)
 * above the Read button for all surah cards AND applies critical card styling.
 */

(function() {
  // Inject critical CSS first
  function injectCriticalCardStyles() {
    const styleId = 'emergency-card-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Critical Card Styling */
      .quran-surah-card, 
      .quran-juz-card, 
      .quran-page-card, 
      .quran-hizb-card, 
      .quran-manzil-card, 
      .quran-ruku-card,
      .surah-card, 
      .juz-card, 
      .page-card, 
      .hizb-card, 
      .manzil-card, 
      .ruku-card {
        width: 100% !important;
        max-width: 100% !important;
        background: white !important;
        border-radius: 16px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        border-left: 4px solid #0ea5e9 !important;
        padding: 24px 20px !important;
        margin-bottom: 16px !important;
        display: flex !important;
        align-items: center !important;
      }
      
      [class*="number"] {
        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
        color: white !important;
        border-radius: 50% !important;
        width: 50px !important;
        height: 50px !important;
        min-width: 50px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-right: 24px !important;
        font-weight: 700 !important;
      }
      
      [class*="titles"], 
      [class*="content"] {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('💉 Critical card styles injected');
  }
  
  // Run style injection immediately
  injectCriticalCardStyles();
  
  // Run immediately and also after a small delay to ensure DOM is loaded
  function fixAllCards() {
    // Target all types of cards, not just surah cards
    const cards = document.querySelectorAll('.quran-surah-card, .quran-juz-card, .quran-page-card, .quran-hizb-card, .quran-manzil-card, .quran-ruku-card, .surah-card, .juz-card, .page-card, .hizb-card, .manzil-card, .ruku-card');
    
    if (!cards || cards.length === 0) {
      console.log('No cards found, waiting...');
      setTimeout(fixAllCards, 500);
      return;
    }
    
    console.log('Fixing ' + cards.length + ' cards');
    
    cards.forEach((card, index) => {
      // Apply direct card styling
      Object.assign(card.style, {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '24px 20px',
        marginBottom: '16px',
        width: '100%',
        maxWidth: '100%', 
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        borderLeft: '4px solid #0ea5e9',
        transition: 'all 0.2s ease-in-out'
      });
      
      // Style the number badge if it exists
      const numberBadge = card.querySelector('[class*="number"]');
      if (numberBadge) {
        Object.assign(numberBadge.style, {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          color: 'white',
          fontWeight: '700',
          width: '50px',
          height: '50px',
          minWidth: '50px',
          minHeight: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          marginRight: '24px'
        });
      }
      
      // Style content area
      const content = card.querySelector('[class*="titles"], [class*="content"]');
      if (content) {
        Object.assign(content.style, {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          textAlign: 'center'
        });
      }
      
      // Clean up any previous emergency fixes first
      const oldFixes = card.querySelectorAll('.emergency-meta-fix');
      oldFixes.forEach(fix => fix.remove());
      
      // Get surah number
      const numberElem = card.querySelector('.quran-surah-number');
      const surahNumber = numberElem ? parseInt(numberElem.textContent.trim(), 10) : index + 1;
      
      // Get verses count and revelation type from existing elements if possible
      let versesCount = '';
      let revelationType = '';
      
      // Try to find verses count
      const versesElem = card.querySelector('.quran-surah-count');
      if (versesElem && versesElem.textContent) {
        versesCount = versesElem.textContent.trim();
      }
      
      // Try to find revelation type
      const revelationElem = card.querySelector('.quran-surah-revelation');
      if (revelationElem && revelationElem.textContent) {
        revelationType = revelationElem.textContent.trim();
      }
      
      // Determine revelation type based on surah number if not found
      if (!revelationType) {
        // Makkiyah surahs (common ones)
        const makkiyahSurahs = [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
                              21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 
                              37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 
                              54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 
                              78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 
                              92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 
                              106, 107, 108, 109, 111, 112, 113, 114];
                              
        revelationType = makkiyahSurahs.includes(surahNumber) ? 'Makkiyah' : 'Medinah';
      }
      
      // Determine verses count if not found
      if (!versesCount) {
        // Hardcoded counts for common surahs
        const verseCounts = {
          1: '7 Verses',
          2: '286 Verses',
          3: '200 Verses',
          4: '176 Verses',
          5: '120 Verses',
          6: '165 Verses',
          7: '206 Verses',
          9: '129 Verses',
          10: '109 Verses',
          12: '111 Verses',
          18: '110 Verses',
          19: '98 Verses',
          20: '135 Verses',
          36: '83 Verses',
          55: '78 Verses',
          56: '96 Verses',
          67: '30 Verses',
          78: '40 Verses'
        };
        
        versesCount = verseCounts[surahNumber] || surahNumber + ' Verses';
      }
      
      // Create emergency meta fix element
      const metaFixElement = document.createElement('div');
      metaFixElement.className = 'emergency-meta-fix direct-meta-info';
      metaFixElement.classList.add(revelationType.toLowerCase() === 'makkiyah' ? 'makkiyah-gradient' : 'medinah-gradient');
      
      // Apply direct styling
      metaFixElement.style.cssText = `
        position: absolute !important;
        bottom: 40px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        text-align: center !important;
        padding: 8px 0 !important;
        border-top: 1px solid rgba(0,0,0,0.2) !important;
        border-bottom: 1px solid rgba(0,0,0,0.2) !important;
        font-weight: 600 !important;
        color: #183b56 !important;
        font-size: 15px !important;
        z-index: 9999 !important;
        background: ${revelationType.toLowerCase() === 'makkiyah' ? 
          'linear-gradient(to right, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.1))' : 
          'linear-gradient(to right, rgba(173, 216, 230, 0.3), rgba(135, 206, 235, 0.1))'} !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      `;
      
      // Set content
      metaFixElement.textContent = versesCount + ' • ' + revelationType;
      
      // Find the read button or create a container for better positioning
      const readButton = card.querySelector('a[href*="/surah/"], button.read-button, .read-button-container, a.read-button');
      
      if (readButton) {
        // Insert meta info before the read button
        card.insertBefore(metaFixElement, readButton);
        
        // Ensure read button is properly positioned
        readButton.style.position = 'absolute';
        readButton.style.bottom = '10px';
        readButton.style.left = '50%';
        readButton.style.transform = 'translateX(-50%)';
        readButton.style.zIndex = '5';
      } else {
        // Add to card if no read button found
        card.appendChild(metaFixElement);
      }
      
      console.log(`Fixed card ${surahNumber}: ${versesCount} • ${revelationType}`);
    });
  }
  
  // Run immediately
  fixAllCards();
  
  // Also run after DOM is fully loaded
  document.addEventListener('DOMContentLoaded', fixAllCards);
  
  // Run again after a delay to catch any late rendering
  setTimeout(fixAllCards, 1000);
  setTimeout(fixAllCards, 2000);
  
  // Setup mutation observer to watch for dynamic content
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      setTimeout(fixAllCards, 100);
    }
  });
  
  // Start observing with enhanced configuration
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
})();