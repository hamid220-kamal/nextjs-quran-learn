'use client'

import { useState, useEffect } from 'react'
import './skeleton-loading.css'

interface QuranLoaderProps {
  initialSurahs: any[];
}

export default function QuranLoader({ initialSurahs = [] }: QuranLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [QuranComponent, setQuranComponent] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    
    // Load the optimized script (without unresponsive dialogs)
    const script = document.createElement('script');
    script.src = '/quran/immediate-quran-fix-updated.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Add visual loading indicator first
    const loaderElement = document.createElement('div');
    loaderElement.className = 'quran-loading';
    loaderElement.innerHTML = `
      <div class="quran-loading-animation"></div>
      <p>Loading Quran viewer...</p>
    `;
    document.body.appendChild(loaderElement);
    
    // Split loading into smaller chunks with timeouts
    setTimeout(() => {
      // Dynamically import the optimized component
      import('./QuranClientOptimized').then(module => {
        // Small delay to allow browser to breathe
        setTimeout(() => {
          if (mounted) {
            setQuranComponent(() => module.default);
            setIsLoading(false);
            document.body.removeChild(loaderElement);
          }
        }, 100);
      }).catch(err => {
        console.error('Failed to load Quran component:', err);
        setLoadingError(true);
        setIsLoading(false);
        if (document.body.contains(loaderElement)) {
          document.body.removeChild(loaderElement);
        }
      });
    }, 300); // Small delay before starting heavy import
    
    return () => {
      mounted = false;
      if (document.body.contains(loaderElement)) {
        document.body.removeChild(loaderElement);
      }
      // Clean up script
      const scriptElement = document.querySelector('script[src="/quran/immediate-quran-fix-updated.js"]');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  if (isLoading) {
    return null; // Visual loader is already added to the DOM
  }

  if (loadingError) {
    return (
      <div className="quran-error">
        <h2>Unable to load Quran viewer</h2>
        <p>There was a problem loading the Quran viewer. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  // Render the dynamically imported component
  return QuranComponent ? <QuranComponent initialSurahs={initialSurahs} /> : null;
}