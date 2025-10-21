/**
 * Cross-Browser Meta Information Fix
 * This script adds critical styles directly to the document head
 * to ensure consistent display across all browsers.
 */

(function() {
  // Load final fix CSS only (other consolidated CSS was removed)
  const linkFinal = document.createElement('link');
  linkFinal.rel = 'stylesheet';
  linkFinal.href = '/final-fix.css';
  linkFinal.id = 'final-fix-styles';
  document.head.appendChild(linkFinal);

  // Create style element (ensure variable is defined)
  const style = document.createElement('style');
  style.id = 'cross-browser-meta-fix';
  style.textContent = `
    /* Critical styles for meta information */
    .emergency-meta-fix,
    .direct-meta-info,
    .quran-surah-meta,
    .quran-surah-meta-text,
    .fixed-meta-info {
      position: absolute !important;
      bottom: 40px !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      text-align: center !important;
      padding: 8px 0 !important;
      border-top: 1px solid rgba(0,0,0,0.2) !important;
      border-bottom: 1px solid rgba(0,0,0,0.2) !important;
      font-weight: 600 !important;
      color: #183b56 !important;
      font-size: 15px !important;
      z-index: 9999 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
    }
    
    /* Makkiyah gradient */
    .makkiyah-gradient {
      background: linear-gradient(to right, rgba(255, 182, 193, 0.3), rgba(255, 192, 203, 0.1)) !important;
      color: #8b0029 !important;
    }
    
    /* Medinah gradient */
    .medinah-gradient {
      background: linear-gradient(to right, rgba(173, 216, 230, 0.3), rgba(135, 206, 235, 0.1)) !important;
      color: #004077 !important;
    }
    
    /* Read button container */
    .read-btn-container {
      position: absolute !important;
      bottom: 15px !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 9999 !important;
    }
    
    /* Special Safari fix */
    @media not all and (min-resolution:.001dpcm) { 
      @supports (-webkit-appearance:none) {
        .emergency-meta-fix,
        .direct-meta-info,
        .quran-surah-meta,
        .quran-surah-meta-text {
          transform: translateZ(0) !important;
        }
      }
    }
    
    /* Edge and IE fix */
    @supports (-ms-ime-align:auto) {
      .emergency-meta-fix,
      .direct-meta-info,
      .quran-surah-meta,
      .quran-surah-meta-text {
        position: absolute !important;
        bottom: 40px !important;
      }
    }
  `;
  
  // Add to document head
  document.head.appendChild(style);
  
  // Check for iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    const iOSFix = document.createElement('style');
    iOSFix.textContent = `
      /* iOS specific fixes */
      .emergency-meta-fix,
      .direct-meta-info,
      .quran-surah-meta,
      .quran-surah-meta-text {
        -webkit-transform: translateZ(0) !important;
        transform: translateZ(0) !important;
        -webkit-backface-visibility: hidden !important;
        backface-visibility: hidden !important;
      }
    `;
    document.head.appendChild(iOSFix);
  }
})();