"use client";

import React, { useEffect, useRef, useState } from "react";
import "./juz-header.css";

type Ayah = {
  number: number;
  numberInSurah?: number;
  surah?: { number: number; englishName?: string; name?: string };
  text?: string;
  translation?: string;
};

// Helper: group ayahs by surah
function groupAyahsBySurah(ayahs: Ayah[]) {
  const groups: { surah: Ayah["surah"]; ayahs: Ayah[] }[] = [];
  let currentSurah: Ayah["surah"] | null = null;
  let currentAyahs: Ayah[] = [];
  for (const ayah of ayahs) {
    if (!currentSurah || ayah.surah?.number !== currentSurah.number) {
      if (currentSurah) groups.push({ surah: currentSurah, ayahs: currentAyahs });
      currentSurah = ayah.surah;
      currentAyahs = [ayah];
    } else {
      currentAyahs.push(ayah);
    }
  }
  if (currentSurah) groups.push({ surah: currentSurah, ayahs: currentAyahs });
  return groups;
}

export default function JuzViewerClient({ ayahs, juz }: { ayahs: Ayah[]; juz: number }) {
  // Navigation handlers for Juz navigation
  const handleGoToPreviousJuz = () => {
    if (juz > 1) {
      window.location.href = `/juz/${juz - 1}`;
    }
  };

  const handleGoToNextJuz = () => {
    if (juz < 30) {
      window.location.href = `/juz/${juz + 1}`;
    }
  };
  // --- State for audio and autoplay ---
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // current ayah index
  const [playing, setPlaying] = useState(false); // is audio playing
  const [autoplay, setAutoplay] = useState(false); // autoplay enabled
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioMap, setAudioMap] = useState<Map<number, string>>(new Map()); // ayah.number -> audio URL
  const [userGestureHint, setUserGestureHint] = useState(false); // show hint if browser blocks autoplay
  const audioRef = useRef<HTMLAudioElement | null>(null);


  // --- Build audioMap (ayah.number -> audio URL) on mount ---
  useEffect(() => {
    const map = new Map<number, string>();
    ayahs.forEach(a => {
      // AlQuran.cloud audio endpoint
      map.set(a.number, `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
    });
    setAudioMap(map);
  }, [ayahs]);

  // --- Setup shared HTMLAudioElement ---
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // --- Handle audio end event for autoplay ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      console.log("Audio ended", currentIndex);
      if (autoplay && currentIndex !== null && currentIndex < ayahs.length - 1) {
        // Find next ayah with audio
        let next = currentIndex + 1;
        while (next < ayahs.length && !audioMap.get(ayahs[next].number)) next++;
        if (next < ayahs.length) {
          console.log("Autoplay: playing next index", next);
          playIndex(next);
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };
    audio.addEventListener("ended", onEnded);
    return () => { audio.removeEventListener("ended", onEnded); };
  }, [autoplay, currentIndex, ayahs, audioMap]);

  // --- Play/Pause logic ---
  async function playIndex(idx: number) {
    const a = ayahs[idx];
    if (!a) return;
    const audioUrl = audioMap.get(a.number);
    if (!audioRef.current || !audioUrl) {
      setAudioError("Audio missing for this ayah");
      if (autoplay) {
        // Skip to next if autoplay
        let next = idx + 1;
        while (next < ayahs.length && !audioMap.get(ayahs[next].number)) next++;
        if (next < ayahs.length) playIndex(next);
      }
      return;
    }
    audioRef.current.src = audioUrl;
    try {
      await audioRef.current.play();
      setCurrentIndex(idx);
      setPlaying(true);
      setAudioError(null);
      setUserGestureHint(false);
      console.log("Playing ayah", idx);
    } catch (e) {
      setPlaying(false);
      setUserGestureHint(true);
      setAudioError("Audio playback failed. Click Play to enable audio.");
      console.error("Autoplay failed (user interaction required)", e);
    }
  }

  function togglePlayPause(idx: number) {
    if (currentIndex === idx && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      playIndex(idx);
    }
  }

  function playNext() { if (currentIndex !== null && currentIndex + 1 < ayahs.length) playIndex(currentIndex + 1); }
  function playPrev() { if (currentIndex !== null && currentIndex > 0) playIndex(currentIndex - 1); }

  // --- Autoplay button logic ---
  function handleAutoplayClick() {
    setAutoplay(v => {
      const next = !v;
      if (next) {
        // Start from first ayah if not already playing
        if (currentIndex === null || !playing) {
          playIndex(currentIndex !== null ? currentIndex : 0);
        }
      } else {
        // Stop audio playback immediately when autoplay is turned off
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setPlaying(false);
      }
      return next;
    });
  }

  // UI: group ayahs by surah for surah headers
  const surahGroups = groupAyahsBySurah(ayahs);

  // Pagination logic
  const pageSize = 50;
  const totalAyahs = ayahs.length;
  const totalPages = Math.ceil(totalAyahs / pageSize);
  const [page, setPage] = useState(1);
  const pagedAyahs = ayahs.slice((page - 1) * pageSize, page * pageSize);
  const pagedSurahGroups = groupAyahsBySurah(pagedAyahs);

  // Header UI
  return (
    <div className="juz-viewer-ui" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="juz-header" style={{ background: '#f0f9ff', textAlign: 'center', padding: '2.5rem 1rem', borderRadius: 12, marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div className="juz-title-container" style={{ marginBottom: '1.5rem' }}>
          <div className="juz-arabic-title" style={{ fontFamily: 'Scheherazade New, Traditional Arabic, serif', fontSize: '2.5rem', color: '#0e9f6e', marginBottom: '0.5rem', fontWeight: 500 }}>{juz} جُزْء</div>
          <div className="juz-english-title" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem', fontWeight: 700 }}>Juz {juz}</div>
          <div className="juz-subtitle" style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '1.5rem' }}>Section of the Holy Quran</div>
        </div>
        <div className="juz-stats" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalAyahs}</div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Total Verses</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{juz}/30</div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Section</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalPages}</div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Total Pages</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: '1.5rem' }}>
          <button
            style={{ background: autoplay ? '#e74c3c' : '#22c55e', color: '#fff', fontWeight: 600, fontSize: 18, borderRadius: 24, padding: '10px 28px', border: 0, cursor: 'pointer', minWidth: 180 }}
            onClick={handleAutoplayClick}
          >
            {autoplay ? 'Stop Autoplay' : 'Auto-Play Juz'}
          </button>
          <a href="/quran" style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 18, borderRadius: 24, padding: '10px 28px', textDecoration: 'none', display: 'inline-block', minWidth: 180 }}>← Back to Quran</a>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: 16, margin: '0 auto 1.5rem auto', maxWidth: 520, boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 17, color: '#222', marginBottom: 4 }}>From Surah {surahGroups[0]?.surah?.englishName} ({surahGroups[0]?.surah?.number}) to Surah {surahGroups[surahGroups.length-1]?.surah?.englishName} ({surahGroups[surahGroups.length-1]?.surah?.number})</div>
          <div style={{ fontSize: 16, color: '#64748b', fontStyle: 'italic' }}>{surahGroups[0]?.surah?.name} to {surahGroups[surahGroups.length-1]?.surah?.name}</div>
        </div>
        {/* Autoplay checkbox removed; green button now triggers autoplay */}
        {userGestureHint && (
          <div style={{ color: '#e67e22', fontSize: 15, marginTop: 8 }}>
            Click Play to enable audio for Autoplay (browser policy)
          </div>
        )}
      </div>
      {/* Render ayahs/verses for the current page with verse-to-verse audio UI */}
      <div style={{ margin: '2rem auto', maxWidth: 800 }}>
        {pagedAyahs.map((ayah, idx) => (
          <div key={ayah.number} style={{
            display: 'flex',
            alignItems: 'flex-start',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 1px 8px #0001',
            marginBottom: 24,
            padding: '24px 18px',
            gap: 18
          }}>
            {/* Left: Verse number and play button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56, marginRight: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{ayah.numberInSurah}</div>
              <button
                onClick={() => togglePlayPause((page - 1) * pageSize + idx)}
                style={{ width: 40, height: 40, border: 0, borderRadius: 8, background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22 }}
                aria-label={playing && currentIndex === (page - 1) * pageSize + idx ? 'Pause' : 'Play'}
              >
                {playing && currentIndex === (page - 1) * pageSize + idx ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="4" width="4" height="14" rx="1.5" fill="white"/><rect x="13" y="4" width="4" height="14" rx="1.5" fill="white"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L18 11L6 18V4Z" fill="white"/></svg>
                )}
              </button>
            </div>
            {/* Right: Arabic and translation */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Scheherazade New, Traditional Arabic, serif', fontSize: '1.7rem', color: '#222', marginBottom: 8, textAlign: 'right', direction: 'rtl' }}>{ayah.text}</div>
              <div style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: 4, textAlign: 'left', direction: 'ltr', borderLeft: '3px solid #10b981', paddingLeft: 12 }}>{ayah.translation}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Single pagination and navigation block */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001', padding: '1.5rem', margin: '2rem auto 0 auto', maxWidth: 600, textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: '#64748b', marginBottom: 8 }}>
          Showing verses {(page-1)*pageSize+1} - {Math.min(page*pageSize, totalAyahs)} of {totalAyahs}<br />
          Page {page}/{totalPages}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 12 }}>
          <button
            style={{ background: page === 1 ? '#94a3b8' : '#22c55e', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 22px', border: 0, cursor: page === 1 ? 'not-allowed' : 'pointer', minWidth: 120 }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous Page
          </button>
          <span style={{ fontWeight: 600, fontSize: 18 }}>Page {page}/{totalPages}</span>
          <button
            style={{ background: page === totalPages ? '#94a3b8' : '#22c55e', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 22px', border: 0, cursor: page === totalPages ? 'not-allowed' : 'pointer', minWidth: 120 }}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next Page →
          </button>
        </div>
        {/* Juz navigation at last page */}
        {page === totalPages && (
          <div style={{ marginTop: 32, padding: '1.2rem', background: '#f0f9ff', borderRadius: 12, boxShadow: '0 1px 4px #0001', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2563eb', marginBottom: 10 }}>Juz Navigation</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
              <button
                style={{ background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '10px 24px', border: 0, cursor: 'pointer', minWidth: 150 }}
                onClick={handleGoToPreviousJuz}
              >
                ← Previous Juz
              </button>
              <span style={{ fontWeight: 600, fontSize: 18 }}>Juz {juz} of 30</span>
              <button
                style={{ background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '10px 24px', border: 0, cursor: 'pointer', minWidth: 150 }}
                onClick={handleGoToNextJuz}
              >
                Next Juz →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
