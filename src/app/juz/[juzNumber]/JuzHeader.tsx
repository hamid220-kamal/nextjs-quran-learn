'use client';

import Link from 'next/link';
import './juz-header.css';

interface JuzHeaderProps {
  juzNumber: number;
  totalVerses: number;
  startAutoPlay: () => void;
  isPlaying: boolean;
  stopPlaying: () => void;
  totalPages?: number;
}

export default function JuzHeader({
  juzNumber,
  totalVerses,
  startAutoPlay,
  isPlaying,
  stopPlaying,
  totalPages = 0
}: JuzHeaderProps) {
  // Format the juz number in Arabic numeral text
  const formatJuzArabic = (num: number) => {
    // Simple Arabic numeral formatter - for proper formatting consider using a library
    return `الجزء ${num}`;
  };

  return (
    <div className="juz-header">
      <div className="juz-title-arabic">
        {formatJuzArabic(juzNumber)}
      </div>
      
      <h1 className="juz-title-english">
        Juz {juzNumber}
      </h1>
      
      <p className="juz-subtitle">
        Section {juzNumber} of the Holy Quran
      </p>
      
      <div className="juz-meta">
        <div className="juz-meta-item">
          <span className="juz-meta-label">Total Verses:</span>
          <span className="juz-meta-value">{totalVerses}</span>
        </div>
        
        <div className="juz-meta-item">
          <span className="juz-meta-label">Section:</span>
          <span className="juz-meta-value">{juzNumber}/30</span>
        </div>
        
        {totalPages > 0 && (
          <div className="juz-meta-item">
            <span className="juz-meta-label">Total Pages:</span>
            <span className="juz-meta-value">{totalPages}</span>
          </div>
        )}
      </div>
      
      <div className="juz-actions">
        {isPlaying ? (
          <button 
            className="action-button action-button-primary"
            onClick={stopPlaying}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
            Stop Playing
          </button>
        ) : (
          <button 
            className="action-button action-button-primary"
            onClick={startAutoPlay}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
            Auto-Play Juz
          </button>
        )}
        
        <Link href="/quran" className="action-button action-button-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47h12.94a.75.75 0 110 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
          Back to Quran
        </Link>
      </div>
    </div>
  );
}