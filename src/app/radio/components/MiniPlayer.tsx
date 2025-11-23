'use client';

import React, { useContext } from 'react';
import { PlayerContext } from '@/app/radio/state/PlayerState';
import useAudioPlayer from '@/app/radio/hooks/useAudioPlayer';
import { useRadioMetadata } from '@/app/radio/lib/useRadioMetadata';

export default function MiniPlayer() {
  const player = useContext(PlayerContext);
  const { play, pause, currentTime, duration } = useAudioPlayer();
  const { chapters, reciters } = useRadioMetadata();

  if (!player) return null;
  const { state, actions } = player;
  const { playlist, currentTrackIndex, isPlaying } = state;

  const currentTrack = playlist[currentTrackIndex];

  if (!currentTrack) return null;

  const surahName = chapters.find(c => c.id === currentTrack.surahId)?.name_simple || `Surah ${currentTrack.surahId}`;
  const reciterName = reciters.find(r => r.id === currentTrack.reciterId)?.name || `Reciter ${currentTrack.reciterId}`;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack.url);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100 cursor-pointer group">
        <div
          className="h-full bg-emerald-500 group-hover:bg-emerald-600 transition-colors relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex w-10 h-10 bg-slate-100 rounded-full items-center justify-center text-slate-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{surahName}</h4>
            <p className="text-xs text-slate-500 truncate font-medium">{reciterName}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
            onClick={actions.prevTrack}
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors active:scale-95"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          <button
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
            onClick={actions.nextTrack}
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Extra Controls (Volume/Expand) - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4 flex-1 justify-end">
          <div className="text-xs font-mono text-slate-400">
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}
