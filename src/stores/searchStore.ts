// src/stores/searchStore.ts

import { create } from 'zustand';
import { Track } from '@/core/audio/types';
import axios from 'axios';

interface SearchResult {
  tracks: Track[];
  albums: any[];
  artists: any[];
}

interface SearchStore {
  // State
  query: string;
  results: SearchResult;
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];

  // Actions
  search: (query: string, accessToken: string) => Promise<void>;
  clearResults: () => void;
  addToRecentSearches: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setError: (error: string | null) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  // Initial state
  query: '',
  results: {
    tracks: [],
    albums: [],
    artists: [],
  },
  isLoading: false,
  error: null,
  recentSearches: [],

  // Actions
  search: async (query: string, accessToken: string) => {
    if (!query.trim()) {
      set({ results: { tracks: [], albums: [], artists: [] } });
      return;
    }

    try {
      set({ isLoading: true, error: null, query });

      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'track,album,artist',
          limit: 20,
        },
      });

      const tracks: Track[] = (response.data.tracks?.items || []).map(
        (item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists[0]?.name || 'Unknown',
          album: item.album?.name || 'Unknown',
          duration: item.duration_ms,
          uri: item.uri,
          artworkUrl: item.album?.images?.[0]?.url,
          isLocal: false,
          previewUrl: item.preview_url,
          explicit: item.explicit,
          popularity: item.popularity,
        }),
      );

      set({
        results: {
          tracks,
          albums: response.data.albums?.items || [],
          artists: response.data.artists?.items || [],
        },
        isLoading: false,
      });

      // Adicionar aos recentes
      get().addToRecentSearches(query);
    } catch (error) {
      console.error('Search failed:', error);
      set({
        error: 'Search failed. Try again.',
        isLoading: false,
      });
    }
  },

  clearResults: () => {
    set({
      query: '',
      results: { tracks: [], albums: [], artists: [] },
      error: null,
    });
  },

  addToRecentSearches: (query: string) => {
    set((state) => {
      const recent = [
        query,
        ...state.recentSearches.filter((q) => q !== query),
      ].slice(0, 10);

      return { recentSearches: recent };
    });
  },

  removeRecentSearch: (query: string) => {
    set((state) => ({
      recentSearches: state.recentSearches.filter((q) => q !== query),
    }));
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
