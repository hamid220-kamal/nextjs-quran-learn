
import { useRef, useState, useCallback, useEffect } from 'react';

// Type for ayah: must have a global number (for API), and optionally text, etc.
export interface UseManzilAudioOptions {
  ayahList: Array<{ number: number; [key: string]: any }>;
  edition?: string; // e.g. "ar.alafasy"
}

/**
 * Custom hook to fetch and play Quran ayah audio using AlQuran.cloud API.
 * Handles fetching, caching, playback, autoplay, and SSR safety.
 */
export function useManzilAudio({ ayahList, edition = 'ar.alafasy' }: UseManzilAudioOptions) {
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [audioUrls, setAudioUrls] = useState<(string | null)[]>(() => ayahList.map(() => null));
  const [userInteracted, setUserInteracted] = useState(false); // for autoplay restrictions
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch and cache audio URLs for ayahs
  useEffect(() => {
    let cancelled = false;
    async function fetchAudioUrls() {
      const urls = await Promise.all(
        ayahList.map(async (ayah) => {
          try {
            const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayah.number}/${edition}`);
            const data = await res.json();
            // Defensive: ensure .audio is a valid .mp3 URL
            if (data?.data?.audio && typeof data.data.audio === 'string' && data.data.audio.endsWith('.mp3')) {
              return data.data.audio;
            }
            return null;
          } catch {
            return null;
          }
        })
      );
      if (!cancelled) setAudioUrls(urls);
    }
    fetchAudioUrls();
    return () => { cancelled = true; };
    // Only refetch if ayahList or edition changes
  }, [ayahList, edition]);

  // Play a specific ayah by index
  const playAyah = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
    setUserInteracted(true); // mark that user has interacted
  }, []);

  // Pause playback
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Play next ayah (for autoplay)
  const playNext = useCallback(() => {
    setCurrentIdx((idx) => {
      if (idx === null) return null;
      if (idx < ayahList.length - 1) {
        setIsPlaying(true);
        return idx + 1;
      } else {
        setIsPlaying(false);
        setAutoplay(false);
        return null;
      }
    });
  }, [ayahList.length]);

  // Effect: when currentIdx or isPlaying changes, set audio src and play/pause
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety
    const audio = audioRef.current;
    if (!audio) return;
    if (currentIdx === null || !audioUrls[currentIdx]) {
      audio.pause();
      return;
    }
    audio.src = audioUrls[currentIdx]!;
    audio.load(); // ensure browser loads new src
    if (isPlaying && userInteracted) {
      // Try to play, but catch autoplay errors
      audio.play().catch(() => {
        // Autoplay restrictions: require user gesture
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentIdx, isPlaying, audioUrls, userInteracted]);

  // Effect: handle autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (autoplay) playNext();
      else setIsPlaying(false);
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, playNext]);

  // Expose state and controls
  return {
    currentIdx,
    isPlaying,
    autoplay,
    setAutoplay,
    playAyah,
    pause,
    audioRef,
    audioUrls,
  };
}
