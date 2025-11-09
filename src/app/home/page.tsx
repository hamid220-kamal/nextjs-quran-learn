'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { fetchQuranStructure } from '../../utils/quranApi';
import HomeSurahCard from './components/HomeSurahCard';
import HomeJuzCard from './components/HomeJuzCard';
import HomeManzilCard from './components/HomeManzilCard';
import HomeHizbCard from './components/HomeHizbCard';
import HomePageCard from './components/HomePageCard';
import HomeRukuCard from './components/HomeRukuCard';
import HomePagination from './components/HomePagination';
import HomeNavigations from './components/HomeNavigations';
import DirectNav from './components/DirectNav';
import NavigationTabs from './components/NavigationTabs';
import SearchBar from './components/SearchBar';
import './components/HomeSurahCard.css';
import './components/HomeJuzCard.css';
import './components/HomeManzilCard.css';
import './components/HomeHizbCard.css';
import './components/HomePageCard.css';
import './components/HomeRukuCard.css';
import './components/HomePagination.css';

interface QuranDataType {
  totalSurahs: number;
  totalJuz: number;
  totalManzil: number;
  totalHizb: number;
  totalPages: number;
  totalRuku: number;
  surahs: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  }[];
}

// Juz mapping data
const juzSurahMap = [
  { start: "Al-Fatihah", end: "Al-Baqarah" },       // Juz 1
  { start: "Al-Baqarah", end: "Al-Baqarah" },       // Juz 2
  { start: "Al-Baqarah", end: "Al-Imran" },         // Juz 3
  { start: "Al-Imran", end: "An-Nisa" },            // Juz 4
  { start: "An-Nisa", end: "An-Nisa" },             // Juz 5
  { start: "An-Nisa", end: "Al-Ma'idah" },          // Juz 6
  { start: "Al-Ma'idah", end: "Al-An'am" },         // Juz 7
  { start: "Al-An'am", end: "Al-A'raf" },           // Juz 8
  { start: "Al-A'raf", end: "Al-Anfal" },           // Juz 9
  { start: "Al-Anfal", end: "At-Tawbah" },          // Juz 10
  { start: "At-Tawbah", end: "Hud" },               // Juz 11
  { start: "Hud", end: "Yusuf" },                   // Juz 12
  { start: "Yusuf", end: "Ibrahim" },               // Juz 13
  { start: "Al-Hijr", end: "An-Nahl" },             // Juz 14
  { start: "Al-Isra", end: "Al-Kahf" },             // Juz 15
  { start: "Al-Kahf", end: "Ta-Ha" },               // Juz 16
  { start: "Al-Anbya", end: "Al-Hajj" },            // Juz 17
  { start: "Al-Mu'minun", end: "Al-Furqan" },       // Juz 18
  { start: "Al-Furqan", end: "An-Naml" },           // Juz 19
  { start: "An-Naml", end: "Al-Ankabut" },          // Juz 20
  { start: "Al-Ankabut", end: "Al-Ahzab" },         // Juz 21
  { start: "Al-Ahzab", end: "Ya-Sin" },             // Juz 22
  { start: "Ya-Sin", end: "Az-Zumar" },             // Juz 23
  { start: "Az-Zumar", end: "Fussilat" },           // Juz 24
  { start: "Fussilat", end: "Al-Jathiyah" },        // Juz 25
  { start: "Al-Ahqaf", end: "Adh-Dhariyat" },       // Juz 26
  { start: "Adh-Dhariyat", end: "Al-Hadid" },       // Juz 27
  { start: "Al-Mujadila", end: "At-Tahrim" },       // Juz 28
  { start: "Al-Mulk", end: "Al-Mursalat" },         // Juz 29
  { start: "An-Naba", end: "An-Nas" }               // Juz 30
];

const getJuzInfo = (juzNumber: number) => {
  const index = juzNumber - 1;
  if (index >= 0 && index < juzSurahMap.length) {
    return juzSurahMap[index];
  }
  return { start: "Unknown", end: "Unknown" };
};

