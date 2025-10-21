/**
 * Delayed Fixer - Applies card fixes after the page has loaded
 */

(function() {
  // Apply fixes at various timepoints to catch any dynamic loading
  setTimeout(applyFixes, 500);
  setTimeout(applyFixes, 1500);
  setTimeout(applyFixes, 3000);
  
  function applyFixes() {
    console.log('🕒 Running delayed fixes...');
    
    // Target all possible card selectors
    const cards = document.querySelectorAll(
      '.quran-surah-card, .surah-card, [class*="surah-card"], [class*="SurahCard"], [class*="surahCard"], .card'
    );
    
    if (!cards || cards.length === 0) {
      console.log('No cards found in delayed fix');
      return;
    }
    
    console.log(`Found ${cards.length} cards to fix`);
    
    // Apply brute force fixes
    cards.forEach(card => {
      // 1. Set the card styles
      Object.assign(card.style, {
        position: 'relative',
        height: 'calc(100% + 2px)',
        paddingBottom: '45px',
        overflow: 'visible'
      });
      
      // 2. Fix any meta information elements
      const metaElements = card.querySelectorAll(
        '.surah-meta, .quran-surah-meta, .emergency-meta-fix, .direct-meta-info, .universal-meta-fix, .fixed-meta-info'
      );
      
      if (metaElements.length > 0) {
        metaElements.forEach(meta => {
          Object.assign(meta.style, {
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '0',
            width: '100%',
            textAlign: 'center',
            zIndex: '999',
            display: 'block',
            visibility: 'visible',
            opacity: '1'
          });
        });
      }
      
      // 3. Fix read buttons
      const readButtons = card.querySelectorAll(
        'a[href*="/surah/"], button.read-button, .read-button-container, a.read-button, .read-btn'
      );
      
      if (readButtons.length > 0) {
        readButtons.forEach(btn => {
          Object.assign(btn.style, {
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '5'
          });
        });
      }
    });
    
    console.log('✅ Delayed fixes applied successfully');
  }
  
  // Also watch for DOM changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        setTimeout(applyFixes, 100);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();