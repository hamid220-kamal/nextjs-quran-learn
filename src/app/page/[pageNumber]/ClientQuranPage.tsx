"use client";
import React from "react";
import Navbar from '../../../components/Navbar/Navbar';

const TOTAL_PAGES = 604;

type Ayah = {
  number: number;
  arabic: string;
  translation?: string;
  surahNumber: number;
  numberInSurah: number;
  audioUrl?: string;
};

type ClientQuranPageProps = {
  pageNumber: number;
  translationEdition: string;
  audioEdition: string;
  ayahs: Ayah[];
};

// --- Audio Button that ensures only one audio plays at a time ---
function VerseAudioButton({ audioUrl, verseId }: { audioUrl?: string; verseId: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  // Store refs in window to share across all buttons on the page
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!(window as any)._globalVerseAudio) {
      (window as any)._globalVerseAudio = {
        audio: null,
        currentVerse: null,
        setPlayingStates: new Set<Function>(),
      };
    }
    const globalAudio = (window as any)._globalVerseAudio;
    globalAudio.setPlayingStates.add(setIsPlaying);
    return () => {
      globalAudio.setPlayingStates.delete(setIsPlaying);
      // On unmount, if this was the playing verse, stop audio
      if (globalAudio.currentVerse === verseId) {
        if (globalAudio.audio) {
          globalAudio.audio.pause();
          globalAudio.audio.currentTime = 0;
        }
        globalAudio.currentVerse = null;
        globalAudio.setPlayingStates.forEach((fn: Function) => fn(false));
      }
    };
  }, [verseId]);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const globalAudio = (window as any)._globalVerseAudio;
    // If this verse is already playing, stop it
    if (globalAudio.currentVerse === verseId) {
      if (globalAudio.audio) {
        globalAudio.audio.pause();
        globalAudio.audio.currentTime = 0;
      }
      globalAudio.currentVerse = null;
      globalAudio.setPlayingStates.forEach((fn: Function) => fn(false));
      return;
    }
    // Stop any currently playing audio
    if (globalAudio.audio) {
      globalAudio.audio.pause();
      globalAudio.audio.currentTime = 0;
    }
    globalAudio.setPlayingStates.forEach((fn: Function) => fn(false));
    if (!audioUrl) return;
    const audio = new window.Audio(audioUrl);
    globalAudio.audio = audio;
    globalAudio.currentVerse = verseId;
    setIsPlaying(true);
    audio.play();
    audio.onended = () => {
      globalAudio.currentVerse = null;
      globalAudio.setPlayingStates.forEach((fn: Function) => fn(false));
    };
    audio.onerror = () => {
      globalAudio.currentVerse = null;
      globalAudio.setPlayingStates.forEach((fn: Function) => fn(false));
    };
  };

  return (
    <button
      onClick={handleClick}
      style={{ width: 44, height: 44, border: 0, borderRadius: 10, background: isPlaying ? '#0ea5e9' : '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: audioUrl ? 'pointer' : 'not-allowed', fontSize: 24, boxShadow: isPlaying ? '0 2px 8px #0ea5e922' : '0 1px 4px #22c55e22', marginTop: 2, transition: 'background 0.15s, box-shadow 0.15s' }}
      aria-label={isPlaying ? `Stop ayah ${verseId}` : `Play ayah ${verseId}`}
      title={isPlaying ? `Stop ayah ${verseId}` : `Play ayah ${verseId}`}
      aria-pressed={isPlaying}
      disabled={!audioUrl}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  );
}

function ClientQuranPage({ pageNumber, translationEdition, audioEdition, ayahs }: ClientQuranPageProps) {
  const totalPages = TOTAL_PAGES;
  // Auto-play state and refs
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);
  const audioQueueRef = React.useRef<HTMLAudioElement | null>(null);
  const stopFlag = React.useRef(false);

  async function handlePlaySequence() {
    setIsAutoPlaying(true);
    stopFlag.current = false;
    for (const ay of ayahs) {
      if (stopFlag.current) break;
      if (!ay.audioUrl) continue;
      await new Promise<void>((resolve) => {
        if (audioQueueRef.current) {
          audioQueueRef.current.pause();
          audioQueueRef.current = null;
        }
        const audio = new window.Audio(ay.audioUrl!);
        audioQueueRef.current = audio;
        audio.play();
        audio.onended = () => {
          audioQueueRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          audioQueueRef.current = null;
          resolve();
        };
      });
    }
    setIsAutoPlaying(false);
  }

  function stopAutoPlay() {
    setIsAutoPlaying(false);
    stopFlag.current = true;
    if (audioQueueRef.current) {
      audioQueueRef.current.pause();
      audioQueueRef.current = null;
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#f7fafc', minHeight: '100vh', padding: '0 0 40px 0' }}>
        {/* Header - styled to match Juz section header */}
        <div style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)',
          textAlign: 'center',
          padding: '2.8rem 1.2rem 2.2rem 1.2rem',
          borderRadius: 18,
          marginBottom: '2.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          border: '1.5px solid #bae6fd',
          position: 'relative',
        }}>
          {/* Large Arabic title */}
          <div style={{
            fontFamily: 'Scheherazade New, Traditional Arabic, serif',
            fontSize: '2.5rem',
            color: '#10b981',
            fontWeight: 700,
            marginBottom: 4,
            letterSpacing: 1,
          }}>
            صفحة
          </div>
          {/* Section title */}
          <div style={{
            fontSize: '2.1rem',
            color: '#2563eb',
            fontWeight: 700,
            marginBottom: 6,
            letterSpacing: 0.5,
          }}>
            Quran Page {pageNumber}
          </div>
          {/* Subtitle */}
          <div style={{ fontSize: '1.15rem', color: '#64748b', marginBottom: '1.7rem', fontWeight: 500 }}>
            Section of the Holy Quran
          </div>
          {/* Meta info row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#0f172a' }}>{ayahs.length}</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Total Verses</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#0f172a' }}>{pageNumber}/604</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>Page</div>
            </div>
          </div>
          {/* Buttons row - styled to match screenshot */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 0 }}>
            <button
              onClick={() => (isAutoPlaying ? stopAutoPlay() : handlePlaySequence())}
              style={{ background: isAutoPlaying ? '#ef4444' : '#22c55e', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '12px 32px', border: 0, cursor: 'pointer', minWidth: 160, boxShadow: isAutoPlaying ? '0 2px 8px #ef444422' : '0 2px 8px #22c55e22', marginRight: 8, transition: 'background 0.15s' }}
              aria-label={isAutoPlaying ? 'Stop Auto-Play' : 'Auto-Play Page'}
            >
              {isAutoPlaying ? 'Stop Auto-Play' : 'Auto-Play Page'}
            </button>
            <button
              onClick={() => window.location.href = '/quran'}
              style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '12px 32px', border: 0, cursor: 'pointer', minWidth: 160, boxShadow: '0 2px 8px #2563eb22', marginLeft: 8, transition: 'background 0.15s' }}
              aria-label="Back to Quran"
            >
              ← Back to Quran
            </button>
          </div>
        </div>
        {/* Ayah Cards - improved spacing and shadow */}
        <div style={{ margin: '2.2rem auto', maxWidth: 800 }}>
          {ayahs.map((ay) => (
            <div key={ay.number} style={{
              display: 'flex',
              alignItems: 'flex-start',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 2px 12px #0001',
              marginBottom: 28,
              padding: '28px 22px',
              gap: 22
            }}>
              {/* Left: Verse number and play button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56, marginRight: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>{ay.number}</div>
                <VerseAudioButton audioUrl={ay.audioUrl} verseId={ay.number} />
              </div>
              {/* Right: Arabic and translation */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Scheherazade New, Traditional Arabic, serif', fontSize: '1.8rem', color: '#222', marginBottom: 10, textAlign: 'right', direction: 'rtl', lineHeight: 1.7 }}>{ay.arabic}</div>
                <div style={{ fontSize: '1.13rem', color: '#64748b', marginBottom: 4, textAlign: 'left', direction: 'ltr', borderLeft: '3px solid #10b981', paddingLeft: 14 }}>{ay.translation}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination - improved style */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px #0001', padding: '1.7rem', margin: '2.5rem auto 0 auto', maxWidth: 600, textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 10 }}>
            Page {pageNumber}/{totalPages}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, marginTop: 14 }}>
            <button
              style={{ background: pageNumber === 1 ? '#94a3b8' : '#22c55e', color: '#fff', fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '10px 28px', border: 0, cursor: pageNumber === 1 ? 'not-allowed' : 'pointer', minWidth: 130, transition: 'background 0.2s' }}
              disabled={pageNumber === 1}
              onClick={() => pageNumber > 1 && (window.location.href = `/page/${pageNumber - 1}`)}
            >
              ← Previous Page
            </button>
            <span style={{ fontWeight: 700, fontSize: 19 }}>Page {pageNumber}/{totalPages}</span>
            <button
              style={{ background: pageNumber === totalPages ? '#94a3b8' : '#22c55e', color: '#fff', fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '10px 28px', border: 0, cursor: pageNumber === totalPages ? 'not-allowed' : 'pointer', minWidth: 130, transition: 'background 0.2s' }}
              disabled={pageNumber === totalPages}
              onClick={() => pageNumber < totalPages && (window.location.href = `/page/${pageNumber + 1}`)}
            >
              Next Page →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientQuranPage;

