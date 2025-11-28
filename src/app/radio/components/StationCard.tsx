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
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    // Store in localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteStations') || '[]');
    if (isFavorite) {
      const filtered = favorites.filter((id: string) => id !== stationId);
      localStorage.setItem('favoriteStations', JSON.stringify(filtered));
    } else {
      favorites.push(stationId);
      localStorage.setItem('favoriteStations', JSON.stringify(favorites));
    }
  };

  // Check if favorite on mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteStations') || '[]');
    setIsFavorite(favorites.includes(stationId));
  }, [stationId]);

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      className="group cursor-pointer flex flex-col gap-2"
      aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      onClick={onPlay}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-shadow hover:shadow-md">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isFavorite ? 0 : 2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100 group-hover:bg-black/40'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
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

        {/* Now Playing Indicator */}
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

      <div className="flex flex-col px-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{subtitle || 'Murattal'}</p>
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
