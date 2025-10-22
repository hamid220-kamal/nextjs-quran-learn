'use client';

import { useState, useEffect, useCallback } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import { 
  fetchSurahs, 
  fetchAllJuz, 
  fetchAllManzil, 
  fetchAllHizb, 
  fetchQuranStructure 
} from '../../utils/quranApi';

// Define all QuranSection types
type QuranSectionType = 'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku';

interface QuranBrowserProps {
  initialData?: any;
}

export default function QuranBrowser({ initialData }: QuranBrowserProps) {
  // State for all Quran sections
  const [activeSection, setActiveSection] = useState<QuranSectionType>('surah');
  const [surahList, setSurahList] = useState<any[]>([]);
  const [juzList, setJuzList] = useState<any[]>([]);
  const [manzilList, setManzilList] = useState<any[]>([]);
  const [hizbList, setHizbList] = useState<any[]>([]);
  const [pageList, setPageList] = useState<any[]>([]);
  const [rukuList, setRukuList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quranStructure, setQuranStructure] = useState({
    totalSurahs: 114,
    totalJuz: 30,
    totalManzil: 7,
    totalHizb: 60,
    totalPages: 604,
    totalRuku: 556
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // If we have initial data from server, use it
  useEffect(() => {
    if (initialData) {
      if (initialData.surahs) {
        setSurahList(initialData.surahs);
      }
      setQuranStructure({
        totalSurahs: 114,
        totalJuz: 30,
        totalManzil: 7,
        totalHizb: 60,
        totalPages: 604,
        totalRuku: 556
      });
      setLoading(false);
    } else {
      // If no initial data, fetch it
      loadQuranStructure();
    }
  }, [initialData]);

  // Reset pagination when section changes or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, searchTerm]);

  // Fetch all Quran structure data
  const loadQuranStructure = async () => {
    try {
      setLoading(true);
      setError(null);

      const structure = await fetchQuranStructure();
      setQuranStructure(structure);
      
      // Only fetch surah list by default
      if (surahList.length === 0) {
        const surahs = await fetchSurahs();
        setSurahList(surahs);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load Quran data. Please try again.');
      setLoading(false);
      console.error("Error loading Quran structure:", err);
    }
  };

  // Load data based on active section
  useEffect(() => {
    const loadSectionData = async () => {
      if (loading) return;
      
      try {
        setLoading(true);
        
        switch (activeSection) {
          case 'surah':
            if (surahList.length === 0) {
              const data = await fetchSurahs();
              setSurahList(data);
            }
            break;
          case 'juz':
            if (juzList.length === 0) {
              // Generate juz list (30 juz)
              const juzArray = Array.from({ length: 30 }, (_, i) => ({
                number: i + 1,
                name: `Juz ${i + 1}`,
                startSurah: null,
                startAyah: null
              }));
              setJuzList(juzArray);
            }
            break;
          case 'manzil':
            if (manzilList.length === 0) {
              // Generate manzil list (7 manzil)
              const manzilArray = Array.from({ length: 7 }, (_, i) => ({
                number: i + 1,
                name: `Manzil ${i + 1}`,
              }));
              setManzilList(manzilArray);
            }
            break;
          case 'hizb':
            if (hizbList.length === 0) {
              // Generate hizb list (60 hizb)
              const hizbArray = Array.from({ length: 60 }, (_, i) => ({
                number: i + 1,
                name: `Hizb ${i + 1}`,
                quarters: 4
              }));
              setHizbList(hizbArray);
            }
            break;
          case 'page':
            if (pageList.length === 0) {
              // Generate page list (604 pages)
              const pageArray = Array.from({ length: 604 }, (_, i) => ({
                number: i + 1,
                name: `Page ${i + 1}`,
              }));
              setPageList(pageArray);
            }
            break;
          case 'ruku':
            if (rukuList.length === 0) {
              // Generate ruku list (556 ruku)
              const rukuArray = Array.from({ length: 556 }, (_, i) => ({
                number: i + 1,
                name: `Ruku ${i + 1}`,
              }));
              setRukuList(rukuArray);
            }
            break;
        }
        
        setLoading(false);
      } catch (err) {
        setError(`Failed to load ${activeSection} data. Please try again.`);
        setLoading(false);
        console.error(`Error loading ${activeSection} data:`, err);
      }
    };
    
    loadSectionData();
  }, [activeSection]);

  // Handle section change
  const handleSectionChange = (section: QuranSectionType) => {
    setActiveSection(section);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Navigate to a specific Quran section
  const navigateToSection = (type: QuranSectionType, number: number) => {
    if (type === 'ruku') {
      window.location.href = `/quran/ruku/${number}`;
    } else {
      window.location.href = `/${type}/${number}`;
    }
  };

  // Filtered list based on search term and active section
  const getFilteredList = () => {
    const term = searchTerm.toLowerCase();
    
    switch (activeSection) {
      case 'surah':
        return surahList.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.englishName.toLowerCase().includes(term) || 
          item.englishNameTranslation.toLowerCase().includes(term) || 
          item.number.toString().includes(term)
        );
      case 'juz':
        return juzList.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.number.toString().includes(term)
        );
      case 'manzil':
        return manzilList.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.number.toString().includes(term)
        );
      case 'hizb':
        return hizbList.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.number.toString().includes(term)
        );
      case 'page':
        return pageList.filter(item => 
          item.number.toString().includes(term)
        );
      case 'ruku':
        return rukuList.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.number.toString().includes(term)
        );
      default:
        return [];
    }
  };

  // Pagination logic
  const getPaginatedList = (list: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return list.slice(startIndex, endIndex);
  };

  const getTotalPages = (list: any[]) => {
    return Math.ceil(list.length / itemsPerPage);
  };

  const goToNextPage = () => {
    const filteredList = getFilteredList();
    const totalPages = getTotalPages(filteredList);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render pagination controls
  const renderPaginationControls = (list: any[]) => {
    const totalPages = getTotalPages(list);
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        <div className="pagination-controls">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="pagination-btn prev-btn"
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            ‹ Previous
          </button>
          
          <div className="pagination-info">
            <span className="page-text">Page</span>
            <span className="current-page">{currentPage}</span>
            <span className="page-text">of</span>
            <span className="total-pages">{totalPages}</span>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn next-btn"
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Next ›
          </button>
        </div>
      </div>
    );
  };

  const filteredList = getFilteredList();
  const paginatedList = getPaginatedList(filteredList);
  const totalPages = getTotalPages(filteredList);

  return (
    <div className="quran-browser">
      <AnimatedBackground />
      
      {/* Quran Header */}
      <header className="quran-header" style={{ paddingTop: '80px', paddingBottom: '30px', paddingLeft: '20px', paddingRight: '20px', marginTop: '20px' }}>
        <h1 className="urdu-heading">پیغامِ قرآن</h1>
        <p className="urdu-subtitle">خوش آمدید! آئیے، ہدایت کے اس سفر کا آغاز کریں۔</p>
        <p className="english-subtitle">(Welcome! Let's begin this journey of divine guidance.)</p>
        
        {/* Quran Statistics */}
        <div className="quran-stats">
          <div className="stat-item" onClick={() => handleSectionChange('surah')}>
            <span className="stat-number">{quranStructure.totalSurahs}</span>
            <span className="stat-label">Surahs</span>
          </div>
          <div className="stat-item" onClick={() => handleSectionChange('juz')}>
            <span className="stat-number">{quranStructure.totalJuz}</span>
            <span className="stat-label">Juz</span>
          </div>
          <div className="stat-item" onClick={() => handleSectionChange('manzil')}>
            <span className="stat-number">{quranStructure.totalManzil}</span>
            <span className="stat-label">Manzil</span>
          </div>
          <div className="stat-item" onClick={() => handleSectionChange('hizb')}>
            <span className="stat-number">{quranStructure.totalHizb}</span>
            <span className="stat-label">Hizb</span>
          </div>
          <div className="stat-item" onClick={() => handleSectionChange('page')}>
            <span className="stat-number">{quranStructure.totalPages}</span>
            <span className="stat-label">Pages</span>
          </div>
          <div className="stat-item" onClick={() => handleSectionChange('ruku')}>
            <span className="stat-number">{quranStructure.totalRuku}</span>
            <span className="stat-label">Ruku</span>
          </div>
        </div>
      </header>
      
      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={`Search ${activeSection}...`}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {/* Content Area */}
      <main className="quran-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading Quran data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadQuranStructure}>Retry</button>
          </div>
        ) : (
          <>
            {/* Surah List */}
            {activeSection === 'surah' && (
              <div className="section-list surah-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">سورۃ کی فہرست</h2>
                  <p className="section-subtitle-en">(List of Surahs)</p>
                </div>
                
                {renderPaginationControls(filteredList)}
                
                <div className="cards-container">
                  {paginatedList.map((surah) => (
                    <div 
                      key={surah.number} 
                      className="list-item surah-item"
                      onClick={() => navigateToSection('surah', surah.number)}
                    >
                      <div className="item-number">{surah.number}</div>
                      <div className="item-details">
                        <div className="item-name-ar" dir="rtl">{surah.name}</div>
                        <div className="item-name-en">{surah.englishName}</div>
                        <div className="item-info">
                          <span className="item-translation">{surah.englishNameTranslation}</span>
                          <span className="item-count">{surah.numberOfAyahs} verses</span>
                          <span className="item-type">{surah.revelationType}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {renderPaginationControls(filteredList)}
              </div>
            )}
            
            {/* Juz List */}
            {activeSection === 'juz' && (
              <div className="section-list juz-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">قرآن کے اجزاء</h2>
                  <p className="section-subtitle-en">(Parts of the Qur'an)</p>
                </div>
                
                <div className="cards-container">
                  {filteredList.map((juz) => (
                    <div 
                      key={juz.number} 
                      className="list-item juz-item"
                      onClick={() => navigateToSection('juz', juz.number)}
                    >
                      <div className="item-number">{juz.number}</div>
                      <div className="item-details">
                        <div className="item-name">{juz.name}</div>
                        <div className="item-info">
                          <span className="item-description">
                            One of 30 parts of the Quran
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Manzil List */}
            {activeSection === 'manzil' && (
              <div className="section-list manzil-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">قرآن کی منازل</h2>
                  <p className="section-subtitle-en">(Stages of the Qur'an)</p>
                </div>
                
                <div className="cards-container">
                  {filteredList.map((manzil) => (
                    <div 
                      key={manzil.number} 
                      className="list-item manzil-item"
                      onClick={() => navigateToSection('manzil', manzil.number)}
                    >
                      <div className="item-number">{manzil.number}</div>
                      <div className="item-details">
                        <div className="item-name">{manzil.name}</div>
                        <div className="item-info">
                          <span className="item-description">
                            One of 7 equal parts of the Quran
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hizb List */}
            {activeSection === 'hizb' && (
              <div className="section-list hizb-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">قرآن کے احزاب</h2>
                  <p className="section-subtitle-en">(Divisions of the Qur'an)</p>
                </div>
                
                {renderPaginationControls(filteredList)}
                
                <div className="cards-container">
                  {paginatedList.map((hizb) => (
                    <div 
                      key={hizb.number} 
                      className="list-item hizb-item"
                      onClick={() => navigateToSection('hizb', hizb.number)}
                    >
                      <div className="item-number">{hizb.number}</div>
                      <div className="item-details">
                        <div className="item-name">{hizb.name}</div>
                        <div className="item-info">
                          <span className="item-description">
                            Each hizb is divided into 4 quarters
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {renderPaginationControls(filteredList)}
              </div>
            )}
            
            {/* Page List */}
            {activeSection === 'page' && (
              <div className="section-list page-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">قرآن کے صفحات</h2>
                  <p className="section-subtitle-en">(Pages of the Qur'an)</p>
                </div>
                
                {renderPaginationControls(filteredList)}
                
                <div className="page-grid-container">
                  <div className="page-grid">
                    {paginatedList.map((page) => (
                      <div 
                        key={page.number} 
                        className="page-card"
                        onClick={() => navigateToSection('page', page.number)}
                      >
                        <div className="page-number">{page.number}</div>
                        <div className="page-label">Page {page.number}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {renderPaginationControls(filteredList)}
              </div>
            )}
            
            {/* Ruku List */}
            {activeSection === 'ruku' && (
              <div className="section-list ruku-list">
                <div className="section-header">
                  <h2 className="section-title-urdu">رکوع کی فہرست</h2>
                  <p className="section-subtitle-en">(List of Rukus)</p>
                </div>
                
                {renderPaginationControls(filteredList)}
                
                <div className="cards-container">
                  {paginatedList.map((ruku) => (
                    <div 
                      key={ruku.number} 
                      className="list-item ruku-item"
                      onClick={() => navigateToSection('ruku', ruku.number)}
                    >
                      <div className="item-number">{ruku.number}</div>
                      <div className="item-details">
                        <div className="item-name">{ruku.name}</div>
                        <div className="item-info">
                          <span className="item-description">
                            Sections marked for bowing during recitation
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {renderPaginationControls(filteredList)}
              </div>
            )}
            
            {filteredList.length === 0 && (
              <div className="empty-results">
                <p>No results found for "{searchTerm}"</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}