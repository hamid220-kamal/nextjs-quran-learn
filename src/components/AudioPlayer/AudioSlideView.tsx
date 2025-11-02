'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AudioSlideView.module.css';

interface AudioSlideViewProps {
  surahNumber: number;
  onClose: () => void;
}

interface Ayah {
  number: number;
  text: string;
  translation: string;
  audio: string;
}

interface Reciter {
  identifier: string;
  name: string;
  language: string;
}

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed, retrying...`);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Failed to fetch after retries');
};

export default function AudioSlideView({ surahNumber, onClose }: AudioSlideViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrollView, setIsScrollView] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completionTriggeredRef = useRef(false);
  const [textLength, setTextLength] = useState<'short' | 'medium' | 'long'>('medium');

  // Prevent body scroll while overlay is open
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = old || '';
    };
  }, []);

  useEffect(() => {
    // When a reciter is selected, fetch the first ayah
    if (selectedReciter) fetchAyah(currentAyahIndex).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReciter, currentAyahIndex]);

  useEffect(() => {
    if (currentAyah) setTextLength(determineTextLength(currentAyah.text || ''));
  }, [currentAyah]);

  const determineTextLength = (text: string): 'short' | 'medium' | 'long' => {
    if (!text) return 'medium';
    const cleaned = text.replace(/[^\\p{L}\\p{N}]/gu, '');
    const len = cleaned.length;
    if (len <= 40) return 'short';
    if (len <= 120) return 'medium';
    return 'long';
  };

  const fetchReciters = async () => {
    try {
      const res = await fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse');
      const data = await res.json();
      const formatted = (data.data || []).map((r: any) => ({ identifier: r.identifier, name: r.englishName, language: r.language }));
      setReciters(formatted);
    } catch (e) {
      console.error('fetchReciters error', e);
    }
  };

  useEffect(() => {
    fetchReciters();
  }, []);

  const fetchAyah = async (ayahNumber: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsAudioLoaded(false);

      // Fetch verse text and translation
      const arabicResp = await fetchWithRetry(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${selectedReciter}`);
      const arabicData = await arabicResp.json();

      const translationResp = await fetchWithRetry(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`);
      const translationData = await translationResp.json();

      if (!arabicData.data || !translationData.data) throw new Error('Invalid API response');

      // Generate all possible audio URLs for this verse using primary and fallback sources
      const verseNumber = arabicData.data.number;
      const audioUrls = [
        `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${verseNumber}.mp3`,
        `https://cdn.islamic.network/quran/audio/64/${selectedReciter}/${verseNumber}.mp3`,
        `https://verses.quran.com/${selectedReciter}/${verseNumber}.mp3`,
        `https://audio.qurancdn.com/${selectedReciter}/mp3/${verseNumber}.mp3`,
        `https://download.quranicaudio.com/quran/${selectedReciter}/${verseNumber}.mp3`,
        // Add ogg format fallbacks
        `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${verseNumber}.ogg`,
        `https://cdn.islamic.network/quran/audio/64/${selectedReciter}/${verseNumber}.ogg`,
        arabicData.data.audio // Include the API-provided URL as last fallback
      ].filter(Boolean); // Remove any undefined/null URLs

      // Try each audio URL until we find one that works
      let workingAudioUrl = null;
      for (const url of audioUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            workingAudioUrl = url;
            break;
          }
        } catch (error) {
          console.warn(`Audio source failed: ${url}`, error);
          continue;
        }
      }

      if (!workingAudioUrl) {
        throw new Error('No working audio source found');
      }

      setCurrentAyah({
        number: ayahNumber,
        text: arabicData.data.text,
        translation: translationData.data.text,
        audio: workingAudioUrl
      });
      setTotalAyahs(arabicData.data.surah?.numberOfAyahs || 0);
    } catch (e) {
      console.error(e);
      setError('Failed to load verse audio. Please try another reciter.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReciterSelect = (id: string) => {
    setSelectedReciter(id);
    setCurrentAyahIndex(1);
    setShowCompletion(false);
    setIsPlaying(true);
    setIsSidebarOpen(false); // Close sidebar after selection
    completionTriggeredRef.current = false;
  };

  const handleAudioEnd = () => {
    if (completionTriggeredRef.current) return;
    if (currentAyahIndex === totalAyahs) {
      completionTriggeredRef.current = true;
      setIsPlaying(false);
      setTimeout(() => setShowCompletion(true), 500);
      return;
    }
    setCurrentAyahIndex((p) => p + 1);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleNext = () => setCurrentAyahIndex((p) => Math.min(p + 1, totalAyahs));
  const handlePrevious = () => setCurrentAyahIndex((p) => Math.max(1, p - 1));

  // Initialize audio element on mount and handle audio events
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.preload = 'auto'; // Preload audio metadata
    
    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      // If we get a "no supported source" error, try to recover by switching to next verse
      if ((e.target as HTMLAudioElement)?.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        setError('Audio format not supported. Trying another source...');
        // Try fetching the ayah again which will try alternative sources
        fetchAyah(currentAyahIndex).catch(console.error);
      }
    };

    const handleCanPlayThrough = () => {
      setIsAudioLoaded(true);
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('error', handleError as EventListener);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('error', handleError as EventListener);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [currentAyahIndex, isPlaying]);

  return (
    <div className={styles.audio_slide_overlay} role="dialog" aria-modal="true">
      <div className={styles.top_navigation}>
        <div className={styles.nav_wrapper}>
          <div className={styles.nav_start}>
            <button onClick={onClose} className={styles.nav_button}>
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className={styles.nav_title}>Surah {surahNumber}</h1>
          </div>
          <div className={styles.nav_end}>
            <button 
              onClick={() => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }} 
              className={styles.nav_icon_button}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '⊠' : '⊞'}
            </button>
            <button 
              onClick={() => setIsSidebarOpen((s) => !s)} 
              className={styles.nav_icon_button}
              aria-label="Select reciter"
            >
              🎧
            </button>
          </div>
        </div>
      </div>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebar_content}>
          <input placeholder="Search reciters" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className={styles.reciters_list}>
            {reciters.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
              <button 
                key={r.identifier} 
                onClick={() => handleReciterSelect(r.identifier)} 
                className={`${styles.sidebar_button} ${selectedReciter === r.identifier ? styles.active : ''}`}
              >
                <div className={styles.reciter_info}>
                  <span className={styles.icon}>🎧</span>
                  <span className={styles.reciter_name}>{r.name}</span>
                </div>
                <span className={`${styles.language_tag} ${styles[r.language.toLowerCase()]}`}>
                  {r.language.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className={`${styles.content_container} ${isScrollView ? styles.scroll_view : ''} ${isSidebarOpen ? styles.sidebar_open : ''}`}>
        <div className={styles.ayah_content} aria-live="polite">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div 
                className={styles.loading_overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.loading_spinner}></div>
                <div className={styles.loading_text}>Loading verse...</div>
              </motion.div>
            )}
            {error && (
              <motion.div 
                className={styles.error_message}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <span className={styles.error_icon}>⚠️</span>
                <span>{error}</span>
                <button onClick={() => fetchAyah(currentAyahIndex)} className={styles.retry_button}>
                  Retry
                </button>
              </motion.div>
            )}
            {currentAyah && (
              <motion.div 
                className={styles.verse_container}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.verse_wrapper}>
                  <div className={styles.verse_number}>
                    {currentAyahIndex} / {totalAyahs}
                  </div>
                  <motion.div 
                    className={styles.arabic_text}
                    data-length={textLength}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentAyah.text}
                  </motion.div>
                  <motion.div 
                    className={styles.translation_text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentAyah.translation}
                  </motion.div>
                </div>
                
                <div className={styles.verse_nav}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentAyahIndex <= 1}
                    aria-label="Previous verse"
                  >
                    ❮
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentAyahIndex >= totalAyahs}
                    aria-label="Next verse"
                  >
                    ❯
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.progress_bar}>
          <div 
            className={styles.progress_indicator}
            style={{ width: `${(currentAyahIndex / totalAyahs) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentAyahIndex}
            aria-valuemin={1}
            aria-valuemax={totalAyahs}
          />
        </div>

        <div className={styles.controls}>
          <button 
            className={styles.control_button}
            onClick={handlePrevious} 
            disabled={currentAyahIndex <= 1 || isLoading}
            aria-label="Previous verse"
          >
            ⮜
          </button>
          <button 
            className={`${styles.control_button} ${styles.play_pause}`}
            onClick={togglePlayPause}
            disabled={!isAudioLoaded || isLoading || !currentAyah?.audio}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className={styles.control_button}
            onClick={handleNext} 
            disabled={currentAyahIndex >= totalAyahs || isLoading}
            aria-label="Next verse"
          >
            ⮞
          </button>
        </div>

        {!isScrollView && (
          <div className={styles.scroll_indicator}>
            <span>Scroll to navigate</span>
            <span>↕️</span>
          </div>
        )}

        <audio 
          ref={audioRef} 
          src={currentAyah?.audio} 
          onEnded={handleAudioEnd} 
          onLoadedData={() => setIsAudioLoaded(true)}
          preload="auto"
          crossOrigin="anonymous"
        />
      </main>
    </div>
  );
}

