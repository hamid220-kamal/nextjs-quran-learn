'use client';

import React, { useState, useContext } from 'react';
import useAudioPlayer from '@/app/radio/hooks/useAudioPlayer';
import { PlayerContext } from '@/app/radio/state/PlayerState';
import { useRadioMetadata } from '@/app/radio/lib/useRadioMetadata';

export default function FullPlayer() {
  const { play, pause, currentTime, duration, seek } = useAudioPlayer();
  const [selectedSpeed, setSelectedSpeed] = useState('1x');
  const [selectedQuality, setSelectedQuality] = useState('High');

  // Get global player state
  const player = useContext(PlayerContext);
  if (!player) return null;

  const { state, actions } = player;
  const { playlist, currentTrackIndex, isPlaying } = state;
  const { nextTrack, prevTrack } = actions;

  // Get metadata for surahs and reciters
  const { surahs, reciters } = useRadioMetadata();

  // Determine current track
  const currentTrack = playlist[currentTrackIndex];

  // Get surah and reciter names
  const surahName = surahs.find(s => s.id === currentTrack?.surahId)?.englishName || `Surah ${currentTrack?.surahId}`;
  const reciterName = reciters.find(r => r.id === currentTrack?.reciterId)?.name || `Reciter ${currentTrack?.reciterId}`;

  // Show fallback if no track is playing
  if (!currentTrack) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="text-lg font-medium">No track playing</p>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack.url);
    }
  };

  const handlePrevious = () => {
    prevTrack();
  };

  const handleNext = () => {
    nextTrack();
  };

  const handleSpeedSelect = (speed: string) => {
    setSelectedSpeed(speed);
    console.log('selected speed:', speed);
  };

  const handleQualitySelect = (quality: string) => {
    const qualityValue = quality === 'High' ? 'high' : 'low';
    actions.setQuality(qualityValue);
    setSelectedQuality(quality);
    console.log('selected quality:', quality);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 md:p-12">
      <div className="flex flex-col items-center space-y-10">
        {/* Cover Image Area with Animation */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <div className="relative w-80 h-80 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow flex items-center justify-center overflow-hidden border border-slate-200">
            <img
              src="/placeholder.jpg"
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-slate-300 text-6xl font-bold" aria-hidden="true">
              ♫
            </span>
          </div>
        </div>

        {/* Track Information */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-slate-900">
            {surahName}
          </h2>
          <p className="text-slate-600 text-lg font-medium">
            {reciterName}
          </p>
        </div>

        {/* Progress Bar / Seek Slider */}
        <div className="w-full max-w-md space-y-3">
          <div className="relative group">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                seek(time);
              }}
              className="w-full accent-emerald-600 cursor-pointer h-2 rounded-lg appearance-none bg-slate-200 hover:bg-slate-300 transition-colors group-hover:accent-emerald-500"
              style={{
                background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${progressPercent}%, rgb(226 232 240) ${progressPercent}%, rgb(226 232 240) 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-600 font-medium">
            <span>{Math.floor(currentTime)}s</span>
            <span>{Math.floor(duration)}s</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-8">
          {/* Previous Button */}
          <button
            className="p-3.5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-900 hover:text-emerald-600 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:scale-95"
            aria-label="Previous track"
            onClick={handlePrevious}
          >
            <span className="text-2xl font-bold">⏮</span>
          </button>

          {/* Play/Pause Button (Large) */}
          <button
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-800 text-white flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 active:scale-95 border border-emerald-400/30"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayPause}
          >
            <span className="text-5xl font-bold ml-0.5">{isPlaying ? '⏸' : '▶'}</span>
          </button>

          {/* Next Button */}
          <button
            className="p-3.5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-900 hover:text-emerald-600 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:scale-95"
            aria-label="Next track"
            onClick={handleNext}
          >
            <span className="text-2xl font-bold">⏭</span>
          </button>
        </div>

        {/* Speed & Quality Selectors - Side by Side */}
        <div className="w-full max-w-md grid grid-cols-2 gap-6">
          {/* Speed Selector */}
          <div className="space-y-3">
            <p className="text-slate-900 text-xs font-bold uppercase text-center tracking-wider">Speed</p>
            <div className="flex gap-2 justify-center">
              {['0.8x', '1x', '1.25x'].map((speed) => (
                <button
                  key={speed}
                  className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${
                    speed === selectedSpeed
                      ? 'bg-emerald-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300 hover:shadow-sm active:scale-95'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
                  aria-label={`Playback speed ${speed}`}
                  onClick={() => handleSpeedSelect(speed)}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selector */}
          <div className="space-y-3">
            <p className="text-slate-900 text-xs font-bold uppercase text-center tracking-wider">Quality</p>
            <div className="flex gap-2 justify-center">
              {['High', 'Low'].map((quality) => (
                <button
                  key={quality}
                  className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${
                    quality === selectedQuality
                      ? 'bg-emerald-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300 hover:shadow-sm active:scale-95'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
                  aria-label={`Audio quality ${quality}`}
                  onClick={() => handleQualitySelect(quality)}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loop & Shuffle Buttons */}
        <div className="flex gap-3 w-full max-w-md">
          <button
            onClick={actions.toggleLoop}
            className={`flex-1 p-3 rounded-xl font-bold transition-all text-sm ${
              state.loop
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300 hover:shadow-sm active:scale-95'
            } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 uppercase text-xs tracking-wider font-semibold`}
            aria-label="Toggle loop mode"
          >
            🔁 Loop
          </button>

          <button
            onClick={actions.toggleShuffle}
            className={`flex-1 p-3 rounded-xl font-bold transition-all text-sm ${
              state.shuffle
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300 hover:shadow-sm active:scale-95'
            } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 uppercase text-xs tracking-wider font-semibold`}
            aria-label="Toggle shuffle mode"
          >
            🔀 Shuffle
          </button>
        </div>

        {/* Close/Minimize Button */}
        <button
          className="w-full max-w-md py-3.5 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold transition-all text-center text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          aria-label="Close full player"
        >
          ↓ Minimize Player
        </button>
      </div>
    </div>
  );
}
