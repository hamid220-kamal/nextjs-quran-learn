'use client';

import { useState, useEffect } from 'react';

export interface FavoriteStation {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    addedAt: number;
}

const STORAGE_KEY = 'quran_radio_favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteStation[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Error loading favorites:', e);
            }
        }
    }, []);

    const addFavorite = (station: Omit<FavoriteStation, 'addedAt'>) => {
        const newFavorite = { ...station, addedAt: Date.now() };
        const updated = [newFavorite, ...favorites.filter(f => f.id !== station.id)];
        setFavorites(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const removeFavorite = (stationId: string) => {
        const updated = favorites.filter(f => f.id !== stationId);
        setFavorites(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const isFavorite = (stationId: string) => {
        return favorites.some(f => f.id === stationId);
    };

    const toggleFavorite = (station: Omit<FavoriteStation, 'addedAt'>) => {
        if (isFavorite(station.id)) {
            removeFavorite(station.id);
        } else {
            addFavorite(station);
        }
    };

    return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}

interface FavoriteButtonProps {
    stationId: string;
    station: { title: string; subtitle?: string; imageUrl?: string };
    className?: string;
}

export function FavoriteButton({ stationId, station, className = '' }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(stationId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite({ id: stationId, ...station });
    };

    return (
        <button
            onClick={handleClick}
            className={`group relative p-2 rounded-full transition-all duration-300 ${favorite
                    ? 'bg-pink-500/20 hover:bg-pink-500/30'
                    : 'bg-white/10 hover:bg-white/20'
                } ${className}`}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className={`w-5 h-5 transition-all duration-300 ${favorite ? 'text-pink-500 fill-pink-500' : 'text-white fill-none'
                    }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            {favorite && (
                <span className="absolute inset-0 rounded-full animate-ping bg-pink-500/30"></span>
            )}
        </button>
    );
}
