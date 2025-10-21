// performance-optimizer.js
// Script to optimize Quran page performance and prevent unresponsive browser dialogs

(function() {
  // Detect if we're in the Quran page
  if (!document.querySelector('.quran-container')) return;
  
  // Break up heavy operations into smaller chunks
  function processInChunks(items, processItemFn, chunkSize = 10, delay = 20) {
    let index = 0;
    
    function processNextChunk() {
      const start = performance.now();
      
      // Process items in the current chunk
      while (index < items.length && performance.now() - start < 16) { // Stay under 16ms per frame
        processItemFn(items[index], index);
        index++;
      }
      
      // Schedule next chunk if needed
      if (index < items.length) {
        setTimeout(processNextChunk, delay);
      }
    }
    
    // Start processing
    processNextChunk();
  }
  
  // Optimize surah card loading
  function optimizeSurahCards() {
    const cards = document.querySelectorAll('.surah-card');
    if (!cards.length) return;
    
    // Make cards initially invisible
    cards.forEach(card => {
      card.style.opacity = '0';
      card.classList.add('quran-progressive-load');
    });
    
    // Process cards in chunks
    processInChunks(
      Array.from(cards),
      (card, i) => {
        card.style.setProperty('--index', i.toString());
        card.classList.add('fade-in');
        
        // Remove unnecessary animations and heavy effects
        const heavyElements = card.querySelectorAll('.heavy-animation, .complex-gradient');
        heavyElements.forEach(el => {
          el.classList.remove('heavy-animation', 'complex-gradient');
        });
      }
    );
  }
  
  // Optimize ayah rendering
  function optimizeAyahRendering() {
    const ayahs = document.querySelectorAll('.quran-ayah, .ayah-card');
    if (!ayahs.length) return;
    
    processInChunks(
      Array.from(ayahs),
      (ayah, i) => {
        // Add lazy-loaded attributes to images
        const images = ayah.querySelectorAll('img');
        images.forEach(img => {
          img.loading = 'lazy';
          img.decoding = 'async';
        });
        
        // Optimize Arabic text rendering
        const arabicText = ayah.querySelector('.quran-ayah-text, .ayah-arabic');
        if (arabicText) {
          arabicText.style.textRendering = 'optimizeSpeed';
        }
      }
    );
  }
  
  // Optimize fonts
  function optimizeFonts() {
    // Add font-display:swap to all font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);
    
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/ScheherazadeNew-Regular.woff2',
      '/fonts/Amiri-Regular.woff2',
      '/fonts/Inter-Medium.woff2'
    ];
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  // Optimize event listeners
  function optimizeEvents() {
    // Use passive event listeners where possible
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
    
    function addPassive(obj) {
      passiveEvents.forEach(event => {
        // Store the original addEventListener
        const original = obj.addEventListener;
        
        // Override addEventListener
        obj.addEventListener = function(type, listener, options) {
          if (passiveEvents.includes(type)) {
            // Force passive for these events
            const newOptions = typeof options === 'object' 
              ? { ...options, passive: true } 
              : { passive: true };
            original.call(this, type, listener, newOptions);
          } else {
            original.call(this, type, listener, options);
          }
        };
      });
    }
    
    // Apply to window, document and body
    addPassive(window);
    addPassive(document);
    addPassive(document.body);
  }
  
  // Use Intersection Observer for lazy loading
  function setupIntersectionObservers() {
    // Only observe elements when they're about to come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Add visible class
            element.classList.add('visible');
            
            // Load any data-src attributes
            if (element.dataset.src) {
              if (element.tagName === 'IMG') {
                element.src = element.dataset.src;
              } else {
                element.style.backgroundImage = `url(${element.dataset.src})`;
              }
              delete element.dataset.src;
            }
            
            // Stop observing this element
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    
    // Observe elements with lazy-load class
    document.querySelectorAll('.lazy-load, .surah-card, .quran-ayah, .ayah-card').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Function to handle cleanup of unused resources
  function cleanupResources() {
    // Remove unnecessary scripts and stylesheets
    const scripts = document.querySelectorAll('script[data-purpose="animation"]');
    scripts.forEach(script => script.remove());
    
    // Disconnect unnecessary observers
    const allMutationObservers = window.MutationObserver;
    if (window._extraObservers) {
      window._extraObservers.forEach(observer => observer.disconnect());
    }
  }
  
  // Initialize optimizations
  function init() {
    // Run optimizations in order of priority
    optimizeFonts();
    
    // Use requestIdleCallback for non-critical optimizations
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        optimizeSurahCards();
        optimizeEvents();
      });
      
      requestIdleCallback(() => {
        optimizeAyahRendering();
        setupIntersectionObservers();
      }, { timeout: 2000 });
      
      requestIdleCallback(() => {
        cleanupResources();
      }, { timeout: 5000 });
    } else {
      // Fallback to setTimeout for browsers without requestIdleCallback
      setTimeout(optimizeSurahCards, 100);
      setTimeout(optimizeEvents, 200);
      setTimeout(optimizeAyahRendering, 500);
      setTimeout(setupIntersectionObservers, 800);
      setTimeout(cleanupResources, 2000);
    }
  }
  
  // Run once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();