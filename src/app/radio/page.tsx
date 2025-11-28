'use client';

import { useState, useContext, useEffect, useMemo } from 'react';
import EnhancedStationCard from './components/EnhancedStationCard';
import StationFeaturedCard from './components/StationFeaturedCard';
import LiveRadioSection from './components/LiveRadioSection';
import RecentlyPlayed, { addToRecentlyPlayed } from './components/RecentlyPlayed';
import SearchFilters, { SortOption, FilterType } from './components/SearchFilters';
import SleepTimer from './components/SleepTimer';
import VolumeControl from './components/VolumeControl';
import { useFavorites } from './components/FavoritesManager';
import stationsData from './data/stations.json';
import { PlayerContext } from './state/PlayerState';
import { loadRadioData } from './lib/loaders';
import { buildPlaylist } from './lib/playlist';
import useAudioPlayer from './hooks/useAudioPlayer';
import { fetchReciters, mapReciterToStation } from './lib/api';
import { fetchRadioStations } from './lib/api/radios';

// Main Page Component
export default function QuranRadioPage() {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Station States
  const [allStations, setAllStations] = useState<any[]>(stationsData);
  const [liveStations, setLiveStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Audio States
  const [volume, setVolume] = useState(0.7);

  // Category View
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const player = useContext(PlayerContext);
  const { favorites } = useFavorites();
  const { } = useAudioPlayer();

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
      }

      // Process Radios
      if (radios.length > 0) {
        const mappedRadios = radios.map(r => ({
          id: `live-${r.id}`,
          title: r.name,
          subtitle: '24/7 Live Radio',
          tags: ['Live', 'Radio'],
          imageUrl: 'https://img.freepik.com/free-vector/radio-flat-icon_1262-18776.jpg',
          reciters: [],
          type: 'live',
          streamUrl: r.url
        }));
        setLiveStations(mappedRadios);
      }
    }
    loadData();
  }, []);

  // Apply volume to audio element
  useEffect(() => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  // Get all unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    allStations.forEach(station => {
      station.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allStations]);

  // Filter and sort stations
  const filteredStations = useMemo(() => {
    let filtered = [...allStations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (station) =>
          (station?.title || '').toLowerCase().includes(query) ||
          (station?.subtitle || '').toLowerCase().includes(query) ||
          station?.tags?.some((tag: string) => (tag || '').toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filterType === 'live') {
      filtered = filtered.filter(s => s.type === 'live' || s.id.startsWith('live-'));
    } else if (filterType === 'recorded') {
      filtered = filtered.filter(s => s.type !== 'live' && !s.id.startsWith('live-'));
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(station =>
        selectedTags.some(tag => station.tags?.includes(tag))
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'favorites') {
        const favoriteIds = new Set(favorites.map(f => f.id));
        filtered = filtered.filter(s => favoriteIds.has(s.id));
      } else {
        filtered = filtered.filter(s => s.tags?.includes(activeCategory));
      }
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'recent':
        // Recently added would need timestamps - for now just reverse
        filtered.reverse();
        break;
      case 'popular':
        // Would need play counts - for now keep as is
        break;
    }

    return filtered;
  }, [allStations, searchQuery, filterType, selectedTags, sortBy, activeCategory, favorites]);

  const handlePlayStation = async (e: React.MouseEvent, stationId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!player) return;
    const { actions, state } = player;

    // Toggle play/pause
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
          url: station.streamUrl
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
        actions.setIsPlaying(true);

        // Add to recently played
        addToRecentlyPlayed({
          id: stationId,
          title: station.title,
          subtitle: station.subtitle || 'Murattal',
          imageUrl: station.imageUrl || ''
        });
      }

    } catch (error) {
      console.error('Error playing station:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLiveRadio = async () => {
    const sourceArray = liveStations.length > 0 ? liveStations : allStations;
    const randomStation = sourceArray[Math.floor(Math.random() * sourceArray.length)];

    if (randomStation) {
      window.location.href = `/radio/${randomStation.id}`;
    }
  };

  const handleSleepTimeout = () => {
    player?.actions.pause();
  };

  // Category options
  const categories = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', count: favorites.length },
    { id: 'Murattal', label: 'Murattal', icon: '📖' },
    { id: 'Mujawwad', label: 'Mujawwad', icon: '🎵' },
    { id: 'Tajweed', label: 'Tajweed', icon: '📚' },
    { id: 'Live', label: 'Live', icon: '🔴' },
  ];

  return (
    <div className="min-h-screen pb-32 bg-white">
      {/* Top Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header with Controls */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Radio
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {allStations.length} stations available
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-3">
              <VolumeControl volume={volume} onChange={setVolume} />
              <SleepTimer onTimeout={handleSleepTimeout} />
            </div>
          </div>

          {/* Live Radio Section */}
          <div className="mb-4">
            <LiveRadioSection onStartRadio={handleStartLiveRadio} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.label}
              {category.count !== undefined && category.count > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium">
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterType={filterType}
          onFilterChange={setFilterType}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          availableTags={availableTags}
        />

        {/* 24/7 Live Stations */}
        {liveStations.length > 0 && activeCategory === 'all' && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">24/7 Live Radios</h2>

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
          </section>
        )}

        {/* Recently Played */}
        {activeCategory === 'all' && (
          <RecentlyPlayed currentStationId={player?.state.currentStationId} />
        )}

        {/* All Stations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory === 'all' ? 'All Stations' : categories.find(c => c.id === activeCategory)?.label}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredStations.length})
              </span>
            </h2>
          </div>

          {filteredStations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredStations.map((station, index) => (
                <div
                  key={station.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <EnhancedStationCard
                    title={station.title}
                    subtitle={station.subtitle}
                    tags={station.tags}
                    imageUrl={station.imageUrl}
                    stationId={station.id}
                    onPlay={(e) => handlePlayStation(e, station.id)}
                    isPlaying={player?.state.currentStationId === station.id && player?.state.isPlaying}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">No stations found</p>
              <p className="text-gray-500">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
              </p>
            </div>
          )}
        </section>

      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-gray-900 font-semibold">Loading station...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
