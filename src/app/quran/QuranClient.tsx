'use client';

import { useState, useEffect, useCallback } from 'react';
import { Surah } from '../../../types/quran';
import AnimatedBackground from './components/AnimatedBackground';
import SurahCard from './components/SurahCard';
import SearchBar from './components/SearchBar';
import TabQuranNavigator from './components/TabQuranNavigator';
import NavCardSelector from './components/NavCardSelector';
import { fetchQuranStructure, fetchSurahs, fetchSurah } from '../../utils/quranApi';
import './components/TabQuranNavigator.css';
import './QuranClientExtras.css';

export default function QuranClient() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [navigationView, setNavigationView] = useState<'cards' | 'tabs'>('cards');
  const [quranStructure, setQuranStructure] = useState({
    totalSurahs: 114,
    totalJuz: 30,
    totalManzil: 7,
    totalHizb: 60,
    totalPages: 604,
    totalRuku: 556,
    apiBaseUrl: ''
  });
  
  // Fetch Quran data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch Quran structure data including surahs
        const structureData = await fetchQuranStructure();
        
        setSurahs(structureData.surahs);
        setFilteredSurahs(structureData.surahs);
        setQuranStructure(structureData);
      } catch (error) {
        console.error('Error fetching Quran data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter surahs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSurahs(surahs);
      return;
    }
    
    const filtered = surahs.filter(surah => 
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString() === searchTerm
    );
    
    setFilteredSurahs(filtered);
  }, [searchTerm, surahs]);
  
  // Handle search input changes
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);
  
  // Handle read button click
  const handleRead = useCallback((surahNumber: number) => {
    // For Next.js navigation we would use router.push here
    window.open(`/surah/${surahNumber}`, '_self');
  }, []);
  
  // Handle play button click
  const handlePlay = useCallback((surahNumber: number) => {
    // Logic to play surah audio would go here
    console.log(`Playing Surah ${surahNumber}`);
    // In a complete implementation, you would trigger audio playback here
  }, []);
  
  // Navigation handlers
  const handleSelectSurah = useCallback((surahNumber: number) => {
    window.open(`/surah/${surahNumber}`, '_self');
  }, []);
  
  const handleSelectJuz = useCallback((juzNumber: number) => {
    window.open(`/juz/${juzNumber}`, '_self');
  }, []);
  
  const handleSelectManzil = useCallback((manzilNumber: number) => {
    window.open(`/manzil/${manzilNumber}`, '_self');
  }, []);
  
  const handleSelectHizb = useCallback((hizbNumber: number) => {
    window.open(`/hizb/${hizbNumber}`, '_self');
  }, []);
  
  const handleSelectPage = useCallback((pageNumber: number) => {
    window.open(`/page/${pageNumber}`, '_self');
  }, []);
  
  // Toggle between card view and tab navigator view
  const toggleView = useCallback(() => {
    setNavigationView(prev => prev === 'cards' ? 'tabs' : 'cards');
  }, []);
  
  return (
    <>
      <AnimatedBackground />
      <div className="quran-container">
        <div className="quran-header">
          <h1 className="urdu-heading">پیغامِ قرآن</h1>
          <p className="urdu-subtitle">خوش آمدید! آئیے، ہدایت کے اس سفر کا آغاز کریں۔</p>
          <p className="english-subtitle">(Welcome! Let's begin this journey of divine guidance.)</p>
          <div className="quran-stats">
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalSurahs}</span>
              <span className="stat-label">Surahs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalJuz}</span>
              <span className="stat-label">Juz</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalManzil}</span>
              <span className="stat-label">Manzil</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalHizb}</span>
              <span className="stat-label">Hizb</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalPages}</span>
              <span className="stat-label">Pages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{quranStructure.totalRuku}</span>
              <span className="stat-label">Ruku</span>
            </div>
          </div>
          
          <div className="quran-controls">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <NavCardSelector
            options={[
              { id: 'cards', label: 'Card View', icon: '🎴' },
              { id: 'tabs', label: 'Tabbed Navigation', icon: '🗂️' }
            ]}
            activeId={navigationView}
            onChange={(id) => setNavigationView(id as 'cards' | 'tabs')}
            className="navigation-selector"
          />
        </div>
        
        {navigationView === 'tabs' ? (
          <TabQuranNavigator 
            onSelectSurah={handleSelectSurah}
            onSelectJuz={handleSelectJuz}
            onSelectManzil={handleSelectManzil}
            onSelectHizb={handleSelectHizb}
            onSelectPage={handleSelectPage}
          />
        ) : (
          <div className="quran-content">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Quran Data...</p>
              </div>
            ) : (
              <div className="surah-grid">
                {filteredSurahs.length > 0 ? (
                  filteredSurahs.map((surah) => (
                    <SurahCard 
                      key={surah.number} 
                      surah={surah}
                      onRead={handleRead}
                      onPlay={handlePlay}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <p>No surahs found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}