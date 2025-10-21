'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const bgElement = bgRef.current;
    if (!bgElement) return;
    
    // Create floating elements
    const createFloatingElements = () => {
      for (let i = 1; i <= 4; i++) {
        const element = document.createElement('div');
        element.className = `floating-bg-element element-${i}`;
        bgElement.appendChild(element);
      }
    };
    
    createFloatingElements();
    
    // Clean up when component unmounts
    return () => {
      if (bgElement) {
        bgElement.innerHTML = '';
      }
    };
  }, []);
  
  return <div ref={bgRef} className="quran-background" />;
}