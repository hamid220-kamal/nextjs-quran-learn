"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Verse } from '@/types/QuranTypes';
import VersePlayer from './VersePlayer/VersePlayer';
import QuranPlayer, { PlaylistItem } from './QuranPlayer';
import '../app/quran-player/quran-player.css';
import '../app/quran-player/surah-cards.css';
import '../app/quran-player/utils.css';
import './QuranPlayer/responsive.css';

const SURAH_AUDIO_API = (surahNum: number, edition: string) =>
  `https://api.alquran.cloud/v1/surah/${surahNum}/${edition}`;

const getSurahColor = (number: number): string => {
  // Colors from the screenshot
  const colors = [
    '#85144b', // Burgundy
    '#4A1958', // Purple
    '#800000', // Maroon
    '#004D40', // Dark Teal
    '#0D47A1', // Royal Blue
    '#1B5E20', // Forest Green
    '#880E4F', // Deep Pink
    '#311B92', // Deep Purple
    '#B71C1C', // Dark Red
    '#006064', // Dark Cyan
  ];
  return colors[number % colors.length];
};

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

interface Reciter {
  identifier: string;
  englishName: string;
  language: string;
  name?: string;
  format?: string;
  type?: string;
  direction?: string;
}

const PaginationButton = ({ 
  page, 
  currentPage, 
  onClick 
}: { 
  page: number; 
  currentPage: number; 
  onClick: (page: number) => void;
}) => (
  <button
    className={page === currentPage ? 'active' : ''}
    onClick={() => onClick(page)}
    aria-current={page === currentPage ? 'page' : undefined}
  >
    {page}
  </button>
);

