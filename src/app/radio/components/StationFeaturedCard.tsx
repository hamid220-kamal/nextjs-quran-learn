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
      className="group relative flex h-full min-w-[280px] cursor-pointer flex-col overflow-hidden rounded-lg bg-white border border-gray-200 transition-all hover:shadow-md"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      onClick={onPlay}
    >
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Live Indicator */}
        {isLiveStation && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
        )}

        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all ${isPlaying ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100 group-hover:bg-black/40'}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
            {isPlaying ? (
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-gray-900 text-white text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Playing
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="relative flex flex-1 flex-col justify-between p-4 bg-white">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{subtitle}</p>
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
