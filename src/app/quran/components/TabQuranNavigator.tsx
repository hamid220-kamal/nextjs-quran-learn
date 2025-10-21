'use client';

import { useState, useEffect } from 'react';
import { 
  fetchSurahs, 
  fetchAllJuz, 
  fetchAllManzil, 
  fetchAllHizb, 
  fetchQuranStructure 
} from '../../utils/quranApi';

// Types
type NavTab = 'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku';

interface JuzInfo {
  number: number;
  startSurah: { number: number; name: string; };
  startAyah: number;
}

interface ItemDetail {
  title: string;
  content: React.ReactNode;
}

interface TabQuranNavigatorProps {
  onSelectSurah: (surahNumber: number) => void;
  onSelectJuz: (juzNumber: number) => void;
  onSelectManzil: (manzilNumber: number) => void;
  onSelectHizb: (hizbNumber: number) => void;
  onSelectPage: (pageNumber: number) => void;
  className?: string;
}

export default function TabQuranNavigator({
  onSelectSurah,
  onSelectJuz,
  onSelectManzil,
  onSelectHizb,
  onSelectPage,
  className = ''
}: TabQuranNavigatorProps) {
  // State
  const [activeTab, setActiveTab] = useState<NavTab>('surah');
  const [surahs, setSurahs] = useState<any[]>([]);
  const [juzData, setJuzData] = useState<any[]>([]);
  const [manzilData, setManzilData] = useState<any[]>([]);
  const [hizbData, setHizbData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState<ItemDetail | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generate page numbers 1-604
  const pageNumbers = Array.from({ length: 604 }, (_, i) => i + 1);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data based on active tab to avoid unnecessary API calls
        if (activeTab === 'surah') {
          const surahsData = await fetchSurahs();
          setSurahs(surahsData);
        } 
        else if (activeTab === 'juz' && juzData.length === 0) {
          const juzArray = Array.from({ length: 30 }, (_, i) => ({
            number: i + 1,
            name: `Juz ${i + 1}`,
          }));
          setJuzData(juzArray);
        }
        else if (activeTab === 'manzil' && manzilData.length === 0) {
          const manzilArray = Array.from({ length: 7 }, (_, i) => ({
            number: i + 1,
            name: `Manzil ${i + 1}`,
          }));
          setManzilData(manzilArray);
        }
        else if (activeTab === 'hizb' && hizbData.length === 0) {
          const hizbArray = Array.from({ length: 60 }, (_, i) => ({
            number: i + 1,
            name: `Hizb ${i + 1}`,
          }));
          setHizbData(hizbArray);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load Quran navigation data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Change active tab
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  // Pagination logic
  const getPaginatedItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const goToNextPage = () => {
    const items = getCurrentItems();
    const totalPages = getTotalPages(items);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current items based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'surah':
        return surahs;
      case 'hizb':
        return hizbData;
      case 'page':
        return pageNumbers.map(num => ({ number: num, name: `Page ${num}` }));
      case 'ruku':
        return Array.from({ length: 556 }, (_, i) => ({
          number: i + 1,
          name: `Ruku ${i + 1}`,
        }));
      default:
        return [];
    }
  };

  // Render pagination controls for paginated sections
  const renderPaginationControls = () => {
    const items = getCurrentItems();
    const totalPages = getTotalPages(items);
    
    if (['surah', 'hizb', 'page', 'ruku'].includes(activeTab) && totalPages > 1) {
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
    }
    return null;
  };

  const currentItems = getCurrentItems();
  const paginatedItems = getPaginatedItems(currentItems);

  return (
    <div className={`quran-navigator ${className}`}>
      {/* Tab Navigation */}
      <div className="navigator-tabs">
        <button 
          className={`tab-btn ${activeTab === 'surah' ? 'active' : ''}`}
          onClick={() => handleTabChange('surah')}
        >
          Surah
        </button>
        <button 
          className={`tab-btn ${activeTab === 'juz' ? 'active' : ''}`}
          onClick={() => handleTabChange('juz')}
        >
          Juz
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manzil' ? 'active' : ''}`}
          onClick={() => handleTabChange('manzil')}
        >
          Manzil
        </button>
        <button 
          className={`tab-btn ${activeTab === 'hizb' ? 'active' : ''}`}
          onClick={() => handleTabChange('hizb')}
        >
          Hizb
        </button>
        <button 
          className={`tab-btn ${activeTab === 'page' ? 'active' : ''}`}
          onClick={() => handleTabChange('page')}
        >
          Page
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ruku' ? 'active' : ''}`}
          onClick={() => handleTabChange('ruku')}
        >
          Ruku
        </button>
      </div>

      {/* Content Area */}
      <div className="navigator-content">
        {isLoading ? (
          <div className="navigator-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="navigator-error">
            <p>{error}</p>
            <button onClick={() => handleTabChange(activeTab)}>Retry</button>
          </div>
        ) : (
          <div className="navigator-items">
            {/* Top Pagination */}
            {renderPaginationControls()}
            
            {/* Surahs Tab Content */}
            {activeTab === 'surah' && (
              <div className="surah-list">
                {paginatedItems.map(surah => (
                  <div 
                    key={surah.number} 
                    className="nav-item surah-item"
                    onClick={() => onSelectSurah(surah.number)}
                    onMouseEnter={() => setSelectedItemDetail({
                      title: `${surah.englishName} (${surah.name})`,
                      content: (
                        <>
                          <p><strong>Meaning:</strong> {surah.englishNameTranslation}</p>
                          <p><strong>Number of Verses:</strong> {surah.numberOfAyahs}</p>
                          <p><strong>Revelation Type:</strong> {surah.revelationType}</p>
                        </>
                      )
                    })}
                    onMouseLeave={() => setSelectedItemDetail(null)}
                  >
                    <span className="item-number">{surah.number}</span>
                    <span className="item-name-ar" dir="rtl">{surah.name}</span>
                    <span className="item-name-en">{surah.englishName}</span>
                    <span className="item-meta">{surah.revelationType} • {surah.numberOfAyahs} verses</span>
                  </div>
                ))}
              </div>
            )}

            {/* Juz Tab Content */}
            {activeTab === 'juz' && (
              <div className="juz-list">
                {juzData.map(juz => (
                  <div 
                    key={juz.number} 
                    className="nav-item juz-item"
                    onClick={() => onSelectJuz(juz.number)}
                    onMouseEnter={() => setSelectedItemDetail({
                      title: `${juz.name}`,
                      content: (
                        <>
                          <p>Juz {juz.number} is one of the 30 sections of the Quran.</p>
                          <p>The Quran is often divided into 30 equal parts to facilitate recitation over a 30-day period, especially during the month of Ramadan.</p>
                        </>
                      )
                    })}
                    onMouseLeave={() => setSelectedItemDetail(null)}
                  >
                    <span className="item-number">{juz.number}</span>
                    <span className="item-name">{juz.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Manzil Tab Content */}
            {activeTab === 'manzil' && (
              <div className="manzil-list">
                {manzilData.map(manzil => (
                  <div 
                    key={manzil.number} 
                    className="nav-item manzil-item"
                    onClick={() => onSelectManzil(manzil.number)}
                  >
                    <span className="item-number">{manzil.number}</span>
                    <span className="item-name">{manzil.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Hizb Tab Content */}
            {activeTab === 'hizb' && (
              <div className="hizb-list">
                {paginatedItems.map(hizb => (
                  <div 
                    key={hizb.number} 
                    className="nav-item hizb-item"
                    onClick={() => onSelectHizb(hizb.number)}
                  >
                    <span className="item-number">{hizb.number}</span>
                    <span className="item-name">{hizb.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Page Tab Content */}
            {activeTab === 'page' && (
              <div className="page-list">
                <div className="page-grid">
                  {paginatedItems.map(page => (
                    <div 
                      key={page.number} 
                      className="page-card"
                      onClick={() => onSelectPage(page.number)}
                    >
                      <div className="page-number">{page.number}</div>
                      <div className="page-label">Page {page.number}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ruku Tab Content */}
            {activeTab === 'ruku' && (
              <div className="ruku-list">
                {paginatedItems.map(ruku => (
                  <div 
                    key={ruku.number} 
                    className="nav-item ruku-item"
                    onClick={() => {/* Handle ruku selection */}}
                  >
                    <span className="item-number">{ruku.number}</span>
                    <span className="item-name">{ruku.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Bottom Pagination */}
            {renderPaginationControls()}
          </div>
        )}
      </div>
      
      {/* Detail Panel */}
      {selectedItemDetail && (
        <div className="item-detail-panel">
          <h3>{selectedItemDetail.title}</h3>
          <div className="detail-content">
            {selectedItemDetail.content}
          </div>
        </div>
      )}
    </div>
  );
}