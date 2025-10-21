// Nuclear Option Card Styling
// This script applies critical styling directly to all cards
// with the highest specificity possible

(function() {
  console.log("⚛️ Nuclear styling fix activated");
  
  // First, inject our CSS with highest priority
  function injectCriticalCSS() {
    const styleId = 'nuclear-card-styling';
    
    // Don't add twice
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* Force styles with !important for everything */
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
      [class*="surah-card"],
      [class*="juz-card"],
      [class*="page-card"],
      [class*="hizb-card"],
      [class*="manzil-card"],
      [class*="ruku-card"] {
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

      /* Use CSS variables for global styling */
      :root {
        --card-accent-gradient: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
        --card-badge-size: 50px;
      }

      /* Force number badge styling */
      .quran-surah-number,
      .quran-juz-number,
      .quran-page-number,
      .quran-hizb-number,
      .quran-manzil-number,
      .quran-ruku-number,
      .surah-number,
      .juz-number,
      .page-number,
      .hizb-number,
      .manzil-number,
      .ruku-number,
      [class*="-number"] {
        background: var(--card-accent-gradient) !important;
        color: white !important;
        font-weight: 700 !important;
        width: var(--card-badge-size) !important;
        height: var(--card-badge-size) !important;
        min-width: var(--card-badge-size) !important;
        min-height: var(--card-badge-size) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 1.25rem !important;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) !important;
        margin-right: 24px !important;
        flex-shrink: 0 !important;
      }

      /* Inject the left border with a pseudo-element */
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
      .ruku-card::before,
      [class*="surah-card"]::before,
      [class*="juz-card"]::before,
      [class*="page-card"]::before,
      [class*="hizb-card"]::before,
      [class*="manzil-card"]::before,
      [class*="ruku-card"]::before {
        content: "" !important;
        position: absolute !important;
        left: -4px !important;
        top: 0 !important;
        height: 100% !important;
        width: 4px !important;
        background: var(--card-accent-gradient) !important;
        border-top-left-radius: 16px !important;
        border-bottom-left-radius: 16px !important;
      }
      
      /* Force content centering */
      .quran-surah-titles,
      .quran-juz-titles,
      .quran-page-titles,
      .quran-hizb-titles,
      .quran-manzil-titles,
      .quran-ruku-titles,
      .surah-card-content,
      .juz-card-content,
      .page-card-content,
      .hizb-card-content,
      .manzil-card-content,
      .ruku-card-content,
      [class*="-titles"],
      [class*="-content"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 1 !important;
        text-align: center !important;
      }
    `;
    document.head.appendChild(style);
    console.log("💉 Critical CSS injected");
  }
  
  // Directly apply inline styles to all cards
  function applyInlineStyles() {
    console.log("🔍 Searching for cards to style...");
    
    // Target every possible card selector
    const cardSelectors = [
      '.quran-surah-card', '.quran-juz-card', '.quran-page-card', 
      '.quran-hizb-card', '.quran-manzil-card', '.quran-ruku-card',
      '.surah-card', '.juz-card', '.page-card', 
      '.hizb-card', '.manzil-card', '.ruku-card',
      '[class*="surah-card"]', '[class*="juz-card"]', '[class*="page-card"]',
      '[class*="hizb-card"]', '[class*="manzil-card"]', '[class*="ruku-card"]'
    ];
    
    // Try to find any cards
    let allCards = [];
    cardSelectors.forEach(selector => {
      const cards = document.querySelectorAll(selector);
      if (cards.length > 0) {
        console.log(`Found ${cards.length} cards with selector: ${selector}`);
        allCards = [...allCards, ...cards];
      }
    });
    
    // Apply inline styles to each card
    if (allCards.length > 0) {
      console.log(`📌 Applying inline styles to ${allCards.length} cards`);
      
      allCards.forEach(card => {
        // Card container styling
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
          transition: 'all 0.2s ease-in-out'
        });
        
        // Find and style number badge
        const numberSelectors = ['.quran-surah-number', '.quran-juz-number', '.quran-page-number', 
                               '.quran-hizb-number', '.quran-manzil-number', '.quran-ruku-number',
                               '.surah-number', '.juz-number', '.page-number', 
                               '.hizb-number', '.manzil-number', '.ruku-number'];
        
        numberSelectors.forEach(selector => {
          const numberBadge = card.querySelector(selector);
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
        });
        
        // Find and style titles/content
        const contentSelectors = ['.quran-surah-titles', '.quran-juz-titles', '.quran-page-titles',
                                '.quran-hizb-titles', '.quran-manzil-titles', '.quran-ruku-titles',
                                '.surah-card-content', '.juz-card-content', '.page-card-content',
                                '.hizb-card-content', '.manzil-card-content', '.ruku-card-content'];
        
        contentSelectors.forEach(selector => {
          const content = card.querySelector(selector);
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
        });
        
        // Style all buttons to say "READ"
        const buttons = card.querySelectorAll('button');
        buttons.forEach(button => {
          Object.assign(button.style, {
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
          });
          
          // Clear button and set text to "READ"
          button.textContent = "READ";
        });
      });
      
      console.log("✅ Card styling complete");
    } else {
      console.log("⚠️ No cards found to style");
    }
  }

  // Initialize styling immediately
  injectCriticalCSS();
  
  // First attempt at styling
  applyInlineStyles();
  
  // Set up mutation observer to catch dynamically added cards
  const observer = new MutationObserver((mutations) => {
    let hasNewElements = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        hasNewElements = true;
      }
    });
    
    if (hasNewElements) {
      applyInlineStyles();
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also apply styling periodically to ensure it catches everything
  const interval = setInterval(() => {
    applyInlineStyles();
  }, 1000);
  
  // Clear interval after 10 seconds to prevent performance issues
  setTimeout(() => {
    clearInterval(interval);
    console.log("⏱️ Stopped periodic styling checks");
  }, 10000);
})();