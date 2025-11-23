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

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      className="group relative flex h-full min-w-[300px] cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md border border-gray-100"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      onClick={onPlay}
    >
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-200">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-200">
            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Play Overlay on Image */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 transition-transform">
            <span className="ml-1 text-xl">{isPlaying ? '⏸' : '▶'}</span>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{subtitle}</p>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-teal-600 transition-colors">
            <span>PLAY</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
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
