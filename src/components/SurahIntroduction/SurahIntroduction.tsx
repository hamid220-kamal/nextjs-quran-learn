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
          <div className="meta-info">
            <div className="meta-item">
              <span className="meta-label">Number of verses:</span>
              <span className="meta-value">{surahData.numberOfAyahs}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Revelation type:</span>
              <span className="meta-value">{surahData.revelationType}</span>
            </div>
          </div>

          <div className="intro-sections">
            <div className="intro-section">
              <h3>Overview</h3>
              <p>{surahData.overview}</p>
            </div>

            <div className="intro-section">
              <h3>{surahData.historicalContext.title}</h3>
              {surahData.historicalContext.content.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>

            <div className="intro-section">
              <h3>{surahData.significance.title}</h3>
              {surahData.significance.content.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>
          </div>

          <div className="virtues-section">
            <h3>Virtues of this Surah:</h3>
            <ul>
              {surahData.virtues.map((virtue, index) => (
                <li key={index}>{virtue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}