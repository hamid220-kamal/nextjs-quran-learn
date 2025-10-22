'use client';

import { useEffect } from 'react';
import { SurahIntroduction as SurahIntroType } from '../../data/surahIntroductions';
import './SurahIntroduction.css';

interface SurahIntroductionProps {
  surahData: SurahIntroType;
  isOpen: boolean;
  onClose: () => void;
}

export default function SurahIntroduction({ surahData, isOpen, onClose }: SurahIntroductionProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="introduction-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="introduction-modal">
        <div className="intro-header">
          <div className="intro-title">
            <h2>INTRODUCTION</h2>
            <h3>{surahData.englishName} ({surahData.name})</h3>
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close introduction"
          >
            ×
          </button>
        </div>
        
        <div className="intro-content">
          <div className="surah-meta">
            <p>Number of verses: {surahData.numberOfAyahs}</p>
            <p>Revelation type: {surahData.revelationType}</p>
          </div>

          {surahData.introduction.map((paragraph, index) => (
            <p key={index} className="intro-paragraph">
              {paragraph}
            </p>
          ))}

          {surahData.virtues && surahData.virtues.length > 0 && (
            <div className="virtues-section">
              <h4>Virtues of this Surah:</h4>
              {surahData.virtues.map((virtue, index) => (
                <p key={`virtue-${index}`}>{virtue}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}