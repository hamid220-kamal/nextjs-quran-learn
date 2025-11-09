'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duas } from './data';
import DuaCard from './components/DuaCard';
import styles from './page.module.css';

const categories = [...new Set(duas.map(dua => dua.category))];

export default function DuasPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedDuas, setBookmarkedDuas] = useState<number[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedDuas');
    if (savedBookmarks) {
      setBookmarkedDuas(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage when changed
  useEffect(() => {
    localStorage.setItem('bookmarkedDuas', JSON.stringify(bookmarkedDuas));
  }, [bookmarkedDuas]);

  const toggleBookmark = (duaId: number) => {
    setBookmarkedDuas(prev => 
      prev.includes(duaId) 
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  };

  const filteredDuas = duas.filter(dua => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch = dua.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dua.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookmark = !showBookmarked || bookmarkedDuas.includes(dua.id);
    return matchesCategory && matchesSearch && matchesBookmark;
  });

  return (
    <div className={styles.pageWrapper}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.heroSection}
      >
        <h1>Quranic Duas & Supplications</h1>
        <p>Authentic duas from the Holy Quran with translations and benefits</p>
      </motion.div>

      <div className={styles.contentContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>Categories</h3>
            <button 
              className={`${styles.categoryButton} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Duas
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.bookmarkSection}>
            <h3>Collections</h3>
            <button 
              className={`${styles.bookmarkButton} ${showBookmarked ? styles.active : ''}`}
              onClick={() => setShowBookmarked(!showBookmarked)}
            >
              <i className="fas fa-bookmark"></i>
              Bookmarked Duas ({bookmarkedDuas.length})
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search duas by name or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewButton} ${isGrid ? styles.active : ''}`}
                onClick={() => setIsGrid(true)}
                aria-label="Grid view"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                className={`${styles.viewButton} ${!isGrid ? styles.active : ''}`}
                onClick={() => setIsGrid(false)}
                aria-label="List view"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>

          <AnimatePresence>
            <motion.div 
              className={`${styles.duasContainer} ${isGrid ? styles.gridView : styles.listView}`}
              layout
            >
              {filteredDuas.length > 0 ? (
                filteredDuas.map(dua => (
                  <motion.div
                    key={dua.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DuaCard
                      dua={dua}
                      isBookmarked={bookmarkedDuas.includes(dua.id)}
                      onBookmark={() => toggleBookmark(dua.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <i className="fas fa-search"></i>
                  <h3>No duas found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}