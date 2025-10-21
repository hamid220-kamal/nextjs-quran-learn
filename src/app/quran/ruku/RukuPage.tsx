import React, { useEffect, useState, useRef } from "react";

type Verse = {
  number: number;
  numberInSurah: number;
  arabicText: string;
  englishText: string;
  audio: string;
};
import Head from "next/head";

const ARABIC_API = "https://api.alquran.cloud/v1/ruku/";
const ENGLISH_API = "https://api.alquran.cloud/v1/ruku/";
const ARABIC_EDITION = "quran-uthmani";
const ENGLISH_EDITION = "en.asad";

interface RukuPageProps {
  params: { rukuNumber: string };
}

export default function RukuPage({ params }: RukuPageProps) {
  const rukuNumber = Number(params.rukuNumber) || 1;
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchRuku() {
      const [arabicRes, englishRes] = await Promise.all([
        fetch(`${ARABIC_API}${rukuNumber}/${ARABIC_EDITION}`).then((r) => r.json()),
        fetch(`${ENGLISH_API}${rukuNumber}/${ENGLISH_EDITION}`).then((r) => r.json()),
      ]);
      const arabicAyahs = arabicRes.data.ayahs;
      const englishAyahs = englishRes.data.ayahs;
      // Merge by global ayah number (not numberInSurah, since ruku can span surahs)
      const merged = arabicAyahs.map((a: any, i: number) => {
        // Try to match by index, fallback to numberInSurah
        let e = englishAyahs[i];
        if (!e || e.numberInSurah !== a.numberInSurah) {
          e = englishAyahs.find((x: any) => x.numberInSurah === a.numberInSurah);
        }
        return {
          number: a.number,
          numberInSurah: a.numberInSurah,
          arabicText: a.text,
          englishText: e ? e.text : "",
          audio: a.audio && a.audio !== '' ? a.audio : `https://verses.quran.com/${a.number}.mp3`,
        };
      });
      setVerses(merged);
    }
    fetchRuku();
  }, [rukuNumber]);

  // Play a single verse
  const playVerse = (idx: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(idx);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new window.Audio(verses[idx].audio);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => {
      setCurrentIndex(null);
    };
  };

  // Auto-play all verses
  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!isAutoPlaying || currentIndex === null || !verses.length) return;
    if (currentIndex >= verses.length) {
      setIsAutoPlaying(false);
      setCurrentIndex(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new window.Audio(verses[currentIndex].audio);
    audioRef.current = audio;
    audio.play();
    const card = document.getElementById(`ayah-${verses[currentIndex].number}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    audio.onended = () => {
      setCurrentIndex(currentIndex !== null ? currentIndex + 1 : null);
    };
    return () => {
      audio.pause();
      audio.onended = null;
    };
  }, [isAutoPlaying, currentIndex, verses]);

  return (
    <>
      <Head>
        <title>{`Ruku ${rukuNumber} | Quran`}</title>
        <meta name="description" content={`Read and listen to Ruku ${rukuNumber} of the Quran with translation and audio.`} />
        {/* Structured data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Ruku ${rukuNumber} | Quran`,
            "description": `Read and listen to Ruku ${rukuNumber} of the Quran with translation and audio.`,
          }),
        }} />
      </Head>
      <div className="flex flex-col items-center w-full py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Ruku {rukuNumber}</h1>
          <div className="flex flex-row justify-center gap-4 mb-8">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg"
              onClick={handleAutoPlay}
              disabled={isAutoPlaying}
            >
              Auto-Play Ruku
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {verses.map((verse, idx) => {
              const isPlaying = idx === currentIndex;
              return (
                <div
                  key={verse.number}
                  id={`ayah-${verse.number}`}
                  className={`verse-card w-full sm:w-1/2 max-w-xl mx-auto mb-6 p-6 border rounded-2xl shadow-md transition-all duration-300 flex flex-col justify-between bg-white ${isPlaying ? "active-verse" : ""}`}
                >
                  <div className="flex flex-row justify-between items-start mb-2">
                    <span className="text-right text-2xl font-arabic flex-1 block w-full" dir="rtl">{verse.arabicText}</span>
                  </div>
                  <div className="flex flex-row justify-between items-end mt-2">
                    <span className="text-left text-gray-700 italic flex-1 block w-full">{verse.englishText}</span>
                  </div>
                  <div className="flex flex-row items-center justify-end mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-lg"
                      onClick={() => playVerse(idx)}
                      disabled={isAutoPlaying}
                    >
                      ▶️ Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .active-verse {
          @apply bg-green-100 border-green-400 shadow-lg scale-105;
        }
        .font-arabic {
          font-family: 'Noto Naskh Arabic', serif;
        }
      `}</style>
    </>
  );
}
