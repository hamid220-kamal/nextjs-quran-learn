'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import AnimatedSearchBar from '../../components/quran/AnimatedSearchBar'
import SurahCard from '../../components/quran/SurahCard'
import ScriptLoader from '../../components/quran/ScriptLoader'
import LazyDataLoader from '../../components/quran/LazyDataLoader'
import { useQuranDataWorker } from '../../utils/quranOptimizer'
import { SurahIcon, JuzIcon, PageIcon, HizbIcon, ManzilIcon, RukuIcon } from '../../components/quran/QuranTabIcons'

// Import styling
import './Quran.css'
// Import performance optimizations
import './performance-optimized.css'

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean;
  audio?: string;
  translation?: string;
  surahNumber?: number;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

interface QuranClientProps {
  initialSurahs?: Surah[];
}

type ActiveTab = 'surahs' | 'juz' | 'page' | 'hizb' | 'manzil' | 'ruku'

const API_BASE = 'https://api.alquran.cloud/v1'

// Audio URL helper (use global ayah number from API)
const getCdnAudioUrl = (globalAyahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`
}

export default function QuranClientOptimized({ initialSurahs = [] }: QuranClientProps) {
  // All quran-related styles live in ./Quran.css (consolidated)
  const [surahs] = useState<Surah[]>(initialSurahs)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('surahs')
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSearch, setPageSearch] = useState('')
  const [hizbSearch, setHizbSearch] = useState('')
  const [rukuSearch, setRukuSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>(initialSurahs)
  
  // Get the Web Worker functions
  const { filterSurahsWithWorker, processAyahsWithWorker, isWorkerAvailable } = useQuranDataWorker()
  
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [currentContent, setCurrentContent] = useState<{
    type: ActiveTab
    number: number
    title: string
  } | null>(null)
  
  // Track flipped cards
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Filter surahs with web worker
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSurahs(initialSurahs);
      return;
    }
    
    // Use the worker to filter without blocking the main thread
    filterSurahsWithWorker(surahs, searchQuery, (filtered) => {
      setFilteredSurahs(filtered);
    });
  }, [surahs, searchQuery, filterSurahsWithWorker]);
  
  // Ensure we only render randomized visuals after client mount
  useEffect(() => {
    setIsMounted(true)
    return () => {}
  }, [])

  // Reset flipped cards when search query changes
  useEffect(() => {
    setFlippedCards(new Set())
  }, [searchQuery])
  
  // Card flip handler
  const handleCardFlip = useCallback((surahNumber: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlippedCards(prev => {
      const newFlipped = new Set(prev)
      if (newFlipped.has(surahNumber)) {
        newFlipped.delete(surahNumber)
      } else {
        newFlipped.add(surahNumber)
      }
      return newFlipped
    })
  }, []);

  // Observer for scroll animations - Optimized with a limited observer set
  useEffect(() => {
    // Only run observer if we're mounted and have cards to observe
    if (!isMounted || !filteredSurahs.length) return;
    
    // Use IntersectionObserver options for better performance
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Unobserve after handling to reduce overhead
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '200px' }) 
    
    // Observe only visible cards in small batches, limited to viewport area
    const cards = document.querySelectorAll('.quran-surah-card:not(.visible)')
    const cardsToObserve = Array.from(cards).slice(0, 20);
    
    cardsToObserve.forEach(card => observer.observe(card))
    
    return () => observer.disconnect()
  }, [filteredSurahs, isMounted])

  // Navigation lists
  const juzList = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), [])
  const pageList = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), [])
  const hizbList = useMemo(() => Array.from({ length: 60 }, (_, i) => i + 1), [])
  const manzilList = useMemo(() => Array.from({ length: 7 }, (_, i) => i + 1), [])
  const rukuList = useMemo(() => Array.from({ length: 556 }, (_, i) => i + 1), [])

  // Filtered numeric lists
  const filteredPageList = useMemo(() => 
    pageList.filter(p => pageSearch === '' || p.toString().includes(pageSearch)), 
    [pageList, pageSearch]
  );
  
  const filteredHizbList = useMemo(() => 
    hizbList.filter(h => hizbSearch === '' || h.toString().includes(hizbSearch)), 
    [hizbList, hizbSearch]
  );
  
  const filteredRukuList = useMemo(() => 
    rukuList.filter(r => rukuSearch === '' || r.toString().includes(rukuSearch)), 
    [rukuList, rukuSearch]
  );

  // Fetch content (Arabic text, translation, and audio editions) and merge ayahs
  const fetchContent = async (endpoint: string, title: string, type: ActiveTab) => {
    setLoading(true)
    setError(null)
    setAudioError(null)

    try {
      // Build edition endpoints
      const arabicEndpoint = `${API_BASE}${endpoint}/ar.uthmani`
      const translationEndpoint = `${API_BASE}${endpoint}/en.asad`
      const audioEndpoint = `${API_BASE}${endpoint}/ar.alafasy`

      // Fetch all three in parallel
      const [arRes, trRes, auRes] = await Promise.allSettled([
        fetch(arabicEndpoint),
        fetch(translationEndpoint),
        fetch(audioEndpoint)
      ])

      // Validate arabic & translation responses
      if (arRes.status !== 'fulfilled' || trRes.status !== 'fulfilled') {
        throw new Error('Failed to fetch content editions')
      }

      const arJson = await (arRes.value).json()
      const trJson = await (trRes.value).json()

      if (arJson?.code !== 200 || !arJson.data?.ayahs) {
        throw new Error('Arabic edition not available')
      }

      // Try to parse audio edition if it succeeded
      let auJson: Record<string, unknown> | null = null
      if (auRes.status === 'fulfilled') {
        try {
          const tmp = await (auRes.value).json()
          if (tmp?.code === 200 && tmp.data?.ayahs) auJson = tmp
        } catch (e) {
          // ignore audio parse errors
        }
      }

      // Handle different response shapes
      const arabicAyahs = arJson.data?.ayahs || (Array.isArray(arJson.data) ? arJson.data : [])
      const translationAyahs = trJson?.data?.ayahs || (Array.isArray(trJson?.data) ? trJson.data : [])
      const audioAyahs = (auJson as any)?.data?.ayahs || (Array.isArray((auJson as any)?.data) ? (auJson as any).data : [])

      // Use web worker to process ayahs
      processAyahsWithWorker(
        arabicAyahs, 
        translationAyahs, 
        audioAyahs, 
        (processedAyahs) => {
          setAyahs(processedAyahs);
          setCurrentContent({
            type,
            number: (arJson as any).data.number || parseInt(endpoint.split('/').pop() || '0'),
            title
          });
          setLoading(false);
        }
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
      setLoading(false)
    }
  }

  // Content fetch functions
  const fetchSurah = useCallback((surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber)
    const title = surah ? `Surah ${surah.englishName} (${surah.name})` : `Surah ${surahNumber}`
    fetchContent(`/surah/${surahNumber}`, title, 'surahs')
  }, [surahs]);

  const fetchJuz = useCallback((juzNumber: number) => 
    fetchContent(`/juz/${juzNumber}`, `Juz ${juzNumber}`, 'juz'), []);

  const fetchPage = useCallback((pageNumber: number) => 
    fetchContent(`/page/${pageNumber}`, `Page ${pageNumber}`, 'page'), []);

  const fetchHizb = useCallback((hizbNumber: number) => 
    fetchContent(`/hizbQuarter/${hizbNumber * 4 - 3}`, `Hizb ${hizbNumber}`, 'hizb'), []);

  const fetchManzil = useCallback((manzilNumber: number) => 
    fetchContent(`/manzil/${manzilNumber}`, `Manzil ${manzilNumber}`, 'manzil'), []);

  const fetchRuku = useCallback((rukuNumber: number) => 
    fetchContent(`/ruku/${rukuNumber}`, `Ruku ${rukuNumber}`, 'ruku'), []);

  // Audio playback functions
  const playAyah = useCallback(async (index: number) => {
    const ayah = ayahs[index]
    if (!ayah) return
    
    // Prevent rapid-fire calls
    if (isPlaying && currentAyahIndex === index) {
      return;
    }
    
    setAudioError(null)
    stopAudio(true)

    try {
      const primaryUrl = ayah.audio || getCdnAudioUrl(ayah.number)
      const fallbackUrl = getCdnAudioUrl(ayah.number)
      
      if (audioRef.current) {
        // Configure error handling
        audioRef.current.onerror = () => {
          if (audioRef.current && audioRef.current.src !== fallbackUrl) {
            audioRef.current.src = fallbackUrl
            
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true)
                setCurrentAyahIndex(index)
              })
              .catch(() => {
                setAudioError('Audio playback failed')
              })
          } else {
            setAudioError('Audio not available')
          }
        }

        // Set source and play
        audioRef.current.src = primaryUrl
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setCurrentAyahIndex(index)
          })
          .catch((e) => {
            console.error('Audio play rejected:', e.message)
            setAudioError('Browser blocked audio')
          })
      }
    } catch (err) {
      setAudioError('Failed to initialize audio')
    }
  }, [ayahs, isPlaying, currentAyahIndex]);

  // Stop audio playback
  const stopAudio = useCallback((keepAuto = false) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch (e) {
        // ignore errors from pause/reset
      }
    }
    setIsPlaying(false)
    setCurrentAyahIndex(-1)
    if (!keepAuto) setAutoPlay(false)
  }, []);

  const toggleAutoPlay = useCallback(() => {
    const newAutoPlay = !autoPlay
    setAutoPlay(newAutoPlay)
    
    if (newAutoPlay && ayahs.length > 0 && currentAyahIndex < ayahs.length - 1) {
      playAyah(currentAyahIndex + 1)
    }
  }, [autoPlay, ayahs.length, currentAyahIndex, playAyah]);

  // Audio event handler
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleEnded = () => {
      setIsPlaying(false)
      
      if (autoPlay && currentAyahIndex >= 0 && currentAyahIndex < ayahs.length - 1) {
        requestAnimationFrame(() => {
          if (document.body.contains(audio)) {
            playAyah(currentAyahIndex + 1)
          }
        })
      } else {
        setCurrentAyahIndex(-1)
        if (autoPlay) setAutoPlay(false)
      }
    }

    audio.removeEventListener('ended', handleEnded)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, currentAyahIndex, ayahs.length, playAyah]);

  const clearContent = useCallback(() => {
    setAyahs([])
    setCurrentContent(null)
    stopAudio()
    setSearchQuery('')
    setError(null)
    setAudioError(null)
  }, [stopAudio]);

  // Render Surah Grid using LazyDataLoader
  const renderSurahGrid = () => (
    <div className="quran-surah-container">
      {/* Welcome hero (client only) */}
      {isMounted && (
        <div className="quran-welcome-container">
          <div className="quran-welcome" role="region" aria-label="Welcome to Quran">
            <h2>The Holy Quran</h2>
            <p>Read, Listen, and Reflect</p>
          </div>
        </div>
      )}
      
      {/* Use LazyDataLoader for better performance */}
      <LazyDataLoader
        data={filteredSurahs}
        renderItem={(surah) => (
          <SurahCard
            key={surah.number}
            surah={surah}
            onRead={() => fetchSurah(surah.number)}
          />
        )}
        initialCount={12}
        batchSize={8}
        batchDelay={100}
        loadTrigger="scroll"
        containerClassName="quran-surah-grid"
        loadingComponent={
          <div className="surah-loader">
            <div className="loader-animation"></div>
            <span>Loading more surahs...</span>
          </div>
        }
        keyExtractor={(surah) => surah.number}
      />
    </div>
  );

  return (
      <div className="quran-client-container">
        {/* Hidden audio element for Quran recitation */}
        <audio ref={audioRef} className="quran-audio-player" />

        {/* Worker Status indicator (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="worker-status">
            Web Worker: {isWorkerAvailable ? 'Active ✓' : 'Inactive ✗'}
          </div>
        )}
        
        <header className="quran-header">
          <AnimatedSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={activeTab === 'surahs' ? "Search Surah..." : "Search..."}
          />
          
          <nav className="quran-navigation-tabs">
            <button 
              className={activeTab === 'surahs' ? 'active' : ''}
              onClick={() => { setActiveTab('surahs'); clearContent(); }}
            >
              <SurahIcon />
              <span>Surah</span>
            </button>
            <button 
              className={activeTab === 'juz' ? 'active' : ''}
              onClick={() => { setActiveTab('juz'); clearContent(); }}
            >
              <JuzIcon />
              <span>Juz</span>
            </button>
            <button 
              className={activeTab === 'page' ? 'active' : ''}
              onClick={() => { setActiveTab('page'); clearContent(); }}
            >
              <PageIcon />
              <span>Page</span>
            </button>
            <button 
              className={activeTab === 'hizb' ? 'active' : ''}
              onClick={() => { setActiveTab('hizb'); clearContent(); }}
            >
              <HizbIcon />
              <span>Hizb</span>
            </button>
            <button 
              className={activeTab === 'manzil' ? 'active' : ''}
              onClick={() => { setActiveTab('manzil'); clearContent(); }}
            >
              <ManzilIcon />
              <span>Manzil</span>
            </button>
            <button 
              className={activeTab === 'ruku' ? 'active' : ''}
              onClick={() => { setActiveTab('ruku'); clearContent(); }}
            >
              <RukuIcon />
              <span>Ruku</span>
            </button>
          </nav>
        </header>
        
        <main className="quran-main">
          {/* Content area */}
          {currentContent ? (
            <div className="quran-content-view">
              <div className="content-header">
                <h2>{currentContent.title}</h2>
                <button className="back-btn" onClick={clearContent}>
                  Back to {activeTab}
                </button>
              </div>
              
              {/* Audio Controls */}
              {ayahs.length > 0 && (
                <div className="audio-controls">
                  <button 
                    className={`auto-play-btn ${autoPlay ? 'active' : ''}`} 
                    onClick={toggleAutoPlay}
                  >
                    {autoPlay ? 'Auto-Play On' : 'Auto-Play Off'}
                  </button>
                  {isPlaying && (
                    <button className="stop-btn" onClick={() => stopAudio()}>
                      Stop
                    </button>
                  )}
                  {audioError && (
                    <div className="audio-error">
                      {audioError}
                    </div>
                  )}
                </div>
              )}
              
              {/* Loading state */}
              {loading ? (
                <div className="content-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading content...</p>
                </div>
              ) : error ? (
                <div className="content-error">
                  <p>Error: {error}</p>
                  <button className="retry-btn" onClick={() => clearContent()}>
                    Return to {activeTab}
                  </button>
                </div>
              ) : ayahs.length === 0 ? (
                <div className="no-verses">
                  <p>No verses found.</p>
                </div>
              ) : (
                <div className="ayahs-container">
                  {/* Use LazyDataLoader for better performance with many ayahs */}
                  <LazyDataLoader
                    data={ayahs}
                    renderItem={(ayah, index) => (
                      <div
                        className={`ayah-card ${currentAyahIndex === index ? 'ayah-card-active' : ''}`}
                        style={{ "--index": index } as React.CSSProperties}
                      >
                        <div className="ayah-header">
                          <div className="ayah-controls">
                            <button
                              onClick={() => playAyah(index)}
                              className={`play-btn ${currentAyahIndex === index && isPlaying ? 'playing' : ''}`}
                            >
                              {currentAyahIndex === index && isPlaying ? (
                                <svg className="play-icon" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                                </svg>
                              ) : (
                                <svg className="play-icon" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              )}
                            </button>
                            <span className="ayah-number">{ayah.numberInSurah}</span>
                          </div>
                          <div className="ayah-meta">
                            <span>Juz {ayah.juz}</span>
                            <span>Page {ayah.page}</span>
                            {ayah.hizbQuarter && <span>Hizb {ayah.hizbQuarter}</span>}
                          </div>
                        </div>

                        <div className="ayah-content">
                          <p className="ayah-arabic" dir="rtl" lang="ar">
                            {ayah.text}
                          </p>
                          {ayah.translation && (
                            <div className="ayah-translation">
                              <p>{ayah.translation}</p>
                            </div>
                          )}
                        </div>

                        {ayah.sajda && (
                          <div className="ayah-footer">
                            <div className="sajda-indicator">
                              <svg className="sajda-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7H15V12.9C15 13.62 15.34 14.3 15.9 14.73L19.2 17.21L17.9 18.6L13.57 14.39C13.21 14.07 13 13.59 13 13.09V9H11V13.09C11 13.59 10.79 14.07 10.43 14.39L6.1 18.6L4.8 17.21L8.1 14.73C8.66 14.3 9 13.62 9 12.9V7H3V9H5V15H3V17H5V21H7V17H13V21H15V17H17V15H15V9H21Z"/>
                              </svg>
                              Recommended Prostration
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    initialCount={10}
                    batchSize={5}
                    batchDelay={100}
                    loadTrigger="scroll"
                    keyExtractor={(ayah) => ayah.number}
                    loadingComponent={
                      <div className="ayah-loader">
                        <div className="loader-animation"></div>
                        <span>Loading more verses...</span>
                      </div>
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            // Navigation Views
            <>
              {activeTab === 'surahs' && renderSurahGrid()}
              
              {activeTab === 'juz' && (
                <div className="quran-nav-grid">
                  {juzList.map((juz) => (
                    <button 
                      key={juz}
                      className="nav-card"
                      onClick={() => fetchJuz(juz)}
                    >
                      <div className="nav-card-content">
                        <JuzIcon />
                        <span className="nav-card-title">Juz {juz}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {activeTab === 'page' && (
                <>
                  <div className="filter-input">
                    <input
                      type="number"
                      value={pageSearch}
                      onChange={(e) => setPageSearch(e.target.value)}
                      placeholder="Filter pages..."
                      min="1"
                      max="604"
                    />
                  </div>
                  <div className="quran-nav-grid">
                    {filteredPageList.map((page) => (
                      <button 
                        key={page}
                        className="nav-card"
                        onClick={() => fetchPage(page)}
                      >
                        <div className="nav-card-content">
                          <PageIcon />
                          <span className="nav-card-title">Page {page}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {activeTab === 'hizb' && (
                <>
                  <div className="filter-input">
                    <input
                      type="number"
                      value={hizbSearch}
                      onChange={(e) => setHizbSearch(e.target.value)}
                      placeholder="Filter hizb..."
                      min="1"
                      max="60"
                    />
                  </div>
                  <div className="quran-nav-grid">
                    {filteredHizbList.map((hizb) => (
                      <button 
                        key={hizb}
                        className="nav-card"
                        onClick={() => fetchHizb(hizb)}
                      >
                        <div className="nav-card-content">
                          <HizbIcon />
                          <span className="nav-card-title">Hizb {hizb}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {activeTab === 'manzil' && (
                <div className="quran-nav-grid">
                  {manzilList.map((manzil) => (
                    <button 
                      key={manzil}
                      className="nav-card"
                      onClick={() => fetchManzil(manzil)}
                    >
                      <div className="nav-card-content">
                        <ManzilIcon />
                        <span className="nav-card-title">Manzil {manzil}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {activeTab === 'ruku' && (
                <>
                  <div className="filter-input">
                    <input
                      type="number"
                      value={rukuSearch}
                      onChange={(e) => setRukuSearch(e.target.value)}
                      placeholder="Filter ruku..."
                      min="1"
                      max="556"
                    />
                  </div>
                  <div className="quran-nav-grid">
                    {filteredRukuList.map((ruku) => (
                      <button 
                        key={ruku}
                        className="nav-card"
                        onClick={() => fetchRuku(ruku)}
                      >
                        <div className="nav-card-content">
                          <RukuIcon />
                          <span className="nav-card-title">Ruku {ruku}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
  )
}