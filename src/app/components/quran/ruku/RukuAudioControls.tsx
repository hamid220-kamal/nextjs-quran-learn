"use client";
import React from 'react';

interface RukuAudioControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  autoPlay: boolean;
  setAutoPlay: (val: boolean) => void;
  currentAyahIndex: number;
  totalAyahs: number;
}

const RukuAudioControls = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  autoPlay,
  setAutoPlay,
  currentAyahIndex,
  totalAyahs,
}: RukuAudioControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 my-6 justify-center">
      <button
        onClick={onPrev}
        className={`px-4 py-2 rounded-full shadow bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none`}
        disabled={currentAyahIndex === 0}
      >
        Previous
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`px-6 py-2 rounded-full shadow font-semibold transition focus:outline-none ${isPlaying ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={onNext}
        className={`px-4 py-2 rounded-full shadow bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none`}
        disabled={currentAyahIndex === totalAyahs - 1}
      >
        Next
      </button>
      <label className="flex items-center gap-2 cursor-pointer font-semibold">
        <input
          type="checkbox"
          checked={autoPlay}
          onChange={e => setAutoPlay(e.target.checked)}
          className="form-checkbox accent-green-500"
        />
        <span className="text-green-700">Auto Play</span>
      </label>
    </div>
  );
};

export default RukuAudioControls;
