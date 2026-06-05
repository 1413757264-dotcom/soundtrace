import { create } from 'zustand';
import { Song, Sample, WaveformData } from '../types/entities';
import {
  getSongDetail,
  getSampleDetail,
  getRecommendations,
  getGraph,
} from '../services/api/dataService';
import type { RecommendationsData, GraphData, DownstreamUsage } from '../types/entities';

interface SampleState {
  currentSong: Song | null;
  currentSamples: Sample[];
  downstreamMap: Record<string, DownstreamUsage>;
  recommendations: RecommendationsData | null;
  graphData: GraphData | null;
  waveformCache: Record<string, WaveformData>;
  loading: boolean;
  error: string | null;

  loadSongDetail: (songId: string) => Promise<void>;
  setSongDirect: (song: Song) => void;
  loadDownstream: (sampleId: string) => Promise<void>;
  loadRecommendations: (songId: string) => Promise<void>;
  loadGraph: (songId: string) => Promise<void>;
  clearSong: () => void;
}

export const useSampleStore = create<SampleState>((set, get) => ({
  currentSong: null,
  currentSamples: [],
  downstreamMap: {},
  recommendations: null,
  graphData: null,
  waveformCache: {},
  loading: false,
  error: null,

  setSongDirect: (song: Song) => {
    set({ currentSong: song, currentSamples: [], loading: false, error: null });
  },

  loadSongDetail: async (songId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getSongDetail(songId);
      if (data) {
        set({
          currentSong: data.song,
          currentSamples: data.samples,
          loading: false,
        });
      } else {
        set({ error: '未找到歌曲信息', loading: false });
      }
    } catch {
      set({ error: '加载失败', loading: false });
    }
  },

  loadDownstream: async (sampleId: string) => {
    const existing = get().downstreamMap[sampleId];
    if (existing) return;
    try {
      const data = await getSampleDetail(sampleId);
      if (data) {
        set(state => ({
          downstreamMap: { ...state.downstreamMap, [sampleId]: data },
        }));
      }
    } catch {}
  },

  loadRecommendations: async (songId: string) => {
    try {
      const data = await getRecommendations(songId);
      set({ recommendations: data });
    } catch {}
  },

  loadGraph: async (songId: string) => {
    try {
      const data = await getGraph(songId);
      set({ graphData: data });
    } catch {}
  },

  clearSong: () => set({
    currentSong: null,
    currentSamples: [],
    recommendations: null,
    graphData: null,
  }),
}));
