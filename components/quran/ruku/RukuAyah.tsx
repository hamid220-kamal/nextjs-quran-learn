import { useRef, useEffect } from 'react';

interface RukuAyahProps {
  ayah: {
    text: string;
    numberInSurah: number;
    audio: string;
    translation: string;
    number: number;
  };
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  isCurrent: boolean;
}

const RukuAyah = ({ ayah, isPlaying, onPlay, onPause, isCurrent }: RukuAyahProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isCurrent && isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      audioRef.current && (audioRef.current.currentTime = 0);
    }
  }, [isPlaying, isCurrent]);

  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 my-2 rounded-lg border transition-all duration-200 ${isCurrent ? 'bg-blue-50 border-blue-400 shadow animate-pulse' : 'bg-white border-gray-200'}`}
      id={`ayah-${ayah.number}`}
    >
      <div className="flex-1 text-right rtl font-quran text-2xl md:text-3xl leading-loose" dir="rtl">
        {ayah.text}
      </div>
      <div className="flex-1 text-left ltr text-base md:text-lg text-gray-700" dir="ltr">
        {ayah.translation}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={isPlaying && isCurrent ? onPause : onPlay}
          className={`px-3 py-1 rounded-full ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} focus:outline-none`}
          aria-label={isPlaying && isCurrent ? 'Pause' : 'Play'}
        >
          {isPlaying && isCurrent ? 'Pause' : 'Play'}
        </button>
        <audio ref={audioRef} src={ayah.audio} preload="none" />
      </div>
    </div>
  );
};

export default RukuAyah;
