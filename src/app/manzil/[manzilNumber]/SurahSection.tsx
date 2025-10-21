'use client';

import './enhanced-surah-section.css';
import './enhanced-verse-style.css';

import { useManzilAudio } from '../useManzilAudio';

interface SurahSectionProps {
  surahData: any;
  ayahList: any[];
}

export default function SurahSection({
  surahData,
  ayahList
}: SurahSectionProps) {

  // Destructure surah info and ayahs
  const { surahNumber, surahName, englishName, englishNameTranslation, revelationType, ayahs } = surahData;

  // Use improved audio hook for this surah's ayahs
  const {
    currentIdx,
    isPlaying,
    autoplay,
    setAutoplay,
    playAyah,
    pause,
    audioRef,
    audioUrls,
  } = useManzilAudio({ ayahList });

  // Helper: show loading or error for audio
  function getAudioStatus(idx: number) {
    if (!audioUrls[idx]) return 'Loading...';
    return null;
  }

  // Only render on client (audio logic is client-only)
  // (Next.js 15: 'use client' at top is sufficient)

  return (
    <div key={`surah-${surahNumber}`} className="surah-section">
      <div className="surah-header light-header">
        <h2>
          <span className="surah-number">{surahNumber}</span>
          {englishName}
        </h2>
        <div className="surah-info">
          <span>{englishNameTranslation}</span>
          <span>{revelationType}</span>
          <span>{ayahs.length} verses</span>
        </div>
        {/* Hidden audio element for playback */}
        <audio ref={audioRef} style={{ display: 'none' }} />
  {/* End verses-container */}
      <div className="verses-container">
        {ayahs.map((ayah, idx) => {
          const isCurrent = currentIdx === idx;
          const isVersePlaying = isCurrent && isPlaying;
          const audioStatus = getAudioStatus(idx);
          return (
            <article
              key={`verse-${ayah.numberInSurah}`}
              className={`verse-item${isCurrent ? ' active-verse' : ''}`}
              aria-current={isCurrent ? 'true' : undefined}
              tabIndex={0}
            >
              <div className="verse-left-column">
                <div className="verse-number-container">
                  <span className="verse-number">{ayah.numberInSurah}</span>
                  <div className="verse-audio-control">
                    <button
                      className={`verse-audio-btn${isVersePlaying ? ' playing' : ''}`}
                      onClick={() =>
                        isVersePlaying ? pause() : playAyah(idx)
                      }
                      aria-label={isVersePlaying ? 'Pause audio' : 'Play audio'}
                      aria-pressed={isVersePlaying}
                      disabled={!audioUrls[idx]}
                    >
                      {audioStatus ? audioStatus : isVersePlaying ? '⏸' : '▶'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="verse-content">
                <div className="verse-text arabic">{ayah.text}</div>
                {ayah.translations && ayah.translations.length > 0 && (
                  <div className="verse-translation">{ayah.translations[0].text}</div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}