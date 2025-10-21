// Card Image Styling Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
  // Card types to target
  const cardTypes = ['surah', 'juz', 'page', 'hizb', 'manzil', 'ruku'];
  
  // Apply consistent styling based on the image reference
  cardTypes.forEach(type => {
    // Find all cards of this type
    const cards = document.querySelectorAll(`.${type}-card, .quran-${type}-card`);
    
    cards.forEach(card => {
      // Enhance the card visual appearance
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.background = 'white';
      card.style.borderRadius = '16px';
      card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      card.style.transition = 'all 0.2s ease-in-out';
      
      // Find the number badge
      const badge = card.querySelector(`.${type}-number, .quran-${type}-number`);
      if (badge) {
        // Apply the blue gradient from image
        badge.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)';
        badge.style.color = 'white';
        badge.style.width = '50px';
        badge.style.height = '50px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.borderRadius = '50%';
        badge.style.fontWeight = '700';
        badge.style.fontSize = '1.25rem';
        badge.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
        badge.style.marginRight = '24px';
      }
      
      // Find the card content area
      const content = card.querySelector(`.${type}-card-content, .quran-${type}-titles`);
      if (content) {
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'center';
        content.style.flex = '1';
        content.style.textAlign = 'center';
      }
      
      // Find Arabic title
      const arabicTitle = card.querySelector(`.${type}-name-ar, .quran-${type}-title-ar`);
      if (arabicTitle) {
        arabicTitle.style.fontFamily = "'Scheherazade New', 'Amiri', serif";
        arabicTitle.style.fontSize = '1.75rem';
        arabicTitle.style.color = '#1e3a8a';
        arabicTitle.style.marginBottom = '6px';
        arabicTitle.style.textAlign = 'center';
        arabicTitle.style.fontWeight = '700';
      }
      
      // Find English title
      const englishTitle = card.querySelector(`.${type}-name-en, .quran-${type}-title-en`);
      if (englishTitle) {
        englishTitle.style.fontSize = '1.125rem';
        englishTitle.style.color = '#111827';
        englishTitle.style.fontWeight = '700';
        englishTitle.style.textAlign = 'center';
        englishTitle.style.marginBottom = '4px';
      }
      
      // Find translation
      const translation = card.querySelector(`.${type}-name-translation, .quran-${type}-title-translation`);
      if (translation) {
        translation.style.fontSize = '0.9rem';
        translation.style.color = '#4b5563';
        translation.style.fontStyle = 'italic';
        translation.style.textAlign = 'center';
      }
      
      // Find meta info
      const metaInfo = card.querySelector(`.${type}-card-meta, .quran-${type}-meta`);
      if (metaInfo) {
        metaInfo.style.display = 'flex';
        metaInfo.style.alignItems = 'center';
        metaInfo.style.justifyContent = 'center';
        metaInfo.style.gap = '8px';
        metaInfo.style.marginTop = '8px';
        
        // Style count badge
        const countBadge = metaInfo.querySelector(`.${type}-count, .quran-${type}-count`);
        if (countBadge) {
          countBadge.style.backgroundColor = '#f1f5f9';
          countBadge.style.color = '#334155';
          countBadge.style.padding = '4px 10px';
          countBadge.style.borderRadius = '30px';
          countBadge.style.fontSize = '0.75rem';
          countBadge.style.fontWeight = '600';
        }
        
        // Style revelation badge
        const revelationBadge = metaInfo.querySelector(`.${type}-revelation, .quran-${type}-revelation`);
        if (revelationBadge) {
          revelationBadge.style.backgroundColor = '#ecfdf5';
          revelationBadge.style.color = '#047857';
          revelationBadge.style.padding = '4px 10px';
          revelationBadge.style.borderRadius = '30px';
          revelationBadge.style.fontSize = '0.75rem';
          revelationBadge.style.fontWeight = '600';
        }
      }
      
      // Find read button
      const readButton = card.querySelector('.read-btn');
      if (readButton) {
        readButton.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)';
        readButton.style.color = 'white';
        readButton.style.padding = '8px 20px';
        readButton.style.borderRadius = '30px';
        readButton.style.border = 'none';
        readButton.style.fontWeight = '600';
        readButton.style.fontSize = '0.875rem';
        readButton.style.textTransform = 'uppercase';
        readButton.style.letterSpacing = '0.05em';
        readButton.style.cursor = 'pointer';
        readButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        readButton.style.transition = 'all 0.2s ease';
        
        // Add hover effect
        readButton.addEventListener('mouseenter', function() {
          this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
          this.style.transform = 'translateY(-1px)';
        });
        
        readButton.addEventListener('mouseleave', function() {
          this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
          this.style.transform = 'translateY(0)';
        });
      }
      
      // Add hover effect to card
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        this.style.transform = 'translateY(-2px)';
        this.style.borderColor = '#dbeafe';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        this.style.transform = 'translateY(0)';
        this.style.borderColor = '#e2e8f0';
      });
    });
  });
});