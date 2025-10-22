'use client';

import React, { useState, useEffect } from 'react';
import QuranPlayer from '@/components/QuranPlayer';
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
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);

  // Fetch Surahs
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
    updatePlaylist(surah);
  };

  const updatePlaylist = (surah: Surah) => {
    // Using a default reciter - Mishary Rashid Alafasy
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.number}.mp3`;
    setPlaylist([
      {
        url: audioUrl,
        title: `${surah.englishName} (${surah.name})`,
        surah: surah.number,
        ayah: 1,
        duration: null, // Duration will be set when audio loads
      }
    ]);
  };

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
              <div className="surah-section">
                <h3 className="surah-section-title">Quran Surahs 1 - 19</h3>
                <div className="slider-container">
                  <button 
                    className="slider-button prev"
                    onClick={() => {
                      const slider = document.getElementById('slider-1');
                      if (slider) slider.scrollLeft -= 300;
                    }}
                    aria-label="Previous Surahs"
                  >
                    ❮
                  </button>
                  <div className="surahs-slider" id="slider-1">
                    {surahs.slice(0, 19).map(surah => (
                      <div
                        key={surah.number}
                        className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                        onClick={() => handleSurahSelect(surah)}
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/surah-backgrounds/${surah.number}.jpg)`
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
                      const slider = document.getElementById('slider-1');
                      if (slider) slider.scrollLeft += 300;
                    }}
                    aria-label="Next Surahs"
                  >
                    ❯
                  </button>
                </div>
              </div>

              <div className="surah-section">
                <h3 className="surah-section-title">Quran Surahs 20 - 38</h3>
                <div className="slider-container">
                  <button 
                    className="slider-button prev"
                    onClick={() => {
                      const slider = document.getElementById('slider-2');
                      if (slider) slider.scrollLeft -= 300;
                    }}
                    aria-label="Previous Surahs"
                  >
                    ❮
                  </button>
                  <div className="surahs-slider" id="slider-2">
                    {surahs.slice(19, 38).map(surah => (
                      <div
                        key={surah.number}
                        className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                        onClick={() => handleSurahSelect(surah)}
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/surah-backgrounds/${surah.number}.jpg)`
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
                      const slider = document.getElementById('slider-2');
                      if (slider) slider.scrollLeft += 300;
                    }}
                    aria-label="Next Surahs"
                  >
                    ❯
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="player-section">
          {playlist.length > 0 ? (
            <QuranPlayer 
              playlist={playlist}
              className="quran-player-main"
            />
          ) : (
            <div className="no-selection">
              Please select a Surah to play
            </div>
          )}
        </div>
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
              <div className="surah-section">
                <h3 className="surah-section-title">Quran Surahs 1 - 19</h3>
                <div className="slider-container">
                  <button 
                    className="slider-button prev"
                    onClick={() => {
                      const slider = document.getElementById('slider-1');
                      if (slider) slider.scrollLeft -= 300;
                    }}
                    aria-label="Previous Surahs"
                  >
                    ❮
                  </button>
                  <div className="surahs-slider" id="slider-1">
                    {surahs.slice(0, 19).map(surah => (
                      <div
                        key={surah.number}
                        className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                        onClick={() => handleSurahSelect(surah)}
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/surah-backgrounds/${surah.number}.jpg)`
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
                      const slider = document.getElementById('slider-1');
                      if (slider) slider.scrollLeft += 300;
                    }}
                    aria-label="Next Surahs"
                  >
                    ❯
                  </button>
                </div>
              </div>

              <div className="surah-section">
                <h3 className="surah-section-title">Quran Surahs 20 - 38</h3>
                <div className="slider-container">
                  <button 
                    className="slider-button prev"
                    onClick={() => {
                      const slider = document.getElementById('slider-2');
                      if (slider) slider.scrollLeft -= 300;
                    }}
                    aria-label="Previous Surahs"
                  >
                    ❮
                  </button>
                  <div className="surahs-slider" id="slider-2">
                    {surahs.slice(19, 38).map(surah => (
                      <div
                        key={surah.number}
                        className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                        onClick={() => handleSurahSelect(surah)}
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/surah-backgrounds/${surah.number}.jpg)`
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
                      const slider = document.getElementById('slider-2');
                      if (slider) slider.scrollLeft += 300;
                    }}
                    aria-label="Next Surahs"
                  >
                    ❯
                  </button>
                </div>
              </div>
                  <div
                    key={surah.number}
                    className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
                    onClick={() => handleSurahSelect(surah)}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/surah-backgrounds/${surah.number}.jpg)`
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
            </>
          )}
        </div>

        <div className="player-section">
          {playlist.length > 0 ? (
            <QuranPlayer 
              playlist={playlist}
              className="quran-player-main"
            />
          ) : (
            <div className="no-selection">
              Please select a Surah to play
            </div>
          )}
        </div>
      </div>
    </div>
  );
}