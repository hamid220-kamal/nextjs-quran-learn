'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface StationFeaturedCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  stationId?: string;
  onPlay?: (e: React.MouseEvent) => void;
  isPlaying?: boolean;
}

export default function StationFeaturedCard({
  title,
  subtitle,
  imageUrl,
  stationId,
  onPlay,
  isPlaying = false,
}: StationFeaturedCardProps) {
  const [imgError, setImgError] = useState(false);
  const isLiveStation = stationId?.startsWith('live-');

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      className="group relative flex h-full min-w-[280px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      onClick={onPlay}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
            <svg className="h-16 w-16 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Live Indicator */}
        {isLiveStation && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
        )}

        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
            {isPlaying ? (
              <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
            <div className="flex gap-0.5 items-end h-3">
              <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-1" />
              <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-2" />
              <div className="w-0.5 h-full bg-green-400 rounded-full animate-music-bar-3" />
            </div>
            <span>Now Playing</span>
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="relative flex flex-1 flex-col justify-between p-4 bg-white">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1 font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return stationId ? (
    <Link href={`/radio/${stationId}`} className="block h-full">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
