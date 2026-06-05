/**
 * AudioEngine — 双轨音频引擎 (Singleton)
 *
 * 直接驱动 playerStore，组件无需关心引擎细节。
 * 60fps 位置轮询 → store.updatePositions()
 */

import { Audio } from 'expo-av';
import { usePlayerStore } from '../../store/playerStore';

export type PlaybackState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error';
export type PlaybackMode = 'linked' | 'independent';

class AudioEngine {
  private soundA: Audio.Sound | null = null;
  private soundB: Audio.Sound | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private _isPlaying = false;

  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,  // 🔑 Continue playing when app is backgrounded
        playsInSilentModeIOS: true,      // Play even when silent switch is on
        shouldDuckAndroid: true,         // Lower volume when other audio plays
        playThroughEarpieceAndroid: false,
      });
    } catch {}
  }

  // ─── Load ──────────────────────────────────────────

  async loadTrackA(uri: string): Promise<number> {
    await this.unloadSound(this.soundA);
    this.soundA = null;
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, volume: 0.8, isLooping: false }
      );
      this.soundA = sound;
      const dur = status.isLoaded ? (status.durationMillis ?? 0) : 0;
      usePlayerStore.getState().setTrackA(uri, dur);
      return dur;
    } catch {
      return 0;
    }
  }

  async loadTrackB(uri: string): Promise<number> {
    await this.unloadSound(this.soundB);
    this.soundB = null;
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, volume: 0.8, isLooping: false }
      );
      this.soundB = sound;
      const dur = status.isLoaded ? (status.durationMillis ?? 0) : 0;
      usePlayerStore.getState().setTrackB(uri, dur);
      return dur;
    } catch {
      return 0;
    }
  }

  // ─── Playback ──────────────────────────────────────

  async play(): Promise<void> {
    try {
      await Promise.all([this.soundA?.playAsync(), this.soundB?.playAsync()]);
      this._isPlaying = true;
      this.startPolling();
    } catch {}
  }

  async pause(): Promise<void> {
    this._isPlaying = false;
    this.stopPolling();
    try {
      await Promise.all([this.soundA?.pauseAsync(), this.soundB?.pauseAsync()]);
    } catch {}
  }

  async toggle(): Promise<void> {
    if (this._isPlaying) await this.pause();
    else await this.play();
  }

  isPlaying(): boolean { return this._isPlaying; }

  // ─── Seek ──────────────────────────────────────────

  async seekA(ms: number): Promise<void> {
    try { await this.soundA?.setPositionAsync(ms); } catch {}
  }

  async seekB(ms: number): Promise<void> {
    try { await this.soundB?.setPositionAsync(ms); } catch {}
  }

  // ─── Volume ────────────────────────────────────────

  async setVolumeA(v: number): Promise<void> {
    try { await this.soundA?.setVolumeAsync(v); } catch {}
  }

  async setVolumeB(v: number): Promise<void> {
    try { await this.soundB?.setVolumeAsync(v); } catch {}
  }

  // ─── Destroy ───────────────────────────────────────

  async destroy(): Promise<void> {
    this.stopPolling();
    await this.unloadSound(this.soundA);
    await this.unloadSound(this.soundB);
    this.soundA = null;
    this.soundB = null;
  }

  // ─── Private ───────────────────────────────────────

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(async () => {
      try {
        const [sa, sb] = await Promise.all([
          this.soundA?.getStatusAsync(),
          this.soundB?.getStatusAsync(),
        ]);
        const posA = (sa?.isLoaded ? sa.positionMillis : 0) ?? 0;
        const posB = (sb?.isLoaded ? sb.positionMillis : 0) ?? 0;
        usePlayerStore.getState().updatePositions(posA, posB);

        if (sa?.isLoaded && sa.didJustFinish && sb?.isLoaded && sb.didJustFinish) {
          this.pause();
        }
      } catch {}
    }, 16); // ~60fps
  }

  private stopPolling(): void {
    if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
  }

  private async unloadSound(sound: Audio.Sound | null): Promise<void> {
    if (!sound) return;
    try { await sound.unloadAsync(); } catch {}
  }
}

// Singleton
let instance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!instance) instance = new AudioEngine();
  return instance;
}
