import React, { useEffect, useRef, useState } from "react";

type Ayah = {
  number: number;
  numberInSurah?: number;
  surah?: { number: number; englishName?: string; name?: string };
  text?: string;
  translation?: string;
};

type JuzPlayerProps = {
  juz: number;
  arabicEdition?: string;
  translationEdition?: string;
  audioEdition?: string;
};

// --- AudioManager class ---
class AudioManager {
  audio: HTMLAudioElement;
  onEnded?: () => void;
  onError?: (err: any) => void;
  private retryCount = 0;
  private maxRetries = 2;
  private currentMeta?: { ayahNumber: number; url: string };
  constructor() {
    this.audio = new Audio();
    this.audio.onended = () => this.onEnded?.();
    this.audio.onerror = (e) => this.handleError(e);
  }
  async play(meta: { ayahNumber: number; url: string }) {
    if (this.currentMeta?.ayahNumber !== meta.ayahNumber) {
      this.audio.src = meta.url;
      this.audio.load();
      this.currentMeta = meta;
      this.retryCount = 0;
    }
    try {
      await this.audio.play();
    } catch (err) {
      this.onError?.(err);
    }
  }
  pause() { this.audio.pause(); }
  stop() { this.pause(); this.audio.currentTime = 0; }
  private handleError(e: any) {
    if (this.retryCount < this.maxRetries && this.currentMeta) {
      this.retryCount++;
      setTimeout(() => this.play(this.currentMeta!), 300 * this.retryCount);
    } else {
      this.onError?.(e);
    }
  }
}

// --- Main JuzPlayer component ---
export default function JuzPlayer({ juz, arabicEdition = "quran-uthmani", translationEdition = "en.asad", audioEdition = "ar.alafasy" }: JuzPlayerProps) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [audioMap, setAudioMap] = useState<Map<number, { ayahNumber: number; url: string }>>(new Map());
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [errorAyahs, setErrorAyahs] = useState<Set<number>>(new Set());
  const [audioError, setAudioError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);

  // Server fetch: merge Arabic + English
  useEffect(() => {
    async function fetchJuzMerged() {
      setLoading(true);
      setError(null);
      try {
        const arabicUrl = `https://api.alquran.cloud/v1/juz/${juz}/${arabicEdition}`;
        const translationUrl = `https://api.alquran.cloud/v1/juz/${juz}/${translationEdition}`;
        const [arabicRes, translationRes] = await Promise.all([
          fetch(arabicUrl),
          fetch(translationUrl),
        ]);
        const arabicJson = await arabicRes.json();
        const translationJson = await translationRes.json();
        if (!arabicJson?.data?.ayahs) throw new Error("Arabic ayahs missing");
        if (!translationJson?.data?.ayahs) throw new Error("Translation ayahs missing");
        // Build translation map
        const translationMap = new Map<number, any>();
        translationJson.data.ayahs.forEach((a: any) => translationMap.set(a.number, a));
        // Merge
        const merged = arabicJson.data.ayahs.map((a: any) => {
          const t = translationMap.get(a.number);
          return {
            number: a.number,
            numberInSurah: a.numberInSurah,
            surah: a.surah,
            text: a.text,
            translation: t ? (t.text || t.translation || "") : "",
          };
        });
        setAyahs(merged);
      } catch (err) {
        setError("Failed to load Juz or translation. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchJuzMerged();
  }, [juz, arabicEdition, translationEdition]);

  // Build audio map client-side
  useEffect(() => {
    let mounted = true;
    async function buildAudioMap() {
      const map = new Map();
      const concurrency = 5;
      let idx = 0;
      async function worker() {
        while (idx < ayahs.length) {
          const i = idx++;
          const ayah = ayahs[i];
          try {
            const r = await fetch(`https://api.alquran.cloud/v1/ayah/${ayah.number}/${audioEdition}`);
            const j = await r.json();
            const url = j?.data?.audio || j?.data?.audioSecondary || null;
            if (url) map.set(ayah.number, { ayahNumber: ayah.number, url });
            else console.warn("No audio URL for ayah", ayah.number, j);
          } catch (e) {
            console.error("Audio fetch failed for", ayah.number, e);
          }
        }
      }
      await Promise.all(Array.from({ length: concurrency }).map(() => worker()));
      if (mounted) setAudioMap(map);
    }
    if (ayahs.length > 0) buildAudioMap();
    return () => { mounted = false; };
  }, [ayahs, audioEdition]);

  // AudioManager setup
  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    const mgr = audioManagerRef.current;
    mgr.onEnded = () => {
      if (autoplay && currentIndex !== null && currentIndex + 1 < ayahs.length) playIndex(currentIndex + 1);
      else setPlaying(false);
    };
    mgr.onError = (err) => {
      setAudioError("Audio error: " + (err?.message || "Unknown"));
      setPlaying(false);
      if (autoplay && currentIndex !== null) playIndex(currentIndex + 1);
    };
    return () => mgr.stop();
  }, [autoplay, ayahs.length, currentIndex]);

  function playIndex(idx: number) {
    const ayah = ayahs[idx];
    const meta = audioMap.get(ayah.number);
    if (!meta) {
      setErrorAyahs(prev => new Set(prev).add(ayah.number));
      setAudioError("Audio missing for ayah " + ayah.number);
      if (autoplay) playIndex(idx + 1);
      return;
    }
    setCurrentIndex(idx);
    setPlaying(true);
    setAudioError(null);
    audioManagerRef.current?.play(meta);
  }

  function togglePlayPause(idx: number) {
    if (currentIndex === idx && playing) {
      audioManagerRef.current?.pause();
      setPlaying(false);
    } else {
      playIndex(idx);
    }
  }

  function playNext() { if (currentIndex !== null && currentIndex + 1 < ayahs.length) playIndex(currentIndex + 1); }
  function playPrev() { if (currentIndex !== null && currentIndex > 0) playIndex(currentIndex - 1); }

  if (loading) return <div>Loading Juz...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      {audioError && <div style={{ color: "red" }}>{audioError}</div>}
      <div>
        <button onClick={() => currentIndex !== null ? togglePlayPause(currentIndex) : playIndex(0)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={playPrev}>Prev</button>
        <button onClick={playNext}>Next</button>
        <label>
          <input type="checkbox" checked={autoplay} onChange={() => setAutoplay(v => !v)} />
          Autoplay
        </label>
      </div>
      <ol>
        {ayahs.map((a, i) => (
          <li key={a.number} style={{ marginBottom: 12 }}>
            <button onClick={() => togglePlayPause(i)} aria-label={`Play verse ${a.number}`}>
              {currentIndex === i && playing ? "Pause" : "Play"}
            </button>
            <div>
              <div><strong>Surah {a.surah?.englishName ?? a.surah?.name} - Ayah {a.numberInSurah}</strong></div>
              <div style={{ fontFamily: "scheherazade, serif", fontSize: 22 }}>{a.text}</div>
              <div style={{ color: "#444" }}>{a.translation || <span style={{ color: "orange" }}>No translation</span>}</div>
            </div>
            {errorAyahs.has(a.number) && <span title="Audio failed">⚠️</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
