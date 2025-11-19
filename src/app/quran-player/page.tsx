'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SurahView from '@/components/SurahView/SurahView';
import Navbar from '@/components/Navbar/Navbar';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [mainContentHeight, setMainContentHeight] = useState<number>(0);

  // Filter surahs based on search query
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase().trim();
    return surahs.filter((surah) => 
      surah.name.toLowerCase().includes(query) ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString() === query
    );
  }, [surahs, searchQuery]);

  // Group filtered surahs into sections
  const groupedSurahs = useMemo(() => {
    const groups = [];
    for (let i = 0; i < filteredSurahs.length; i += 19) {
      groups.push({
        start: i,
        end: Math.min(i + 19, filteredSurahs.length),
        surahs: filteredSurahs.slice(i, i + 19)
      });
    }
    return groups;
  }, [filteredSurahs]);

  useEffect(() => {
    // Calculate and set content height
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      const navbarHeight = 80; // Height of navbar
      setMainContentHeight(windowHeight - navbarHeight);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

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
    const imageNumber = ((surahNumber - 1) % 14) + 1;
    return `/images/surah-backgrounds/${imageNumber}.jpg`;
  };

  const renderSurahSection = (groupIndex: number, surahs: Surah[], sliderId: string) => (
    <div className="surah-section" key={groupIndex}>
      <h3 className="surah-section-title">
        Surah {surahs[0].number} - {surahs[surahs.length - 1].number}
      </h3>
      <div className="slider-container">
        <button 
          className="slider-button prev"
          onClick={() => {
            const slider = document.getElementById(sliderId);
            if (slider) slider.scrollLeft -= 300;
          }}
          aria-label="Previous Surahs"
          title="Scroll left"
        >
          &#10094;
        </button>
        <div className="surahs-slider" id={sliderId}>
          {surahs.map((surah) => (
            <div
              key={surah.number}
              className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''}`}
              onClick={() => handleSurahSelect(surah)}
              style={{
                backgroundImage: `url(${getBackgroundImage(surah.number)})`
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
          title="Scroll right"
        >
          &#10095;
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero Header */}
        <div className="page-header">
          <div className="header-background" style={{ 
            backgroundImage: 'url(/images/quran%20player%20home%20background.jpg)'
          }}></div>
          <div className="header-overlay"></div>
          <div className="header-content">
            <h1 className="page-title">Quran Player</h1>
            <p className="page-subtitle">Immerse yourself in the beautiful recitation of the Holy Quran</p>
          </div>
        </div>

        {/* Search and Content Area */}
        <div className="main-content-wrapper">
          {/* Search Bar Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Surah name, English name, or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-button"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="search-info">
                  Found <strong>{filteredSurahs.length}</strong> Surah{filteredSurahs.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="surahs-container">
              {isLoadingSurahs ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading Surahs...</p>
                </div>
              ) : filteredSurahs.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No Surahs Found</h3>
                  <p>Try searching with different keywords or clear your search.</p>
                </div>
              ) : (
                <>
                  {groupedSurahs.map((group, index) => 
                    renderSurahSection(index, group.surahs, `slider-${index}`)
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Surah Detail View Modal */}
        {selectedSurah && (
          <SurahView
            surah={selectedSurah}
            onBack={() => setSelectedSurah(null)}
            backgroundImage={getBackgroundImage(selectedSurah.number)}
          />
        )}
      </main>
    </div>
  );
}