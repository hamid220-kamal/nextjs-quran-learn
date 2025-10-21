/**
 * Diagnostic Script - Card Detector
 * This script logs information about card elements found on the page
 * to help diagnose styling issues.
 */

(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', detectCards);
  setTimeout(detectCards, 1000);
  setTimeout(detectCards, 2000);
  
  function detectCards() {
    console.log('🔍 CARD DETECTION DIAGNOSTIC');
    console.log('-------------------------------');
    
    // Try different selectors
    const selectors = [
      '.quran-surah-card', 
      '.surah-card', 
      '[class*="surah"]',
      '[class*="Surah"]',
      '.card'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      console.log(`${selector}: ${elements.length} elements found`);
      
      if (elements.length > 0) {
        // Log classes of first element
        console.log(`  Sample classes: ${elements[0].className}`);
        
        // Check for meta elements
        const metaElements = Array.from(elements).filter(el => 
          el.querySelector('.surah-meta, .quran-surah-meta, .emergency-meta-fix, .direct-meta-info'));
          
        console.log(`  Elements with meta info: ${metaElements.length}`);
        
        // Check for read buttons
        const withReadButtons = Array.from(elements).filter(el => 
          el.querySelector('a[href*="/surah/"], button.read-button, .read-button-container, a.read-button'));
          
        console.log(`  Elements with read buttons: ${withReadButtons.length}`);
        
        // Check positioning
        const firstEl = elements[0];
        const computedStyle = window.getComputedStyle(firstEl);
        console.log(`  Position: ${computedStyle.position}`);
        console.log(`  Height: ${computedStyle.height}`);
        console.log(`  Overflow: ${computedStyle.overflow}`);
      }
    });
    
    console.log('-------------------------------');
    console.log('🛠️ FIXING ISSUES AUTOMATICALLY');
    
    // Find all cards with any selector and apply fixes
    const allCards = document.querySelectorAll(selectors.join(', '));
    console.log(`Total cards found: ${allCards.length}`);
    
    if (allCards.length > 0) {
      allCards.forEach(card => {
        // Force correct styles
        card.style.position = 'relative';
        card.style.overflow = 'visible';
        card.style.height = 'calc(100% + 2px)';
        card.style.paddingBottom = '40px';
        
        // Create consistent meta container if not exists
        let metaContainer = card.querySelector('.surah-meta, .quran-surah-meta, .emergency-meta-fix, .direct-meta-info');
        if (!metaContainer) {
          console.log('Creating missing meta container');
          metaContainer = document.createElement('div');
          metaContainer.className = 'universal-meta-fix';
          
          // Try to find verses and revelation type
          const numberElem = card.querySelector('[class*="number"], [class*="Number"]');
          const surahNumber = numberElem ? parseInt(numberElem.textContent.trim(), 10) : 1;
          
          // Determine type based on number
          const makkiyahSurahs = [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
                              21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 
                              37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 
                              54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 
                              78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 
                              92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 
                              106, 107, 108, 109, 111, 112, 113, 114];
                              
          const revelationType = makkiyahSurahs.includes(surahNumber) ? 'Makkiyah' : 'Medinah';
          
          metaContainer.textContent = `${surahNumber} Verses • ${revelationType}`;
          metaContainer.style.cssText = `
            position: absolute !important;
            bottom: 40px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            text-align: center !important;
            padding: 8px 0 !important;
            font-weight: 600 !important;
            color: #183b56 !important;
            font-size: 15px !important;
            z-index: 9999 !important;
            background: linear-gradient(to right, rgba(200, 200, 255, 0.3), rgba(200, 200, 255, 0.1)) !important;
          `;
          
          card.appendChild(metaContainer);
        }
        
        // Fix meta container positioning
        metaContainer.style.position = 'absolute';
        metaContainer.style.bottom = '40px';
        metaContainer.style.left = '0';
        metaContainer.style.right = '0';
        metaContainer.style.width = '100%';
        metaContainer.style.zIndex = '9999';
        
        // Find read button
        const readBtn = card.querySelector('a[href*="/surah/"], button.read-button, .read-button-container, a.read-button');
        if (readBtn) {
          readBtn.style.position = 'absolute';
          readBtn.style.bottom = '10px';
          readBtn.style.left = '50%';
          readBtn.style.transform = 'translateX(-50%)';
          readBtn.style.zIndex = '5';
        }
      });
      
      console.log('✅ Applied fixes to all cards');
    }
  }
})();