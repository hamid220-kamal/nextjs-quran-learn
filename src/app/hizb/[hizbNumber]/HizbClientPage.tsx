"use client";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from '../../../components/Navbar/Navbar';

type Ayah = {
  number: number;
  surah: any;
  text: string;
  translation?: string | null;
  audio?: string | null;
};

export default function HizbClientPage({ hizbId, ayahs, error }: { hizbId: number; ayahs: Ayah[]; error: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefetchRef = useRef<HTMLAudioElement>(null);
  const [autoplayOnLoad, setAutoplayOnLoad] = useState(false);

  useEffect(() => {
    if (searchParams?.get("auto") === "1") {
      setAutoplayOnLoad(true);
      // Remove query param so it doesn't replay on refresh
      const params = new URLSearchParams(searchParams as any);
      params.delete("auto");
      router.replace(`?${params.toString()}`);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (autoplayOnLoad) {
      setTimeout(() => {
        handlePlayFrom(0);
      }, 200);
    }
    // eslint-disable-next-line
  }, [autoplayOnLoad]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const onEnded = () => {
      const next = currentIndex + 1;
      if (next < ayahs.length) {
        handlePlayFrom(next);
      } else {
        setIsPlaying(false);
        if (Number(hizbId) < 60) {
          router.push(`/hizb/${Number(hizbId) + 1}?auto=1`);
        }
      }
    };
    audioEl.addEventListener("ended", onEnded);
    return () => audioEl.removeEventListener("ended", onEnded);
    // eslint-disable-next-line
  }, [currentIndex, ayahs, hizbId]);

  useEffect(() => {
    const ayah = ayahs[currentIndex];
    if (!ayah) return;
    const id = `ayah-${ayah.number}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (isPlaying && audioRef.current) {
      const src = ayah.audio;
      if (src) {
        audioRef.current.src = src;
        audioRef.current.play().catch(() => {});
      } else {
        const next = currentIndex + 1;
        if (next < ayahs.length) {
          handlePlayFrom(next);
        } else if (Number(hizbId) < 60) {
          router.push(`/hizb/${Number(hizbId) + 1}?auto=1`);
        }
      }
    }
    const nextAyah = ayahs[currentIndex + 1];
    if (nextAyah && prefetchRef.current) {
      prefetchRef.current.src = nextAyah.audio || "";
    }
    // eslint-disable-next-line
  }, [currentIndex, isPlaying, ayahs]);

  function handlePlayFrom(index: number) {
    if (!ayahs[index]) return;
    setCurrentIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      try {
        if (audioRef.current) {
          if (ayahs[index].audio) {
            audioRef.current.src = ayahs[index].audio!;
            audioRef.current.play().catch(() => {});
          } else {
            const next = index + 1;
            if (next < ayahs.length) handlePlayFrom(next);
          }
        }
      } catch (e) {}
    }, 50);
  }

  function togglePlayPause() {
    if (!isPlaying) {
      handlePlayFrom(currentIndex);
    } else {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }

  function onManualSelect(index: number) {
    setCurrentIndex(index);
    if (isPlaying) {
      handlePlayFrom(index);
    } else {
      if (audioRef.current && ayahs[index].audio) {
        audioRef.current.src = ayahs[index].audio!;
      }
    }
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="mb-4">{error}</p>
        <button onClick={() => router.push('/quran')} className="px-3 py-1 border rounded">Back to Quran</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learn Quran — Hizb {hizbId}</title>
        <meta name="description" content={`Read and listen to Hizb ${hizbId} with translation.`} />
      </Head>
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Hizb {hizbId}</h1>
            <p className="text-sm text-gray-600">Arabic text, translation and verse-by-verse audio</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className={`px-4 py-2 rounded text-white font-semibold ${
                isPlaying ? "bg-red-600" : "bg-green-600"
              }`}
              aria-pressed={isPlaying}
            >
              {isPlaying ? "Pause" : "Auto Play"}
            </button>
            <button
              onClick={() => router.push("/quran")}
              className="px-3 py-1 border rounded"
            >
              Back to Quran
            </button>
          </div>
        </div>
        <audio ref={audioRef} controls style={{ width: "100%" }} />
        <audio ref={prefetchRef} preload="auto" style={{ display: "none" }} />
        <div className="mt-6 space-y-4">
          {ayahs.map((ayah: Ayah, idx: number) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={ayah.number}
                id={`ayah-${ayah.number}`}
                onClick={() => onManualSelect(idx)}
                className={`p-4 rounded-md cursor-pointer transition-shadow ${
                  isCurrent ? "bg-green-50 ring-2 ring-green-300" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-right flex-1">
                    <p className="text-2xl leading-relaxed font-arabic">{ayah.text}</p>
                  </div>
                  <div className="ml-4 text-sm text-gray-500">#{ayah.number}</div>
                </div>
                {ayah.translation && (
                  <div className="mt-2 text-gray-700 text-sm">{ayah.translation}</div>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayFrom(idx);
                    }}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    ▶ Play this ayah
                  </button>
                  {!ayah.audio && (
                    <span className="text-xs text-red-500 ml-2">Audio not available</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
