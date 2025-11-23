import { PlayerProvider } from './state/PlayerState';
import MiniPlayer from '@/app/radio/components/MiniPlayer';

export default function RadioLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <MiniPlayer />
      </div>
    </PlayerProvider>
  );
}
