'use client';

import EnhancedStationCard from './components/EnhancedStationCard';
import StationFeaturedCard from './components/StationFeaturedCard';
import LiveRadioSection from './components/LiveRadioSection';
import RecentlyPlayed from './components/RecentlyPlayed';
import SearchFilters from './components/SearchFilters';
import SleepTimer from './components/SleepTimer';
import VolumeControl from './components/VolumeControl';
import { useRadioPage } from './hooks/useRadioPage';
import useAudioPlayer from './hooks/useAudioPlayer';

// Main Page Component
export default function QuranRadioPage() {
  const {
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    filterType, setFilterType,
    selectedTags, setSelectedTags,
    activeCategory, setActiveCategory,
    allStations,
    liveStations,
    isLoading,
    volume, setVolume,
    player,
    favorites,
    availableTags,
    filteredStations,
    handlePlayStation,
    handleStartLiveRadio
  } = useRadioPage();

  // Initialize audio player hook (for global player state sync if needed)
  useAudioPlayer();

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
    <div className="min-h-screen pb-32 bg-gray-50">
      {/* Top Section - Hero & Controls */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Radio
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                {allStations.length} stations
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-3">
              <VolumeControl volume={volume} onChange={setVolume} />
              <SleepTimer onTimeout={handleSleepTimeout} />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Hero Section */}
        <section>
          <LiveRadioSection onStartRadio={handleStartLiveRadio} />
        </section>

        {/* Categories & Filters */}
        <section className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${activeCategory === category.id
                  ? 'bg-gray-900 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <span className="text-base">{category.icon}</span>
                {category.label}
                {category.count !== undefined && category.count > 0 && (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-bold ml-1">
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>

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
        </section>

        {/* 24/7 Live Stations */}
        {liveStations.length > 0 && activeCategory === 'all' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Live Now
              </h2>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {liveStations.map((station) => (
                <div key={station.id} className="w-[280px] flex-shrink-0">
                  <StationFeaturedCard
                    title={station.title}
                    subtitle={station.subtitle}
                    imageUrl={station.imageUrl || ''}
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
          <RecentlyPlayed currentStationId={player?.state.currentStationId || undefined} />
        )}

        {/* All Stations Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
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
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <EnhancedStationCard
                    title={station.title}
                    subtitle={station.subtitle}
                    tags={station.tags}
                    imageUrl={station.imageUrl || ''}
                    stationId={station.id}
                    onPlay={(e) => handlePlayStation(e, station.id)}
                    isPlaying={player?.state.currentStationId === station.id && player?.state.isPlaying}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-gray-900 font-medium">Loading station...</p>
          </div>
        </div>
      )}
    </div>
  );
}
