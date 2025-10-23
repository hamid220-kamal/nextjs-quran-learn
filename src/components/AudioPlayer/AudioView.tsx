import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchReciters, getReciterSurahDuration, type ReciterWithMetadata } from '../../utils/quranAPI';
import './AudioView.css';

interface AudioViewProps {
  surahNumber: number;
  surahName: string;
  backgroundImage: string;
  onClose: () => void;
}

interface ReciterDisplay extends ReciterWithMetadata {
  id: string;
  duration?: number;
}

export default function AudioView({ surahNumber, surahName, backgroundImage, onClose }: AudioViewProps) {
  const [reciters, setReciters] = useState<ReciterDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReciters = async () => {
      try {
        setLoading(true);
        const fetchedReciters = await fetchReciters();
        
        // Get durations for each reciter in parallel
        const recitersWithDurations = await Promise.all(
          fetchedReciters.map(async (reciter) => {
            try {
              const duration = await getReciterSurahDuration(surahNumber, reciter.identifier);
              return {
                ...reciter,
                id: reciter.identifier,
                duration
              };
            } catch (err) {
              console.error(`Error fetching duration for ${reciter.identifier}:`, err);
              return {
                ...reciter,
                id: reciter.identifier,
                duration: undefined
              };
            }
          })
        );

        setReciters(recitersWithDurations);
      } catch (err) {
        setError('Failed to load reciters');
        console.error('Error loading reciters:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReciters();
  }, [surahNumber]);

  const filteredReciters = reciters.filter(reciter =>
    reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <motion.div 
      className="audio-view-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
      }}
    >
      {/* Top Bar */}
      <div className="top-bar" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="surah-info" style={{ color: 'white' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            <span>quranplayer</span> | <span>{surahName}</span>
          </Link>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Go back</span> →
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Panel - Recitations */}
        <div className="recitations-panel">
          <div className="recitations-header">
            <h3>
              <span className="recitation-icon">🎤</span> 
              Recitations
            </h3>
            <div className="search-container">
              <input 
                type="search" 
                placeholder="Search"
                className="reciter-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="reciters-list">
            {loading ? (
              <div className="loading-state">Loading reciters...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredReciters.map((reciter) => (
              <div key={reciter.id} className="reciter-card">
                <div className="reciter-info">
                  <div className="reciter-name">{reciter.englishName}</div>
                  <div className="reciter-details">
                    <span className="reciter-native-name">{reciter.name}</span>
                    <span className="reciter-language">{reciter.languageNative}</span>
                    {reciter.duration && (
                      <span className="reciter-duration">
                        {Math.floor(reciter.duration / 60)}:{String(reciter.duration % 60).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="reciter-number">
                  <span className="number-label">{reciter.language.toUpperCase()}</span>
                  <span className="number-value">{reciter.identifier.split('.')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Verse Display */}
        <div className="verse-display" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          {/* Verse content will be displayed here */}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="audio-controls" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button className="control-btn">Previous</button>
        <button className="control-btn">Play</button>
        <button className="control-btn">Next</button>
      </div>
    </motion.div>
  );
}