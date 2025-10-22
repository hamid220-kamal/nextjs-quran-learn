"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

export type PlaylistItem = {
  id?: string | number;
  url: string;
  title?: string;
  surah?: string | number;
  ayah?: number;
  duration?: number; // optional known duration in seconds
  artwork?: string;
};

export interface QuranPlayerProps {
  playlist: PlaylistItem[];
  initialIndex?: number;
  className?: string;
  onPlay?: (item: PlaylistItem) => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function QuranPlayer({
  playlist,
  initialIndex = 0,
  className = "",
  onPlay,
  onPause,
  onEnded,
}: QuranPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  // Ensure audio element exists
  useEffect(() => {
    if (!audioRef.current) {
      const a = document.createElement("audio");
      a.preload = "metadata";
      a.crossOrigin = "anonymous";
      audioRef.current = a;
    }

    const audio = audioRef.current!;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(isFinite(audio.duration) ? audio.duration : null);
    const onEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onEnded]);

  // load current item
  useEffect(() => {
    const item = playlist[index];
    const audio = audioRef.current;
    if (!audio || !item) return;
    audio.src = item.url;
    audio.load();
    setCurrentTime(0);
    setDuration(item.duration ?? null);
    if (isPlaying) {
      // try to play
      audio
        .play()
        .then(() => {
          if (onPlay) onPlay(item);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playlist]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    const item = playlist[index];
    if (!audio || !item) return;
    try {
      await audio.play();
      setIsPlaying(true);
      if (onPlay) onPlay(item);
    } catch (e) {
      setIsPlaying(false);
    }
  }, [index, playlist, onPlay]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    if (onPause) onPause();
  }, [onPause]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      const nextIndex = i + 1;
      if (nextIndex >= playlist.length) return i;
      return nextIndex;
    });
  }, [playlist.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const seekTo = (percentage: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(percentage)) return;
    const dur = duration ?? audio.duration;
    if (!dur || !isFinite(dur)) return;
    audio.currentTime = Math.max(0, Math.min(dur, dur * percentage));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    seekTo(pct);
  };

  const formatTime = (sec?: number | null) => {
    if (!sec || !isFinite(sec)) return "--:--";
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    const m = Math.floor((sec / 60) % 60).toString().padStart(2, "0");
    const h = Math.floor(sec / 3600);
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const currentItem = playlist[index];
  const progressPct = (() => {
    const dur = duration ?? (audioRef.current ? audioRef.current.duration : NaN);
    if (!dur || !isFinite(dur)) return 0;
    return Math.min(100, (currentTime / dur) * 100);
  })();

  return (
    <div className={`quran-player ${className}`} role="region" aria-label="Quran audio player">
      <div className="qp-top">
        <div className="qp-track-info">
          <div className="qp-title">{currentItem?.title ?? `Surah ${currentItem?.surah ?? "-"}`}</div>
          <div className="qp-sub">{currentItem?.surah ? `Surah ${currentItem.surah} • Ayah ${currentItem.ayah ?? "-"}` : null}</div>
        </div>
        <div className="qp-times">
          <span className="qp-current">{formatTime(currentTime)}</span>
          <span className="qp-divider">/</span>
          <span className="qp-duration">{formatTime(duration ?? (audioRef.current ? audioRef.current.duration : null))}</span>
        </div>
      </div>

      <div className="qp-progress" onClick={handleProgressClick} aria-label="Seek" role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPct)} tabIndex={0}>
        <div className="qp-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="qp-controls">
        <button type="button" className="qp-btn" onClick={prev} aria-label="Previous">⏮</button>
        {isPlaying ? (
          <button type="button" className="qp-btn play" onClick={pause} aria-label="Pause">⏸</button>
        ) : (
          <button type="button" className="qp-btn play" onClick={play} aria-label="Play">▶️</button>
        )}
        <button type="button" className="qp-btn" onClick={stop} aria-label="Stop">⏹</button>
        <button type="button" className="qp-btn" onClick={next} aria-label="Next">⏭</button>
      </div>

      {/* Hidden audio element (not added to DOM visually) */}
      <audio ref={audioRef as any} style={{ display: "none" }} />
    </div>
  );
}
