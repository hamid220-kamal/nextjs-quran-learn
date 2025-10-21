/**
 * Direct Brutal Fix for Surah Cards
 * This script creates a <style> tag and injects it directly into the head
 * with the most aggressive possible CSS targeting.
 */

(function() {
  // Create ultra-specific style element
  const brutalFix = document.createElement('style');
  brutalFix.id = 'brutal-fix';
  brutalFix.innerHTML = `
    /* Increase card height by exactly 2px as requested */
    .quran-surah-card,
    .surah-card,
    [class*="surah-card"],
    [class*="SurahCard"],
    [class*="surahCard"],
    .card,
    [id*="surah"],
    [id*="Surah"] {
      height: calc(100% + 2px) !important;
    }
    
    /* Position meta info ABOVE Read button - super specific */
    .surah-meta,
    .quran-surah-meta,
    .emergency-meta-fix,
    .direct-meta-info,
    .universal-meta-fix,
    .fixed-meta-info,
    .force-meta,
    .diagnostic-meta-fix,
    [class*="meta"],
    [class*="Meta"] {
      bottom: 40px !important;
    }
    
    /* Position Read button at the bottom - super specific */
    a[href*="/surah/"],
    button.read-button,
    .read-button-container,
    a.read-button,
    .read-btn,
    [class*="read-"],
    [class*="Read"] {
      bottom: 10px !important;
      margin: 0 auto !important;
      left: 0 !important;
      right: 0 !important;
    }
    
    /* Ensure read button container is centered */
    .read-btn-container {
      position: absolute !important;
      bottom: 20px !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 10 !important;
      margin: 0 auto !important;
    }
  `;
  
  // Add the brutal fix to the head
  document.head.appendChild(brutalFix);
  
  // Create a function that forces the fix directly on elements
  function enforceBrutalFix() {
    console.log('☢️ ENFORCING BRUTAL FIX');
    
    // Find all cards
    const cards = document.querySelectorAll(
      '.quran-surah-card, .surah-card, [class*="surah"], [class*="Surah"], .card'
    );
    
    if (cards && cards.length > 0) {
      cards.forEach(card => {
        // Increase height by exactly 2px
        card.style.setProperty('height', 'calc(100% + 2px)', 'important');
        
        // Find meta info and position above read button
        const metaElements = card.querySelectorAll(
          '.surah-meta, .quran-surah-meta, .emergency-meta-fix, .direct-meta-info, [class*="meta"], [class*="Meta"]'
        );
        
        metaElements.forEach(meta => {
          meta.style.setProperty('bottom', '40px', 'important');
          meta.style.setProperty('position', 'absolute', 'important');
          meta.style.setProperty('z-index', '999', 'important');
        });
        
        // Find read buttons and position at the bottom
        const readButtons = card.querySelectorAll(
          'a[href*="/surah/"], button.read-button, .read-button-container, a.read-button, .read-btn, [class*="read"], [class*="Read"]'
        );
        
        readButtons.forEach(button => {
          button.style.setProperty('bottom', '10px', 'important');
          button.style.setProperty('position', 'absolute', 'important');
        });
      });
    }
  }
  
  // Run the enforcer immediately
  enforceBrutalFix();
  
  // And run it at intervals
  setInterval(enforceBrutalFix, 1000);
  setInterval(enforceBrutalFix, 3000);
})();