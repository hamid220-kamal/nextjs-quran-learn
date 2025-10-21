'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { EDITIONS } from '../../../utils/quranApi';
import { getManzilData, getManzilWithTranslations } from '../../../utils/quranSectionApi';
import { getAyahNumbersForManzil } from '../../../utils/manzilAyahMap';
import './ManzilViewer.css';
import SurahSection from './SurahSection';
import ManzilHeader from './ManzilHeader';
import AudioErrorToast from './AudioErrorToast';
import PaginationControls from './PaginationControls';

interface ManzilViewerProps {
  manzilNumber: number;
}

export default function ManzilViewer({ manzilNumber }: ManzilViewerProps) {
  // Individual verse playback state
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  // Cleanup: stop any playing verse on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);
  // Play or pause a single verse manually
  const playVerse = (ayahIndex: number) => {
    const selectedAyah = ayahs[ayahIndex];
    if (!selectedAyah || !selectedAyah.audio) return;

    // If the same verse is already playing → pause it
    if (currentPlayingVerse === ayahIndex) {
      audioRef.current?.pause();
      setCurrentPlayingVerse(null);
      return;
    }

    // Stop any currently playing verse
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // If autoplay is active, stop it
    if (autoplay) setAutoplay(false);

    // Create or update the audio element
    audioRef.current = new Audio(selectedAyah.audio);
    audioRef.current.play();

    setCurrentPlayingVerse(ayahIndex);

    // When it finishes, reset state
    audioRef.current.onended = () => {
      setCurrentPlayingVerse(null);
    };
  };
  // --- All state and variable declarations at the top ---
  // This ordering prevents ReferenceError: no variable is referenced before initialization
  const [manzil, setManzil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Audio system state
  type Ayah = { number: number; text: string; audio: string | null; translation?: string };
  const [ayahs, setAyahs] = useState<Ayah[]>([]); // Current page's ayahs with audio
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Index in ayahs
  const [autoplay, setAutoplay] = useState(false); // Single source of truth for autoplay
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [totalAyahs, setTotalAyahs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [loadingVerse, setLoadingVerse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  // ...existing code...

  // --- Defensive guards and correct ordering in effects ---
  // Fetch all ayah audio for the current manzil
  // Fetch ayah audio URLs for the current page (client-side only)
  useEffect(() => {
    if (!manzil || !manzil.ayahs || isNaN(manzilNumber)) return;
    setIsFetchingAudio(true);
    const edition = 'ar.alafasy';
    // Get ayah numbers for current page
    const pageAyahNumbers = manzil.ayahs.map((ayah: any) => ayah.number);
    // Fetch audio for each ayah in parallel (limit concurrency if needed)
    Promise.all(pageAyahNumbers.map(async (ayahNum, idx) => {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/${edition}`);
        const data = await res.json();
        return {
          number: ayahNum,
          text: manzil.ayahs[idx].text,
          translation: manzil.ayahs[idx].translations?.[0]?.text ?? '',
          audio: data?.data?.audio || null
        };
      } catch {
        return {
          number: ayahNum,
          text: manzil.ayahs[idx].text,
          translation: manzil.ayahs[idx].translations?.[0]?.text ?? '',
          audio: null
        };
      }
    })).then((ayahObjs: Ayah[]) => {
      setAyahs(ayahObjs);
      setIsFetchingAudio(false);
    });
  }, [manzil, manzilNumber, offset, limit]);
  // Playback effect: play ayah audio when currentIndex changes
  useEffect(() => {
    if (currentIndex === null || !ayahs[currentIndex]) return;
    const ay = ayahs[currentIndex];
    if (!ay.audio) {
      // Skip missing audio
      setCurrentIndex(idx => (idx !== null && idx + 1 < ayahs.length ? idx + 1 : null));
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new window.Audio();
    }
    audioRef.current.src = ay.audio;
    audioRef.current.load();
    // Play if autoplay or manual play
    if (autoplay && userInteractedRef.current) {
      audioRef.current.play().catch(() => {
        // Show UI hint if needed
      });
    }
    // Handlers
    audioRef.current.onended = () => {
      if (currentIndex !== null && currentIndex + 1 < ayahs.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handlePageEnd();
      }
    };
    audioRef.current.onerror = () => {
      setErrorMessage('Audio not available for this verse.');
      setCurrentIndex(idx => (idx !== null && idx + 1 < ayahs.length ? idx + 1 : null));
    };
    // Highlight currently playing verse (UI logic can use currentIndex)
  }, [currentIndex, ayahs, autoplay]);

  // Handle page end: advance to next page or stop autoplay
  async function handlePageEnd() {
    if (currentPage < totalPages) {
      handleNextPage();
      // Wait for ayahs to load
      setTimeout(() => {
        if (autoplay && userInteractedRef.current) setCurrentIndex(0);
      }, 800); // Wait for new ayahs
    } else {
      setAutoplay(false);
      setCurrentIndex(null);
      userInteractedRef.current = false;
    }
  }
  // ...existing code...
  // (Removed obsolete autoPlayQueue/currentAutoPlayIndex logic)

  // Handle advancing to next verse when current verse ends
  // ...existing code...
  
  // Function to stop verse audio
  const stopVerse = () => {
    console.log('[Manzil] Stopping audio playback');
    setPlayingVerse(null);
    setLoadingVerse(null);
  };
  
  // (Removed obsolete playAllVersesInSurah and stopAutoPlay logic)
  
  // Function to get total ayahs in a manzil
  const fetchManzilTotalAyahs = async (manzilNum: number) => {
    try {
      // Fetch manzil metadata without limit to get total count
      const manzilMeta = await getManzilData(manzilNum);
      return manzilMeta.ayahs.length;
    } catch (err) {
      console.error('Error fetching manzil metadata:', err);
      return 0;
    }
  };

  // Fetch Manzil data with pagination and translations
  const fetchManzilData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get total ayahs in this manzil (only on first load)
      if (totalAyahs === 0) {
        const total = await fetchManzilTotalAyahs(manzilNumber);
        setTotalAyahs(total);
        // Calculate total pages based on the total number of ayahs
        const pages = Math.ceil(total / limit);
        setTotalPages(pages);
      }
      
      // Fetch the manzil with translations
      const manzilData = await getManzilWithTranslations(
        manzilNumber,
        [EDITIONS.ARABIC, EDITIONS.ENGLISH],
        { offset, limit }
      );
      
      // Debug the data structure to ensure we have what we need
      console.log('Manzil data structure:', { 
        ayahsCount: manzilData.ayahs?.length || 0,
        hasTranslations: manzilData.ayahs?.[0]?.translations?.length > 0 || false,
        sampleAyah: manzilData.ayahs?.[0] 
      });
      
      setManzil(manzilData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching manzil data:", err);
      setError(`Failed to load Manzil ${manzilNumber}. Please try again.`);
      setLoading(false);
    }
  };
  
  // Fetch data on component mount or when parameters change
  useEffect(() => {
    fetchManzilData();
    
    // Check if we need to start auto-play after navigation
    const shouldStartAutoPlay = window.sessionStorage.getItem('startManzilAutoPlayAfterNav') === 'true';
    if (shouldStartAutoPlay && currentPage === 1) {
      window.sessionStorage.removeItem('startManzilAutoPlayAfterNav');
      // Wait for data to load before starting auto-play
      setTimeout(() => {
  // (Removed obsolete startManzilAutoPlay call)
      }, 1000);
    }
  }, [manzilNumber, offset, limit]);
  
  // Group ayahs by surah for display
  const ayahsBySurah = useMemo(() => {
    if (!manzil || !manzil.ayahs) return {};
    
    const grouped = {};
    manzil.ayahs.forEach(ayah => {
      const surahNum = ayah.surah.number;
      if (!grouped[surahNum]) {
        grouped[surahNum] = {
          surahNumber: surahNum,
          surahName: ayah.surah.name,
          englishName: ayah.surah.englishName,
          englishNameTranslation: ayah.surah.englishNameTranslation,
          revelationType: ayah.surah.revelationType,
          ayahs: []
        };
      }
      grouped[surahNum].ayahs.push(ayah);
    });
    
    return grouped;
  }, [manzil]);
  
  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const newOffset = (newPage - 1) * limit;
    setOffset(newOffset);
    
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNextPage = () => {
    if (currentPage >= totalPages) return;
    
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    const newOffset = (newPage - 1) * limit;
    setOffset(newOffset);
    
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Render error state
  if (error) {
    return (
      <div className="manzil-viewer error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="retry-button" onClick={fetchManzilData}>
          Try Again
        </button>
      </div>
    );
  }
  
  // Header button handler: single autoplay toggle
  function handleAutoplayToggle() {
    userInteractedRef.current = true;
    setAutoplay(prev => {
      const next = !prev;
      if (next && currentIndex === null) setCurrentIndex(0);
      if (!next) audioRef.current?.pause();
      return next;
    });
  }

  // Check if any audio is currently playing
  const isAnyAudioPlaying = playingVerse !== null;

  return (
    <div className="manzil-viewer">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Manzil {manzilNumber}...</p>
        </div>
      ) : (
        <>
          {/* Last page indicator flag */}
          {currentPage === totalPages && (
            <div className="last-page-flag">Last Page of Manzil {manzilNumber}</div>
          )}
          
          <ManzilHeader 
            manzilNumber={manzilNumber} 
            totalVerses={totalAyahs}
            totalPages={totalPages}
            autoplay={autoplay}
            setAutoplay={handleAutoplayToggle}
          />
          
          {/* Top Pagination Controls */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              offset={offset}
              limit={limit}
              totalVerses={totalAyahs}
              onPageChange={(page) => {
                if (page === currentPage - 1) {
                  handlePrevPage();
                } else if (page === currentPage + 1) {
                  handleNextPage();
                }
              }}
            />
          )}
          
          {/* Display each surah section */}
          <div className="manzil-content ayah-list">
            {ayahs.map((ayah, index) => (
              <div key={ayah.number} className={`ayah-item${currentPlayingVerse === index ? ' playing' : ''}`}> 
                <div className="ayah-number">
                  <span>{index + 1}</span>
                  <button
                    onClick={() => playVerse(index)}
                    className="verse-audio-btn"
                    disabled={autoplay || isFetchingAudio || !ayah.audio}
                  >
                    {currentPlayingVerse === index ? "❚❚" : "▶"}
                  </button>
                  {isFetchingAudio && <span className="audio-spinner">Loading audio...</span>}
                  {!ayah.audio && <span className="audio-error">No audio</span>}
                </div>
                <div className="ayah-content">
                  <div className="ayah-text">{ayah.text}</div>
                  {ayah.translation && (
                    <div className="ayah-translation">{ayah.translation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Bottom Pagination Controls */}
          {/* ...existing code... */}
          {/* Bottom Pagination Controls */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              offset={offset}
              limit={limit}
              totalVerses={totalAyahs}
              onPageChange={(page) => {
                if (page === currentPage - 1) {
                  handlePrevPage();
                } else if (page === currentPage + 1) {
                  handleNextPage();
                }
              }}
            />
          )}
          
          {/* Manzil Navigation - Only shown on the last page */}
          {currentPage === totalPages && (
            <div className="manzil-navigation">
              <div className="navigation-header">
                <h3>Manzil Navigation</h3>
                <div className="last-page-indicator">Last Page of Manzil {manzilNumber}</div>
              </div>
              <div className="pagination-controls manzil-nav-controls">
                {manzilNumber > 1 && (
                  <a href={`/manzil/${manzilNumber - 1}`} className="pagination-button nav-button prev">
                    ← Previous Manzil
                  </a>
                )}
                <span className="page-indicator manzil-indicator">Manzil {manzilNumber} of 7</span>
                {manzilNumber < 7 && (
                  <a href={`/manzil/${manzilNumber + 1}`} className="pagination-button nav-button next">
                    Next Manzil →
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Audio is now handled via iframes */}
        </>
      )}
      
      {/* Toast for audio errors */}
      {errorMessage && (
        <AudioErrorToast 
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}