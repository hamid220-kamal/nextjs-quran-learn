/**
 * NUCLEAR OPTION - Guaranteed Style Fix
 * This script applies the strongest possible styling directly to each element
 */

(function() {
  console.log('🔥 NUCLEAR OPTION ACTIVATED 🔥');
  
  // First, inject ultra-specific CSS
  injectUltraSpecificCSS();
  
  // Then apply direct inline styles
  applyDirectStyles();
  
  // Set up multiple monitors at different intervals
  setInterval(applyDirectStyles, 1000);
  setInterval(applyDirectStyles, 3000);
  
  // FUNCTION: Inject ultra-specific CSS
  function injectUltraSpecificCSS() {
    const ultraCSS = document.createElement('style');
    ultraCSS.id = 'nuclear-option-css';
    ultraCSS.innerHTML = `
      /* Ultimate specificity selectors */
      html body main div[class] div[class] div[class] div[class*="surah"],
      html body main div[class] div[class] div[class] div.card,
      html body main div[class] div[class] div[class] div.surah-card,
      html body main div[class] div[class] div[class] div.quran-surah-card,
      [class*="surah-card"],
      [class*="SurahCard"],
      [class*="surahCard"],
      .card {
        position: relative !important;
        height: calc(100% + 2px) !important; /* Increase height by 2px as requested */
        padding-bottom: 45px !important; /* Space for meta and button */
        margin-bottom: 15px !important;
        overflow: visible !important;
        z-index: 1 !important;
      }
      
      /* Force all parent containers to show overflow */
      html body main div[class] div[class] div[class],
      html body main div[class] div[class],
      html body main div[class],
      html body main {
        overflow: visible !important;
      }
      
      /* Ultra-specific read button container styling */
      html body .read-btn-container,
      html body main div[class] div[class] div[class] div.read-btn-container,
      html body main div[class] div[class] div[class] div[class].read-btn-container {
        position: absolute !important;
        bottom: 20px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 1000 !important;
        margin: 0 auto !important;
      }
      
      /* Ultra-specific read button styling */
      html body .read-btn,
      html body main div[class] div[class] div[class] div.read-btn,
      html body main div[class] div[class] div[class] button.read-btn,
      html body a[href*="/surah/"],
      html body button.read-button,
      html body .read-button-container,
      html body a.read-button {
        margin: 0 auto !important;
        display: block !important;
      }
      
      /* Ultra-specific meta info styling */
      html body .surah-meta,
      html body .quran-surah-meta,
      html body .emergency-meta-fix,
      html body .direct-meta-info,
      html body .universal-meta-fix,
      html body .fixed-meta-info,
      html body [class*="meta"],
      html body [class*="Meta"] {
        display: block !important;
        position: absolute !important;
        bottom: 40px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        text-align: center !important;
        z-index: 999 !important;
        padding: 5px 0 !important;
        margin: 0 !important;
        visibility: visible !important;
        opacity: 1 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        background: linear-gradient(to right, rgba(240, 240, 240, 0.9), rgba(255, 255, 255, 0.9)) !important;
        border-top: 1px solid rgba(0,0,0,0.1) !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
        font-weight: bold !important;
      }
      
      /* Ultra-specific read button styling */
      html body a[href*="/surah/"],
      html body button.read-button,
      html body .read-button-container,
      html body a.read-button,
      html body .read-btn,
      html body [class*="read"],
      html body [class*="Read"] {
        display: inline-block !important;
        position: absolute !important;
        bottom: 10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 5 !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Makkiyah styling */
      .makkiyah-gradient,
      [class*="makkiyah"],
      [class*="Makkiyah"] {
        background: linear-gradient(to right, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.1)) !important;
        color: #8b0029 !important;
      }
      
      /* Medinah styling */
      .medinah-gradient,
      [class*="medinah"],
      [class*="Medinah"] {
        background: linear-gradient(to right, rgba(173, 216, 230, 0.3), rgba(135, 206, 235, 0.1)) !important;
        color: #004077 !important;
      }
    `;
    
    // Add to document head with highest priority
    document.head.appendChild(ultraCSS);
  }
  
  // FUNCTION: Apply direct styles
  function applyDirectStyles() {
    console.log('📌 Applying direct inline styles to all elements');
    
    // Find all surah cards with any possible selector
    const cards = document.querySelectorAll(
      '[class*="surah"], [class*="Surah"], .card, [class*="card"], [class*="Card"]'
    );
    
    if (!cards || cards.length === 0) {
      console.log('No cards found for direct styling');
      return;
    }
    
    console.log(`Found ${cards.length} potential cards for direct styling`);
    
    // Process each card
    cards.forEach(card => {
      // 1. Apply direct card styles
      Object.assign(card.style, {
        position: 'relative',
        height: 'calc(100% + 2px)',
        paddingBottom: '45px',
        overflow: 'visible',
        zIndex: '1',
        marginBottom: '15px'
      });
      
      // 2. Check for existing meta information
      let metaInfo = card.querySelector('.surah-meta, .quran-surah-meta, .emergency-meta-fix, .direct-meta-info, [class*="meta"], [class*="Meta"]');
      
      // 3. If meta info exists, style it directly
      if (metaInfo) {
        console.log('Meta info found, applying direct styles');
        Object.assign(metaInfo.style, {
          display: 'block',
          position: 'absolute',
          bottom: '40px',
          left: '0',
          right: '0',
          width: '100%',
          textAlign: 'center',
          zIndex: '999',
          padding: '5px 0',
          margin: '0',
          visibility: 'visible',
          opacity: '1',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          background: 'linear-gradient(to right, rgba(240, 240, 240, 0.9), rgba(255, 255, 255, 0.9))',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          fontWeight: 'bold'
        });
      } else {
        // If no meta info, we might need to create it
        console.log('No meta info found, checking if we should create it');
      }
      
      // 4. Find and style read button containers
      const readButtonContainer = card.querySelector('.read-btn-container');
      
      if (readButtonContainer) {
        console.log('Read button container found, applying direct styles for centering');
        Object.assign(readButtonContainer.style, {
          position: 'absolute',
          bottom: '20px',
          left: '0',
          right: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000',
          margin: '0 auto'
        });
        
        // Style the read button inside the container
        const readButton = readButtonContainer.querySelector('.read-btn, button.read-button, a.read-button');
        if (readButton) {
          Object.assign(readButton.style, {
            margin: '0 auto',
            display: 'block',
            visibility: 'visible',
            opacity: '1'
          });
        }
      } else {
        // If no container, find and style read button directly
        const readButton = card.querySelector('a[href*="/surah/"], button.read-button, .read-btn, [class*="read"], [class*="Read"]');
        if (readButton) {
          console.log('Read button found, applying direct styles');
          Object.assign(readButton.style, {
            display: 'block',
            margin: '0 auto',
            zIndex: '5',
            visibility: 'visible',
            opacity: '1',
            position: 'absolute',
            bottom: '20px',
            left: '0',
            right: '0'
          });
        }
      }
      
      // 5. Fix any parent containers that might clip overflow
      let parent = card.parentNode;
      let depth = 0;
      
      while (parent && depth < 5) {
        parent.style.overflow = 'visible';
        parent = parent.parentNode;
        depth++;
      }
    });
  }
})();