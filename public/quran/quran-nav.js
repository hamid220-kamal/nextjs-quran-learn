// quran-nav.js - Handles enhanced navigation tab functionality for Quran sections

document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelectorAll('.quran-nav-tab');
  
  // Add ripple effect to all tabs
  navTabs.forEach(tab => {
    // Add ripple effect
    tab.addEventListener('mousedown', (event) => {
      const x = event.clientX - tab.getBoundingClientRect().left;
      const y = event.clientY - tab.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'tab-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      tab.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
    
    // Add touch ripple effect for mobile
    tab.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      const x = touch.clientX - tab.getBoundingClientRect().left;
      const y = touch.clientY - tab.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'tab-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      tab.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }, { passive: true });
  });
  
  // Add hover effects to enhance interactive feedback
  function createHoverEffect() {
    const hoverEffect = document.createElement('div');
    hoverEffect.className = 'tab-hover-effect';
    return hoverEffect;
  }
  
  // Auto-scroll active tab into view when page loads
  setTimeout(() => {
    const activeTab = document.querySelector('.quran-nav-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, 200);
  
  // Apply specific color variations based on tab type
  document.querySelectorAll('.quran-nav-tab[data-type]').forEach(tab => {
    const tabType = tab.getAttribute('data-type');
    const tabIcon = tab.querySelector('.tab-icon');
    
    // Apply subtle themed coloring based on tab type
    if (tabIcon) {
      switch(tabType) {
        case 'surahs':
          tabIcon.style.color = 'var(--tab-primary)';
          break;
        case 'juz':
          tabIcon.style.color = 'var(--tab-secondary)';
          break;
        case 'page':
          tabIcon.style.color = '#10b981';
          break;
        case 'hizb':
          tabIcon.style.color = '#f59e0b';
          break;
        case 'manzil':
          tabIcon.style.color = '#ef4444';
          break;
        case 'ruku':
          tabIcon.style.color = '#ec4899';
          break;
      }
    }
  });
});