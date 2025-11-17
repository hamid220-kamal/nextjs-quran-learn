import React, { useState, useEffect } from 'react';
import { 
  FaExpand, 
  FaScroll, 
  FaBookmark,
  FaShare,
  FaImages,
  FaMusic,
  FaInfoCircle
} from 'react-icons/fa';
import styles from './ToggleMenu.module.css';

interface ToggleMenuProps {
  onFullScreen: () => void;
  onScrollViewToggle: () => void;
  onSlideViewToggle: () => void;
  onAudioViewToggle: () => void;
  onIntroductionToggle: () => void;
  onBookmarkToggle: () => void;
  onShareClick: () => void;
  isFullScreen: boolean;
  isScrollView: boolean;
  currentView: 'surah' | 'scroll' | 'slide' | 'audio';
  surahNumber?: number;
  verseNumber?: number;
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({
  onFullScreen,
  onScrollViewToggle,
  onSlideViewToggle,
  onAudioViewToggle,
  onIntroductionToggle,
  onBookmarkToggle,
  onShareClick,
  isFullScreen,
  isScrollView,
  currentView,
  surahNumber = 1,
  verseNumber
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('surahBookmarks');
    if (savedBookmarks) {
      try {
        const parsedData = JSON.parse(savedBookmarks) as string[];
        const parsedBookmarks = new Set<string>(parsedData);
        setBookmarks(parsedBookmarks);
        
        const bookmarkKey = verseNumber 
          ? `${surahNumber}-${verseNumber}` 
          : `${surahNumber}`;
        setIsBookmarked(parsedBookmarks.has(bookmarkKey));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, [surahNumber, verseNumber]);

  const handleBookmarkToggle = () => {
    const bookmarkKey = verseNumber 
      ? `${surahNumber}-${verseNumber}` 
      : `${surahNumber}`;
    
    const newBookmarks = new Set(bookmarks);
    
    if (isBookmarked) {
      newBookmarks.delete(bookmarkKey);
      setIsBookmarked(false);
    } else {
      newBookmarks.add(bookmarkKey);
      setIsBookmarked(true);
    }
    
    setBookmarks(newBookmarks);
    localStorage.setItem('surahBookmarks', JSON.stringify(Array.from(newBookmarks)));
    onBookmarkToggle();
  };

  return (
    <div className={styles.toggleContainer}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        title="Menu"
      >
        ☰
      </button>
      
      {isOpen && (
        <div className={styles.menuContent}>
          <button onClick={onFullScreen} title={isFullScreen ? 'Exit full screen' : 'Enter full screen'}>
            <FaExpand /> {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          
          <button 
            onClick={onScrollViewToggle} 
            title="Toggle scroll view"
            disabled={currentView === 'scroll'}
          >
            <FaScroll /> Scroll View
          </button>
          
          <button 
            onClick={onSlideViewToggle} 
            title="View slides"
            disabled={currentView === 'slide'}
          >
            <FaImages /> Slide View
          </button>

          <button 
            onClick={onAudioViewToggle} 
            title="Play with audio"
            disabled={currentView === 'audio'}
          >
            <FaMusic /> Play with Audio
          </button>

          <button onClick={onIntroductionToggle} title="View introduction">
            <FaInfoCircle /> Introduction
          </button>
          
          <button 
            onClick={handleBookmarkToggle}
            className={isBookmarked ? styles.active : ''}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FaBookmark style={{ color: isBookmarked ? '#FFD700' : 'white' }} /> 
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button onClick={onShareClick} title="Share this page">
            <FaShare /> Share
          </button>
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;