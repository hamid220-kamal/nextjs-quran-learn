'use client';

import { useEffect } from 'react';

interface ScriptLoaderProps {
  scripts: string[];
}

export default function ScriptLoader({ scripts }: ScriptLoaderProps) {
  useEffect(() => {
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    });
  }, [scripts]);
  
  return null;
}