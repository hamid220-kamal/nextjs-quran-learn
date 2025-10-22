"use client";
import Footer from '../../components/Footer';
import React, { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import "../quran/Quran.css";
import "./AudioQuran.css";

// API endpoints
const SURAH_LIST_API = "https://api.alquran.cloud/v1/surah";
const RECITERS_API =
  "https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse";
const SURAH_AUDIO_API = (surahNum: number, edition: string) =>
  `https://api.alquran.cloud/v1/surah/${surahNum}/${edition}`;

function formatTime(sec: number) {
  if (!isFinite(sec) || isNaN(sec)) return "--:--";
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const m = Math.floor((sec / 60) % 60).toString().padStart(2, "0");
  const h = Math.floor(sec / 3600);
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export default function AudioQuranPage() {
  const [reciters, setReciters] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedReciter, setSelectedReciter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const [nowPlayingSurah, setNowPlayingSurah] = useState<number | null>(null);
  const [nowPlayingAyahIndex, setNowPlayingAyahIndex] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [ayahLists, setAyahLists] = useState<any>({});
  const [durationsMap, setDurationsMap] = useState<any>({});
  const [perSurahError, setPerSurahError] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const SURAH_PER_PAGE = 20;

  const audioRef = useRef<HTMLAudioElement>(
    typeof window !== "undefined" ? new window.Audio() : null
  );
  const prefetchIdRef = useRef(0);

  // Time tracking state
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [durationState, setDurationState] = useState(0);

  // Fetch reciters + surahs
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [recRes, surRes] = await Promise.all([
          fetch(RECITERS_API),
          fetch(SURAH_LIST_API),
        ]);
        if (!recRes.ok || !surRes.ok)
          throw new Error("Failed to fetch data from API");
        const recJson = await recRes.json();
        const surJson = await surRes.json();
        if (cancelled) return;
        setReciters(recJson.data || []);
        setSurahs(surJson.data || []);
        if (recJson.data?.length > 0)
          setSelectedReciter(recJson.data[0].identifier);
      } catch (err) {
        setGlobalError("Error loading reciters or surahs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Central playback handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (nowPlayingSurah == null) return;
      const ayahUrls = ayahLists[nowPlayingSurah] || [];
      const nextIndex = (nowPlayingAyahIndex ?? 0) + 1;
      if (nextIndex < ayahUrls.length) {
        playAyahIndex(nowPlayingSurah, nextIndex);
      } else {
        setIsPlaying(false);
        setNowPlayingAyahIndex(null);
        setNowPlayingSurah(null);
      }
    };

    const onError = () => {
      if (nowPlayingSurah == null) return;
      const ayahUrls = ayahLists[nowPlayingSurah] || [];
      const nextIndex = (nowPlayingAyahIndex ?? 0) + 1;
      if (nextIndex < ayahUrls.length) playAyahIndex(nowPlayingSurah, nextIndex);
      else {
        setIsPlaying(false);
        setNowPlayingAyahIndex(null);
        setNowPlayingSurah(null);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTimeState(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDurationState(audio.duration);
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [nowPlayingSurah, nowPlayingAyahIndex, ayahLists]);

  const getAyahUrls = useCallback(
    async (surahNum: number) => {
      if (!selectedReciter) return [];
      if (ayahLists[surahNum]) return ayahLists[surahNum];
      try {
        const res = await fetch(SURAH_AUDIO_API(surahNum, selectedReciter));
        if (!res.ok) throw new Error("Failed to fetch audio");
        const json = await res.json();
        const urls = json.data?.ayahs?.map((a: any) => a.audio) || [];
        setAyahLists((prev: any) => ({ ...prev, [surahNum]: urls }));
        return urls;
      } catch {
        setPerSurahError((prev: any) => ({
          ...prev,
          [surahNum]: "Audio not available for this reciter.",
        }));
        return [];
      }
    },
    [selectedReciter, ayahLists]
  );

  const playAyahIndex = async (surahNum: number, index: number) => {
    const urls = ayahLists[surahNum] || [];
    if (!urls || index < 0 || index >= urls.length) return;
    try {
      const audio = audioRef.current!;
      audio.pause();
      audio.src = urls[index];
      await audio.play();
      setNowPlayingSurah(surahNum);
      setNowPlayingAyahIndex(index);
      setIsPlaying(true);
    } catch {
      const next = index + 1;
      if (next < urls.length) playAyahIndex(surahNum, next);
      else setIsPlaying(false);
    }
  };

  const handlePlaySurah = async (surahNum: number) => {
    const urls = await getAyahUrls(surahNum);
    if (urls.length > 0) playAyahIndex(surahNum, 0);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const handleResume = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };
  const handleStop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setNowPlayingAyahIndex(null);
    setNowPlayingSurah(null);
    setCurrentTimeState(0);
  };
  const handleNext = () => {
    if (nowPlayingSurah == null) return;
    const urls = ayahLists[nowPlayingSurah] || [];
    const next = (nowPlayingAyahIndex ?? 0) + 1;
    if (next < urls.length) playAyahIndex(nowPlayingSurah, next);
  };
  const handlePrev = () => {
    if (nowPlayingSurah == null) return;
    const prev = Math.max(0, (nowPlayingAyahIndex ?? 0) - 1);
    playAyahIndex(nowPlayingSurah, prev);
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !durationState) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = clickPosition / progressBarWidth;
    
    audioRef.current.currentTime = percentage * durationState;
  };

  // Get current surah and reciter info for sticky player
  const getCurrentSurahInfo = () => {
    if (nowPlayingSurah === null) return null;
    
    const surah = surahs.find(s => s.number === nowPlayingSurah);
    const reciter = reciters.find(r => r.identifier === selectedReciter);
    
    return {
      surahName: surah?.englishName || `Surah ${nowPlayingSurah}`,
      surahTranslation: surah?.englishNameTranslation || "",
      reciterName: reciter?.englishName || selectedReciter,
      currentAyah: (nowPlayingAyahIndex ?? 0) + 1,
      totalAyahs: surah?.numberOfAyahs || 0
    };
  };

  const currentPlaybackInfo = getCurrentSurahInfo();

  // Calculate progress percentage
  const progressPercentage = durationState > 0 
    ? (currentTimeState / durationState) * 100 
    : 0;

  // Calculate remaining time
  const remainingTime = durationState - currentTimeState;

  // filter and paginate surahs
  const filteredSurahs = surahs.filter((s: any) => {
    const q = search.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
  });

  const totalPages = Math.ceil(filteredSurahs.length / SURAH_PER_PAGE);
  const paginatedSurahs = filteredSurahs.slice(
    (currentPage - 1) * SURAH_PER_PAGE,
    currentPage * SURAH_PER_PAGE
  );

  const goPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
  <>
      <Head>
        <title>Quran Audio Player | Listen to Surah Online</title>
        <meta
          name="description"
          content="Listen to Quran surahs ayah-by-ayah with real-time progress and reciter options."
        />
      </Head>

      <Navbar />

      <div className="audio-section">
        <motion.div
          className="audio-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            paddingTop: '100px',
            paddingBottom: '30px',
            paddingLeft: '20px',
            paddingRight: '20px',
            marginTop: '20px',
            textAlign: 'center'
          }}
        >
          <h1 className="main-title">Quran Audio</h1>
          <p className="subtitle">
            Listen to the whole Surah continuously (ayah by ayah)
          </p>
        </motion.div>

        {globalError && <div className="error-message">{globalError}</div>}

        <div className="controls-card">
          <div className="controls-grid">
            <div className="control-group">
              <label className="control-label">Select Reciter</label>
              <select
                value={selectedReciter}
                onChange={(e) => {
                  setSelectedReciter(e.target.value);
                  setAyahLists({});
                  setDurationsMap({});
                  setPerSurahError({});
                }}
                className="reciter-select"
              >
                {reciters.map((r: any) => (
                  <option key={r.identifier} value={r.identifier}>
                    {r.englishName} ({r.language})
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Search Surah</label>
              <input
                className="search-input"
                placeholder="Search by name or number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={goPrevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ◀ Prev
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goNextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next ▶
            </button>
          </div>
        </div>

        {/* Surah Cards */}
        <div className="chapters-container">
          {paginatedSurahs.map((s: any) => {
            const isNow = nowPlayingSurah === s.number;
            const perErr = perSurahError[s.number];
            return (
              <div
                key={s.number}
                className={`surah-card${isNow ? " active" : ""}`}
              >
                <div className="left-number">{s.number}</div>
                <div className="center-title">
                  <div className="surah-name">{s.englishName}</div>
                  <div className="surah-translation">
                    {s.englishNameTranslation} • {s.numberOfAyahs} ayahs
                  </div>
                  {perErr && (
                    <div className="playback-error">⚠ {perErr}</div>
                  )}
                </div>
                <div className="right-controls">
                  <button
                    className="control-btn small"
                    onClick={handlePrev}
                    aria-label="Previous"
                  >
                    ⏮
                  </button>
                  {isNow && isPlaying ? (
                    <button
                      className="control-btn"
                      onClick={handlePause}
                      aria-label="Pause"
                    >
                      ⏸
                    </button>
                  ) : isNow ? (
                    <button
                      className="control-btn"
                      onClick={handleResume}
                      aria-label="Resume"
                    >
                      ▶️
                    </button>
                  ) : (
                    <button
                      className="control-btn"
                      onClick={() => handlePlaySurah(s.number)}
                      aria-label="Play"
                    >
                      ▶️
                    </button>
                  )}
                  <button
                    className="control-btn"
                    onClick={handleStop}
                    aria-label="Stop"
                  >
                    ⏹
                  </button>
                  <button
                    className="control-btn small"
                    onClick={handleNext}
                    aria-label="Next"
                  >
                    ⏭
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination */}
        <div className="pagination-controls-bottom">
          <button
            onClick={goPrevPage}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ◀ Prev
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goNextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next ▶
          </button>
        </div>

        {/* Spotify-style Sticky Bottom Player */}
        {nowPlayingSurah !== null && currentPlaybackInfo && (
          <div className="sticky-player">
            <div className="sticky-player-content">
              {/* Now Playing Info */}
              <div className="now-playing-info">
                <div className="now-playing-label">Now Playing:</div>
                <div className="now-playing-details">
                  {currentPlaybackInfo.surahName} - {currentPlaybackInfo.reciterName}
                </div>
                <div className="ayah-info">
                  Ayah {currentPlaybackInfo.currentAyah} of {currentPlaybackInfo.totalAyahs}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="time-display">
                  <span className="elapsed-time">{formatTime(currentTimeState)}</span>
                  <span className="duration-time">/ {formatTime(durationState)}</span>
                  <span className="remaining-time">-{formatTime(remainingTime)} left</span>
                </div>
                <div 
                  className="progress-bar-container"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="progress-bar" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Controls */}
              <div className="sticky-player-controls">
                <button
                  className="sticky-control-btn"
                  onClick={handlePrev}
                  aria-label="Previous Ayah"
                >
                  ⏮
                </button>
                {isPlaying ? (
                  <button
                    className="sticky-control-btn play-pause"
                    onClick={handlePause}
                    aria-label="Pause"
                  >
                    ⏸
                  </button>
                ) : (
                  <button
                    className="sticky-control-btn play-pause"
                    onClick={handleResume}
                    aria-label="Play"
                  >
                    ▶️
                  </button>
                )}
                <button
                  className="sticky-control-btn"
                  onClick={handleStop}
                  aria-label="Stop"
                >
                  ⏹
                </button>
                <button
                  className="sticky-control-btn"
                  onClick={handleNext}
                  aria-label="Next Ayah"
                >
                  ⏭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}