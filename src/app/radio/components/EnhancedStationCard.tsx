'use client';

import Link from 'next/link';
import { FavoriteButton } from './FavoritesManager';

interface EnhancedStationCardProps {
    title: string;
    subtitle?: string;
    tags?: string[];
    imageUrl?: string;
    stationId: string;
    isPlaying?: boolean;
    onPlay?: (e: React.MouseEvent) => void;
}

export default function EnhancedStationCard({
    title,
    subtitle,
    imageUrl,
    stationId,
    isPlaying = false,
    onPlay,
}: EnhancedStationCardProps) {
    const handlePlayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onPlay?.(e);
    };

    return (
        <Link href={`/radio/${stationId}`} className="group block">
            <div className="relative bg-white rounded-lg overflow-hidden transition-all hover:shadow-md">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            🎙️
                        </div>
                    )}

                    {/* Play Button Overlay - Only on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <button
                            onClick={handlePlayClick}
                            className="transform scale-0 group-hover:scale-100 transition-transform duration-200 rounded-full p-3 bg-white shadow-lg"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Favorite Button - Only on Hover */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FavoriteButton
                            stationId={stationId}
                            station={{ title, subtitle, imageUrl }}
                        />
                    </div>

                    {/* Playing Indicator - Always Visible When Playing */}
                    {isPlaying && (
                        <div className="absolute top-2 left-2 z-20">
                            <div className="flex items-center gap-1.5 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium">
                                <div className="flex gap-0.5 items-end">
                                    <div className="w-0.5 h-2 bg-white rounded-full animate-music-bar-1" />
                                    <div className="w-0.5 h-3 bg-white rounded-full animate-music-bar-2" />
                                    <div className="w-0.5 h-2 bg-white rounded-full animate-music-bar-3" />
                                </div>
                                <span>Playing</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-1">{subtitle}</p>
                    )}

                    {/* Tags - Removed to match quran.com minimal design */}
                </div>
            </div>
        </Link>
    );
}
