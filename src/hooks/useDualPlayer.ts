/**
 * useDualPlayer — 双轨播放 hook
 *
 *  AudioEngine (singleton) → playerStore ← useDualPlayer → UI
 */

import { useCallback, useEffect, useRef } from 'react';
import { getAudioEngine, PlaybackMode } from '../services/audio/AudioEngine';
import { usePlayerStore } from '../store/playerStore';

export function useDualPlayer() {
  const engine = useRef(getAudioEngine()).current;
  const store = usePlayerStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    engine.initialize();
    return () => {
      // Don't destroy on unmount — singleton lives for app lifetime
    };
  }, []);

  const loadAndPlay = useCallback(async (
    uriA: string, uriB: string, durA: number, durB: number,
    seekA?: number, seekB?: number,
  ) => {
    store.setDualMode(true);
    store.showMiniPlayer(
      store.miniPlayerSongTitle ?? '采样对比',
      store.miniPlayerArtist ?? ''
    );
    await Promise.all([engine.loadTrackA(uriA), engine.loadTrackB(uriB)]);
    if (seekA !== undefined) await engine.seekA(seekA);
    if (seekB !== undefined) await engine.seekB(seekB);
    await engine.play();
  }, [store, engine]);

  const togglePlayback = useCallback(async () => {
    await engine.toggle();
    const playing = engine.isPlaying();
    // Sync store playing state
    store.updatePositions(store.trackAPosition, store.trackBPosition);
  }, [engine, store]);

  const seek = useCallback(async (track: 'A' | 'B', ms: number) => {
    if (track === 'A') await engine.seekA(ms);
    else await engine.seekB(ms);
  }, [engine]);

  const setVolume = useCallback(async (track: 'A' | 'B', v: number) => {
    if (track === 'A') await engine.setVolumeA(v);
    else await engine.setVolumeB(v);
  }, [engine]);

  return {
    // Actions
    loadAndPlay, togglePlayback, seek, setVolume,

    // Convenience passthrough to store
    setMode: store.setPlaybackMode,
    setOffset: store.setOffset,
    stop: store.reset,
    showMiniPlayer: store.showMiniPlayer,
    hideMiniPlayer: store.hideMiniPlayer,

    // State from store (reactive)
    trackAPosition: store.trackAPosition,
    trackBPosition: store.trackBPosition,
    trackADuration: store.trackADuration,
    trackBDuration: store.trackBDuration,
    isPlaying: store.trackAIsPlaying,
    playbackMode: store.playbackMode,
    offsetMs: store.offsetMs,
    isDualMode: store.isDualMode,
    miniPlayerVisible: store.miniPlayerVisible,
    miniPlayerSongTitle: store.miniPlayerSongTitle,
    miniPlayerArtist: store.miniPlayerArtist,
  };
}
