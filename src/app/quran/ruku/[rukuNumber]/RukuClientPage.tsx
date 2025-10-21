"use client";
import { useEffect, useState, useRef } from "react";
import { fetchRukuWithArabicAndEnglish } from '@/utils/fetchRukuEnglishWithAudio';
import { resolveAudioForVerses } from '@/utils/resolveAudioForVerses';
import RukuHeader from '@/app/components/quran/ruku/RukuHeader';
import RukuLayout from '@/app/components/quran/ruku/RukuLayout';
import RukuNavigation from '@/app/components/quran/ruku/RukuNavigation';
import RukuAudioClient from './RukuAudioClient';

export default function RukuClientPage({ rukuNumber }: { rukuNumber: number }) {
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioClientRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const merged = await fetchRukuWithArabicAndEnglish(rukuNumber, { cache: true });
        const withAudio = await resolveAudioForVerses(merged.map(v => ({
          id: v.id,
          surah: v.surah,
          ayah: v.ayah,
          arabicText: v.arabicText,
          englishText: v.englishText,
        })), {
          audioEdition: 'ar.alafasy',
          concurrencyLimit: 6,
          retries: 2,
          cache: true,
          debug: true,
          onProgress: (idx, total, status) => {
            // Optionally show progress
          }
        });
        if (!cancelled) {
          setVerses(withAudio);
          setLoading(false);
        }
      } catch (err) {
        console.error('[RukuClientPage] fetch error:', err);
        if (!cancelled) {
          setError("Failed to fetch ruku with audio");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rukuNumber]);

  // Auto-play handlers
  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    if (audioClientRef.current) {
      audioClientRef.current.startAutoPlay();
    }
  };
  const handleStopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (audioClientRef.current) {
      audioClientRef.current.stopAutoPlay();
    }
  };

  if (loading) {
    return (<div className="text-center py-8">Loading verses...</div>);
  }
  if (error) {
    return (<div className="text-center py-8 text-red-600">{error}</div>);
  }

  return (
    <>
      <div className="w-full flex justify-center pb-40"> {/* Add bottom padding so content is not hidden behind sticky nav */}
        <div className="max-w-xl w-full">
          <RukuHeader
            rukuNumber={rukuNumber}
            totalVerses={verses.length}
            sectionText="Section of the Holy Quran"
            isAutoPlaying={isAutoPlaying}
            onAutoPlay={handleAutoPlay}
            onStopAutoPlay={handleStopAutoPlay}
          />
          {/* Functional Nav Bar below Header */}
          <RukuNavigation currentRuku={rukuNumber} totalRukus={556} />
          <RukuLayout
            rukuNumber={rukuNumber}
            edition={verses[0]?.surah ? `Surah ${verses[0].surah}` : ''}
            description={`Read Ruku ${rukuNumber} of the Quran in Arabic and English.`}
          >
            {/* Quran verse content remains untouched here */}
            <RukuAudioClient
              ref={audioClientRef}
              ayahs={verses}
              isAutoPlaying={isAutoPlaying}
              setIsAutoPlaying={setIsAutoPlaying}
            />
          </RukuLayout>
        </div>
      </div>
      {/* Functional Nav Bar at Bottom */}
      <div className="w-full flex justify-center mt-8">
        <div className="max-w-4xl w-full">
          <RukuNavigation currentRuku={rukuNumber} totalRukus={556} />
        </div>
      </div>
    </>
  );
}