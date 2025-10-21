"use client";
import React from 'react';
import Link from 'next/link';
import styles from './rukuHeader.module.css';

type Props = {
  rukuNumber: number;
  totalVerses: number;
  sectionText?: string;
  totalPages?: number;
  fromSurah?: string;
  onAutoPlay?: () => void;
  onStopAutoPlay?: () => void;
  isAutoPlaying?: boolean;
};

export default function RukuHeader({
  rukuNumber,
  totalVerses,
  sectionText = 'Section of the Holy Quran',
  totalPages,
  fromSurah,
  onAutoPlay,
  onStopAutoPlay,
  isAutoPlaying = false,
}: Props) {
  return (
    <div className={styles['ruku-header']}>
      <div className={styles['ruku-title-container']}>
        <h1 className={styles['ruku-arabic-title']} dir="rtl">رُكْعَة {rukuNumber}</h1>
        <h2 className={styles['ruku-english-title']}>Ruku {rukuNumber}</h2>
        <p className={styles['ruku-subtitle']}>{sectionText}</p>
      </div>
      <div className={styles['ruku-stats']}>
        <div className={styles['stat-item']}>
          <div className={styles['stat-label']}>Total Verses:</div>
          <div className={styles['stat-value']}>{totalVerses}</div>
        </div>
        <div className={styles['stat-item']}>
          <div className={styles['stat-label']}>Ruku:</div>
          <div className={styles['stat-value']}>{rukuNumber}</div>
        </div>
        {typeof totalPages !== 'undefined' && (
          <div className={styles['stat-item']}>
            <div className={styles['stat-label']}>Total Pages:</div>
            <div className={styles['stat-value']}>{totalPages}</div>
          </div>
        )}
      </div>
      <div className={styles['ruku-actions']}>
        <button
          className={
            styles['auto-play-button'] + (isAutoPlaying ? ' ' + styles['playing'] : '')
          }
          onClick={() => {
            if (isAutoPlaying) {
              onStopAutoPlay && onStopAutoPlay();
            } else {
              onAutoPlay && onAutoPlay();
            }
          }}
          aria-pressed={isAutoPlaying}
        >
          {isAutoPlaying ? 'Stop Auto-Play' : 'Auto-Play Ruku'}
        </button>
        <Link href="/quran" className={styles['back-to-quran-button']}>
          Back to Quran
        </Link>
      </div>
      {fromSurah && (
        <div className={styles['ruku-info']}>
          <p className={styles['ruku-description']}>{fromSurah}</p>
          {/* Optionally add English description if available */}
        </div>
      )}
    </div>
  );
}
