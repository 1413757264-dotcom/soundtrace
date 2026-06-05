/**
 * API Client — 音迹 Backend BFF
 *
 * 生产环境: http://localhost:8000 → 替换为实际域名
 * 开发降级: 后端不可用时自动 fallback → mock 数据
 */

const API_BASE = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  error?: { code: string; message: string };
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API] ${endpoint} failed:`, error);
    throw error;
  }
}

// ─── Search ──────────────────────────────────────────

export async function searchTracks(query: string, page = 1, limit = 200, artist?: string) {
  const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
  return request<any[]>(`/search?${params}`);
}

export async function searchAutocomplete(query: string) {
  const params = new URLSearchParams({ q: query });
  return request<any[]>(`/search/autocomplete?${params}`);
}

export async function getTrending() {
  return request<string[]>('/search/trending');
}

// ─── Samples ─────────────────────────────────────────

export async function traceSamples(artist: string, title: string) {
  const params = new URLSearchParams({ artist, title });
  return request<any>(`/samples/trace?${params}`);
}

export async function getUpstreamTrace(artist: string, title: string) {
  const params = new URLSearchParams({ artist, title });
  return request<any[]>(`/samples/upstream?${params}`);
}

export async function getDownstreamTrace(artist: string, title: string) {
  const params = new URLSearchParams({ artist, title });
  return request<any>(`/samples/downstream?${params}`);
}

export async function discoverSamples(genre?: string, yearMin?: number, yearMax?: number) {
  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (yearMin) params.set('year_min', String(yearMin));
  if (yearMax) params.set('year_max', String(yearMax));
  return request<any[]>(`/samples/discover?${params}`);
}

// ─── Graph ───────────────────────────────────────────

export async function getCollaborationGraph(artistId: string, depth = 2) {
  const params = new URLSearchParams({ artist_id: artistId, depth: String(depth) });
  return request<any>(`/graph/collaborations?${params}`);
}

export async function getSampleNetwork(songId: string, depth = 2) {
  const params = new URLSearchParams({ song_id: songId, depth: String(depth) });
  return request<any>(`/graph/sample-network?${params}`);
}

// ─── Audio ───────────────────────────────────────────

export async function recognizeAudio(audioFile: File | Blob) {
  const formData = new FormData();
  formData.append('file', audioFile);
  try {
    const response = await fetch(`${API_BASE}/audio/recognize`, {
      method: 'POST',
      body: formData,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return await response.json();
  } catch (error) {
    console.warn('[API] recognize failed:', error);
    throw error;
  }
}

export async function analyzeAudio(audioFile: File | Blob, songTitle?: string, artistName?: string) {
  const formData = new FormData();
  formData.append('file', audioFile);
  if (songTitle) formData.append('song_title', songTitle);
  if (artistName) formData.append('artist_name', artistName);
  try {
    const response = await fetch(`${API_BASE}/audio/analyze`, {
      method: 'POST',
      body: formData,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return await response.json();
  } catch (error) {
    console.warn('[API] analyze failed:', error);
    throw error;
  }
}

export async function getAnalysisJob(jobId: string) {
  return request<any>(`/audio/jobs/${jobId}`);
}

// ─── Auth ────────────────────────────────────────────

export async function register(username: string, email: string, password: string) {
  const params = new URLSearchParams({ username, email, password });
  return request<any>(`/auth/register?${params}`, { method: 'POST' });
}

export async function login(username: string, password: string) {
  const params = new URLSearchParams({ username, password });
  const result = await request<{ access_token: string }>(
    `/auth/login?${params}`,
    { method: 'POST' },
  );
  if (result.success && result.data?.access_token) {
    setAuthToken(result.data.access_token);
  }
  return result;
}

export async function getMe() {
  return request<any>('/auth/me');
}

// ─── Stats ───────────────────────────────────────────

export async function getStats() {
  const response = await fetch(`${API_BASE.replace('/v1', '')}/health`);
  return response.json();
}

// ─── Health Check ────────────────────────────────────

let backendAvailable = false;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE.replace('/v1', '')}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    backendAvailable = response.ok;
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

export function isBackendAvailable(): boolean {
  return backendAvailable;
}
