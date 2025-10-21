// navigation-scroll.js - Handles horizontal scrolling for Quran navigation tabs

document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelector('.quran-nav-tabs');
  
  if (!navTabs) return;
  
  // Variables for tracking horizontal scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  // Event listeners for mouse interactions
  navTabs.addEventListener('mousedown', (e) => {
    isDown = true;
    navTabs.classList.add('active-scroll');
    startX = e.pageX - navTabs.offsetLeft;
    scrollLeft = navTabs.scrollLeft;
  });

  navTabs.addEventListener('mouseleave', () => {
    isDown = false;
    navTabs.classList.remove('active-scroll');
  });

  navTabs.addEventListener('mouseup', () => {
    isDown = false;
    navTabs.classList.remove('active-scroll');
  });

  navTabs.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - navTabs.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    navTabs.scrollLeft = scrollLeft - walk;
  });

  // Add shadow indicators based on scroll position
  function updateShadows() {
    const { scrollLeft, scrollWidth, clientWidth } = navTabs;
    
    // Remove existing shadow classes
    navTabs.classList.remove('shadow-left', 'shadow-right', 'shadow-left-right');
    
    // Add appropriate shadow classes
    if (scrollLeft > 10) {
      if (scrollLeft + clientWidth < scrollWidth - 10) {
        navTabs.classList.add('shadow-left', 'shadow-right');
      } else {
        navTabs.classList.add('shadow-left');
      }
    } else if (scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 10) {
      navTabs.classList.add('shadow-right');
    }
  }

  // Monitor scroll position
  navTabs.addEventListener('scroll', updateShadows);
  window.addEventListener('resize', updateShadows);

  // Initial check for shadows
  updateShadows();

  // Add scroll buttons for better UX
  const navContainer = navTabs.parentElement;
  if (navContainer) {
    const scrollLeftBtn = document.createElement('button');
    scrollLeftBtn.className = 'nav-scroll-btn nav-scroll-left';
    scrollLeftBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    scrollLeftBtn.setAttribute('aria-label', 'Scroll left');

    const scrollRightBtn = document.createElement('button');
    scrollRightBtn.className = 'nav-scroll-btn nav-scroll-right';
    scrollRightBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    scrollRightBtn.setAttribute('aria-label', 'Scroll right');

    // Insert buttons
    navContainer.insertBefore(scrollLeftBtn, navTabs);
    navContainer.appendChild(scrollRightBtn);

    // Scroll functionality for buttons
    scrollLeftBtn.addEventListener('click', () => {
      navTabs.scrollBy({ left: -200, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
      navTabs.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Show/hide buttons based on scroll position
    function updateScrollButtons() {
      const { scrollLeft, scrollWidth, clientWidth } = navTabs;
      
      scrollLeftBtn.style.opacity = scrollLeft > 10 ? '1' : '0';
      scrollLeftBtn.style.pointerEvents = scrollLeft > 10 ? 'auto' : 'none';
      
      scrollRightBtn.style.opacity = (scrollLeft + clientWidth < scrollWidth - 10) ? '1' : '0';
      scrollRightBtn.style.pointerEvents = (scrollLeft + clientWidth < scrollWidth - 10) ? 'auto' : 'none';
    }

    navTabs.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    
    // Initial check for button visibility
    updateScrollButtons();
  }

  // Auto-scroll the active tab into view
  setTimeout(() => {
    const activeTab = navTabs.querySelector('.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, 100);
});