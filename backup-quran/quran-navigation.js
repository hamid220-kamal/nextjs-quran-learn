/**
 * Quran Navigation Interactive Features
 * This script adds interactive features to the Quran navigation tabs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Select all navigation tabs
    const navTabs = document.querySelectorAll('.quran-nav-tab');
    
    // Function to create ripple effect
    function createRipple(event) {
        const button = event.currentTarget;
        
        // Remove any existing ripple
        const ripple = button.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }
        
        // Create new ripple element
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        button.appendChild(circle);
    }
    
    // Function to handle tab click
    function handleTabClick(event) {
        // Create ripple effect
        createRipple(event);
        
        // Remove active class from all tabs and content
        navTabs.forEach(tab => tab.classList.remove('active'));
        const tabContents = document.querySelectorAll('.quran-nav-tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        const clickedTab = event.currentTarget;
        clickedTab.classList.add('active');
        
        // Find and show corresponding content
        const tabType = clickedTab.getAttribute('data-type');
        if (tabType) {
            const targetContent = document.querySelector(`.quran-nav-tab-content[data-type="${tabType}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
        
        // Update URL hash without page jump
        if (history.pushState) {
            history.pushState(null, null, `#${tabType}`);
        } else {
            location.hash = `#${tabType}`;
        }
        
        // Animate indicator (if present)
        updateIndicator(clickedTab);
    }
    
    // Function to update tab indicator position
    function updateIndicator(activeTab) {
        const indicator = document.querySelector('.tab-indicator');
        if (!indicator) return;
        
        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        
        indicator.style.width = `${width}px`;
        indicator.style.left = `${left}px`;
    }
    
    // Add event listeners to all tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
        
        // Add tooltips with descriptions if not already present
        if (!tab.querySelector('.tooltip')) {
            const tabType = tab.getAttribute('data-type');
            let tooltipText = '';
            
            switch(tabType) {
                case 'surah':
                    tooltipText = 'Browse by Surahs (Chapters)';
                    break;
                case 'juz':
                    tooltipText = 'Browse by Juz (Parts)';
                    break;
                case 'page':
                    tooltipText = 'Browse by Pages';
                    break;
                case 'hizb':
                    tooltipText = 'Browse by Hizb (Groups)';
                    break;
                case 'manzil':
                    tooltipText = 'Browse by Manzil (Sections)';
                    break;
                case 'ruku':
                    tooltipText = 'Browse by Ruku (Bowing)';
                    break;
                default:
                    tooltipText = 'Browse Quran';
            }
            
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = tooltipText;
            tab.appendChild(tooltip);
        }
    });
    
    // Initialize based on URL hash if present
    function initFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetTab = document.querySelector(`.quran-nav-tab[data-type="${hash}"]`);
            if (targetTab) {
                // Simulate click on the tab
                targetTab.click();
            }
        } else {
            // Default to first tab
            const firstTab = navTabs[0];
            if (firstTab) firstTab.click();
        }
    }
    
    // Initialize from hash on page load
    initFromHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', initFromHash);
    
    // Add tab indicator if not present
    const tabsContainer = document.querySelector('.quran-nav-tabs');
    if (tabsContainer && !document.querySelector('.tab-indicator')) {
        const indicator = document.createElement('span');
        indicator.classList.add('tab-indicator');
        tabsContainer.appendChild(indicator);
        
        // Initialize indicator position
        const activeTab = document.querySelector('.quran-nav-tab.active') || navTabs[0];
        if (activeTab) {
            setTimeout(() => updateIndicator(activeTab), 100);
        }
    }
});

// Add scroll shadows to tabs container on mobile
function handleTabScroll() {
    const tabsContainer = document.querySelector('.quran-nav-tabs');
    if (!tabsContainer) return;
    
    const isOverflowing = tabsContainer.scrollWidth > tabsContainer.clientWidth;
    if (!isOverflowing) return;
    
    const scrollPosition = tabsContainer.scrollLeft;
    const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
    
    // Add shadow classes based on scroll position
    if (scrollPosition > 10) {
        tabsContainer.classList.add('shadow-left');
    } else {
        tabsContainer.classList.remove('shadow-left');
    }
    
    if (scrollPosition < maxScroll - 10) {
        tabsContainer.classList.add('shadow-right');
    } else {
        tabsContainer.classList.remove('shadow-right');
    }
}

// Initialize scroll shadows
document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.quran-nav-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('scroll', handleTabScroll);
        window.addEventListener('resize', handleTabScroll);
        
        // Initial check
        setTimeout(handleTabScroll, 100);
    }
});