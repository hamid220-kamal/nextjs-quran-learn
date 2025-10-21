"use client";
import { useRef, useEffect } from 'react';
import styles from './rukuAyah.module.css';

type Ayah = {
  text: string;
  numberInSurah: number;
  audio: string;
  translation: string;
  number: number;
};

type RukuAyahProps = {
  ayah: Ayah;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const RukuAyah = ({ ayah, index, isPlaying, isCurrent, onPlayPause, audioRef }: RukuAyahProps) => {

  // No need for useEffect: playback is now controlled by parent via ref

  return (
    <div
      id={`ayah-${ayah.number}`}
      className={
        `${styles['ruku-ayah']} ${isCurrent ? styles['active'] : ''} w-full max-w-xl mx-auto mb-6 p-6 rounded-2xl shadow-lg bg-white flex flex-row items-stretch border border-gray-100 transition-all duration-300`
      }
    >
      {/* Left column: number badge and play button */}
      <div className={styles['ruku-left-column']}>
        <span className={styles['ruku-number']}>{ayah.numberInSurah}</span>
        <button
          onClick={onPlayPause}
          className={
            styles['ruku-audio-btn'] + (isCurrent && isPlaying ? ' ' + styles['playing'] : '')
          }
          aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
          aria-pressed={isCurrent && isPlaying}
        >
          {isCurrent && isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9L5 3z" /></svg>
          )}
        </button>
      </div>
      {/* Right column: texts */}
      <div className="flex flex-col justify-center flex-1 px-2 py-2">
        <div className="text-right text-2xl font-arabic text-gray-900 mb-2 leading-relaxed" dir="rtl">
          {ayah.text}
        </div>
        <div className="text-left text-gray-600 text-base leading-relaxed">
          {ayah.translation}
        </div>
      </div>
      {/* Hidden audio element removed; playback is managed by parent */}
    </div>
  );
};

export default RukuAyah;
