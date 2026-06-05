import { create } from 'zustand';

export type PlaybackMode = 'linked' | 'independent';

interface PlayerState {
  // Track A (original sample)
  trackAUrl: string | null;
  trackAPosition: number; // ms
  trackADuration: number;
  trackAIsPlaying: boolean;
  trackAVolume: number;

  // Track B (target song)
  trackBUrl: string | null;
  trackBPosition: number;
  trackBDuration: number;
  trackBIsPlaying: boolean;
  trackBVolume: number;

  // Sync
  playbackMode: PlaybackMode;
  offsetMs: number; // manual offset adjustment

  // Highlight region (sample segment)
  highlightStartMs: number;
  highlightEndMs: number;

  // Global
  isDualMode: boolean;
  miniPlayerVisible: boolean;
  miniPlayerSongTitle: string | null;
  miniPlayerArtist: string | null;

  // Actions
  setTrackA: (url: string, duration: number) => void;
  setTrackB: (url: string, duration: number) => void;
  updatePositions: (a: number, b: number) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  setOffset: (ms: number) => void;
  setHighlight: (start: number, end: number) => void;
  togglePlayback: () => void;
  setDualMode: (v: boolean) => void;
  showMiniPlayer: (title: string, artist: string) => void;
  hideMiniPlayer: () => void;
  reset: () => void;
}

const initialState = {
  trackAUrl: null,
  trackAPosition: 0,
  trackADuration: 0,
  trackAIsPlaying: false,
  trackAVolume: 0.8,
  trackBUrl: null,
  trackBPosition: 0,
  trackBDuration: 0,
  trackBIsPlaying: false,
  trackBVolume: 0.8,
  playbackMode: 'linked' as PlaybackMode,
  offsetMs: 0,
  highlightStartMs: 0,
  highlightEndMs: 0,
  isDualMode: false,
  miniPlayerVisible: false,
  miniPlayerSongTitle: null,
  miniPlayerArtist: null,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  setTrackA: (url, duration) => set({ trackAUrl: url, trackADuration: duration }),
  setTrackB: (url, duration) => set({ trackBUrl: url, trackBDuration: duration }),

  updatePositions: (a, b) => set({ trackAPosition: a, trackBPosition: b }),

  setPlaybackMode: (mode) => set({ playbackMode: mode }),

  setOffset: (ms) => set({ offsetMs: ms }),

  setHighlight: (start, end) => set({ highlightStartMs: start, highlightEndMs: end }),

  togglePlayback: () => {
    const { trackAIsPlaying } = get();
    set({ trackAIsPlaying: !trackAIsPlaying, trackBIsPlaying: !trackAIsPlaying });
  },

  setDualMode: (v) => set({ isDualMode: v }),

  showMiniPlayer: (title, artist) =>
    set({ miniPlayerVisible: true, miniPlayerSongTitle: title, miniPlayerArtist: artist }),

  hideMiniPlayer: () => set({ miniPlayerVisible: false }),

  reset: () => set(initialState),
}));
