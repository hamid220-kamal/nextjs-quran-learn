// quran-nav.js - Handles navigation tab functionality

document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelectorAll('.quran-nav-tab');
  const tabContents = document.querySelectorAll('.quran-nav-tab-content');
  
  // Function to set active tab
  function setActiveTab(tabType) {
    // Deactivate all tabs
    navTabs.forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Hide all content sections
    tabContents.forEach(content => {
      content.style.display = 'none';
    });
    
    // Activate selected tab
    const selectedTab = document.querySelector(`.quran-nav-tab[data-type="${tabType}"]`);
    if (selectedTab) {
      selectedTab.classList.add('active');
      
      // Show corresponding content
      const selectedContent = document.querySelector(`.quran-nav-tab-content[data-type="${tabType}"]`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
      }
      
      // Store active tab in session storage
      sessionStorage.setItem('activeQuranTab', tabType);
    }
  }
  
  // Add click event listeners to tabs
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabType = tab.getAttribute('data-type');
      setActiveTab(tabType);
    });
    
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
  });
  
  // Check for active tab in session storage
  const savedTab = sessionStorage.getItem('activeQuranTab');
  if (savedTab) {
    setActiveTab(savedTab);
  } else {
    // Set default tab (first tab)
    const defaultTab = navTabs[0];
    if (defaultTab) {
      const tabType = defaultTab.getAttribute('data-type');
      setActiveTab(tabType);
    }
  }
});