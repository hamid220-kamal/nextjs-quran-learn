'use client';

import React, { useState, useCallback } from 'react';

export type PlaylistTrack = {
  url: string;
  surahId: number;
  reciterId: number;
};

export type PlayerState = {
  isPlaying: boolean;
  currentStationId: string | null;
  currentTrackIndex: number;
  currentTime: number;
  playlist: PlaylistTrack[];
  loop: boolean;
  shuffle: boolean;
  quality: "high" | "low";
};

export type PlayerActions = {
  setStation: (stationId: string) => void;
  play: () => void;
  pause: () => void;
  setTrackIndex: (index: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaylist: (tracks: PlaylistTrack[]) => void;
  setIsPlaying: (value: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setQuality: (q: "high" | "low") => void;
};

type PlayerContextValue = {
  state: PlayerState;
  actions: PlayerActions;
};

export const PlayerContext = React.createContext<PlayerContextValue | null>(null);

interface PlayerProviderProps {
  children: React.ReactNode;
}

// Helper to check if a next track exists
export function hasNextTrack(state: PlayerState): boolean {
  return state.currentTrackIndex + 1 < state.playlist.length;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentStationId: null,
    currentTrackIndex: 0,
    currentTime: 0,
    playlist: [],
    loop: false,
    shuffle: false,
    quality: "high",
  });

  const actions: PlayerActions = {
    setStation: useCallback((stationId: string) => {
      // TODO: implement station selection logic
      setState((prev) => ({
        ...prev,
        currentStationId: stationId,
        currentTrackIndex: 0,
        currentTime: 0,
      }));
    }, []),

    play: useCallback(() => {
      // TODO: implement play logic
      setState((prev) => ({
        ...prev,
        isPlaying: true,
      }));
    }, []),

    pause: useCallback(() => {
      // TODO: implement pause logic
      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
    }, []),

    setTrackIndex: useCallback((index: number) => {
      // TODO: implement track index logic
      setState((prev) => ({
        ...prev,
        currentTrackIndex: index,
        currentTime: 0,
      }));
    }, []),

    setCurrentTime: useCallback((time: number) => {
      // TODO: implement time update logic
      setState((prev) => ({
        ...prev,
        currentTime: time,
      }));
    }, []),

    setPlaylist: useCallback((tracks: PlaylistTrack[]) => {
      setState((prev) => ({
        ...prev,
        playlist: tracks,
        currentTrackIndex: 0,
      }));
    }, []),

    setIsPlaying: useCallback((value: boolean) => {
      setState((prev) => ({
        ...prev,
        isPlaying: value,
      }));
    }, []),

    nextTrack: useCallback(() => {
      setState((prev) => {
        const nextIndex = prev.currentTrackIndex + 1;
        if (!prev.playlist[nextIndex]) return prev; // no next track
        return { ...prev, currentTrackIndex: nextIndex };
      });
    }, []),

    prevTrack: useCallback(() => {
      setState((prev) => {
        const prevIndex = prev.currentTrackIndex - 1;
        if (prevIndex < 0) return prev; // first track already
        return { ...prev, currentTrackIndex: prevIndex };
      });
    }, []),

    toggleLoop: useCallback(() => {
      setState((prev) => ({ ...prev, loop: !prev.loop }));
    }, []),

    toggleShuffle: useCallback(() => {
      setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
    }, []),

    setQuality: useCallback((q: "high" | "low") => {
      setState((prev) => ({ ...prev, quality: q }));
    }, []),
  };

  const value: PlayerContextValue = {
    state,
    actions,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
