'use client';

import React, { useState, useEffect } from 'react';
import SurahView from '@/components/SurahView/SurahView';
import './styles.css';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function QuranPlayerPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(response => response.json())
      .then(data => {
        setSurahs(data.data);
        setIsLoadingSurahs(false);
      })
      .catch(error => {
        console.error('Error fetching surahs:', error);
        setIsLoadingSurahs(false);
      });
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
  };

  const getBackgroundImage = (surahNumber: number) => {
    // Using a set of 14 images that repeat for all Surahs
    const imageNumber = ((surahNumber - 1) % 14) + 1; // This will cycle from 1 to 14
    return `/images/surah-backgrounds/${imageNumber}.jpg`;
  };

  const renderSurahSection = (start: number, end: number, sliderId: string) => (
    <div className="surah-section">
      <h3 className="surah-section-title">Quran Surahs {start + 1} - {end}</h3>
      <div className="slider-container">
        <button 
          className="slider-button prev"
          onClick={() => {
            const slider = document.getElementById(sliderId);
            if (slider) slider.scrollLeft -= 300;
          }}
          aria-label="Previous Surahs"
        >
          ❮
        </button>
        <div className="surahs-slider" id={sliderId}>
          {surahs.slice(start, end).map((surah) => (
            <div
              key={surah.number}
              className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
              onClick={() => handleSurahSelect(surah)}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getBackgroundImage(surah.number)})`
              }}
            >
              <div className="surah-card-content">
                <div className="surah-number-badge">{surah.number}</div>
                <h3 className="surah-name-arabic">{surah.name}</h3>
                <h4 className="surah-name-english">{surah.englishName}</h4>
                <p className="surah-translation">{surah.englishNameTranslation}</p>
                <span className="surah-ayahs">{surah.numberOfAyahs} Verses</span>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="slider-button next"
          onClick={() => {
            const slider = document.getElementById(sliderId);
            if (slider) slider.scrollLeft += 300;
          }}
          aria-label="Next Surahs"
        >
          ❯
        </button>
      </div>
    </div>
  );

  return (
    <div className="quran-player-page">
      <div className="page-header">
        <h1 className="page-title">Quran Player</h1>
        <p className="page-subtitle">Listen to the Holy Quran with Mishary Rashid Alafasy</p>
      </div>

      <div className="main-content">
        <div className="surahs-container">
          {isLoadingSurahs ? (
            <div className="loading">Loading surahs...</div>
          ) : (
            <>
              {renderSurahSection(0, 19, 'slider-1')}
              {renderSurahSection(19, 38, 'slider-2')}
              {renderSurahSection(38, 57, 'slider-3')}
              {renderSurahSection(57, 76, 'slider-4')}
              {renderSurahSection(76, 95, 'slider-5')}
              {renderSurahSection(95, 114, 'slider-6')}
            </>
          )}
        </div>
      </div>

      {selectedSurah && (
        <SurahView
          surah={selectedSurah}
          onBack={() => setSelectedSurah(null)}
          backgroundImage={getBackgroundImage(selectedSurah.number)}
        />
      )}
    </div>
  );
}