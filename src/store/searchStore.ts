import { create } from 'zustand';
import { Song, SearchMethod } from '../types/entities';
import { searchSongs, searchAutocomplete, getTrending } from '../services/api/dataService';
import {
  getSearchHistory, addSearchHistory, clearSearchHistory,
} from '../services/storage';

interface SearchState {
  query: string;
  searchMethod: SearchMethod;
  results: Song[];
  suggestions: Array<{title: string; artist: string; year?: number}>;
  isSearching: boolean;
  history: string[];
  trending: string[];
  error: string | null;
  historyLoaded: boolean;
  trendingLoaded: boolean;

  setQuery: (q: string) => void;
  setSearchMethod: (m: SearchMethod) => void;
  search: (query?: string) => Promise<void>;
  fetchSuggestions: (q: string) => Promise<void>;
  clearResults: () => void;
  addToHistory: (q: string) => void;
  clearHistory: () => void;
  loadHistory: () => Promise<void>;
  loadTrending: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  searchMethod: 'text',
  results: [],
  suggestions: [],
  isSearching: false,
  history: [],
  trending: [],
  error: null,
  historyLoaded: false,
  trendingLoaded: false,

  setQuery: (q) => {
    set({ query: q });
    if (q.length >= 2) get().fetchSuggestions(q);
  },

  setSearchMethod: (m) => set({ searchMethod: m }),

  search: async (query) => {
    const q = query || get().query;
    if (!q.trim()) return;
    set({ isSearching: true, error: null, query: q, results: [] });
    try {
      const results = await searchSongs(q);
      set({ results, isSearching: false });
      get().addToHistory(q);
    } catch {
      set({ error: '搜索失败，请重试', isSearching: false });
    }
  },

  fetchSuggestions: async (q: string) => {
    if (q.length < 2) { set({ suggestions: [] }); return; }
    try {
      const suggestions = await searchAutocomplete(q);
      set({ suggestions });
    } catch {}
  },

  clearResults: () => set({ results: [], query: '' }),

  addToHistory: (q) => {
    const history = [q, ...get().history.filter(h => h !== q)].slice(0, 50);
    set({ history });
    addSearchHistory(q);
  },

  clearHistory: () => {
    set({ history: [] });
    clearSearchHistory();
  },

  loadHistory: async () => {
    if (get().historyLoaded) return;
    const history = await getSearchHistory();
    set({ history, historyLoaded: true });
  },

  loadTrending: async () => {
    if (get().trendingLoaded) return;
    try {
      const trending = await getTrending();
      set({ trending, trendingLoaded: true });
    } catch {}
  },
}));