const Home = () => {
  const [quranData, setQuranData] = useState<QuranDataType | null>(null);
  const [lastRead, setLastRead] = useState<{ surah: number; ayah: number } | null>(null);
  const [navigationMode, setNavigationMode] = useState<'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku'>('surah');
  const [searchQuery, setSearchQuery] = useState('');

  // Search helper function
  const filterByNumber = (searchTerm: string, itemNumber: number, prefix: string) => {
    if (!searchTerm) return true;
    const normalizedSearch = searchTerm.toLowerCase().replace(prefix.toLowerCase(), '').trim();
    return itemNumber.toString() === normalizedSearch;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Ruku mapping data
  const rukuData = Array.from({ length: 556 }, (_, i) => {
    const rukuNumber = i + 1;
    const juzNumber = Math.ceil(rukuNumber / 18.5); // Approximate mapping (556/30 ≈ 18.5 ruku per juz)
    const juzInfo = getJuzInfo(juzNumber);
    return {
      number: rukuNumber,
      start: juzInfo.start,
      end: juzInfo.end,
      ayahRange: `${juzInfo.start} to ${juzInfo.end}`
    };
  });

  // Page mapping data
  const pageData = Array.from({ length: 604 }, (_, i) => {
    const pageNumber = i + 1;
    const juzNumber = Math.ceil(pageNumber / 20); // Approximate mapping
    const juzInfo = getJuzInfo(juzNumber);
    return {
      number: pageNumber,
      start: juzInfo.start,
      end: juzInfo.end,
      ayahRange: `${juzInfo.start} to ${juzInfo.end}`
    };
  });

  // Hizb mapping data
  const hizbData = Array.from({ length: 60 }, (_, i) => {
    const hizbNumber = i + 1;
    const juzNumber = Math.ceil(hizbNumber / 2);
    const juzInfo = getJuzInfo(juzNumber);
    return {
      number: hizbNumber,
      start: juzInfo.start,
      end: juzInfo.end,
      ayahRange: `${juzInfo.start} to ${juzInfo.end}`
    };
  });

  // Manzil mapping data
  const manzilData = [
    {
      number: 1,
      description: "Protection from Jinn and Evil",
      start: "Al-Fatihah",
      end: "Al-Baqarah",
      ayahRange: "Al-Fatihah to Al-Baqarah:141"
    },
    {
      number: 2,
      description: "Protection from Black Magic",
      start: "Al-Baqarah",
      end: "Al-Ma'idah",
      ayahRange: "Al-Baqarah:142 to Al-Ma'idah:81"
    },
    {
      number: 3,
      description: "Protection from Calamities",
      start: "Al-Ma'idah",
      end: "At-Tawbah",
      ayahRange: "Al-Ma'idah:82 to At-Tawbah:92"
    },
    {
      number: 4,
      description: "Success and Victory",
      start: "At-Tawbah",
      end: "Ta-Ha",
      ayahRange: "At-Tawbah:93 to Ta-Ha:135"
    },
    {
      number: 5,
      description: "Healing and Recovery",
      start: "Al-Anbya",
      end: "Al-Ahzab",
      ayahRange: "Al-Anbya:1 to Al-Ahzab:30"
    },
    {
      number: 6,
      description: "Ease in Hardship",
      start: "Al-Ahzab",
      end: "Al-Jathiyah",
      ayahRange: "Al-Ahzab:31 to Al-Jathiyah:37"
    },
    {
      number: 7,
      description: "Complete Protection",
      start: "Al-Ahqaf",
      end: "An-Nas",
      ayahRange: "Al-Ahqaf:1 to An-Nas:6"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQuranStructure();
        setQuranData(data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    const getLastRead = () => {
      const stored = localStorage.getItem('lastRead');
      if (stored) {
        setLastRead(JSON.parse(stored));
      }
    };

    fetchData();
    getLastRead();
  }, []);

    return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h1>
          <h2 className={styles.mainTitle}>
            Read, Learn, and Understand the Holy Quran
          </h2>
          <p className={styles.subtitle}>
            Start your journey with comprehensive Quran learning resources
          </p>
          
          {/* Direct Navigation */}
          <DirectNav />
        </div>
      </section>

      {/* Main Navigation */}
      <HomeNavigations />

      {/* Surahs Section */}
      <section className={styles.quranSection}>
        {/* Last Read Section */}
        {lastRead && (
          <div className={styles.lastReadCard}>
            <div className={styles.lastReadInfo}>
              <h3>Continue Reading</h3>
              <p>Surah {lastRead.surah}, Verse {lastRead.ayah}</p>
            </div>
            <Link 
              href={`/quran/surah/${lastRead.surah}#${lastRead.ayah}`}
              className={styles.continueButton}
            >
              Continue Reading
            </Link>
          </div>
        )}
        
        {/* Navigation Tabs */}
        <NavigationTabs
          navigationMode={navigationMode}
          setNavigationMode={setNavigationMode}
        />
        <SearchBar 
          onSearch={handleSearch}
          navigationMode={navigationMode}
        />
        
        {/* Surah Cards Grid */}
        {quranData && navigationMode === 'surah' && (
          <div className="section-container">
            <div className="surahs-grid">
              {quranData.surahs
                .filter(surah => {
                  if (!searchQuery) return true;
                  return (
                    surah.name.toLowerCase().includes(searchQuery) ||
                    surah.englishName.toLowerCase().includes(searchQuery) ||
                    surah.number.toString().includes(searchQuery)
                  );
                })
                .map((surah) => (
                  <HomeSurahCard key={surah.number} surah={surah} />
              ))}
            </div>
          </div>
        )}

        {/* Juz Cards Grid */}
        {quranData && navigationMode === 'juz' && (
          <div className="section-container">
            <div className="juz-grid">
              {Array.from({ length: 30 }, (_, i) => i + 1)
                .filter(juzNumber => filterByNumber(searchQuery, juzNumber, 'juz'))
                .map((juzNumber) => {
                  const juzInfo = getJuzInfo(juzNumber);
                  return (
                    <HomeJuzCard
                      key={juzNumber}
                      juzNumber={juzNumber}
                      surahStart={juzInfo.start}
                      surahEnd={juzInfo.end}
                    />
                  );
              })}
            </div>
          </div>
        )}

        {/* Manzil Cards Grid */}
        {quranData && navigationMode === 'manzil' && (
          <div className="section-container">
            <div className="manzil-grid">
              {manzilData
                .filter(manzil => filterByNumber(searchQuery, manzil.number, 'manzil'))
                .map((manzil) => (
                  <HomeManzilCard
                    key={manzil.number}
                    manzilNumber={manzil.number}
                    surahStart={manzil.start}
                    surahEnd={manzil.end}
                    description={manzil.description}
                    ayahRange={manzil.ayahRange}
                  />
              ))}
            </div>
          </div>
        )}

        {/* Hizb Cards Grid */}
        {quranData && navigationMode === 'hizb' && (
          <div className="section-container">
            <div className="hizb-grid">
              {hizbData
                .filter(hizb => filterByNumber(searchQuery, hizb.number, 'hizb'))
                .map((hizb) => (
                  <HomeHizbCard
                    key={hizb.number}
                    hizbNumber={hizb.number}
                    surahStart={hizb.start}
                    surahEnd={hizb.end}
                    ayahRange={hizb.ayahRange}
                  />
              ))}
            </div>
          </div>
        )}

        {/* Page Cards Grid */}
        {quranData && navigationMode === 'page' && (
          <div className="section-container">
            <div className="page-grid">
              {pageData
                .filter(page => filterByNumber(searchQuery, page.number, 'page'))
                .map((page) => (
                  <HomePageCard
                    key={page.number}
                    pageNumber={page.number}
                    surahStart={page.start}
                    surahEnd={page.end}
                    ayahRange={page.ayahRange}
                  />
              ))}
            </div>
          </div>
        )}

        {/* Ruku Cards Grid */}
        {quranData && navigationMode === 'ruku' && (
          <div className="section-container">
            <div className="ruku-grid">
              {rukuData
                .filter(ruku => filterByNumber(searchQuery, ruku.number, 'ruku'))
                .map((ruku) => (
                  <HomeRukuCard
                    key={ruku.number}
                    rukuNumber={ruku.number}
                    surahStart={ruku.start}
                    surahEnd={ruku.end}
                    ayahRange={ruku.ayahRange}
                  />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;