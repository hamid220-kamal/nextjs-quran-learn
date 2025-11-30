'use client';

import React from 'react';
import Link from 'next/link';

interface Station {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    rating?: number;
    listeners?: number;
}

interface StationRecommendationsProps {
    stations: Station[];
    title?: string;
    subtitle?: string;
    onStationSelect?: (stationId: string) => void;
}

export default function StationRecommendations({
    stations,
    title = '✨ Recommended for You',
    subtitle = 'Based on your listening history',
    onStationSelect,
}: StationRecommendationsProps) {
    if (stations.length === 0) {
        return null;
    }

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.map((station) => (
                    <Link
                        key={station.id}
                        href={`/radio/${station.id}`}
                        onClick={() => onStationSelect?.(station.id)}
                        className="group block"
                    >
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all hover:shadow-lg h-full flex flex-col">
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                {station.imageUrl ? (
                                    <img
                                        src={station.imageUrl}
                                        alt={station.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <span className="text-4xl opacity-40">🎙️</span>
                                    </div>
                                )}

                                {/* Badge */}
                                <div className="absolute top-3 right-3 bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                                    Recommended
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                                        {station.title}
                                    </h3>
                                    {station.subtitle && (
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                            {station.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                                    {station.rating && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">⭐</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {station.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                    {station.listeners && (
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                            <span>👥</span>
                                            <span className="font-medium">
                                                {station.listeners > 1000
                                                    ? `${(station.listeners / 1000).toFixed(1)}k`
                                                    : station.listeners}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
