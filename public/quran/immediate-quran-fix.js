// immediate-quran-fix.js
// Add this script at the very top of your Quran page to prevent unresponsive dialogs

(function() {
  // Create and inject custom style for responsive handling
  const style = document.createElement('style');
  style.textContent = `
    .quran-preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(248, 246, 241, 0.95);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Inter', system-ui, sans-serif;
    }
    
    .quran-preloader-animation {
      width: 80px;
      height: 80px;
      border: 5px solid #e9ecef;
      border-top-color: #0d4b4d;
      border-radius: 50%;
      animation: quran-spin 1s linear infinite;
    }
    
    .quran-preloader-message {
      margin-top: 20px;
      font-size: 18px;
      color: #0d4b4d;
      text-align: center;
    }
    
    .quran-preloader-progress {
      width: 250px;
      height: 4px;
      background-color: #e9ecef;
      margin-top: 20px;
      border-radius: 2px;
      overflow: hidden;
    }
    
    .quran-preloader-progress-bar {
      height: 100%;
      background-color: #0d4b4d;
      width: 0%;
      transition: width 0.3s ease;
    }
    
    @keyframes quran-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Create preloader element
  const preloader = document.createElement('div');
  preloader.className = 'quran-preloader';
  preloader.innerHTML = `
    <div class="quran-preloader-animation"></div>
    <div class="quran-preloader-message">Loading Quran...</div>
    <div class="quran-preloader-progress">
      <div class="quran-preloader-progress-bar"></div>
    </div>
  `;
  
  // Append to body when DOM is ready
  function addPreloader() {
    document.body.appendChild(preloader);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPreloader);
  } else {
    addPreloader();
  }
  
  // Update progress bar
  let progress = 0;
  const progressBar = preloader.querySelector('.quran-preloader-progress-bar');
  const progressInterval = setInterval(() => {
    progress += Math.random() * 5;
    if (progress > 95) {
      clearInterval(progressInterval);
      progress = 95; // Wait for actual load to complete the last 5%
    }
    progressBar.style.width = progress + '%';
  }, 200);
  
  // Stage-based loading with yielding to browser
  const stages = [
    { name: 'Initializing...', weight: 10 },
    { name: 'Loading resources...', weight: 20 },
    { name: 'Preparing Quranic content...', weight: 30 },
    { name: 'Setting up interface...', weight: 20 },
    { name: 'Almost ready...', weight: 20 }
  ];
  
  let stageIndex = 0;
  const messageElement = preloader.querySelector('.quran-preloader-message');
  
  function processNextStage() {
    if (stageIndex >= stages.length) return;
    
    const stage = stages[stageIndex];
    messageElement.textContent = stage.name;
    stageIndex++;
    
    // Yield back to browser to prevent unresponsive dialog
    setTimeout(processNextStage, 300 + Math.random() * 700);
  }
  
  processNextStage();
  
  // Function to optimize actual page rendering once loaded
  function optimizePageRendering() {
    // Find all image elements and add loading="lazy"
    document.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
    
    // Break up heavy rendering operations
    const heavySelectors = ['.quran-surah-container', '.ayahs-container'];
    heavySelectors.forEach(selector => {
      const container = document.querySelector(selector);
      if (!container) return;
      
      const children = Array.from(container.children);
      container.innerHTML = '';
      
      let index = 0;
      function addNextBatch() {
        const fragment = document.createDocumentFragment();
        const batchSize = 5;
        const end = Math.min(index + batchSize, children.length);
        
        for (let i = index; i < end; i++) {
          fragment.appendChild(children[i]);
        }
        
        container.appendChild(fragment);
        index = end;
        
        if (index < children.length) {
          setTimeout(addNextBatch, 16); // Roughly 1 frame at 60fps
        } else if (selector === heavySelectors[heavySelectors.length - 1]) {
          // Final rendering is complete
          finishLoading();
        }
      }
      
      setTimeout(addNextBatch, 0);
    });
  }
  
  // Complete loading and remove preloader
  function finishLoading() {
    progressBar.style.width = '100%';
    
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        if (document.body.contains(preloader)) {
          document.body.removeChild(preloader);
        }
      }, 500);
    }, 200);
  }
  
  // React to page load events
  window.addEventListener('load', () => {
    // Allow a bit of time for initial render
    setTimeout(optimizePageRendering, 100);
  });
  
  // Handle case where page is already loaded
  if (document.readyState === 'complete') {
    setTimeout(optimizePageRendering, 100);
  }
  
  // Expose a global function to remove the preloader manually
  window.removeQuranPreloader = finishLoading;
})();