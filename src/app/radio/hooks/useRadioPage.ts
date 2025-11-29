import { useState, useEffect, useMemo, useContext } from 'react';
import { PlayerContext } from '../state/PlayerState';
import { useFavorites } from '../components/FavoritesManager';
import stationsData from '../data/stations.json';
import { loadRadioData } from '../lib/loaders';
import { buildPlaylist } from '../lib/playlist';
import { fetchReciters, mapReciterToStation } from '../lib/api';
import { fetchRadioStations } from '../lib/api/radios';
import { addToRecentlyPlayed } from '../components/RecentlyPlayed';

export type SortOption = 'name' | 'recent' | 'popular';
export type FilterType = 'all' | 'live' | 'recorded';

export function useRadioPage() {
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Station States
    const [allStations, setAllStations] = useState<any[]>(stationsData);
    const [liveStations, setLiveStations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Audio States
    const [volume, setVolume] = useState(0.7);

    const player = useContext(PlayerContext);
    const { favorites } = useFavorites();

    // Fetch Reciters and Radios
    useEffect(() => {
        async function loadData() {
            try {
                const [reciters, radios] = await Promise.all([
                    fetchReciters(),
                    fetchRadioStations()
                ]);

                // Process Reciters
                if (reciters && reciters.length > 0) {
                    const apiStations = reciters.map(mapReciterToStation);
                    const localIds = new Set(stationsData.map(s => s.id));
                    const newStations = apiStations.filter(s => !localIds.has(s.id));
                    const combined = [...stationsData, ...newStations];
                    setAllStations(combined);
                }

                // Process Radios
                if (radios && radios.length > 0) {
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
            } catch (error) {
                console.error("Failed to load radio data", error);
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
                filtered.reverse();
                break;
            case 'popular':
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

    const handleStartLiveRadio = async (_mode: string) => {
        // Logic to select a random station or specific mood-based station
        // For now, just pick a random one from liveStations or allStations
        const sourceArray = liveStations.length > 0 ? liveStations : allStations;
        const randomStation = sourceArray[Math.floor(Math.random() * sourceArray.length)];

        if (randomStation) {
            // In a real app, we might filter by 'mood' if we had that metadata
            // For now, just redirect or play
            window.location.href = `/radio/${randomStation.id}`;
        }
    };

    return {
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
    };
}
