'use client';

import { useState, useContext, useEffect } from 'react';
import StationCard from './components/StationCard';
import StationFeaturedCard from './components/StationFeaturedCard';
import LiveRadioSection from './components/LiveRadioSection';
import stationsData from './data/stations.json';
import { PlayerContext } from './state/PlayerState';
import { loadRadioData } from './lib/loaders';
import { buildPlaylist } from './lib/playlist';
import useAudioPlayer from './hooks/useAudioPlayer';
import { fetchReciters, mapReciterToStation } from './lib/api';
import { fetchRadioStations } from './lib/api/radios';

// Main Page Component
export default function QuranRadioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allStations, setAllStations] = useState<any[]>(stationsData);
  const [filteredStations, setFilteredStations] = useState<any[]>(stationsData);
  const [liveStations, setLiveStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const player = useContext(PlayerContext);
  const { } = useAudioPlayer(); // play is no longer needed here as we use state to drive playback

  // Fetch Reciters and Radios
  useEffect(() => {
    async function loadData() {
      const [reciters, radios] = await Promise.all([
        fetchReciters(),
        fetchRadioStations()
      ]);

      // Process Reciters
      if (reciters.length > 0) {
        const apiStations = reciters.map(mapReciterToStation);
        const localIds = new Set(stationsData.map(s => s.id));
        const newStations = apiStations.filter(s => !localIds.has(s.id));
        const combined = [...stationsData, ...newStations];
        setAllStations(combined);
        setFilteredStations(combined);
      }

      // Process Radios
      if (radios.length > 0) {
        const mappedRadios = radios.map(r => ({
          id: `live-${r.id}`,
          title: r.name,
          subtitle: '24/7 Live Radio',
          tags: ['Live', 'Radio'],
          imageUrl: 'https://img.freepik.com/free-vector/radio-flat-icon_1262-18776.jpg', // Placeholder or generic radio image
          reciters: [],
          type: 'live',
          streamUrl: r.url
        }));
        setLiveStations(mappedRadios);
      }
    }
    loadData();
  }, []);

  // Filter stations based on search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allStations.filter(
      (station) =>
        (station?.title || '').toLowerCase().includes(query) ||
        (station?.subtitle || '').toLowerCase().includes(query) ||
        station?.tags?.some((tag: string) => (tag || '').toLowerCase().includes(query))
    );
    setFilteredStations(filtered);
  }, [searchQuery, allStations]);

  const handlePlayStation = async (e: React.MouseEvent, stationId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!player) return;
    const { actions, state } = player;

    // If already playing this station, toggle play/pause
    if (state.currentStationId === stationId && state.isPlaying) {
      actions.pause();
      return;
    }

    if (state.currentStationId === stationId && !state.isPlaying) {
      actions.play();
      return;
    }

    const station = allStations.find((s) => s.id === stationId);
    if (!station) return;

    try {
      setIsLoading(true);

      let playlist = [];

      if (stationId.startsWith('live-') && station.streamUrl) {
        // Handle Live Stream
        playlist = [{
          surahId: 0,
          reciterId: 0,
          url: station.streamUrl,
          title: station.title
        }];
      } else if (station.reciters && station.reciters.length > 0) {
        // Handle Regular Station
        const reciterId = parseInt(station.reciters[0], 10);
        const data = await loadRadioData(reciterId);
        playlist = buildPlaylist(station, data.audio);
      } else {
        return;
      }

      actions.setPlaylist(playlist);
      actions.setStation(stationId);
      actions.setTrackIndex(0);

      if (playlist.length > 0) {
        // playAudio(playlist[0].url); // Removed to prevent race condition with useEffect
        actions.setIsPlaying(true);
      }

    } catch (error) {
      console.error('Error playing station:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLiveRadio = async (mood: string) => {
    // Pick a random LIVE station if available, otherwise random reciter
    const sourceArray = liveStations.length > 0 ? liveStations : allStations;
    const randomStation = sourceArray[Math.floor(Math.random() * sourceArray.length)];

    if (randomStation) {
      // Just navigate or play? The requirement was to navigate.
      // But here we are simulating a click or action.
      // Since we removed onPlay from cards to allow navigation, 
      // this button might need to programmatically navigate or play.
      // For "Start Live Radio", playing immediately seems appropriate, 
      // OR navigating to that station's page.
      // Let's navigate to the station page.
      window.location.href = `/radio/${randomStation.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">

      {/* Top Section with Teal Background */}
      <div className="bg-[#149493] pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Quran Radio</h1>
            {/* Search Bar */}
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Search reciters..."
                className="w-full rounded-full bg-white/10 border border-white/20 py-2 px-4 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute right-3 top-2.5 h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Live Radio Section */}
          <div className="mb-12">
            <LiveRadioSection onStartRadio={handleStartLiveRadio} />
          </div>

          {/* 24/7 Live Stations Section */}
          {liveStations.length > 0 && (
            <div className="space-y-4 mb-12">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  24/7 Live Radios
                </h2>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {liveStations.map((station) => (
                  <div key={station.id} className="w-[280px] flex-shrink-0">
                    <StationFeaturedCard
                      title={station.title}
                      subtitle={station.subtitle}
                      imageUrl={station.imageUrl}
                      stationId={station.id}
                      isPlaying={player?.state.currentStationId === station.id && player?.state.isPlaying}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Stations Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Curated Stations</h2>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {stationsData.slice(0, 3).map((station) => (
                <div key={station.id} className="w-[300px] flex-shrink-0">
                  <StationFeaturedCard
                    title={station.title}
                    subtitle={station.subtitle}
                    imageUrl={station.imageUrl}
                    stationId={station.id}
                    // onPlay removed to allow navigation
                    isPlaying={player?.state.currentStationId === station.id && player?.state.isPlaying}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area (White Background) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Reciter Stations Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Reciter Stations</h2>

            {/* Mobile Search (Visible only on mobile) */}
            <div className="md:hidden w-full max-w-xs ml-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 py-2 px-4 text-sm focus:outline-none focus:border-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredStations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
              {filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  title={station.title}
                  subtitle={station.subtitle}
                  tags={station.tags}
                  imageUrl={station.imageUrl}
                  stationId={station.id}
                  // onPlay removed to allow navigation
                  isPlaying={player?.state.currentStationId === station.id && player?.state.isPlaying}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">No reciters found matching "{searchQuery}"</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
