'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  surahNumber: number;
  verseNumber: number;
  onPlaying?: () => void;
  onPaused?: () => void;
}

export default function AudioPlayer({ surahNumber, verseNumber, onPlaying, onPaused }: AudioPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Generate unique ID for this player
  const playerId = `player-${surahNumber}-${verseNumber}`;
  
  // Create iframe URL with verse parameters
  const iframeUrl = `/audio-players/verse-player.html?surah=${surahNumber}&verse=${verseNumber}`;
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'player-loaded') {
        setIsLoaded(true);
      } else if (event.data === 'player-playing') {
        onPlaying?.();
      } else if (event.data === 'player-paused') {
        onPaused?.();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onPlaying, onPaused]);
  
  return (
    <div className={styles.playerWrapper}>
      <iframe
        ref={iframeRef}
        id={playerId}
        src={iframeUrl}
        className={styles.playerFrame}
        title={`Audio player for surah ${surahNumber} verse ${verseNumber}`}
        allow="autoplay"
        loading="lazy"
      />
    </div>
  );
}