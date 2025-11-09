import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  navigationMode: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, navigationMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    // Update placeholder based on navigation mode
    const placeholders = {
      surah: 'Search by Surah name or number (e.g., "Al-Fatihah" or "1")',
      juz: 'Search by Juz number (e.g., "Juz 1")',
      manzil: 'Search by Manzil number (e.g., "Manzil 1")',
      hizb: 'Search by Hizb number (e.g., "Hizb 1")',
      page: 'Search by Page number (e.g., "Page 1")',
      ruku: 'Search by Ruku number (e.g., "Ruku 1")'
    };
    setPlaceholder(placeholders[navigationMode as keyof typeof placeholders]);
  }, [navigationMode]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search"
        />
        <span className={styles.searchIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </div>
      <div className={styles.searchHint}>
        {navigationMode === 'surah' && (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;