import { useState, useRef } from 'react';
import styles from './QuranVerseCard.module.css';

interface QuranVerseCardProps {
  verseNumber: number;
  arabicText: string;
  translation: string;
  audioUrl: string;
}

export default function QuranVerseCard({
  verseNumber,
  arabicText,
  translation,
  audioUrl
}: QuranVerseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.verseCard}>
      <div className={styles.verseHeader}>
        <div className={styles.verseNumber}>{verseNumber}</div>
        <button
          onClick={handlePlayPause}
          className={styles.audioButton}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className={styles.verseContent}>
        <p className={styles.arabicText} dir="rtl">
          {arabicText}
        </p>
        <p className={styles.translation}>
          {translation}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnd}
        style={{ display: 'none' }}
      />
    </div>
  );
}