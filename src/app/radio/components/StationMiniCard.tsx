import React from 'react';
import Link from 'next/link';

interface StationMiniCardProps {
  title: string;
  reciter?: string;
  progress?: number;
  stationId?: string;
}

export default function StationMiniCard({
  title,
  reciter,
  progress = 0,
  stationId,
}: StationMiniCardProps) {
  // Clamp progress between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const cardContent = (
    <div
      role="button"
      tabIndex={0}
      className="min-w-[230px] bg-white border rounded-xl p-3 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition"
      aria-label={`${title}${reciter ? ` by ${reciter}` : ''}`}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
        🎙️
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-gray-900">{title}</div>
        {reciter && <div className="text-xs text-gray-500 truncate">{reciter}</div>}

        <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full"
            style={{ width: `${normalizedProgress}%` }}
          />
        </div>
      </div>
    </div>
  );

  return stationId ? (
    <Link href={`/radio/${stationId}`} className="block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
