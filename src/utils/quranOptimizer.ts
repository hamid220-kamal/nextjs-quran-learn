'use client'

import { useEffect, useRef } from 'react'

// Interface for Worker Message Event
interface WorkerMessageEvent {
  data: {
    type: string;
    data: any;
  }
}

// Interface for Surah
interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Interface for Ayah
interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean;
  audio?: string;
  translation?: string;
  surahNumber?: number;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

/**
 * QuranOptimizer Hook
 * Handles off-main-thread processing of Quran data using Web Workers
 */
export function useQuranDataWorker() {
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    // Initialize worker on client side only
    if (typeof window !== 'undefined' && !workerRef.current && window.Worker) {
      try {
        // Create worker instance
        workerRef.current = new Worker('/quran/quranDataWorker.js');
        
        // Log success
        console.info('Quran Data Worker initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Quran Data Worker:', error);
      }
    }
    
    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    }
  }, []);
  
  /**
   * Filter surahs based on search query using Worker
   */
  const filterSurahsWithWorker = (
    surahs: Surah[],
    query: string,
    onComplete: (filteredSurahs: Surah[]) => void
  ) => {
    if (!workerRef.current) {
      // Fallback to in-thread filtering if worker not available
      const searchQuery = query.toLowerCase();
      const filtered = surahs.filter(surah =>
        (surah.englishName?.toLowerCase() || '').includes(searchQuery) ||
        (surah.name?.toLowerCase() || '').includes(searchQuery) ||
        (surah.englishNameTranslation?.toLowerCase() || '').includes(searchQuery) ||
        surah.number.toString().includes(query)
      );
      onComplete(filtered);
      return;
    }
    
    // Setup one-time event listener for the result
    const handleMessage = (e: WorkerMessageEvent) => {
      if (e.data.type === 'FILTERED_SURAHS') {
        onComplete(e.data.data);
        // Remove the listener once we get the response
        workerRef.current?.removeEventListener('message', handleMessage);
      }
    };
    
    workerRef.current.addEventListener('message', handleMessage);
    
    // Send data to worker
    workerRef.current.postMessage({
      type: 'FILTER_SURAHS',
      data: { surahs, query }
    });
  };
  
  /**
   * Process ayahs from different endpoints using Worker
   */
  const processAyahsWithWorker = (
    arabicAyahs: Ayah[],
    translationAyahs: Ayah[],
    audioAyahs: Ayah[],
    onComplete: (processedAyahs: Ayah[]) => void
  ) => {
    if (!workerRef.current) {
      // Fallback to in-thread processing if worker not available
      const processedAyahs = arabicAyahs.map((ayah, idx) => {
        const globalAyahNumber = (ayah as any).number || (ayah as any)?.id || null;
        const translationText = translationAyahs[idx]?.text || '';
        const audioUrlFromEdition = audioAyahs[idx]?.audio || null;
        const fallbackAudio = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
        
        return {
          ...ayah,
          translation: translationText,
          audio: audioUrlFromEdition || fallbackAudio,
          surahNumber: (ayah as any).surah?.number || null
        };
      });
      
      onComplete(processedAyahs);
      return;
    }
    
    // Setup one-time event listener for the result
    const handleMessage = (e: WorkerMessageEvent) => {
      if (e.data.type === 'PROCESSED_AYAHS') {
        onComplete(e.data.data);
        // Remove the listener once we get the response
        workerRef.current?.removeEventListener('message', handleMessage);
      }
    };
    
    workerRef.current.addEventListener('message', handleMessage);
    
    // Send data to worker
    workerRef.current.postMessage({
      type: 'PROCESS_AYAHS',
      data: { arabicAyahs, translationAyahs, audioAyahs }
    });
  };
  
  return {
    filterSurahsWithWorker,
    processAyahsWithWorker,
    isWorkerAvailable: !!workerRef.current
  };
}