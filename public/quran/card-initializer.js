// Card Initialization Script
// This script ensures all card types have consistent styling

document.addEventListener('DOMContentLoaded', function() {
  // Card types to target
  const cardTypes = ['surah', 'juz', 'page', 'hizb', 'manzil', 'ruku'];
  
  // Apply consistent hover interactions
  cardTypes.forEach(type => {
    // Find all cards of this type
    const cards = document.querySelectorAll(`.${type}-card, .quran-${type}-card`);
    
    cards.forEach(card => {
      // Ensure card has proper class setup
      if (!card.classList.contains(`quran-${type}-card`)) {
        card.classList.add(`quran-${type}-card`);
      }
      
      // Ensure number badge has proper class
      const numberBadge = card.querySelector(`.${type}-number, .quran-${type}-number`);
      if (numberBadge && !numberBadge.classList.contains(`quran-${type}-number`)) {
        numberBadge.classList.add(`quran-${type}-number`);
      }
      
      // Ensure card main content has proper class
      const cardMain = card.querySelector(`.${type}-card-main, .quran-${type}-card-inner`);
      if (cardMain) {
        if (!cardMain.classList.contains(`quran-${type}-card-inner`)) {
          cardMain.classList.add(`quran-${type}-card-inner`);
        }
      }
      
      // Apply hover effects for animation
      card.addEventListener('mouseenter', function() {
        this.classList.add('card-hover');
        
        // Animate number badge
        const badge = this.querySelector(`.${type}-number, .quran-${type}-number`);
        if (badge) badge.classList.add('badge-hover');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('card-hover');
        
        // Reset number badge animation
        const badge = this.querySelector(`.${type}-number, .quran-${type}-number`);
        if (badge) badge.classList.remove('badge-hover');
      });
    });
  });
  
  // Apply focus styles for accessibility
  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('focus', function() {
      const card = this.closest('[class*="-card"]');
      if (card) card.classList.add('card-focus');
    });
    
    btn.addEventListener('blur', function() {
      const card = this.closest('[class*="-card"]');
      if (card) card.classList.remove('card-focus');
    });
  });
});