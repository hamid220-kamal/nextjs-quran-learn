/**
 * Surah Card Structure Helper
 * This script reorganizes the content in surah cards to ensure proper structure
 */

(function() {
  // Run on page load and after any dynamic content updates
  document.addEventListener('DOMContentLoaded', structureCards);
  
  // Also run after a slight delay
  setTimeout(structureCards, 1000);
  setTimeout(structureCards, 2000);
  
  // Set up mutation observer to watch for new cards
  const observer = new MutationObserver(function(mutations) {
    let shouldRestructure = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        shouldRestructure = true;
      }
    });
    
    if (shouldRestructure) {
      structureCards();
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Main function to structure cards
  function structureCards() {
    console.log('🔄 Structuring surah cards...');
    
    // Find all cards
    const cards = document.querySelectorAll('.surah-card, .quran-surah-card');
    
    if (!cards || cards.length === 0) {
      console.log('No cards found, will try again later');
      return;
    }
    
    console.log(`Found ${cards.length} cards to structure`);
    
    // Process each card
    cards.forEach(function(card, index) {
      // Skip cards that are already processed
      if (card.hasAttribute('data-structured')) {
        return;
      }
      
      console.log(`Structuring card ${index + 1}`);
      
      // 1. Extract content elements
      const numberElement = card.querySelector('.surah-number, .quran-surah-number');
      const arabicElement = card.querySelector('.surah-arabic-name, .quran-surah-arabic');
      const englishElement = card.querySelector('.surah-english-name, .quran-surah-english');
      const versesElement = card.querySelector('.surah-verses-count, .quran-surah-count');
      const revelationElement = card.querySelector('.surah-revelation, .quran-surah-revelation');
      const readButton = card.querySelector('a[href*="/surah/"], button.read-button, .read-button, .read-btn');
      
      // 2. Get or create container elements
      let headerDiv = card.querySelector('.surah-header');
      if (!headerDiv) {
        headerDiv = document.createElement('div');
        headerDiv.className = 'surah-header';
      }
      
      let bodyDiv = card.querySelector('.surah-body');
      if (!bodyDiv) {
        bodyDiv = document.createElement('div');
        bodyDiv.className = 'surah-body';
      }
      
      let metaDiv = card.querySelector('.surah-meta, .quran-surah-meta');
      if (!metaDiv) {
        metaDiv = document.createElement('div');
        metaDiv.className = 'surah-meta';
      }
      
      let buttonContainer = card.querySelector('.read-button-container');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'read-button-container';
      }
      
      // 3. Clear the card content but save any elements we want to keep
      const elementsToKeep = [];
      if (numberElement) elementsToKeep.push(numberElement);
      if (arabicElement) elementsToKeep.push(arabicElement);
      if (englishElement) elementsToKeep.push(englishElement);
      if (versesElement) elementsToKeep.push(versesElement);
      if (revelationElement) elementsToKeep.push(revelationElement);
      if (readButton) elementsToKeep.push(readButton);
      
      // Store card's original HTML for debugging
      const originalHTML = card.innerHTML;
      
      // 4. Rebuild the card structure
      card.innerHTML = '';
      
      // Add the header with number
      if (numberElement) {
        headerDiv.appendChild(numberElement);
        card.appendChild(headerDiv);
      }
      
      // Add the body with Arabic and English names
      if (arabicElement) bodyDiv.appendChild(arabicElement);
      if (englishElement) bodyDiv.appendChild(englishElement);
      card.appendChild(bodyDiv);
      
      // Add meta information
      if (versesElement) metaDiv.appendChild(versesElement);
      if (revelationElement) metaDiv.appendChild(revelationElement);
      
      // If we don't have verses or revelation elements but have text
      if (!versesElement && !revelationElement) {
        // Try to extract info from the card
        const metaText = card.textContent.match(/(\d+)\s*verses/i);
        const verses = metaText ? metaText[1] + ' Verses' : '? Verses';
        
        const versesElem = document.createElement('div');
        versesElem.className = 'surah-verses-count';
        versesElem.textContent = verses;
        metaDiv.appendChild(versesElem);
        
        // Is it Makkiyah or Madinah?
        const revelationType = card.textContent.match(/mak+iyah|madinah/i);
        if (revelationType) {
          const revElem = document.createElement('div');
          revElem.className = 'surah-revelation';
          
          const revType = revelationType[0].toLowerCase().includes('mak') ? 'Makkiyah' : 'Madinah';
          revElem.textContent = revType;
          revElem.classList.add(revType.toLowerCase());
          
          metaDiv.appendChild(revElem);
        }
      }
      
      card.appendChild(metaDiv);
      
      // Add read button
      if (readButton) {
        buttonContainer.innerHTML = '';
        buttonContainer.appendChild(readButton);
      } else {
        // Try to find or create a read button
        const surahLink = card.querySelector('a[href*="/surah/"]');
        if (surahLink) {
          // Clone it to preserve event handlers
          const newButton = surahLink.cloneNode(true);
          newButton.className = 'read-button';
          if (!newButton.textContent) newButton.textContent = 'Read';
          buttonContainer.appendChild(newButton);
        } else {
          // Create a new button if none exists
          const newButton = document.createElement('a');
          newButton.textContent = 'Read';
          newButton.className = 'read-button';
          
          // Try to determine the surah number
          let surahNum = '1';
          if (numberElement) {
            surahNum = numberElement.textContent.trim();
          }
          
          newButton.href = `/quran/surah/${surahNum}`;
          buttonContainer.appendChild(newButton);
        }
      }
      
      card.appendChild(buttonContainer);
      
      // Mark the card as structured
      card.setAttribute('data-structured', 'true');
      card.style.height = 'calc(100% + 10px)';
    });
    
    console.log('✅ Card structuring complete');
  }
})();