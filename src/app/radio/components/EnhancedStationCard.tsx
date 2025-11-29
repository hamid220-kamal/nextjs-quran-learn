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
        <Link href={`/radio/${stationId}`} className="group block h-full">
            <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full border border-gray-100">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <span className="text-5xl opacity-50">🎙️</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play Button Overlay - Only on Hover */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-black/40 opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                            onClick={handlePlayClick}
                            className="transform scale-90 group-hover:scale-100 transition-all duration-300 rounded-full p-4 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white text-gray-900"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:bg-white transition-colors">
                            <FavoriteButton
                                stationId={stationId}
                                station={{ title, subtitle, imageUrl }}
                            />
                        </div>
                    </div>

                    {/* Playing Indicator */}
                    {isPlaying && (
                        <div className="absolute bottom-3 left-3 z-20">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                                <div className="flex gap-0.5 items-end h-3">
                                    <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-1" />
                                    <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-2" />
                                    <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-3" />
                                </div>
                                <span>Now Playing</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-base group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-gray-500 line-clamp-1 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
