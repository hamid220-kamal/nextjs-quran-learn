'use client';

import { useState } from 'react';
import type { Dua } from '../data';
import styles from '../page.module.css';

interface DuaCardProps {
  dua: Dua;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export default function DuaCard({ dua, isBookmarked, onBookmark }: DuaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  return (
    <div className={`${styles.duaCard} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.duaHeader}>
        <h2>{dua.name}</h2>
        <span className={styles.category}>{dua.category}</span>
      </div>
      
      <div className={styles.duaArabic} dir="rtl">
        {dua.arabic}
      </div>
      
      <div className={styles.duaTransliteration}>
        <strong>Transliteration:</strong>
        <p>{dua.transliteration}</p>
      </div>
      
      <div className={styles.duaTranslation}>
        <strong>Translation:</strong>
        <p>{dua.translation}</p>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          {dua.benefits && (
            <div className={styles.benefitsSection}>
              <h3>Benefits</h3>
              <ul>
                {dua.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {dua.occasions && (
            <div className={styles.occasionsSection}>
              <h3>When to Recite</h3>
              <ul>
                {dua.occasions.map((occasion, index) => (
                  <li key={index}>{occasion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.duaFooter}>
        <div className={styles.duaReference}>
          <span>Reference:</span> {dua.reference}
        </div>
        
        <div className={styles.cardActions}>
          <button
            className={`${styles.bookmarkButton} ${isBookmarked ? styles.active : ''}`}
            onClick={onBookmark}
            aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <i className={`fas fa-bookmark${isBookmarked ? '' : '-o'}`}></i>
          </button>

          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
          
          {dua.audioUrl && (
            <button
              className={`${styles.audioButton} ${isAudioPlaying ? styles.playing : ''}`}
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
            >
              <i className={`fas fa-${isAudioPlaying ? 'pause' : 'play'}`}></i>
            </button>
          )}
          
          <button
            className={styles.shareButton}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: dua.name,
                  text: `${dua.arabic}\n\n${dua.translation}\n\nReference: ${dua.reference}`,
                  url: window.location.href,
                });
              }
            }}
            aria-label="Share dua"
          >
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
}