'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface RecentStation {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    playedAt: number;
}

interface RecentlyPlayedProps {
    currentStationId?: string;
}

export default function RecentlyPlayed({ currentStationId }: RecentlyPlayedProps) {
    const [recentStations, setRecentStations] = useState<RecentStation[]>([]);

    useEffect(() => {
        // Load from local storage
        const stored = localStorage.getItem('recentlyPlayed');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setRecentStations(parsed);
            } catch (error) {
                console.error('Error parsing recently played:', error);
            }
        }
    }, [currentStationId]);

    const clearAll = () => {
        localStorage.removeItem('recentlyPlayed');
        setRecentStations([]);
    };

    if (recentStations.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">🕒</span> Jump Back In
                </h2>
                <button
                    onClick={clearAll}
                    className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                >
                    Clear History
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                {recentStations.map((station) => (
                    <Link
                        key={`${station.id}-${station.playedAt}`}
                        href={`/radio/${station.id}`}
                        className="flex-shrink-0 w-36 snap-start group"
                    >
                        <div className="space-y-2">
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                                <img
                                    src={station.imageUrl}
                                    alt={station.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {station.title}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                    {formatTimestamp(station.playedAt)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Helper function to add a station to recently played (export for use in page)
export function addToRecentlyPlayed(station: Omit<RecentStation, 'playedAt'>) {
    const stored = localStorage.getItem('recentlyPlayed');
    let recent: RecentStation[] = [];

    if (stored) {
        try {
            recent = JSON.parse(stored);
        } catch (error) {
            console.error('Error parsing recently played:', error);
        }
    }

    // Remove if already exists
    recent = recent.filter(s => s.id !== station.id);

    // Add to beginning
    recent.unshift({
        ...station,
        playedAt: Date.now()
    });

    // Keep only last 10
    recent = recent.slice(0, 10);

    localStorage.setItem('recentlyPlayed', JSON.stringify(recent));
}
