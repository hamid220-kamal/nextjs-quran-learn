import React, { useRef, useState, useEffect, useCallback } from "react";

function formatTime(sec = 0) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s}`;
  return `${m}:${s}`;
}

export default function SurahAudioPlayer({ audioSrc, title = "", onEnded }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.crossOrigin = "anonymous";
    }
    const audio = audioRef.current;
    audio.src = audioSrc ?? "";
    audio.load();

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onTime = () => {
      if (!isScrubbing) setCurrentTime(audio.currentTime);
    };
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onEndedInternal = () => {
      setIsPlaying(false);
      if (typeof onEnded === "function") onEnded();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEndedInternal);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEndedInternal);
    };
  }, [audioSrc]);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying) {
      try {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const seekTo = useCallback((timeSec) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(duration)) return;
    const t = Math.max(0, Math.min(duration, timeSec));
    audio.currentTime = t;
    setCurrentTime(t);
  }, [duration]);

  const seekBy = useCallback((deltaSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    seekTo(audio.currentTime + deltaSeconds);
  }, [seekTo]);

  const onKeyDown = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      handlePlayPause();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekBy(-5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      seekBy(5);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekTo(duration || 0);
    }
  };

  useEffect(() => {
    if (!isScrubbing) setScrubTime(currentTime);
  }, [currentTime, isScrubbing]);

  const remaining = Math.max(0, (duration || 0) - (isScrubbing ? scrubTime : currentTime));
  const progressPercent = duration ? ((isScrubbing ? scrubTime : currentTime) / duration) * 100 : 0;

  return (
    <div
      className="w-full max-w-3xl mx-auto bg-white/5 rounded-2xl p-4 shadow-md"
      onKeyDown={onKeyDown}
      role="group"
      aria-label={title ? `Audio player for ${title}` : "Audio player"}
    >
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10 focus:ring-2 focus:ring-accent"
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
            </svg>
          ) : isPlaying ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14"></rect>
              <rect x="14" y="5" width="4" height="14"></rect>
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M5 3v18l15-9L5 3z"></path>
            </svg>
          )}
        </button>

        {/* +/-5s buttons */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => seekBy(-5)}
            aria-label="Back 5 seconds"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/4 hover:bg-white/6 focus:ring-1 focus:ring-accent"
            title="Back 5s"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 6v5l4-4-4-4v3c-4.97 0-9 4.03-9 9 0 1.04.16 2.03.45 2.95a1 1 0 001.77.48C10 17 13 13 13 8h-1z"></path>
            </svg>
            <span className="sr-only">Back 5 seconds</span>
          </button>

          <button
            onClick={() => seekBy(5)}
            aria-label="Forward 5 seconds"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/4 hover:bg-white/6 focus:ring-1 focus:ring-accent"
            title="Forward 5s"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 6v5l4-4-4-4v3c-4.97 0-9 4.03-9 9 0 1.04.16 2.03.45 2.95a1 1 0 001.77.48C10 17 13 13 13 8h-1z" transform="scale(-1,1) translate(-24,0)"></path>
            </svg>
            <span className="sr-only">Forward 5 seconds</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{title || "Audio"}</div>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{formatTime(isScrubbing ? scrubTime : currentTime)}</span>
            <span aria-hidden>•</span>
            <span>{formatTime(duration)}</span>
            <span className="ml-2 text-xs text-gray-400">({formatTime(remaining)} left)</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div
          className="relative h-2 rounded-full bg-white/8 cursor-pointer"
          onMouseDown={(e) => {
            const bounding = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounding.left;
            const pct = Math.max(0, Math.min(1, x / bounding.width));
            const t = pct * (duration || 0);
            setIsScrubbing(true);
            setScrubTime(t);
          }}
          onMouseUp={() => {
            setIsScrubbing(false);
            seekTo(scrubTime);
          }}
          onMouseMove={(e) => {
            if (!isScrubbing) return;
            const bounding = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounding.left;
            const pct = Math.max(0, Math.min(1, x / bounding.width));
            const t = pct * (duration || 0);
            setScrubTime(t);
          }}
          onClick={(e) => {
            const bounding = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounding.left;
            const pct = Math.max(0, Math.min(1, x / bounding.width));
            const t = pct * (duration || 0);
            seekTo(t);
          }}
          aria-label="Seek"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={isScrubbing ? scrubTime : currentTime}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); seekBy(-5); }
            if (e.key === "ArrowRight") { e.preventDefault(); seekBy(5); }
            if (e.key === "Home") { e.preventDefault(); seekTo(0); }
            if (e.key === "End") { e.preventDefault(); seekTo(duration || 0); }
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full"
            style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#10b981,#06b6d4)" }}
          />
          <div
            className="absolute -translate-y-1/2 top-1/2 w-3 h-3 rounded-full bg-white shadow"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
