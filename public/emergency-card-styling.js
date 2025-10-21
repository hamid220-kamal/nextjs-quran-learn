// Emergency Direct Style Injection
// This script injects styles directly into the page to override any other styles

document.addEventListener('DOMContentLoaded', function() {
  console.log('Emergency style injection activated');
  
  // Helper function to create and inject styles
  function injectStyles(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  
  // Inline critical CSS with highest priority
  injectStyles(`
    /* Card containers */
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
    .ruku-card,
    [class*="quran-"][class*="-card"],
    [class*="surah-card"],
    [class*="juz-card"],
    [class*="page-card"],
    [class*="hizb-card"],
    [class*="manzil-card"],
    [class*="ruku-card"],
    [class*="card"] {
      background-color: white !important;
      border-radius: 16px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
      padding: 24px 20px !important;
      margin: 0 0 16px 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      transition: all 0.2s ease-in-out !important;
      border: 1px solid #e2e8f0 !important;
      display: flex !important;
      align-items: center !important;
      position: relative !important;
      overflow: visible !important;
      border-left: 4px solid transparent !important;
    }
    
    /* Number badges */
    [class*="number"] {
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
      color: white !important;
      font-weight: 700 !important;
      width: 50px !important;
      height: 50px !important;
      min-width: 50px !important;
      min-height: 50px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 1.25rem !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) !important;
      margin-right: 24px !important;
    }
    
    /* Content areas */
    [class*="titles"],
    [class*="content"] {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      flex: 1 !important;
      text-align: center !important;
    }
    
    /* Left border */
    .quran-surah-card::before,
    .quran-juz-card::before,
    .quran-page-card::before,
    .quran-hizb-card::before,
    .quran-manzil-card::before,
    .quran-ruku-card::before,
    .surah-card::before,
    .juz-card::before,
    .page-card::before,
    .hizb-card::before,
    .manzil-card::before,
    .ruku-card::before {
      content: "" !important;
      position: absolute !important;
      left: -4px !important;
      top: 0 !important;
      height: 100% !important;
      width: 4px !important;
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
      border-top-left-radius: 16px !important;
      border-bottom-left-radius: 16px !important;
      z-index: 10 !important;
    }
    
    /* Buttons */
    button.read-btn {
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
      color: white !important;
      padding: 8px 20px !important;
      border-radius: 30px !important;
      border: none !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      cursor: pointer !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Grid containers */
    .quran-surah-grid,
    .quran-juz-grid,
    .quran-page-grid,
    .quran-hizb-grid,
    .quran-manzil-grid,
    .quran-ruku-grid {
      width: 90% !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
    }
  `);
  
  // Apply direct DOM styling
  function applyDOMStyling() {
    console.log('Applying direct DOM styling');
    
    // Find all card elements
    document.querySelectorAll('[class*="card"]').forEach(card => {
      // Apply card styling
      Object.assign(card.style, {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '24px 20px',
        margin: '0 0 16px 0',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        borderLeft: '4px solid #0ea5e9',
      });
      
      // Fix numbers
      card.querySelectorAll('[class*="number"]').forEach(number => {
        Object.assign(number.style, {
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
          marginRight: '24px',
        });
      });
      
      // Fix content
      card.querySelectorAll('[class*="titles"], [class*="content"]').forEach(content => {
        Object.assign(content.style, {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          textAlign: 'center',
        });
      });
    });
  }
  
  // Initial run
  setTimeout(applyDOMStyling, 500);
  
  // Run again to catch any dynamically added elements
  setTimeout(applyDOMStyling, 1500);
  setTimeout(applyDOMStyling, 3000);
});

// Continuous monitoring for new elements
(function() {
  console.log("Setting up continuous style monitoring");
  
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Apply styling to any new elements
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            const element = node;
            
            // Check if this is a card or contains cards
            if (element.className && element.className.includes('card')) {
              console.log('Styling newly added card:', element);
              
              // Apply card styling
              Object.assign(element.style, {
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                padding: '24px 20px',
                margin: '0 0 16px 0',
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'visible',
                borderLeft: '4px solid #0ea5e9',
              });
            }
            
            // Look for cards inside this element
            const cards = element.querySelectorAll('[class*="card"]');
            if (cards.length > 0) {
              console.log(`Found ${cards.length} cards inside new element`);
              
              cards.forEach(card => {
                // Apply card styling
                Object.assign(card.style, {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  padding: '24px 20px',
                  margin: '0 0 16px 0',
                  width: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'visible',
                  borderLeft: '4px solid #0ea5e9',
                });
                
                // Style number badges
                card.querySelectorAll('[class*="number"]').forEach(number => {
                  Object.assign(number.style, {
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
                    marginRight: '24px',
                  });
                });
                
                // Style content areas
                card.querySelectorAll('[class*="titles"], [class*="content"]').forEach(content => {
                  Object.assign(content.style, {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1',
                    textAlign: 'center',
                  });
                });
              });
            }
          }
        });
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
})();