export default function QuranPlayerClient() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reciterSearchQuery, setReciterSearchQuery] = useState('');
  const [isReciterDropdownOpen, setIsReciterDropdownOpen] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 20;
  
  // Filter reciters based on search query
  const filteredReciters = reciters
    .filter(reciter => 
      reciter.englishName.toLowerCase().includes(reciterSearchQuery.toLowerCase()) ||
      reciter.language.toLowerCase().includes(reciterSearchQuery.toLowerCase())
    )
    .sort((a, b) => a.englishName.localeCompare(b.englishName));

  // Close reciter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.reciter-select-container')) {
        setIsReciterDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Group reciters by language
  const groupedReciters = useMemo(() => {
    return filteredReciters.reduce((acc, reciter) => {
      const language = reciter.language;
      if (!acc[language]) {
        acc[language] = [];
      }
      acc[language].push(reciter);
      return acc;
    }, {} as Record<string, Reciter[]>);
  }, [filteredReciters]);

  // Sort languages alphabetically
  const sortedLanguages = useMemo(() => {
    return Object.keys(groupedReciters).sort();
  }, [groupedReciters]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch both verse-by-verse and complete Quran reciters
        const [verseByVerseRes, completeRes, surahsRes] = await Promise.all([
          fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse'),
          fetch('https://api.alquran.cloud/v1/edition?format=audio'),
          fetch('https://api.alquran.cloud/v1/surah')
        ]);

        if (!verseByVerseRes.ok || !completeRes.ok || !surahsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [verseByVerseData, completeData, surahsData] = await Promise.all([
          verseByVerseRes.json(),
          completeRes.json(),
          surahsRes.json()
        ]);

        // Combine and deduplicate reciters
        const allReciters = [...(verseByVerseData.data || []), ...(completeData.data || [])];
        const uniqueReciters = Array.from(
          new Map(allReciters.map(r => [r.identifier, r])).values()
        );

        setReciters(uniqueReciters);
        setSurahs(surahsData.data || []);
      } catch (e) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadSurah = async (surahNum: number) => {
    try {
      setSelectedSurah(surahNum);
      setIsLoading(true);
      setCurrentVerse(1);
      setIsPlaying(false);
      
      // Fetch both audio and text data
      const [audioRes, textRes] = await Promise.all([
        fetch(SURAH_AUDIO_API(surahNum, selectedReciter)),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/en.sahih`)
      ]);

      if (!audioRes.ok || !textRes.ok) throw new Error('Failed to fetch surah data');

      const [audioData, textData] = await Promise.all([
        audioRes.json(),
        textRes.json()
      ]);

      // Combine audio and text data
      const verses = audioData.data?.ayahs?.map((ayah: any, index: number) => {
        const textAyah = textData.data?.ayahs[index];
        return {
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          audio: ayah.audio,
          text: ayah.text,
          translation: textAyah?.text || ''
        };
      });

      setVerses(verses || []);
      setPlaylist(verses?.map((v: Verse) => ({
        url: v.audio,
        title: `Verse ${v.numberInSurah}`,
        surah: surahNum,
        ayah: v.numberInSurah
      })) || []);
      
    } catch (e) {
      setError('Failed to load surah. Please try again.');
      console.error('Error loading surah:', e);
      setVerses([]);
      setPlaylist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (verseNumber: number) => {
    setCurrentVerse(verseNumber);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = verses.find(v => v.numberInSurah === verseNumber)?.audio || '';
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleNext = () => {
    if (currentVerse < verses.length) {
      handlePlay(currentVerse + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVerse > 1) {
      handlePlay(currentVerse - 1);
    }
  };

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        handleNext();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleNext);
      }
    };
  }, [verses.length]);

  const normalizedSearchQuery = debouncedSearchQuery.toLowerCase();

  // First check if the search query matches any reciter
  const matchingReciter = reciters.find(reciter => 
    reciter.englishName.toLowerCase().includes(normalizedSearchQuery) ||
    reciter.language.toLowerCase().includes(normalizedSearchQuery)
  );

  // If a matching reciter is found, automatically select it
  useEffect(() => {
    if (matchingReciter && debouncedSearchQuery !== '') {
      setSelectedReciter(matchingReciter.identifier);
    } else if (debouncedSearchQuery === '') {
      setSelectedReciter('ar.alafasy'); // Reset to default reciter when search is cleared
    }
  }, [matchingReciter, debouncedSearchQuery]);

  const filteredSurahs = surahs.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.englishName.toLowerCase().includes(normalizedSearchQuery) ||
    surah.englishNameTranslation.toLowerCase().includes(normalizedSearchQuery) ||
    surah.number.toString().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredSurahs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSurahs = filteredSurahs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="quran-player-layout">
      <header className="player-header">
        <div className="search-bar" role="search">
          <input
            type="search"
            placeholder={isLoading ? "Loading..." : "Search surah by name or number..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search surahs"
            disabled={isLoading}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="reciter-select-container">
          <input
            type="text"
            className="reciter-search"
            placeholder="Search reciters..."
            value={reciterSearchQuery}
            onChange={(e) => setReciterSearchQuery(e.target.value)}
            onFocus={() => setIsReciterDropdownOpen(true)}
            aria-label="Search reciters"
            disabled={isLoading}
          />
          {isReciterDropdownOpen && (
            <div className="reciter-dropdown" role="listbox">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Loading reciters...</span>
                </div>
              ) : filteredReciters.length > 0 ? (
                sortedLanguages.map(language => (
                  <div key={language} className="reciter-group">
                    <div className="language-header">
                      {language === 'ar' ? 'Arabic' :
                       language === 'en' ? 'English' :
                       language === 'ur' ? 'Urdu' :
                       language === 'fa' ? 'Persian' :
                       language === 'tr' ? 'Turkish' :
                       language.toUpperCase()}
                    </div>
                    {groupedReciters[language].map((reciter) => (
                      <div
                        key={reciter.identifier}
                        className={`reciter-option ${selectedReciter === reciter.identifier ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedReciter(reciter.identifier);
                          setReciterSearchQuery(reciter.englishName);
                          setIsReciterDropdownOpen(false);
                          if (selectedSurah) loadSurah(selectedSurah);
                        }}
                        role="option"
                        aria-selected={selectedReciter === reciter.identifier}
                      >
                        <div className="reciter-info">
                          <span className="reciter-name">{reciter.englishName}</span>
                          {reciter.name && reciter.name !== reciter.englishName && (
                            <span className="reciter-native-name">{reciter.name}</span>
                          )}
                        </div>
                        {selectedReciter === reciter.identifier && (
                          <span className="selected-icon">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <span>No reciters found matching "{reciterSearchQuery}"</span>
                  <button 
                    className="clear-search"
                    onClick={() => setReciterSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {selectedSurah ? (
        <div className="active-player-section">
          <button 
            className="back-button"
            onClick={() => setSelectedSurah(null)}
            aria-label="Back to surah selection"
          >
            ← Back to Surahs
          </button>
          <h2 className="surah-title">
            {surahs.find(s => s.number === selectedSurah)?.englishName}
          </h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading verses...</span>
            </div>
          ) : verses.length > 0 ? (
            <VersePlayer
              verses={verses}
              currentVerse={currentVerse}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="surah-cards-grid">
            {paginatedSurahs.map((surah) => (
            <div 
              key={surah.number}
              className={`surah-card ${selectedSurah === surah.number ? 'selected' : ''}`}
              onClick={() => loadSurah(surah.number)}
              style={{
                background: getSurahColor(surah.number)
              } as React.CSSProperties}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && loadSurah(surah.number)}
              aria-label={`Play Surah ${surah.englishName}`}
            >
              <div className="surah-card__overlay">
                <div className="surah-card__number">{surah.number}</div>
                <div className="surah-card__content">
                  <h3 className="surah-card__name-ar" dir="rtl">{surah.name}</h3>
                  <div className="surah-card__details">
                    <span className="surah-card__name-en">{surah.englishName}</span>
                    <span className="surah-card__verses">{surah.numberOfAyahs} Verses</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          {filteredSurahs.length > ITEMS_PER_PAGE && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                ←
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <PaginationButton
                    key={pageNumber}
                    page={pageNumber}
                    currentPage={currentPage}
                    onClick={handlePageChange}
                  />
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
