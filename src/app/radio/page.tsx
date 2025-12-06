'use client';

// Exact Quran.com Radio page with Backend API Integration
import React, { useState, useRef, useEffect } from 'react';
import { fetchReciters, fetchStations, fetchAudio } from './lib/api';

interface Station {
  id: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
}

interface Reciter {
  id: number;
  name: string;
  arabicName?: string;
  style?: string;
  imageUrl?: string;
  link?: string;
}

// Main Page Component
export default function RadioPageQuranClone() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingReciterId, setPlayingReciterId] = useState<number | null>(null);
  const [playingStationId, setPlayingStationId] = useState<string | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [curatedStations, setCuratedStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadRadioData = async () => {
      try {
        setLoading(true);
        const [recitersData, stationsData] = await Promise.all([
          fetchReciters(),
          fetchStations(),
        ]);

        setReciters(recitersData || []);
        setCuratedStations((stationsData.curatedStations as Station[]) || []);
        setError(null);
      } catch (err) {
        console.error('Error loading radio data:', err);
        setError('Failed to load radio data');
      } finally {
        setLoading(false);
      }
    };

    loadRadioData();
  }, []);

  // Handle reciter play button click
  const handleReciterPlay = async (reciter: Reciter) => {
    try {
      // Fetch audio for first surah (Al-Fatiha - surah 1)
      const audioData = await fetchAudio(reciter.id, 1);
      
      if (audioData.audioUrls && audioData.audioUrls.length > 0 && audioRef.current) {
        // URLs are already from our audio-stream endpoint - use directly
        audioRef.current.src = audioData.audioUrls[0];
        audioRef.current.play();
        setPlayingReciterId(reciter.id);
        setPlayingStationId(null);
        console.log(`Playing ${reciter.name} - ${audioData.surahName}`);
      }
    } catch (error) {
      console.error('Error playing reciter audio:', error);
      setError('Failed to load audio');
    }
  };

  // Handle station play button click
  const handleStationPlay = async (station: Station) => {
    try {
      // Use first reciter (ID 2 - AbdulBaset) as default for stations
      const defaultReciterId = 2;
      
      const audioData = await fetchAudio(defaultReciterId, 1);
      
      if (audioData.audioUrls && audioData.audioUrls.length > 0 && audioRef.current) {
        // URLs are already from our audio-stream endpoint - use directly
        audioRef.current.src = audioData.audioUrls[0];
        audioRef.current.play();
        setPlayingStationId(station.id);
        setPlayingReciterId(null);
        console.log(`Playing ${station.title} - ${audioData.surahName}`);
      }
    } catch (error) {
      console.error('Error playing station audio:', error);
      setError('Failed to load audio');
    }
  };

  // Stop audio
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingReciterId(null);
    setPlayingStationId(null);
  };

  return (
    <div className="w-full bg-white">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} crossOrigin="anonymous" />
      
      <style suppressHydrationWarning>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="w-full bg-gradient-to-r from-teal-500 to-teal-600 py-10 px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-teal-700 rounded w-32 mb-4"></div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-teal-700 rounded w-64"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Curated Stations Section - EXACT QURAN.COM FULL WIDTH */}
          <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-10 px-0">
            <div className="w-full">
              <h2 className="text-white font-bold mb-4 px-4 sm:px-6 md:px-8 lg:px-12" style={{ fontSize: '18px' }}>Curated Stations</h2>

              {/* Horizontal Scroll - Responsive Grid Layout with generous spacing */}
              <div className="flex gap-8 sm:gap-10 md:gap-12 overflow-x-auto hide-scrollbar px-4 sm:px-6 md:px-8 lg:px-12 pb-4">
                {curatedStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => {
                      if (playingStationId === station.id) {
                        handleStop();
                      } else {
                        handleStationPlay(station);
                      }
                    }}
                    className="group cursor-pointer flex-shrink-0 transition-all duration-300 px-3 focus:outline-none"
                    style={{ width: 'calc(25% - 9px)', minWidth: '250px', maxWidth: '310px' }}
                    title={`Click to ${playingStationId === station.id ? 'stop' : 'play'} ${station.title}`}
                  >
                    {/* Card Container */}
                    <div className="flex flex-col overflow-hidden rounded-lg bg-white hover:shadow-lg transition-shadow h-full">
                      {/* Image Container - Responsive Height */}
                      <div className="relative overflow-hidden bg-gray-300 rounded-t-lg" style={{ paddingBottom: '56.25%' }}>
                        <img
                          src={station.image}
                          alt={station.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          title={station.title}
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                          <svg className={`w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity ${playingStationId === station.id ? 'opacity-100' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                            {playingStationId === station.id ? (
                              <>
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </>
                            ) : (
                              <path d="M8 5v14l11-7z" />
                            )}
                          </svg>
                        </div>
                      </div>
                      
                      {/* Title and Description */}
                      <div className="bg-white p-3 flex flex-col flex-grow">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{station.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-1 flex items-center">
                          {station.description}
                          <svg className="w-4 h-4 ml-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Reciter Stations Section - EXACT QURAN.COM GRID */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 mt-12">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-8">Reciter Stations</h2>

              {/* Grid of Reciter Stations - Compact sizing with generous spacing */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-12 sm:gap-14 md:gap-16 lg:gap-20">
                {reciters.map((reciter) => (
                  <div
                    key={reciter.id}
                    className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 px-2 sm:px-3"
                  >
                    {/* Play Button Container */}
                    <button
                      onClick={() => {
                        if (playingReciterId === reciter.id) {
                          handleStop();
                        } else {
                          handleReciterPlay(reciter);
                        }
                      }}
                      className="relative w-full aspect-square mb-3 rounded-sm overflow-hidden bg-gray-200 shadow-xs hover:shadow-sm transition-all duration-300 group flex items-center justify-center focus:outline-none"
                      title={`Click to ${playingReciterId === reciter.id ? 'stop' : 'play'} ${reciter.name}`}
                    >
                      <img
                        src={reciter.imageUrl}
                        alt={reciter.name}
                        className="w-full h-full object-cover absolute inset-0"
                        loading="lazy"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                        <svg className={`w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity ${playingReciterId === reciter.id ? 'opacity-100' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                          {playingReciterId === reciter.id ? (
                            <>
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </>
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </div>
                    </button>
                    
                    {/* Name and Type */}
                    <h3 className="text-xs font-medium text-gray-900 line-clamp-2 text-center">
                      {reciter.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 text-center">{reciter.style}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
