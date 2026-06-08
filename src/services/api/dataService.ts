/**
 * Data Service — Kanye West exclusive
 */
import * as api from './client';
import { mockSongs, mockSamples, getSongWithSamples as mockGetSong, getGraphData as mockGetGraph, getSongRecommendations as mockGetRecs, getSampleDownstream as mockGetDownstream, getUpstreamTrace as mockGetUpstream, mockTrendingSearches } from './mockData';
import type { Song, Sample, RecommendationsData, GraphData, DownstreamUsage, UpstreamTrace } from '../../types/entities';

export { mockTrendingSearches };

export async function searchAutocomplete(query: string): Promise<any[]> { try { const r=await api.searchAutocomplete(query); return r.success?r.data:[]; } catch { return []; } }
export async function getTrending(): Promise<string[]> { try { const r=await api.getTrending(); return r.success?r.data:mockTrendingSearches; } catch { return mockTrendingSearches; } }
export async function getSongDetail(songId: string): Promise<{song:Song;samples:Sample[]}|null> { try { const r=await api.traceSamples('Kanye West',mockSongs.find(s=>s.id===songId)?.title||''); return r.success?{song:mockSongs.find(s=>s.id===songId)!,samples:[]}:mockGetSong(songId); } catch { return mockGetSong(songId); } }
export async function getSampleDetail(sampleId: string): Promise<DownstreamUsage|null> { return mockGetDownstream(sampleId); }
export async function getRecommendations(songId: string): Promise<RecommendationsData> { return mockGetRecs(songId); }
export async function getGraph(songId: string): Promise<GraphData> { return mockGetGraph(songId); }
export async function getUpstream(sampleId: string): Promise<UpstreamTrace|null> { return mockGetUpstream(sampleId); }
export async function getDiscoverSamples(): Promise<any[]> { return []; }

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const result = await api.searchTracks(query);
    if (result.success && result.data?.length > 0) {
      return result.data.map(mapTrackToSong);
    }
  } catch { }
  return [];
}

function mapTrackToSong(track: any): Song {
  return {
    id: track.id || '',
    title: track.title || '',
    primaryArtist: { id: 'a01', name: 'Kanye West', imageUrl: null, genres: ['hip_hop'], externalIds: {} },
    featuredArtists: [],
    albumTitle: track.album_title || null,
    releaseYear: track.release_year || 0,
    releaseDate: null,
    durationMs: track.duration_ms || 0,
    bpm: track.bpm || 0,
    key: track.key_signature || '',
    genre: 'hip_hop',
    subGenre: track.sub_genre || 'conscious',
    coverArtUrl: '',
    streamingLinks: {},
    credits: [],
    sampleCount: track.sample_count || 0,
    createdAt: '',
  } as any;
}
