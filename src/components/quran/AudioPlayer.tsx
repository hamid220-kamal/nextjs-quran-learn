'use client'

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  isLoading?: boolean;
}

export default function AudioPlayer({ audioUrl, isPlaying, onPlay, onPause, isLoading }: AudioPlayerProps) {
  return (
    <div className="audio-controls">
      <button
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={isPlaying ? onPause : onPlay}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="audio-loading" />
        ) : isPlaying ? (
          '⏸️'
        ) : (
          '▶️'
        )}
      </button>
    </div>
  );
}