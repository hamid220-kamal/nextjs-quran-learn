import React, { useState } from 'react';
import Link from 'next/link';

interface StationCardProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  imageUrl?: string;
  stationId?: string;
  onPlay?: (e: React.MouseEvent) => void;
  isPlaying?: boolean;
}

export default function StationCard({
  title,
  subtitle,
  imageUrl,
  stationId,
  onPlay,
  isPlaying = false,
}: StationCardProps) {
  const [imgError, setImgError] = useState(false);

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      className="group cursor-pointer flex flex-col gap-2"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      onClick={onPlay}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}

        {/* Play Overlay - Only visible on hover or when playing */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform">
            <span className="ml-0.5 text-lg">{isPlaying ? '⏸' : '▶'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start">
        <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 leading-tight">{title}</h3>
        <p className="text-[13px] text-gray-500 line-clamp-1 mt-0.5">{subtitle || 'Murattal'}</p>
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
