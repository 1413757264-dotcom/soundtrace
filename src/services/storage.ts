/**
 * 数据持久化层 — AsyncStorage
 * 搜索历史 / 收藏采样 / 浏览记录 / 设置 / 首次启动
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboarded: '@soundtrace/onboarded',
  searchHistory: '@soundtrace/search_history',
  savedSamples: '@soundtrace/saved_samples',
  savedSongs: '@soundtrace/saved_songs',
  viewHistory: '@soundtrace/view_history',
  settings: '@soundtrace/settings',
  playQueue: '@soundtrace/play_queue',
};

// ─── Generic ─────────────────────────────────────────

async function get<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

async function set(key: string, value: unknown): Promise<void> {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Onboarding ──────────────────────────────────────

export async function hasOnboarded(): Promise<boolean> {
  return get(KEYS.onboarded, false);
}

export async function markOnboarded(): Promise<void> {
  return set(KEYS.onboarded, true);
}

// ─── Search History ──────────────────────────────────

export async function getSearchHistory(): Promise<string[]> {
  return get(KEYS.searchHistory, []);
}

export async function addSearchHistory(query: string): Promise<void> {
  const history = await getSearchHistory();
  const updated = [query, ...history.filter(h => h !== query)].slice(0, 50);
  await set(KEYS.searchHistory, updated);
}

export async function clearSearchHistory(): Promise<void> {
  await set(KEYS.searchHistory, []);
}

// ─── Saved Samples ───────────────────────────────────

export async function getSavedSamples(): Promise<string[]> {
  return get(KEYS.savedSamples, []);
}

export async function toggleSavedSample(sampleId: string): Promise<boolean> {
  const saved = await getSavedSamples();
  const exists = saved.includes(sampleId);
  const updated = exists ? saved.filter(id => id !== sampleId) : [sampleId, ...saved];
  await set(KEYS.savedSamples, updated);
  return !exists; // returns true if now saved
}

export async function isSampleSaved(sampleId: string): Promise<boolean> {
  const saved = await getSavedSamples();
  return saved.includes(sampleId);
}

// ─── View History ────────────────────────────────────

export async function getViewHistory(): Promise<{ songId: string; title: string; artist: string; timestamp: number }[]> {
  return get(KEYS.viewHistory, []);
}

export async function addViewHistory(entry: { songId: string; title: string; artist: string }): Promise<void> {
  const history = await getViewHistory();
  const updated = [{ ...entry, timestamp: Date.now() }, ...history.filter(h => h.songId !== entry.songId)].slice(0, 100);
  await set(KEYS.viewHistory, updated);
}

// ─── Play Queue ──────────────────────────────────────

export async function getPlayQueue(): Promise<string[]> {
  return get(KEYS.playQueue, []);
}

export async function addToPlayQueue(songId: string): Promise<void> {
  const q = await getPlayQueue();
  if (!q.includes(songId)) { q.push(songId); await set(KEYS.playQueue, q); }
}

export async function removeFromPlayQueue(songId: string): Promise<void> {
  const q = (await getPlayQueue()).filter(id => id !== songId);
  await set(KEYS.playQueue, q);
}

export async function clearPlayQueue(): Promise<void> {
  await set(KEYS.playQueue, []);
}

// ─── Settings ────────────────────────────────────────

export interface AppSettings {
  audioQuality: 'low' | 'medium' | 'high';
  autoPlayPreview: boolean;
  theme: 'dark';
  fontSize: 'standard' | 'large';
}

const defaultSettings: AppSettings = {
  audioQuality: 'high',
  autoPlayPreview: true,
  theme: 'dark',
  fontSize: 'standard',
};

export async function getSettings(): Promise<AppSettings> {
  return get(KEYS.settings, defaultSettings);
}

export async function updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await set(KEYS.settings, updated);
  return updated;
}
