import React from 'react';
import './verse-highlights.css';

export type Verse = {
  number: number;
  surahNumber?: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  audioUrl?: string;
};

type Props = {
  verses: Verse[];
  isAutoPlaying?: boolean;
  currentVerseIndex?: number | null;
  playVerseByIndex?: (index: number) => Promise<void> | void;
  ariaLabelPrefix?: string;
};

export default function VersesList({
  verses,
  isAutoPlaying = false,
  currentVerseIndex = null,
  playVerseByIndex,
  ariaLabelPrefix = 'Verse',
}: Props) {
  return (
    <div className="verses-container">
      {verses.map((verse, idx) => {
        const isActive = currentVerseIndex === idx;
        return (
          <article
            key={`verse-${verse.number}`}
            className={`verse-item${isActive ? ' active-verse' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            tabIndex={0}
          >
            <div className="verse-left-column">
              <div className="verse-number-container">
                <span className="verse-number">{verse.numberInSurah}</span>
                <div className="verse-audio-control">
                  <button
                    className={
                      isAutoPlaying
                        ? isActive
                          ? 'verse-audio-btn playing-button'
                          : 'verse-audio-btn disabled-button'
                        : isActive
                          ? 'verse-audio-btn playing-button'
                          : 'verse-audio-btn'
                    }
                    onClick={() => playVerseByIndex && playVerseByIndex(idx)}
                    disabled={isAutoPlaying && !isActive}
                    aria-label={
                      isActive
                        ? `Pause ${ariaLabelPrefix} ${verse.numberInSurah}`
                        : `Play ${ariaLabelPrefix} ${verse.numberInSurah}`
                    }
                    aria-pressed={isActive}
                  >
                    {isActive ? <span>⏸</span> : <span>▶</span>}
                  </button>
                </div>
              </div>
            </div>
            <div className="verse-content">
              <div className="verse-text arabic">{verse.text}</div>
              {verse.translation && (
                <div className="verse-translation">{verse.translation}</div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
