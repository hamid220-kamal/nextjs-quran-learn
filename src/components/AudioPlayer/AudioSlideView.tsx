'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioSlideViewProps {
  surahNumber: number;
  onClose: () => void;
}

interface Ayah {
  number: number;
  text: string;
  translation: string;
  audio: string;
}

interface Reciter {
  identifier: string;
  name: string;
  language: string;
}

export default function AudioSlideView({ surahNumber, onClose }: AudioSlideViewProps) {
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(1);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch reciters on mount
  useEffect(() => {
    fetchReciters();
  }, []);

  // Fetch ayah when reciter changes
  useEffect(() => {
    if (selectedReciter) {
      fetchAyah(currentAyahIndex);
    }
  }, [selectedReciter, currentAyahIndex]);

  const fetchReciters = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse');
      const data = await response.json();
      const formattedReciters = data.data.map((reciter: any) => ({
        identifier: reciter.identifier,
        name: reciter.englishName,
        language: reciter.language
      }));
      setReciters(formattedReciters);
    } catch (error) {
      console.error('Error fetching reciters:', error);
    }
  };

  const fetchAyah = async (ayahNumber: number) => {
    try {
      // Fetch Arabic text and audio
      const arabicResponse = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${selectedReciter}`
      );
      const arabicData = await arabicResponse.json();

      // Fetch English translation
      const translationResponse = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`
      );
      const translationData = await translationResponse.json();

      setCurrentAyah({
        number: ayahNumber,
        text: arabicData.data.text,
        translation: translationData.data.text,
        audio: arabicData.data.audio
      });
      setTotalAyahs(arabicData.data.surah.numberOfAyahs);
    } catch (error) {
      console.error('Error fetching ayah:', error);
    }
  };

  const handleReciterSelect = (reciterId: string) => {
    setSelectedReciter(reciterId);
    setCurrentAyahIndex(1);
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    if (currentAyahIndex < totalAyahs) {
      setCurrentAyahIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentAyahIndex < totalAyahs) {
      setCurrentAyahIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentAyahIndex > 1) {
      setCurrentAyahIndex(prev => prev - 1);
    }
  };

  const filteredReciters = reciters.filter(reciter =>
    reciter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="audio-slide-view">
      <div className="content-container">
        <div className="reciter-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reciters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="reciter-search"
            />
          </div>
          <div className="reciters-list">
            {filteredReciters.map((reciter) => (
              <button
                key={reciter.identifier}
                onClick={() => handleReciterSelect(reciter.identifier)}
                className={`reciter-item ${selectedReciter === reciter.identifier ? 'selected' : ''}`}
              >
                {reciter.name} ({reciter.language})
              </button>
            ))}
          </div>
        </div>

        <div className="ayah-display">
          <AnimatePresence mode="wait">
            {currentAyah && (
              <motion.div
                key={currentAyah.number}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="ayah-content"
              >
                <div className="arabic-text">{currentAyah.text}</div>
                <div className="translation-text">{currentAyah.translation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <audio
            ref={audioRef}
            src={currentAyah?.audio}
            onEnded={handleAudioEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="controls">
            <button onClick={handlePrevious} disabled={currentAyahIndex === 1}>
              Previous
            </button>
            <button onClick={togglePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleNext} disabled={currentAyahIndex === totalAyahs}>
              Next
            </button>
          </div>

          <div className="ayah-counter">
            Verse {currentAyahIndex} of {totalAyahs}
          </div>
        </div>
      </div>

      <button onClick={onClose} className="close-button">
        Go back
      </button>

      <style jsx>{`
        .audio-slide-view {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .content-container {
          display: flex;
          flex: 1;
          padding: 20px;
        }

        .reciter-panel {
          width: 300px;
          background: rgba(0, 0, 0, 0.7);
          padding: 20px;
          overflow-y: auto;
        }

        .reciter-search {
          width: 100%;
          padding: 8px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 4px;
        }

        .reciters-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reciter-item {
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.3s;
        }

        .reciter-item:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .reciter-item.selected {
          background: rgba(255, 255, 255, 0.3);
        }

        .ayah-display {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .ayah-content {
          margin-bottom: 40px;
        }

        .arabic-text {
          font-family: 'Scheherazade New', serif;
          font-size: 3rem;
          color: white;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .translation-text {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin-top: 40px;
        }

        .controls button {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.3s;
        }

        .controls button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ayah-counter {
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.3s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}