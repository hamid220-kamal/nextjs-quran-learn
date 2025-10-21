'use client';

import { useState, useEffect } from 'react';
import { getJuzData, getJuzWithTranslation } from '../../utils/enhancedJuzFetcher';
import getJuzAudioPlayer, { RECITERS } from '../../utils/juzAudioPlayer';

/**
 * JuzDataDemo Component
 * 
 * This is a demo component that shows how to use the enhanced Juz fetcher functions.
 * It demonstrates fetching juz data with translations, displaying metadata,
 * and playing juz audio.
 */
export default function JuzDataDemo() {
  // State for juz selection and data
  const [juzNumber, setJuzNumber] = useState<number>(1);
  const [edition, setEdition] = useState<string>('en.asad'); // Default to English - Muhammad Asad
  const [juzData, setJuzData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for audio player
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentReciter, setCurrentReciter] = useState<string>(RECITERS.ALAFASY);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Initialize audio player
  const audioPlayer = getJuzAudioPlayer(currentReciter);
  
  // Fetch juz data when parameters change
  useEffect(() => {
    async function loadJuzData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch juz data with translation and metadata
        const data = await getJuzWithTranslation(juzNumber, edition, { includeMetadata: true });
        setJuzData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch juz data');
      } finally {
        setLoading(false);
      }
    }
    
    loadJuzData();
  }, [juzNumber, edition]);
  
  // Setup audio player event listeners
  useEffect(() => {
    audioPlayer.onPlay(() => {
      setIsPlaying(true);
    });
    
    audioPlayer.onPause(() => {
      setIsPlaying(false);
    });
    
    audioPlayer.onEnd(() => {
      setIsPlaying(false);
    });
    
    audioPlayer.onError((error) => {
      setAudioError(error);
      setIsPlaying(false);
    });
    
    // Cleanup on unmount
    return () => {
      audioPlayer.cleanup();
    };
  }, [audioPlayer]);
  
  // Handle playing juz audio
  const playJuzAudio = async () => {
    try {
      setAudioError(null);
      await audioPlayer.playJuz(juzNumber);
    } catch (err: any) {
      setAudioError(err.message || 'Failed to play juz audio');
    }
  };
  
  // Handle playing a specific verse
  const playVerseAudio = async (surahNumber: number, ayahNumber: number) => {
    try {
      setAudioError(null);
      await audioPlayer.playVerse(juzNumber, surahNumber, ayahNumber);
    } catch (err: any) {
      setAudioError(err.message || 'Failed to play verse audio');
    }
  };
  
  // Handle audio playback toggle
  const toggleAudio = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      playJuzAudio();
    }
  };
  
  // Change reciter
  const handleReciterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReciter = event.target.value;
    setCurrentReciter(newReciter);
    audioPlayer.setReciter(newReciter);
  };
  
  return (
    <div className="juz-data-demo">
      <h1>Juz Data Demo</h1>
      
      {/* Juz selection controls */}
      <div className="juz-controls">
        <div className="control-group">
          <label htmlFor="juz-select">Select Juz:</label>
          <select 
            id="juz-select"
            value={juzNumber}
            onChange={(e) => setJuzNumber(parseInt(e.target.value))}
          >
            {Array.from({length: 30}, (_, i) => (
              <option key={i+1} value={i+1}>Juz {i+1}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="edition-select">Translation:</label>
          <select 
            id="edition-select"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
          >
            <option value="en.asad">English - Muhammad Asad</option>
            <option value="en.sahih">English - Sahih International</option>
            <option value="en.pickthall">English - Pickthall</option>
            <option value="fr.hamidullah">French - Hamidullah</option>
            <option value="ur.jalandhry">Urdu - Jalandhry</option>
          </select>
        </div>
      </div>
      
      {/* Audio controls */}
      <div className="audio-controls">
        <div className="control-group">
          <label htmlFor="reciter-select">Reciter:</label>
          <select 
            id="reciter-select"
            value={currentReciter}
            onChange={handleReciterChange}
          >
            <option value={RECITERS.ALAFASY}>Mishary Alafasy</option>
            <option value={RECITERS.MINSHAWI}>Mohamed Minshawi</option>
            <option value={RECITERS.HUSARY}>Mahmoud Khalil Al-Husary</option>
            <option value={RECITERS.SUDAIS}>Abdurrahman As-Sudais</option>
            <option value={RECITERS.MUAIQLY}>Abdullah Al-Muaiqly</option>
          </select>
        </div>
        
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={toggleAudio}
          disabled={loading || !juzData}
        >
          {isPlaying ? 'Pause' : 'Play'} Juz {juzNumber}
        </button>
        
        {audioError && <p className="error-message">{audioError}</p>}
      </div>
      
      {/* Loading and error states */}
      {loading && <p className="loading-message">Loading juz data...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {/* Juz metadata display */}
      {juzData && juzData.metadata && (
        <div className="juz-metadata">
          <h2>Juz {juzData.juzNumber} Metadata</h2>
          <p><strong>Verses:</strong> {juzData.metadata.totalVerses}</p>
          <p><strong>First verse:</strong> {juzData.metadata.firstVerseKey}</p>
          <p><strong>Last verse:</strong> {juzData.metadata.lastVerseKey}</p>
          
          <h3>Surahs in this Juz:</h3>
          <ul className="surah-list">
            {juzData.metadata.surahs.map((surah) => (
              <li key={surah.number}>
                <strong>{surah.englishName}</strong> ({surah.name})
                - Verses {surah.firstVerse} to {surah.lastVerse}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Juz content display */}
      {juzData && juzData.ayahs && (
        <div className="juz-content">
          <h2>Juz {juzData.juzNumber} Content</h2>
          
          {juzData.ayahs.map((ayah, index) => (
            <div key={`${ayah.surah.number}-${ayah.numberInSurah}`} className="verse-container">
              {/* Show surah name at the beginning of each surah */}
              {(index === 0 || juzData.ayahs[index-1].surah.number !== ayah.surah.number) && (
                <div className="surah-header">
                  <h3>{ayah.surah.englishName} ({ayah.surah.name})</h3>
                  <p>{ayah.surah.englishNameTranslation}</p>
                </div>
              )}
              
              <div className="verse">
                <div className="verse-number">
                  <span>{ayah.numberInSurah}</span>
                  <button 
                    className="play-verse-btn"
                    onClick={() => playVerseAudio(ayah.surah.number, ayah.numberInSurah)}
                    title="Play this verse"
                  >
                    ▶
                  </button>
                </div>
                
                <div className="verse-text">
                  {/* Arabic text */}
                  <p className="arabic">{ayah.text}</p>
                  
                  {/* Translation */}
                  {ayah.translation && (
                    <p className="translation">{ayah.translation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .juz-data-demo {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .juz-controls, .audio-controls {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        select, button {
          padding: 8px 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        
        button {
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #45a049;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .playing {
          background-color: #f44336;
        }
        
        .loading-message, .error-message {
          padding: 10px;
          border-radius: 4px;
        }
        
        .loading-message {
          background-color: #e3f2fd;
          color: #0d47a1;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .juz-metadata {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          border-left: 4px solid #2196F3;
        }
        
        .surah-list {
          list-style-type: none;
          padding-left: 0;
        }
        
        .surah-list li {
          margin-bottom: 8px;
        }
        
        .juz-content {
          margin-top: 30px;
        }
        
        .surah-header {
          margin-top: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .verse-container {
          margin-bottom: 15px;
        }
        
        .verse {
          display: flex;
          gap: 15px;
        }
        
        .verse-number {
          min-width: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .play-verse-btn {
          padding: 2px 6px;
          font-size: 0.8rem;
          margin-top: 5px;
          background-color: #2196F3;
        }
        
        .verse-text {
          flex: 1;
        }
        
        .arabic {
          font-size: 1.5rem;
          margin-bottom: 10px;
          direction: rtl;
          line-height: 1.8;
        }
        
        .translation {
          color: #555;
        }
      `}</style>
    </div>
  );
}