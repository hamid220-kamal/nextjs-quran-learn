/* Direct DOM manipulation to ensure meta info is visible everywhere */
document.addEventListener('DOMContentLoaded', function() {
  // Wait for DOM to be fully loaded
  setTimeout(function() {
    // Function to add meta info to cards
    function addMetaInfoToCards() {
      const cards = document.querySelectorAll('.quran-surah-card');
      
      cards.forEach(card => {
        const cardFront = card.querySelector('.quran-surah-card-front');
        if (!cardFront) return;
        
        // Try to find surah number and other needed info
        const numberDiv = card.querySelector('.quran-surah-number');
        if (!numberDiv) return;
        
        const surahNumber = parseInt(numberDiv.textContent || '0', 10);
        if (!surahNumber) return;
        
        // Check if we already have a meta info div
        if (card.querySelector('.direct-meta-info')) return;
        
        // Create meta info div - this will be absolutely positioned
        const metaInfo = document.createElement('div');
        metaInfo.className = 'direct-meta-info';
        metaInfo.style.cssText = `
          position: absolute;
          bottom: 60px;
          left: 0;
          right: 0;
          width: 100%;
          text-align: center;
          padding: 8px 0;
          border-top: 1px solid rgba(0,0,0,0.1);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          font-weight: 600;
          color: #183b56;
          font-size: 15px;
          z-index: 1000000;
          background: linear-gradient(to right, rgba(173, 216, 230, 0.3), rgba(135, 206, 235, 0.1));
        `;
        
        // Find the data-meta-content attribute if available
        const metaContent = card.getAttribute('data-meta-content');
        
        // Set content based on surah number (hardcoded for important surahs)
        let content = '';
        
        if (metaContent) {
          content = metaContent;
        } else {
          // Hardcoded data for key surahs as fallback
          switch(surahNumber) {
            case 1:
              content = '7 Verses • Makkiyah';
              metaInfo.style.background = 'linear-gradient(to right, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.1))';
              break;
            case 2:
              content = '286 Verses • Medinah';
              break;
            case 3:
              content = '200 Verses • Medinah';
              break;
            case 4:
              content = '176 Verses • Medinah';
              break;
            case 5:
              content = '120 Verses • Medinah';
              break;
            case 6:
              content = '165 Verses • Makkiyah';
              metaInfo.style.background = 'linear-gradient(to right, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.1))';
              break;
            default:
              // For others, we use a generic format
              content = 'Tap to read';
          }
        }
        
        metaInfo.textContent = content;
        card.appendChild(metaInfo);
      });
    }
    
    // Run once on page load
    addMetaInfoToCards();
    
    // Set an observer to watch for new cards
    const observer = new MutationObserver(function(mutations) {
      addMetaInfoToCards();
    });
    
    // Start observing the document for changes in the DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also periodically check, just to be extra sure
    setInterval(addMetaInfoToCards, 1000);
    
  }, 500); // Wait 500ms for React to fully render
});