'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import AnimatedSearchBar from '../../components/quran/AnimatedSearchBar'
import SurahCard from '../../components/quran/SurahCard'
import ScriptLoader from '../../components/quran/ScriptLoader'
import { SurahIcon, JuzIcon, PageIcon, HizbIcon, ManzilIcon, RukuIcon } from '../../components/quran/QuranTabIcons'

// All styling for the Quran page is now consolidated in a single CSS file
import './Quran.css'

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
  meta?: Record<string, unknown>;
  sajda?: Record<string, unknown>;
}

type ActiveTab = 'surahs' | 'juz' | 'page' | 'hizb' | 'manzil' | 'ruku'

const API_BASE = 'https://api.alquran.cloud/v1'

// Audio URL helper (use global ayah number from API)
const getCdnAudioUrl = (globalAyahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`
}

export default function QuranClient({ initialSurahs = [] }: QuranClientProps) {
  // All quran-related styles live in ./Quran.css (consolidated). Avoid
  // reintroducing multiple scattered CSS files; import the single stylesheet instead.
  const [surahs] = useState<Surah[]>(initialSurahs)
  // Only render certain randomized visuals after client mount to avoid
  // hydration mismatches (Math.random / Date differences between server and client)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('surahs')
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSearch, setPageSearch] = useState('')
  const [hizbSearch, setHizbSearch] = useState('')
  const [rukuSearch, setRukuSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [currentContent, setCurrentContent] = useState<{
    type: ActiveTab
    number: number
    title: string
  } | null>(null)
  
  // Track flipped cards
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  
  // Card flip handler
  const handleCardFlip = (surahNumber: number, e: React.MouseEvent) => {
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
  }

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Safe filtering with memoization to avoid unnecessary re-renders
  const filteredSurahs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return (surahs || []).filter(surah =>
      (surah.englishName?.toLowerCase() || '').includes(query) ||
      (surah.name?.toLowerCase() || '').includes(query) ||
      (surah.englishNameTranslation?.toLowerCase() || '').includes(query) ||
      surah.number.toString().includes(searchQuery)
    );
  }, [surahs, searchQuery])
  
  // Ensure we only render randomized visuals after client mount
  useEffect(() => {
    setIsMounted(true)
    return () => {}
  }, [])

  // Reset flipped cards when search query changes
  useEffect(() => {
    setFlippedCards(new Set())
  }, [searchQuery])
  
  // Observer for scroll animations - Optimized version
  useEffect(() => {
    // Only run observer if we're mounted and have cards to observe
    if (!isMounted || !filteredSurahs.length) return;
    
    // Set up intersection observer for scroll animations - with limited operations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Removed the pulse animation to improve performance
        }
      })
    }, { threshold: 0.1, rootMargin: '100px' }) // Added rootMargin for better performance
    
    // Limit the number of observed cards to improve performance
    const maxObservedCards = 20;
    // Observe only visible cards, up to the maximum
    const cards = document.querySelectorAll('.quran-surah-card')
    const cardsToObserve = Array.from(cards).slice(0, maxObservedCards);
    
    cardsToObserve.forEach(card => observer.observe(card))
    
    return () => observer.disconnect()
  }, [filteredSurahs, isMounted])

  // Navigation lists
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1)
  const pageList = Array.from({ length: 604 }, (_, i) => i + 1)
  const hizbList = Array.from({ length: 60 }, (_, i) => i + 1)
  const manzilList = Array.from({ length: 7 }, (_, i) => i + 1)
  const rukuList = Array.from({ length: 556 }, (_, i) => i + 1)

  // Filtered numeric lists
  const filteredPageList = pageList.filter(p => pageSearch === '' || p.toString().includes(pageSearch))
  const filteredHizbList = hizbList.filter(h => hizbSearch === '' || h.toString().includes(hizbSearch))
  const filteredRukuList = rukuList.filter(r => rukuSearch === '' || r.toString().includes(rukuSearch))

  // Fetch content (Arabic text, translation, and audio editions) and merge ayahs
  const fetchContent = async (endpoint: string, title: string, type: ActiveTab) => {
    setLoading(true)
    setError(null)
    setAudioError(null)

    try {
      // Build edition endpoints (most API routes accept the same path + '/{edition}')
      const arabicEndpoint = `${API_BASE}${endpoint}/ar.uthmani`
      const translationEndpoint = `${API_BASE}${endpoint}/en.asad`
      const audioEndpoint = `${API_BASE}${endpoint}/ar.alafasy`

      // Fetch all three in parallel (audio may 404 for some routes, we'll handle that)
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

      if (trJson?.code !== 200 || !trJson.data?.ayahs) {
        // translation may be missing, but we can continue with empty translations
        console.warn('Translation edition not available; continuing without translations')
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

  // Handle different response shapes: some endpoints (manzil, page, juz) may return data as an array
  const arabicAyahs = arJson.data?.ayahs || (Array.isArray(arJson.data) ? arJson.data : [])
  const translationAyahs = trJson?.data?.ayahs || (Array.isArray(trJson?.data) ? trJson.data : [])
  const audioAyahs = (auJson as any)?.data?.ayahs || (Array.isArray((auJson as any)?.data) ? (auJson as any).data : [])

  console.debug('fetchContent debug', { endpoint, arabicCount: arabicAyahs.length, translationCount: translationAyahs.length, audioCount: audioAyahs.length })

      // Merge ayahs using arabic as source of truth
      const processedAyahs = arabicAyahs.map((ayah: Record<string, unknown>, idx: number) => {
        const globalAyahNumber = (ayah as any).number || (ayah as any)?.id || null // global ayah number from API
        const translationText = translationAyahs[idx]?.text || ''
        const audioUrlFromEdition = audioAyahs[idx]?.audio || null

        // Fallback audio: use cdn with global ayah number
        const fallbackAudio = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`

        return {
          ...ayah,
          translation: translationText,
          audio: audioUrlFromEdition || fallbackAudio,
          surahNumber: (arJson as any).data.number || (ayah as any).surah?.number || null
        }
      })

      setAyahs(processedAyahs)
      setCurrentContent({
        type,
        number: (arJson as any).data.number || parseInt(endpoint.split('/').pop() || '0'),
        title
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  // Fetch functions
  const fetchSurah = (surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber)
    const title = surah ? `Surah ${surah.englishName} (${surah.name})` : `Surah ${surahNumber}`
    fetchContent(`/surah/${surahNumber}`, title, 'surahs')
  }

  const fetchJuz = (juzNumber: number) => 
    fetchContent(`/juz/${juzNumber}`, `Juz ${juzNumber}`, 'juz')

  const fetchPage = (pageNumber: number) => 
    fetchContent(`/page/${pageNumber}`, `Page ${pageNumber}`, 'page')

  const fetchHizb = (hizbNumber: number) => 
    fetchContent(`/hizbQuarter/${hizbNumber * 4 - 3}`, `Hizb ${hizbNumber}`, 'hizb')

  const fetchManzil = (manzilNumber: number) => 
    fetchContent(`/manzil/${manzilNumber}`, `Manzil ${manzilNumber}`, 'manzil')

  const fetchRuku = (rukuNumber: number) => 
    fetchContent(`/ruku/${rukuNumber}`, `Ruku ${rukuNumber}`, 'ruku')

  // Optimized Audio player with debouncing to prevent excessive operations
  const playAyah = async (index: number) => {
    const ayah = ayahs[index]
    if (!ayah) return
    
    // Prevent rapid-fire calls by checking if already playing the requested ayah
    if (isPlaying && currentAyahIndex === index) {
      return; // Already playing this ayah, no need to restart
    }
    
    setAudioError(null)
    stopAudio(true)

    try {
      // Pre-determine URLs to avoid multiple calculations
      const primaryUrl = ayah.audio || getCdnAudioUrl(ayah.number)
      const fallbackUrl = getCdnAudioUrl(ayah.number)
      
      if (audioRef.current) {
        // Configure error handling once
        audioRef.current.onerror = () => {
          // Only try fallback if we're not already using it
          if (audioRef.current && audioRef.current.src !== fallbackUrl) {
            audioRef.current.src = fallbackUrl
            
            // Use a Promise to handle the play attempt cleanly
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true)
                setCurrentAyahIndex(index)
              })
              .catch(() => {
                setAudioError('Audio playback failed after fallback attempt')
              })
          } else {
            setAudioError('Audio not available for this ayah')
          }
        }

        // Set source and play
        audioRef.current.src = primaryUrl
        
        // Clean play attempt with proper state management
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setCurrentAyahIndex(index)
          })
          .catch((e) => {
            console.error('Audio play rejected:', e.message)
            setAudioError('Browser blocked audio playback')
          })
      } else {
        setAudioError('Audio player not available')
      }
    } catch (err) {
      console.error('Audio playback error:', err)
      setAudioError('Failed to initialize audio')
    }
  }

  // Stop audio playback. If keepAuto is true, do not disable autoPlay (used when advancing to next ayah)
  const stopAudio = (keepAuto = false) => {
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
  }

  const toggleAutoPlay = () => {
    const newAutoPlay = !autoPlay
    setAutoPlay(newAutoPlay)
    
    if (newAutoPlay && ayahs.length > 0 && currentAyahIndex < ayahs.length - 1) {
      playAyah(currentAyahIndex + 1)
    }
  }

  // Optimized audio event handler with stable reference
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // Use a stable reference to prevent recreating event listeners
    const handleEnded = () => {
      setIsPlaying(false)
      
      // Check autoPlay and bounds in the callback to get latest state values
      if (autoPlay && currentAyahIndex >= 0 && currentAyahIndex < ayahs.length - 1) {
        // Use requestAnimationFrame for better performance than setTimeout
        requestAnimationFrame(() => {
          // Double-check we should still play (component could have unmounted)
          if (document.body.contains(audio)) {
            playAyah(currentAyahIndex + 1)
          }
        })
      } else {
        setCurrentAyahIndex(-1)
        if (autoPlay) setAutoPlay(false)
      }
    }

    // Clean up previous listener before adding a new one
    audio.removeEventListener('ended', handleEnded)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay, currentAyahIndex, ayahs.length])

  const clearContent = () => {
    setAyahs([])
    setCurrentContent(null)
    stopAudio()
    setSearchQuery('')
    setError(null)
    setAudioError(null)
  }

  // Render Surah Grid
  const renderSurahGrid = () => (
    <div className="quran-surah-container">
      {/* Welcome hero (client only) - interactive inspirational area */}
      {isMounted && (
        <div>
          <div className="quran-welcome" role="region" aria-label="Welcome to Quran">
            <div className="quran-ayah-hero" dir="rtl" lang="ar">
              السلام عليكم، اقرأ القرآن لتستنير القلوب وتطمئن الأرواح.
            </div>
            <div className="quran-ayah-translation">
              Peace be upon you, read the Qur&apos;an so that hearts may be enlightened and souls may find peace.
            </div>
            <div className="welcome-actions">
              <button
                className="inspire-btn"
                onClick={() => {
                  // pick a random surah and open it
                  if (surahs && surahs.length > 0) {
                    const idx = Math.floor(Math.random() * surahs.length)
                    const s = surahs[idx]
                    fetchSurah(s.number)
                  }
                }}
              >
                Inspire me
              </button>
              <button
                className="start-btn"
                onClick={() => {
                  // focus on surah grid
                  setActiveTab('surahs')
                  const el = document.querySelector('.quran-surah-grid') as HTMLElement | null
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                Start Reading
              </button>
            </div>
          </div>

          {/* Nav pills: Surah / Juz quick links under the ayah hero */}
          <div className="quran-navs" role="navigation" aria-label="Quran navigation">
          </div>
        </div>
      )}
      
      {/* Search box */}
      <AnimatedSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search surah by name, translation, or number..." />
      
      {/* Surah heading - Exact match to the image */}
      <div className="section-heading-container">
        <h2 className="section-heading surah-heading">
          <span className="count-green">114</span>
          <span className="title-blue">Surah's</span>
        </h2>
        <div className="heading-underline"></div>
      </div>
      <p className="section-subheading">Complete collection of chapters from the Holy Quran</p>
      
      {filteredSurahs.length > 0 ? (
        <div className="quran-surah-grid">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.number}
              surah={surah}
              onRead={() => fetchSurah(surah.number)}
            />
          ))}
        </div>
      ) : (
        <div className="quran-no-results">
          <p>No surahs found matching your search.</p>
        </div>
      )}
    </div>
  )

  // Render Number Grid
  const renderNumberGrid = (items: number[], fetchFunction: (num: number) => void, label: string) => {
    // Special content for Juz cards
    const juzArabicNames = [
      'الم', 'سيقول', 'تلك الرسل', 'لن تنالوا', 'والمحصنات', 'لا يحب الله',
      'وإذا سمعوا', 'ولو أننا', 'قال الملأ', 'واعلموا', 'يعتذرون', 'ومامن دابة',
      'وما أبرئ', 'ربما', 'سبحان الذي', 'قال ألم', 'اقترب للناس', 'قد أفلح',
      'وقال الذين', 'أمن خلق', 'أتل ما', 'ومن يقنت', 'ومالي', 'فمن أظلم',
      'إليه يرد', 'حم', 'قال فما خطبكم', 'قد سمع الله', 'تبارك الذي', 'عم'
    ];
    
    // Translations for Juz names
    const juzTranslations = [
      'Alif Lam Mim', 'Sayaqul', 'Tilka Al-Rusul', 'Lan Tanaloo', 'Wal Muhsanat', 'La Yuhibbullah',
      'Wa Itha Sami\'u', 'Wa Law Annana', 'Qalal Mala\'', 'Wa\'lamu', 'Ya\'tazeroon', 'Wa ma min dabbah',
      'Wa ma ubarri', 'Rubama', 'Subhanallathi', 'Qalam', 'Iqtaraba Linnaas', 'Qad Aflaha',
      'Wa Qalallathina', 'Am man khalaqa', 'Utlu ma', 'Wa man yaqnut', 'Wa mali', 'Faman azlamu',
      'Ilayhi yuraddu', 'Ha Mim', 'Qala fama khatbukum', 'Qad sami\'allah', 'Tabarakallazi', 'Amma'
    ];
    
    // Get lowercase name for class consistency
    const cardType = label.toLowerCase();
    
    return (
    <div className="full-width-container">
      <div className={`section-icon ${cardType}-icon`}></div>
      <h2 className={`section-heading ${cardType}-heading`}>
        <span className="count">{items.length}</span>
        <span className="title">{label}&apos;s</span>
      </h2>
      <p className="section-subheading">Complete collection of {cardType} from the Holy Quran</p>
      
      <div className={`quran-${cardType}-grid full-width-grid`}>
        {items.map((number) => {
          // For Juz cards, display with Arabic name and translation
          const isJuz = cardType === 'juz';
          const juzIndex = number - 1; // Juz numbers are 1-indexed
          
          return (
          <div
            key={number}
            className={`quran-${cardType}-card ${cardType}-card`}
            data-meta-content={`${label} ${number}`}
          >
            <div className={`quran-${cardType}-card-inner ${cardType}-card-main`}>
              {/* Card Number Badge */}
              <div className={`quran-${cardType}-number ${cardType}-number`}>{number}</div>

              {/* Main Content */}
              <div className={`quran-${cardType}-titles ${cardType}-card-content`}>
                {isJuz && juzIndex < juzArabicNames.length && (
                  <div className={`quran-${cardType}-title-ar ${cardType}-name-ar`} dir="rtl">{juzArabicNames[juzIndex]}</div>
                )}
                <div className={`quran-${cardType}-title-en ${cardType}-name-en`}>{label} {number}</div>
                {isJuz && juzIndex < juzTranslations.length && (
                  <div className={`quran-${cardType}-title-translation ${cardType}-name-translation`}>{juzTranslations[juzIndex]}</div>
                )}
              </div>

              {/* Meta Info */}
              <div className={`quran-${cardType}-meta ${cardType}-card-meta`}>
                {isJuz ? (
                  <>
                    <div className={`quran-${cardType}-count ${cardType}-count`}>Part {number}/30</div>
                    <div className={`quran-${cardType}-revelation ${cardType}-revelation`}>{number <= 24 ? "Varied" : "Mufassal"}</div>
                  </>
                ) : (
                  <div className={`quran-${cardType}-count ${cardType}-count`}>Quick open {cardType}</div>
                )}
              </div>

              {/* Actions */}
              <div className={`quran-${cardType}-actions ${cardType}-actions`}>
                <button 
                  className="read-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Create ripple effect
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                      const x = e.nativeEvent.offsetX;
                      const y = e.nativeEvent.offsetY;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple';
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 800);
                    }
                    fetchFunction(number);
                  }}
                >
                  READ
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
    );
  }

  return (
    <div className="quran-client-container">
      {/* Hidden audio element for Quran recitation */}
      {useMemo(() => (
        <audio 
          ref={audioRef} 
          className="quran-audio-hidden" 
          preload="metadata" 
          crossOrigin="anonymous"
        />
      ), [])}
      
      {/* Primary navigation is shown inside the page content to avoid duplication */}

      {/* Error Display */}
      {(error || audioError) && (
        <div className="error-message">
          <span>{error || audioError}</span>
          <button 
            onClick={() => {
              setError(null)
              setAudioError(null)
            }}
            className="error-close"
          >

          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading Quranic content...</p>
        </div>
      )}

      {/* Main Content */}
      <main className="content-area">
        {!currentContent ? (
          <>
            {/* Enhanced navigation tabs with Islamic-inspired design */}
            <div className="quran-nav-container" role="navigation" aria-label="Quran navigation">
              <div className="quran-nav-tabs">
                <button 
                  className={`quran-nav-tab ${activeTab === 'surahs' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('surahs'); 
                    const el = document.querySelector('.quran-surah-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="surahs"
                >
                  <span className="tab-icon"><SurahIcon /></span>
                  <span className="tab-label">Surahs</span>
                  <span className="tab-count">114</span>
                </button>
                
                <button 
                  className={`quran-nav-tab ${activeTab === 'juz' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('juz'); 
                    const el = document.querySelector('.quran-juz-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="juz"
                >
                  <span className="tab-icon"><JuzIcon /></span>
                  <span className="tab-label">Juz</span>
                  <span className="tab-count">30</span>
                </button>
                
                <button 
                  className={`quran-nav-tab ${activeTab === 'page' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('page'); 
                    const el = document.querySelector('.quran-page-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="page"
                >
                  <span className="tab-icon"><PageIcon /></span>
                  <span className="tab-label">Pages</span>
                  <span className="tab-count">604</span>
                </button>
                
                <button 
                  className={`quran-nav-tab ${activeTab === 'hizb' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('hizb'); 
                    const el = document.querySelector('.quran-hizb-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="hizb"
                >
                  <span className="tab-icon"><HizbIcon /></span>
                  <span className="tab-label">Hizb</span>
                  <span className="tab-count">60</span>
                </button>
                
                <button 
                  className={`quran-nav-tab ${activeTab === 'manzil' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('manzil'); 
                    const el = document.querySelector('.quran-manzil-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="manzil"
                >
                  <span className="tab-icon"><ManzilIcon /></span>
                  <span className="tab-label">Manzil</span>
                  <span className="tab-count">7</span>
                </button>
                
                <button 
                  className={`quran-nav-tab ${activeTab === 'ruku' ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab('ruku'); 
                    const el = document.querySelector('.quran-ruku-grid') as HTMLElement | null; 
                    if (el) el.scrollIntoView({ behavior: 'smooth' }) 
                  }}
                  data-type="ruku"
                >
                  <span className="tab-icon"><RukuIcon /></span>
                  <span className="tab-label">Ruku</span>
                  <span className="tab-count">556</span>
                </button>
              </div>
            </div>
            {/* Using useMemo to prevent unnecessary re-renders of tab content */}
            {useMemo(() => {
              switch(activeTab) {
                case 'surahs':
                  return renderSurahGrid();
                case 'juz':
                  return renderNumberGrid(juzList, fetchJuz, 'Juz');
                case 'page':
                  return (
                    <div className="page-search-container full-width-container">
                      <AnimatedSearchBar value={pageSearch} onChange={setPageSearch} placeholder="Click here to Search pages..." className="search-small" />
                      {renderNumberGrid(filteredPageList, fetchPage, 'Page')}
                    </div>
                  );
                case 'hizb':
                  return (
                    <div className="hizb-search-container full-width-container">
                      <AnimatedSearchBar value={hizbSearch} onChange={setHizbSearch} placeholder="Click here to Search hizb..." className="search-small" />
                      {renderNumberGrid(filteredHizbList, fetchHizb, 'Hizb')}
                    </div>
                  );
                case 'manzil':
                  return renderNumberGrid(manzilList, fetchManzil, 'Manzil');
                case 'ruku':
                  return (
                    <div className="ruku-search-container full-width-container">
                      <AnimatedSearchBar value={rukuSearch} onChange={setRukuSearch} placeholder="Click here to Search ruku..." className="search-small" />
                      {renderNumberGrid(filteredRukuList, fetchRuku, 'Ruku')}
                    </div>
                  );
                default:
                  return null;
              }
            }, [activeTab, filteredPageList, filteredHizbList, filteredRukuList, 
                pageSearch, hizbSearch, rukuSearch, juzList, manzilList])}
          </>
        ) : (
          <div className="content-view">
            <header className="content-header">
              <div className="content-info">
                <h2>
                  {currentContent.title.includes('(') ? (
                    <>
                      {currentContent.title.split('(')[0].trim()}
                      <span className="arabic-title" dir="rtl" lang="ar">
                        {currentContent.title.match(/\(([^)]+)\)/) ? currentContent.title.match(/\(([^)]+)\)/)[1] : ''}
                      </span>
                    </>
                  ) : (
                    currentContent.title
                  )}
                </h2>
                <p>{ayahs.length} verses</p>
              </div>
              <div className="content-controls">
                <button
                  onClick={(e) => {
                    // Create ripple effect
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                      const x = e.nativeEvent.offsetX;
                      const y = e.nativeEvent.offsetY;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple';
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 800);
                    }
                    toggleAutoPlay();
                  }}
                  disabled={ayahs.length === 0}
                  className={`control-btn ${autoPlay ? 'control-btn-active' : ''}`}
                >
                  {autoPlay ? (
                    <>
                      <span className="icon-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                        </svg>
                      </span>
                      Auto-Playing...
                    </>
                  ) : (
                    <>
                      <span className="icon-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </span>
                      Auto-Play
                    </>
                  )}
                </button>
                <button 
                  onClick={(e) => {
                    // Create ripple effect
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                      const x = e.nativeEvent.offsetX;
                      const y = e.nativeEvent.offsetY;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple';
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 800);
                    }
                    stopAudio(false);
                  }} 
                  className="control-btn control-btn-stop"
                >
                  <span className="icon-wrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4-12H8v8h8V8z"/>
                    </svg>
                  </span>
                  Stop
                </button>
                <button 
                  onClick={(e) => {
                    // Create ripple effect
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                      const x = e.nativeEvent.offsetX;
                      const y = e.nativeEvent.offsetY;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple';
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 800);
                    }
                    clearContent();
                  }} 
                  className="control-btn control-btn-back"
                >
                  <span className="icon-wrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                  </span>
                  Back
                </button>
              </div>
            </header>

            <div className="ayahs-list">
              {ayahs.length === 0 ? (
                <div className="no-verses">
                  <p>No verses found.</p>
                </div>
              ) : (
                <div className="ayahs-container">
                  {ayahs.map((ayah, index) => (
                    <div
                      key={ayah.number}
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
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Load navigation enhancement and card styling scripts */}
      <ScriptLoader scripts={[
        '/quran/navigation-scroll.js',
        '/quran/quran-nav.js',
        '/quran/card-initializer.js',
        '/quran/card-title-centering.js',
        '/quran/card-image-styling.js',
        '/nuclear-card-styling.js', // Nuclear option for guaranteed styling
        '/emergency-card-styling.js', // Emergency direct DOM manipulation
        '/brutal-direct-fix.js', // Brutal force styling with maximum priority
        '/direct-style-injector.js', // Direct DOM styling injector
        '/emergency-meta-fix.js' // Emergency meta and styling fix
      ]} />
      
      {/* Add Islamic pattern styling dynamically */}
      <link rel="stylesheet" href="/quran/islamic-patterns.css" />
    </div>
  )
}