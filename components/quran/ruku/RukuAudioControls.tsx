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
    <div className="flex items-center gap-4 my-4 justify-center">
      <button
        onClick={onPrev}
        className="btn px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        disabled={currentAyahIndex === 0}
      >
        Previous
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`btn px-4 py-1 rounded ${isPlaying ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'} hover:opacity-90`}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={onNext}
        className="btn px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        disabled={currentAyahIndex === totalAyahs - 1}
      >
        Next
      </button>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={autoPlay}
          onChange={e => setAutoPlay(e.target.checked)}
          className="form-checkbox"
        />
        Auto Play
      </label>
    </div>
  );
};

export default RukuAudioControls;
