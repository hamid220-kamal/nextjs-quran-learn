'use client';

import { useState, useContext, useEffect, use } from 'react';
import stationsData from '../data/stations.json';
import { loadRadioData } from '@/app/radio/lib/loaders';
import { buildPlaylist } from '@/app/radio/lib/playlist';
import useAudioPlayer from '@/app/radio/hooks/useAudioPlayer';
import { PlayerContext } from '@/app/radio/state/PlayerState';
import { useRadioMetadata } from '@/app/radio/lib/useRadioMetadata';
import { fetchRadioStations } from '@/app/radio/lib/api/radios';

interface StationDetailPageProps {
  params: Promise<{
    stationId: string;
  }>;
}

export default function StationDetail({ params }: StationDetailPageProps) {
  const { stationId } = use(params);
  const [liveStation, setLiveStation] = useState<any>(null);

  // Check if it's a live station
  const isLive = stationId.startsWith('live-');

  const station = isLive ? liveStation : stationsData.find((s) => s.id === stationId);
  const { play, pause, seek, currentTime, duration } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Fetch live station data if needed
  useEffect(() => {
    if (isLive && !liveStation) {
      fetchRadioStations().then(radios => {
        const id = parseInt(stationId.replace('live-', ''), 10);
        const found = radios.find(r => r.id === id);
        if (found) {
          setLiveStation({
            id: stationId,
            title: found.name,
            subtitle: '24/7 Live Radio',
            imageUrl: 'https://img.freepik.com/free-vector/radio-flat-icon_1262-18776.jpg',
            reciters: [],
            streamUrl: found.url
          });
        }
      });
    }
  }, [isLive, stationId, liveStation]);

  // Get global player context
  const player = useContext(PlayerContext);
  const { chapters, reciters } = useRadioMetadata();

  const { state, actions } = player || { state: {}, actions: {} } as any;
  const { isPlaying, currentTrackIndex, playlist } = state;
  const currentTrack = playlist?.[currentTrackIndex];

  // Derive names
  const surahName = currentTrack ? (chapters.find(c => c.id === currentTrack.surahId)?.name_simple || (currentTrack.title || `Surah ${currentTrack.surahId}`)) : station?.title;
  const reciterName = currentTrack ? (reciters.find(r => r.id === currentTrack.reciterId)?.name || `Reciter ${currentTrack.reciterId}`) : (station?.reciters?.length > 0 ? `Reciter ${station?.reciters[0]}` : (station?.subtitle || 'Unknown Reciter'));

  // Auto-play logic
  useEffect(() => {
    if (station && player && !isAutoPlaying) {
      const startStation = async () => {
        // If already playing this station, just ensure it's playing
        if (state.currentStationId === station.id && state.playlist.length > 0) {
          if (!state.isPlaying) actions.play();
          setIsLoading(false);
          setIsAutoPlaying(true);
          return;
        }

        try {
          setIsLoading(true);

          let newPlaylist = [];

          if (isLive && station.streamUrl) {
            // Handle Live Stream
            newPlaylist = [{
              surahId: 0,
              reciterId: 0,
              url: station.streamUrl,
              title: station.title
            }];
          } else {
            // Handle Regular Station
            const reciterId = parseInt(station.reciters[0], 10);
            const data = await loadRadioData(reciterId);
            newPlaylist = buildPlaylist({ ...station, surahs: 'all' } as any, data.audio);
          }

          actions.setPlaylist(newPlaylist);
          actions.setStation(station.id);
          actions.setTrackIndex(0);

          if (newPlaylist.length > 0) {
            play(newPlaylist[0].url);
            actions.setIsPlaying(true);
          }
          setIsAutoPlaying(true);
        } catch (error) {
          console.error('Error auto-playing station:', error);
        } finally {
          setIsLoading(false);
        }
      };
      startStation();
    }
  }, [station, player, isAutoPlaying, isLive]);

  if (!player || !station) return <div className="min-h-screen flex items-center justify-center text-white">Loading Station...</div>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-white">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-3xl scale-110 transition-all duration-1000"
        style={{ backgroundImage: `url(${station.imageUrl || '/placeholder.jpg'})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/60 to-slate-900" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">

        {/* Live Indicator */}
        <div className="mb-8 flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 backdrop-blur-md border border-red-500/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold tracking-widest text-red-100">LIVE RADIO</span>
        </div>

        {/* Album Art / Visualizer Area */}
        <div className="relative mb-10 group">
          <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            {station.imageUrl ? (
              <img
                src={station.imageUrl}
                alt={station.title}
                className={`h-full w-full object-cover transition-transform duration-[20s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <span className="text-4xl">🎵</span>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Audio Visualizer Bars (CSS Animation) */}
          {isPlaying && (
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-teal-400/80"
                  style={{
                    height: '20px',
                    animation: `equalizer 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2 mb-12 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
            {surahName}
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            {reciterName}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/10 text-slate-400 border border-white/5">
              {station.subtitle || 'Murattal'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md space-y-8">
          {/* Progress Bar */}
          <div className="group relative h-1.5 w-full cursor-pointer rounded-full bg-white/10" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seek(percent * duration);
          }}>
            <div
              className="absolute h-full rounded-full bg-teal-500 transition-all group-hover:bg-teal-400"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Main Buttons */}
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => actions.playPrevious()}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>

            <button
              onClick={() => isPlaying ? pause() : play(currentTrack?.url)}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl shadow-teal-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
              ) : isPlaying ? (
                <svg className="h-10 w-10 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg className="h-10 w-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            <button
              onClick={() => actions.playNext()}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes equalizer {
          0%, 100% { height: 10px; }
          50% { height: 30px; }
        }
      `}</style>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
