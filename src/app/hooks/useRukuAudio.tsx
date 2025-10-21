
import { useRef, useState, useEffect } from 'react';

export function useRukuAudio(ayahs: any[], audioRefs: React.RefObject<HTMLAudioElement>[]) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Pause all audios on unmount
  useEffect(() => {
    return () => {
      audioRefs.forEach(ref => {
        if (ref.current) ref.current.pause();
      });
    };
  }, [audioRefs]);

  const playVerse = (index: number) => {
    // Pause all others
    audioRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.pause();
        if (i !== index) ref.current.currentTime = 0;
      }
    });
    const audio = audioRefs[index]?.current;
    if (!audio) return;
    setCurrentIndex(index);
    setIsPlaying(true);
    audio.play().catch((err) => {
      setIsPlaying(false);
      console.warn('Audio playback blocked:', err);
    });
    audio.onended = () => {
      setIsPlaying(false);
      if (isAutoPlay && index < ayahs.length - 1) {
        playVerse(index + 1);
      }
    };
  };

  const pause = () => {
    if (currentIndex !== null && audioRefs[currentIndex]?.current) {
      audioRefs[currentIndex].current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = (index: number) => {
    if (currentIndex === index && isPlaying) {
      pause();
    } else {
      playVerse(index);
    }
  };

  const toggleAutoPlay = () => setIsAutoPlay((prev) => !prev);

  return {
    currentIndex,
    isPlaying,
    isAutoPlay,
    playVerse,
    pause,
    togglePlayPause,
    toggleAutoPlay,
  };
}
