
"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import React, { useState, useEffect, useCallback } from 'react';
import './Hifz.css';

export const metadata = {
  title: "Hifz — Quran Memorization | Learn Quran",
  description: "Real-time Quran memorization page powered by AlQuran Cloud API. Memorize, listen, and track progress."
};

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Verse {
  id: number;
  number: number;
  arabic: string;
  translation: string;
  audio: string;
  hidden: boolean;
  memorized: boolean;
  revealed: boolean;
}

interface MemorizationDay {
  day: number;
  verses: string;
  startVerse: number;
  endVerse: number;
  completed: boolean;
}

interface Progress {
  versesMemorized: number;
  percentComplete: number;
}

export default function HifzPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [memorizationPlan, setMemorizationPlan] = useState<MemorizationDay[] | null>(null);
  const [progress, setProgress] = useState<Progress>({ versesMemorized: 0, percentComplete: 0 });
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const CARDS_PER_PAGE = 20;

  // Live API call: Fetch all surahs from AlQuran Cloud API
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.data) {
          setSurahs(data.data);
          setTotalPages(Math.ceil(data.data.length / CARDS_PER_PAGE));
        }
        setLoadingSurahs(false);
      } catch (error) {
        console.error('Error fetching surahs:', error);
        setLoadingSurahs(false);
      }
    };

    fetchSurahs();
  }, []);

  // Filter surahs based on search query
  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update total pages when search query changes
  useEffect(() => {
    const surahsToShow = searchQuery ? filteredSurahs : surahs;
    const newTotalPages = Math.ceil(surahsToShow.length / CARDS_PER_PAGE);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page exceeds new total pages
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [searchQuery, filteredSurahs, surahs, currentPage]);

  // localStorage: Load user progress and settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('hifzProgress');
      const savedPracticeMode = localStorage.getItem('practiceMode');
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      
      if (savedPracticeMode) {
        setPracticeMode(JSON.parse(savedPracticeMode));
      }
    }
  }, []);

  // localStorage: Save progress and settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hifzProgress', JSON.stringify(progress));
      localStorage.setItem('practiceMode', JSON.stringify(practiceMode));
    }
  }, [progress, practiceMode]);

  // Live API call: Fetch surah verses with Arabic and English translations
  const fetchSurahVerses = async (surahNumber: number) => {
    setLoadingVerses(true);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`
      );
      const data = await response.json();
      
      if (data.data && data.data.length >= 2) {
        const arabicVerses = data.data[0];
        const englishVerses = data.data[1];
        
        // localStorage: Load memorized verses
        let memorizedSet = new Set<string>();
        if (typeof window !== 'undefined') {
          const savedMemorized = localStorage.getItem('memorizedVerses');
          if (savedMemorized) {
            memorizedSet = new Set(JSON.parse(savedMemorized));
          }
        }

        const formattedVerses: Verse[] = arabicVerses.ayahs.map((ayah: any, index: number) => ({
          id: ayah.number,
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: englishVerses.ayahs[index]?.text || '',
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
          hidden: false,
          memorized: memorizedSet.has(`${surahNumber}-${ayah.numberInSurah}`),
          revealed: false
        }));
        
        setVerses(formattedVerses);
        setSelectedSurah(arabicVerses);
        createMemorizationPlan(arabicVerses, formattedVerses);
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
    }
    setLoadingVerses(false);
  };

  // Generate memorization plan based on verse count
  const createMemorizationPlan = (surah: Surah, verses: Verse[]) => {
    if (!surah) return;
    
    const verseCount = surah.numberOfAyahs;
    let plan: MemorizationDay[] = [];
    let versesPerDay = 5;
    
    if (verseCount <= 10) {
      versesPerDay = 2;
    } else if (verseCount <= 50) {
      versesPerDay = 3;
    }
    
    for (let i = 0; i < verseCount; i += versesPerDay) {
      const end = Math.min(i + versesPerDay - 1, verseCount - 1);
      const dayVerses = verses.slice(i, end + 1);
      const allMemorized = dayVerses.every(verse => verse.memorized);
      
      plan.push({
        day: Math.floor(i / versesPerDay) + 1,
        verses: `${i + 1}-${end + 1}`,
        startVerse: i + 1,
        endVerse: end + 1,
        completed: allMemorized
      });
    }
    
    setMemorizationPlan(plan);
    
    // Calculate progress
    const memorizedCount = verses.filter(v => v.memorized).length;
    updateProgress(memorizedCount, verseCount);
  };

  const updateProgress = useCallback((memorizedCount: number, totalVerses: number) => {
    const percentComplete = Math.round((memorizedCount / totalVerses) * 100);
    setProgress({
      versesMemorized: memorizedCount,
      percentComplete: percentComplete
    });
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchSurahVerses(surah.number);
    setCurrentPage(1);
  };

  const handleBackToSurahs = () => {
    setSelectedSurah(null);
    setVerses([]);
    setMemorizationPlan(null);
    setCurrentlyPlaying(null);
    if (currentAudio) {
      currentAudio.pause();
    }
  };

  // localStorage: Save memorized verses and update progress
  const toggleVerseMemorized = (verseNumber: number) => {
    if (!selectedSurah) return;

    const verseKey = `${selectedSurah.number}-${verseNumber}`;
    let memorizedSet = new Set<string>();
    
    if (typeof window !== 'undefined') {
      const savedMemorized = localStorage.getItem('memorizedVerses');
      if (savedMemorized) {
        memorizedSet = new Set(JSON.parse(savedMemorized));
      }
    }

    if (memorizedSet.has(verseKey)) {
      memorizedSet.delete(verseKey);
    } else {
      memorizedSet.add(verseKey);
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('memorizedVerses', JSON.stringify([...memorizedSet]));
    }

    // Update verses array
    setVerses(prevVerses => 
      prevVerses.map(verse => 
        verse.number === verseNumber 
          ? { ...verse, memorized: !verse.memorized }
          : verse
      )
    );

    // Update memorization plan
    if (memorizationPlan) {
      const updatedPlan = memorizationPlan.map(day => {
        if (verseNumber >= day.startVerse && verseNumber <= day.endVerse) {
          const dayVerses = verses.filter(v => 
            v.number >= day.startVerse && v.number <= day.endVerse
          );
          const allMemorized = dayVerses.every(v => 
            v.number === verseNumber ? !v.memorized : v.memorized
          );
          return { ...day, completed: allMemorized };
        }
        return day;
      });
      setMemorizationPlan(updatedPlan);
    }

    // Update progress
    const memorizedCount = Array.from(memorizedSet).filter(key => 
      key.startsWith(`${selectedSurah.number}-`)
    ).length;
    
    updateProgress(memorizedCount, selectedSurah.numberOfAyahs);
  };

  // Audio playback with manual control only (no autoplay)
  const playAudio = async (audioUrl: string, verseNumber: number) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
      }

      setCurrentlyPlaying(verseNumber);
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
      });

      await audio.play();
    } catch (error) {
      console.log('Audio play failed:', error);
      setCurrentlyPlaying(null);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentlyPlaying(null);
    }
  };

  const toggleVerseReveal = (verseNumber: number) => {
    setVerses(prevVerses => 
      prevVerses.map(verse => 
        verse.number === verseNumber 
          ? { ...verse, revealed: !verse.revealed }
          : verse
      )
    );
  };

  // Function to toggle complete verse hiding (Arabic + English)
  const toggleVerseHidden = (verseNumber: number) => {
    setVerses(prevVerses => 
      prevVerses.map(verse => 
        verse.number === verseNumber 
          ? { ...verse, hidden: !verse.hidden }
          : verse
      )
    );
  };

  const markDayAsComplete = (dayIndex: number) => {
    if (!memorizationPlan || !selectedSurah) return;
    
    const updatedPlan = [...memorizationPlan];
    updatedPlan[dayIndex].completed = !updatedPlan[dayIndex].completed;
    setMemorizationPlan(updatedPlan);

    // Mark all verses in this day as memorized
    const day = updatedPlan[dayIndex];
    if (day.completed) {
      let memorizedSet = new Set<string>();
      if (typeof window !== 'undefined') {
        const savedMemorized = localStorage.getItem('memorizedVerses');
        if (savedMemorized) {
          memorizedSet = new Set(JSON.parse(savedMemorized));
        }
      }

      for (let verseNum = day.startVerse; verseNum <= day.endVerse; verseNum++) {
        const verseKey = `${selectedSurah.number}-${verseNum}`;
        memorizedSet.add(verseKey);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('memorizedVerses', JSON.stringify([...memorizedSet]));
      }

      // Update verses
      setVerses(prev => 
        prev.map(verse => 
          verse.number >= day.startVerse && verse.number <= day.endVerse
            ? { ...verse, memorized: true }
            : verse
        )
      );

      // Update progress
      const memorizedCount = Array.from(memorizedSet).filter(key => 
        key.startsWith(`${selectedSurah.number}-`)
      ).length;
      updateProgress(memorizedCount, selectedSurah.numberOfAyahs);
    }
  };

  // Navigation between surahs
  const navigateToSurah = (direction: 'next' | 'previous') => {
    if (!selectedSurah) return;
    
    const currentIndex = surahs.findIndex(s => s.number === selectedSurah.number);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (targetIndex >= 0 && targetIndex < surahs.length) {
      handleSurahSelect(surahs[targetIndex]);
    }
  };

  // Pagination calculations - FIXED
  const getCurrentPageSurahs = () => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const surahsToShow = searchQuery ? filteredSurahs : surahs;
    return surahsToShow.slice(startIndex, startIndex + CARDS_PER_PAGE);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate today's progress across all surahs
  const getOverallProgress = () => {
    if (typeof window !== 'undefined') {
      const savedMemorized = localStorage.getItem('memorizedVerses');
      if (savedMemorized) {
        const memorizedSet = new Set(JSON.parse(savedMemorized));
        return memorizedSet.size;
      }
    }
    return 0;
  };

  const overallProgress = getOverallProgress();

  // Pagination component - FIXED
  const PaginationControls = () => {
    const surahsToShow = searchQuery ? filteredSurahs : surahs;
    const displaySurahs = getCurrentPageSurahs();
    
    return (
      <nav className="pagination" aria-label="Surah navigation">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1 || surahsToShow.length === 0}
          className="pagination-btn"
          aria-label="Previous page"
        >
          Previous
        </button>
        
        <span className="pagination-info">
          Page {currentPage} of {totalPages} 
          {searchQuery && ` (${surahsToShow.length} results)`}
        </span>
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages || surahsToShow.length === 0}
          className="pagination-btn"
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    );
  };

  return (
    <>
      <Navbar />
      <main className="islamic-app">
        <header className="app-header">
        <div className="container">
          <div className="header-content">        
            <div className="hifz-intro">
              <h2 className="hifz-heading-arabic">حِفظُ القُرآن – <span className="hifz-heading-en">The Journey of Qur’an Memorization</span></h2>
              <div className="hifz-intro-text">
                <div className="hifz-intro-arabic">قرآنِ پاک کو یاد کرنے کا سفر، دلوں کو منور کرنے والا۔</div>
                <div className="hifz-intro-en">Begin your sacred journey — learn, review, and remember each verse with devotion.</div>
              </div>
            </div>
            {!selectedSurah && (
              <div className="daily-progress">
              </div>
            )}
          </div>
          {selectedSurah && (
            <button 
              className="back-btn" 
              onClick={handleBackToSurahs}
              aria-label="Back to surah selection"
            >
              ← Back to Surahs
            </button>
          )}
        </div>
      </header>

      {!selectedSurah ? (
        <section className="surah-selection">
          <div className="container">
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search surahs by name or translation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search surahs"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="search-results-info">
                Found {filteredSurahs.length} surah(s) matching "{searchQuery}"
              </div>
            )}

            <PaginationControls />
            
            {loadingSurahs ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                Loading surahs...
              </div>
            ) : (
              <>
                <div className="card-list">
                  {getCurrentPageSurahs().map((surah) => (
                    <article 
                      key={surah.number} 
                      className="surah-card"
                      onClick={() => handleSurahSelect(surah)}
                      aria-label={`Select ${surah.englishName} surah`}
                    >
                      <div className="card-left">
                        <div className="number-circle">{surah.number}</div>
                        <div className="surah-info">
                          <h3 className="surah-english-name">{surah.englishName}</h3>
                          <p className="surah-translation">{surah.englishNameTranslation}</p>
                          <span className="surah-meta">{surah.numberOfAyahs} verses • {surah.revelationType}</span>
                        </div>
                      </div>
                      <div className="card-right">
                        <div className="arabic-name">{surah.name}</div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* No Results Message */}
                {searchQuery && filteredSurahs.length === 0 && (
                  <div className="no-results">
                    <p>No surahs found matching "{searchQuery}"</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="clear-search-btn"
                    >
                      Clear Search
                    </button>
                  </div>
                )}

                {/* Show message when no surahs at all */}
                {!searchQuery && surahs.length === 0 && !loadingSurahs && (
                  <div className="no-results">
                    <p>No surahs available</p>
                  </div>
                )}

                <PaginationControls />
              </>
            )}
          </div>
        </section>
      ) : (
        // ... rest of the code remains the same for surah detail view
        <>
          {/* Current Surah Header */}
          <section className="surah-detail-header">
            <div className="container">
              <div className="surah-info-centered">
                <h2>{selectedSurah.englishName} ({selectedSurah.name})</h2>
                <p className="surah-description">{selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} verses</p>
                
                <div className="practice-mode-container">
                  <div className={`practice-mode-indicator ${practiceMode ? 'active' : ''}`}>
                    Practice Mode: {practiceMode ? 'ON' : 'OFF'}
                  </div>
                  <button 
                    className={`practice-toggle-btn ${practiceMode ? 'active' : ''}`}
                    onClick={() => setPracticeMode(!practiceMode)}
                    aria-label={practiceMode ? 'Turn off practice mode' : 'Turn on practice mode'}
                  >
                    {practiceMode ? 'Disable Practice Mode' : 'Enable Practice Mode'}
                  </button>
                </div>
              </div>
              
              <div className="progress-display-centered">
                <div className="progress-stats-highlight">
                  <span className="progress-text-main">{progress.versesMemorized} of {selectedSurah.numberOfAyahs} verses memorized</span>
                  <span className="progress-percent-highlight">({progress.percentComplete}%)</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress.percentComplete}%` }}
                    aria-label={`${progress.percentComplete}% complete`}
                  >
                    <span className="progress-text">{progress.percentComplete}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="memorization-interface">
            <div className="container">
              <div className="interface-grid">
                {/* Memorization Plan Sidebar */}
                <aside className="plan-sidebar">
                  <div className="sidebar-section">
                    <h3>Memorization Plan</h3>
                    <div className="plan-details">
                      <p><strong>Surah:</strong> {selectedSurah.englishName}</p>
                      <p><strong>Total Verses:</strong> {selectedSurah.numberOfAyahs}</p>
                      <p><strong>Days Needed:</strong> {memorizationPlan?.length || 0}</p>
                    </div>
                  </div>

                  <div className="sidebar-section">
                    <h3>Daily Schedule</h3>
                    <div className="day-cards-container">
                      {memorizationPlan?.map((day, index) => (
                        <div 
                          key={index} 
                          className={`day-plan-card ${day.completed ? 'completed' : ''}`}
                        >
                          <h4>Day {day.day}</h4>
                          <p>Verses {day.verses}</p>
                          <button 
                            className={`complete-day-btn ${day.completed ? 'completed' : ''}`}
                            onClick={() => markDayAsComplete(index)}
                            aria-label={`Mark day ${day.day} ${day.completed ? 'incomplete' : 'complete'}`}
                          >
                            {day.completed ? '✓ Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Verse Practice Area */}
                <section className="verse-practice">
                  <div className="practice-section-header">
                    <h3>Verse Practice</h3>
                    {practiceMode && (
                      <div className="practice-mode-banner">
                        Practice Mode Active - Arabic and translation hidden
                      </div>
                    )}
                  </div>

                  {loadingVerses ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      Loading verses...
                    </div>
                  ) : (
                    <div className="verses-container">
                      {verses.map((verse) => (
                        <article 
                          key={verse.number} 
                          className={`verse-practice-card ${verse.memorized ? 'memorized' : ''} ${currentlyPlaying === verse.number ? 'playing' : ''}`}
                        >
                          <div className="verse-header">
                            <span className="verse-number">Verse {verse.number}</span>
                            {verse.memorized && (
                              <span className="memorized-badge">✓ Memorized</span>
                            )}
                          </div>

                          {/* Show content based on practice mode, reveal state, and hidden state */}
                          {!verse.hidden && (!practiceMode || verse.revealed) && (
                            <>
                              <div className="verse-arabic-text">
                                {verse.arabic}
                              </div>
                              <div className="verse-translation-text">
                                {verse.translation}
                              </div>
                            </>
                          )}

                          {verse.hidden && (
                            <div className="verse-hidden-message">
                              <p>Verse content is hidden</p>
                            </div>
                          )}

                          <div className="verse-actions">
                            <button 
                              className={`audio-play-btn ${currentlyPlaying === verse.number ? 'playing' : ''}`}
                              onClick={() => currentlyPlaying === verse.number ? stopAudio() : playAudio(verse.audio, verse.number)}
                              aria-label={`Play verse ${verse.number} audio`}
                            >
                              {currentlyPlaying === verse.number ? '⏹️ Stop' : '▶️ Play'}
                            </button>
                            
                            <button 
                              className="hide-verse-btn"
                              onClick={() => toggleVerseHidden(verse.number)}
                              aria-label={verse.hidden ? 'Show verse' : 'Hide verse'}
                            >
                              {verse.hidden ? 'Show Verse' : 'Hide Verse'}
                            </button>
                            
                            {practiceMode && (
                              <button 
                                className="reveal-content-btn"
                                onClick={() => toggleVerseReveal(verse.number)}
                                aria-label={verse.revealed ? 'Hide verse' : 'Reveal verse'}
                              >
                                {verse.revealed ? 'Hide Content' : 'Reveal Content'}
                              </button>
                            )}
                            
                            <button 
                              className={`memorize-toggle-btn ${verse.memorized ? 'memorized' : ''}`}
                              onClick={() => toggleVerseMemorized(verse.number)}
                              aria-label={verse.memorized ? 'Mark verse not memorized' : 'Mark verse memorized'}
                            >
                              {verse.memorized ? '✓ Memorized' : 'Mark Memorized'}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* Next/Previous Surah Navigation */}
                  <nav className="surah-navigation">
                    <button 
                      onClick={() => navigateToSurah('previous')}
                      disabled={selectedSurah.number === 1}
                      className="surah-nav-btn previous"
                      aria-label="Go to previous surah"
                    >
                      ← Previous Surah
                    </button>
                    <button 
                      onClick={() => navigateToSurah('next')}
                      disabled={selectedSurah.number === 114}
                      className="surah-nav-btn next"
                      aria-label="Go to next surah"
                    >
                      Next Surah →
                    </button>
                  </nav>
                </section>
              </div>
            </div>
          </div>
        </>
      )}
        </main>
      <Footer />
    </>
  );
}