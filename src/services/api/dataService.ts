/**
 * Data Service — API-first with mock fallback
 *
 * 策略: 先调后端 → 失败/超时 → 降级到 mock 数据
 * 确保用户永远有数据可看，不会白屏
 */

import * as api from './client';
import {
  searchSongs as mockSearch,
  getSongWithSamples as mockGetSong,
  getGraphData as mockGetGraph,
  getSongRecommendations as mockGetRecs,
  getSampleDownstream as mockGetDownstream,
  getUpstreamTrace as mockGetUpstream,
  mockTrendingSearches,
  mockSongs,
  mockSamples,
} from './mockData';
import type { Song, Sample, RecommendationsData, GraphData, DownstreamUsage, UpstreamTrace } from '../../types/entities';

const API_TIMEOUT = 3000;

// ─── Search ──────────────────────────────────────────

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const result = await api.searchTracks(query);
    if (result.success && result.data?.length > 0) {
      return result.data.map(mapTrackToSong);
    }
  } catch {}
  // Fallback to mock
  return mockSearch(query);
}

export async function searchAutocomplete(query: string): Promise<any[]> {
  try {
    const result = await api.searchAutocomplete(query);
    if (result.success) return result.data;
  } catch {}
  return [];
}

export async function getTrending(): Promise<string[]> {
  try {
    const result = await api.getTrending();
    if (result.success) return result.data;
  } catch {}
  return mockTrendingSearches;
}

// ─── Song Detail ─────────────────────────────────────

export async function getSongDetail(songId: string): Promise<{ song: Song; samples: Sample[] } | null> {
  // Try backend first for real data
  const song = mockSongs.find(s => s.id === songId);
  if (!song) return null;

  try {
    const result = await api.traceSamples(song.primaryArtist.name, song.title);
    if (result.success && result.data) {
      // Merge backend data with local song info
      return {
        song,
        samples: mapBackendSamplesToLocal(result.data.samples_used || [], songId, song.title),
      };
    }
  } catch {}

  // Fallback
  return mockGetSong(songId);
}

// ─── Graph ───────────────────────────────────────────

export async function getGraph(songId: string): Promise<GraphData> {
  try {
    const song = mockSongs.find(s => s.id === songId);
    if (song) {
      const result = await api.getCollaborationGraph(song.primaryArtist.id);
      if (result.success && result.data?.nodes?.length > 0) {
        return result.data;
      }
    }
  } catch {}
  return mockGetGraph(songId);
}

// ─── Recommendations ─────────────────────────────────

export async function getRecommendations(songId: string): Promise<RecommendationsData> {
  // For now, use mock recommendations (Spotify-based recs need ML pipeline)
  return mockGetRecs(songId);
}

// ─── Samples ─────────────────────────────────────────

export async function getSampleDetail(sampleId: string): Promise<DownstreamUsage | null> {
  try {
    const sample = mockSamples.find(s => s.id === sampleId);
    if (sample) {
      const result = await api.getDownstreamTrace(
        sample.sourceArtist.name,
        sample.sourceSongTitle,
      );
      if (result.success) {
        return {
          sample,
          songs: Object.values(result.data || {}).flat().slice(0, 20).map(mapBackendTrackToSong),
          totalCount: Object.values(result.data || {}).flat().length,
        };
      }
    }
  } catch {}
  return mockGetDownstream(sampleId);
}

export async function getUpstream(sampleId: string): Promise<UpstreamTrace | null> {
  return mockGetUpstream(sampleId);
}

// ─── Discover ────────────────────────────────────────

export async function getDiscoverSamples(genre?: string): Promise<any[]> {
  try {
    const result = await api.discoverSamples(genre);
    if (result.success) return result.data;
  } catch {}
  return [];
}

// ─── Mappers ─────────────────────────────────────────

function mapTrackToSong(track: any): Song {
  return {
    id: track.spotify_id || track.itunes_id || `track-${Date.now()}`,
    title: track.title || '',
    primaryArtist: {
      id: track.primary_artist_spotify_id || track.primary_artist_itunes_id || '',
      name: track.primary_artist_name || '',
      imageUrl: track.cover_art_url,
      genres: [],
      externalIds: {
        spotifyId: track.primary_artist_spotify_id,
        musicBrainzId: track.primary_artist_itunes_id,
      },
    },
    featuredArtists: (track.featured_artists || []).map((a: any) => ({
      id: a.spotify_id || '', name: a.name, imageUrl: null, genres: [], externalIds: {},
    })),
    albumTitle: track.album_title || null,
    releaseYear: track.release_year || 0,
    releaseDate: null,
    durationMs: track.duration_ms || 0,
    bpm: track.bpm || 0,
    key: track.key_signature || '',
    genre: 'hip_hop',
    subGenre: 'boom_bap',
    coverArtUrl: track.cover_art_url || '',
    streamingLinks: {},
    credits: [],
    sampleCount: 0,
    createdAt: '',
    // Extras preserved from API
    previewUrl: track.preview_url || '',
    itunesId: track.itunes_id || '',
    artistItunesId: track.primary_artist_itunes_id || '',
  } as any;
}

function mapBackendTrackToSong(track: any): Song {
  return {
    id: `ws-${Date.now()}`,
    title: track.title || '',
    primaryArtist: { id: '', name: track.artist || '', imageUrl: null, genres: [], externalIds: {} },
    featuredArtists: [],
    albumTitle: null,
    releaseYear: track.year || 0,
    releaseDate: null,
    durationMs: 0,
    bpm: 0,
    key: '',
    genre: 'hip_hop',
    subGenre: 'boom_bap',
    coverArtUrl: '',
    streamingLinks: {},
    credits: [],
    sampleCount: 0,
    createdAt: '',
  };
}

function mapBackendSamplesToLocal(samplesUsed: any[], songId: string, songTitle: string): Sample[] {
  return samplesUsed.map((s: any, i: number) => ({
    id: `be-${i}`,
    type: 'melody' as any,
    sourceSongTitle: s.title || '',
    sourceArtist: { id: '', name: s.artist || '', imageUrl: null, genres: [], externalIds: {} },
    sourceReleaseYear: s.year || 0,
    sourceGenre: 'unknown' as any,
    sourceCoverUrl: '',
    targetSongId: songId,
    targetSongTitle: songTitle,
    startTimeMs: 0,
    endTimeMs: 0,
    targetStartTimeMs: 0,
    targetEndTimeMs: 0,
    waveformDataUrl: null,
    audioPreviewUrl: null,
    attributionConfirmed: true,
    confidenceScore: 0.9,
    description: null,
  }));
}
