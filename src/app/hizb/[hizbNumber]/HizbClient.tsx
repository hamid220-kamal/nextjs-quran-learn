'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar/Navbar';
import { fetchHizbQuarter } from '../../../utils/quranApi';

interface HizbClientProps {
  hizbNumber: string;
}

export default function HizbClient({ hizbNumber }: HizbClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hizbNumberInt = parseInt(hizbNumber);
  
  useEffect(() => {
    // Validate hizb number
    if (isNaN(hizbNumberInt) || hizbNumberInt < 1 || hizbNumberInt > 60) {
      router.push('/quran');
      return;
    }
    
    // Each hizb has 4 quarters, so we fetch the first quarter of this hizb
    const hizbQuarterNumber = (hizbNumberInt - 1) * 4 + 1;
    
    async function loadHizbData() {
      try {
        // Fetch hizb quarter data
        const hizbData = await fetchHizbQuarter(hizbQuarterNumber);
        
        // For now, redirect to the first surah in this hizb
        // In a complete implementation, this would display the hizb content
        if (hizbData && hizbData.ayahs && hizbData.ayahs.length > 0) {
          const firstAyah = hizbData.ayahs[0];
          router.push(`/surah/${firstAyah.surah.number}`);
        } else {
          setError("No data found for this Hizb");
        }
      } catch (err) {
        console.error("Error loading Hizb data:", err);
        setError("Failed to load Hizb data");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadHizbData();
  }, [hizbNumberInt, router]);
  
  if (isLoading) {
    return (
      <div className="hizb-page-container">
        <Navbar />
        <div className="hizb-content">
          <h1>Loading Hizb {hizbNumberInt}...</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="hizb-page-container">
        <Navbar />
        <div className="hizb-content">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => router.push('/quran')}>Back to Quran</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="hizb-page-container">
      <Navbar />
      <div className="hizb-content">
        <h1>Hizb {hizbNumberInt}</h1>
        <p>This page is under development. Redirecting to the first Surah in this Hizb...</p>
      </div>
    </div>
  );
}