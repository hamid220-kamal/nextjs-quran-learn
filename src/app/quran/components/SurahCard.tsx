'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Surah } from '../../../../types/quran';

interface SurahCardProps {
  surah: Surah;
  onRead: (surahNumber: number) => void;
  onPlay: (surahNumber: number) => void;
}

export default function SurahCard({ surah, onRead, onPlay }: SurahCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={`/surah/${surah.number}`} passHref>
      <div 
        className={`surah-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-surah-number={surah.number}
        role="button"
        aria-label={`Read Surah ${surah.englishName}`}
      >
        <div className="surah-card-content">
          <div className="surah-number">{surah.number}</div>
          <div className="surah-name-ar" dir="rtl">{surah.name}</div>
          <div className="surah-name-en">{surah.englishName}</div>
          <div className="surah-name-translation">{surah.englishNameTranslation}</div>
          
          <div className="surah-meta">
            <div className="surah-count">{surah.numberOfAyahs} verses</div>
            <div className="surah-revelation">{surah.revelationType}</div>
          </div>
        </div>
        
        <div className="surah-actions">
          <button 
            className="btn play-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlay(surah.number);
            }}
            aria-label={`Listen to Surah ${surah.englishName}`}
          >
            Play Audio
          </button>
        </div>
      </div>
    </Link>
  );
}