'use client';

import RukuAyah from '@/app/components/quran/ruku/RukuAyah';
import { useRef, useState, useImperativeHandle, forwardRef } from 'react';

export type RukuAudioClientHandle = {
  startAutoPlay: () => void;
  stopAutoPlay: () => void;
};
export type RukuAudioClientProps = {
  ayahs: any[];
  isAutoPlaying: boolean;
  setIsAutoPlaying: (v: boolean) => void;
};

const RukuAudioClient = forwardRef<RukuAudioClientHandle, RukuAudioClientProps>(({ ayahs, isAutoPlaying, setIsAutoPlaying }: {
  ayahs: any[];
  isAutoPlaying: boolean;
  setIsAutoPlaying: (v: boolean) => void;
}, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState<number | null>(null);

  // Scroll to verse when it becomes active
  const scrollToVerse = (verseId: number) => {
    const el = document.getElementById(`ayah-${verseId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Play/pause logic for green button
  const handlePlay = async (verse: any) => {
    try {
      // Build fallback audio URL if missing
      let audioUrl = verse.audioUrl || verse.audio;
      if (!audioUrl && verse.number) {
        audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.number}.mp3`;
      }
      if (!audioUrl) {
        console.warn("No audio URL found for verse:", verse);
        return;
      }

      // If the same verse is playing, toggle pause/resume
      if (currentVerseId === verse.number && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        return;
      }

      // Stop previous verse if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        audioRef.current.load(); // Ensure browser loads new src
        await audioRef.current.play().catch((err) => {
          console.warn('Audio play error:', err);
        });
        setCurrentVerseId(verse.number);
        setIsPlaying(true);
        scrollToVerse(verse.number);
      }
    } catch (err) {
      console.error("Error playing verse audio:", err);
    }
  };


  // Auto-play logic
  const startAutoPlay = async () => {
    if (!ayahs.length) return;
    setIsAutoPlaying(true);
    setAutoPlayIndex(0);
    await playVerseAtIndex(0);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    setAutoPlayIndex(null);
    setIsPlaying(false);
    setCurrentVerseId(null);
    if (audioRef.current) audioRef.current.pause();
  };

  const playVerseAtIndex = async (idx: number) => {
    const ayah = ayahs[idx];
    if (!ayah) return;
    let audioUrl = ayah.audioUrl || ayah.audio;
    if (!audioUrl && ayah.number) {
      audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    }
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      await audioRef.current.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
      setCurrentVerseId(ayah.id || ayah.number);
      setIsPlaying(true);
      scrollToVerse(ayah.id || ayah.number);
    }
  };

  // Handle audio ended for auto-play
  const handleEnded = async () => {
    if (isAutoPlaying && autoPlayIndex !== null) {
      const nextIndex = autoPlayIndex + 1;
      if (nextIndex < ayahs.length) {
        setAutoPlayIndex(nextIndex);
        await playVerseAtIndex(nextIndex);
      } else {
        setIsAutoPlaying(false);
        setAutoPlayIndex(null);
        setIsPlaying(false);
        setCurrentVerseId(null);
      }
    } else {
      setIsPlaying(false);
      setCurrentVerseId(null);
    }
  };

  // Expose imperative methods for parent
  useImperativeHandle(ref, () => ({
    startAutoPlay,
    stopAutoPlay,
  }));

  return (
    <>
      {/* Hidden shared audio element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        hidden
      />
      <div className="flex flex-col items-center w-full py-4">
        {ayahs.map((ayah, idx) => {
          const audioProp = ayah.audioUrl || ayah.audio || "";
          return (
            <RukuAyah
              key={ayah.id || ayah.number}
              ayah={{
                text: ayah.arabicText || ayah.text || "",
                numberInSurah: ayah.ayah || ayah.numberInSurah,
                audio: audioProp,
                translation: ayah.englishText || ayah.translation || "",
                number: ayah.id || ayah.number,
              }}
              index={idx}
              isPlaying={isPlaying && currentVerseId === (ayah.id || ayah.number)}
              isCurrent={currentVerseId === (ayah.id || ayah.number)}
              onPlayPause={() => handlePlay({
                ...ayah,
                audioUrl: audioProp,
                number: ayah.id || ayah.number,
              })}
              audioRef={audioRef}
            />
          );
        })}
      </div>
    </>
  );
});

export default RukuAudioClient;
