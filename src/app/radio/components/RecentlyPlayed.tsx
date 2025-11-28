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
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    Recently Played
                </h2>
                <button
                    onClick={clearAll}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                {recentStations.map((station, index) => (
                    <Link
                        key={`${station.id}-${station.playedAt}`}
                        href={`/radio/${station.id}`}
                        className="flex-shrink-0 w-40 snap-start stagger-item"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="group cursor-pointer">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-shadow hover:shadow-md">
                                <img
                                    src={station.imageUrl}
                                    alt={station.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                                <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{station.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{station.subtitle}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
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
