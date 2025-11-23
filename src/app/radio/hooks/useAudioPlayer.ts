import { useRef, useState, useEffect, useContext } from 'react';
import { PlayerContext } from '@/app/radio/state/PlayerState';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Get global player state
  const player = useContext(PlayerContext);
  const setIsPlayingState = player?.actions.setIsPlaying;
  const nextTrack = player?.actions.nextTrack;
  const state = player?.state;

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Update duration when metadata is loaded
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    // Update current time as playback progresses
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Sync play state to global state
    audio.onplay = () => {
      setIsPlaying(true);
      if (setIsPlayingState) setIsPlayingState(true);
    };

    // Sync pause state to global state
    audio.onpause = () => {
      setIsPlaying(false);
      if (setIsPlayingState) setIsPlayingState(false);
    };

    // Auto-play next track when current track ends
    audio.onended = () => {
      // Set playing false in local and global state
      setIsPlaying(false);
      if (player?.actions.setIsPlaying) {
        player.actions.setIsPlaying(false);
      }

      // If loop mode ON and we are at last track → restart from 0
      if (player?.state?.loop) {
        const lastIndex = player.state.playlist.length - 1;
        if (player.state.currentTrackIndex === lastIndex) {
          player.actions.setTrackIndex(0);
          return;
        }
      }

      // Check if there is a next track
      if (player?.state && player.actions.nextTrack &&
        player.state.currentTrackIndex + 1 < player.state.playlist.length) {

        // Move to the next track
        player.actions.nextTrack();
      } else {
        // No next track — stop gracefully
        console.log("End of playlist");
      }
    };

    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [setIsPlayingState, nextTrack]);

  // Watch for track index changes and load the new track
  useEffect(() => {
    if (!state) return;
    const track = state.playlist[state.currentTrackIndex];
    if (track && audioRef.current) {
      // Helper to get quality prefix
      function getQualityPrefix() {
        return state?.quality === "low" ? "64" : "128";
      }

      const bitrate = getQualityPrefix();
      const qualityAdjustedUrl = track.url.replace("/128/", `/${bitrate}/`);

      // Only update src if it's different to avoid reloading
      if (audioRef.current.src !== qualityAdjustedUrl) {
        audioRef.current.src = qualityAdjustedUrl;
      }

      if (state.isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name === 'AbortError') {
              // Ignore AbortError as it means a new play request superseded this one
              console.log('Play request aborted by new request');
            } else {
              console.error('Error playing track:', error);
            }
          });
        }
      }
      // setIsPlaying(true); // This local state update might be redundant if driven by global state, but keeping for safety if logic differs
      // if (setIsPlayingState) setIsPlayingState(true); // Already true in global state if we are here? 
      // Actually, this useEffect runs on currentTrackIndex change. 
      // If we just changed track, we likely want to ensure we are playing if the state says so.
    }
  }, [state?.currentTrackIndex, state?.playlist, state?.quality, state?.isPlaying]); // Added state.isPlaying to dependency to react to play/pause toggles if needed, though usually handled by separate effect or actions. 
  // Wait, the original dependency list was [state?.currentTrackIndex, state?.playlist, state?.quality, setIsPlayingState].
  // If I add state.isPlaying, it might re-trigger on play/pause. 
  // The original logic was: "Watch for track index changes and load the new track".
  // If I just change track, I want to play it.

  // Let's stick to the plan: robust play call.


  // Reload current track when quality changes
  useEffect(() => {
    if (!audioRef.current || !state) return;
    const track = state.playlist[state.currentTrackIndex];
    if (!track) return;

    // Helper to get quality prefix
    function getQualityPrefix() {
      return state?.quality === "low" ? "64" : "128";
    }

    const bitrate = getQualityPrefix();
    const qualityAdjustedUrl = track.url.replace("/128/", `/${bitrate}/`);
    audioRef.current.src = qualityAdjustedUrl;
    audioRef.current.play().catch((error) => {
      console.error('Error playing track:', error);
    });
  }, [state?.quality]);

  // Placeholder functions — with real audio logic
  function play(url: string) {
    if (!audioRef.current) return;
    audioRef.current.src = url;
    audioRef.current.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    setIsPlaying(true);
    if (setIsPlayingState) setIsPlayingState(true);
  }

  function pause() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    if (setIsPlayingState) setIsPlayingState(false);
  }

  function seek(time: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
  };
}

export default useAudioPlayer;
