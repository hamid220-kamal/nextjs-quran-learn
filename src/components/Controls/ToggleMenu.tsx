import React, { useState } from 'react';
import { 
  FaExpand, 
  FaScroll, 
  FaBookmark, 
  FaMicrophone,
  FaLanguage,
  FaAdjust,
  FaShare
} from 'react-icons/fa';
import styles from './ToggleMenu.module.css';

interface ToggleMenuProps {
  onFullScreen: () => void;
  onScrollViewToggle: () => void;
  onBookmarkToggle: () => void;
  onShareClick: () => void;
  isFullScreen: boolean;
  isScrollView: boolean;
  currentView: 'surah' | 'scroll' | 'slide' | 'audio';
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({
  onFullScreen,
  onScrollViewToggle,
  onBookmarkToggle,
  onShareClick,
  isFullScreen,
  isScrollView,
  currentView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(5);

  const handleBlurChange = (value: number) => {
    setBackgroundBlur(value);
    // Update background blur in the parent component
    document.documentElement.style.setProperty('--background-blur', `${value}px`);
  };

  return (
    <div className={styles.toggleContainer}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>
      
      {isOpen && (
        <div className={styles.menuContent}>
          <button onClick={onFullScreen}>
            <FaExpand /> {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          
          {currentView !== 'audio' && (
            <button onClick={onScrollViewToggle}>
              <FaScroll /> {isScrollView ? 'Single View' : 'Scroll View'}
            </button>
          )}
          
          <button onClick={onBookmarkToggle}>
            <FaBookmark /> Bookmarks
          </button>

          <div className={styles.backgroundControl}>
            <div className={styles.controlLabel}>
              <FaAdjust /> Background Blur
            </div>
            <input 
              type="range"
              min="0"
              max="10"
              value={backgroundBlur}
              onChange={(e) => handleBlurChange(Number(e.target.value))}
              className={styles.rangeInput}
            />
          </div>

          <button onClick={onShareClick}>
            <FaShare /> Share
          </button>
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;