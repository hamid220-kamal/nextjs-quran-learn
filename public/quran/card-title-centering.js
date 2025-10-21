// Card Title Centering Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
  // Card types to target
  const cardTypes = ['surah', 'juz', 'page', 'hizb', 'manzil', 'ruku'];
  
  // Function to adjust layout based on content length
  function adjustCardLayout() {
    cardTypes.forEach(type => {
      // Find all cards of this type
      const cards = document.querySelectorAll(`.${type}-card, .quran-${type}-card`);
      
      cards.forEach(card => {
        // Get title elements
        const titleEn = card.querySelector(`.${type}-name-en, .quran-${type}-title-en`);
        const titleAr = card.querySelector(`.${type}-name-ar, .quran-${type}-title-ar`);
        
        if (titleEn) {
          // Check if title is long
          if (titleEn.textContent && titleEn.textContent.length > 15) {
            titleEn.style.fontSize = '1rem';
            titleEn.style.lineHeight = '1.3';
          }
          
          // Special layout for juz cards to account for Arabic text
          if (type === 'juz' && titleAr) {
            // Create flex container for better alignment
            const parent = titleEn.parentElement;
            parent.style.display = 'flex';
            parent.style.flexDirection = 'column';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            
            // Improve Arabic text appearance
            if (titleAr) {
              titleAr.style.lineHeight = '1.5';
              titleAr.style.marginBottom = '0.25rem';
            }
          }
        }
      });
    });
  }
  
  // Apply layout adjustments
  adjustCardLayout();
  
  // Reapply if window is resized
  window.addEventListener('resize', adjustCardLayout);
});