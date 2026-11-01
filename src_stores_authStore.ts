// src/stores/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  // Actions
  setTokens: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ) => Promise<void>;
  setUserId: (userId: string) => void;
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setError: (error: string | null) => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setTokens: async (
        accessToken: string,
        refreshToken: string,
        expiresIn: number,
      ) => {
        const expiresAt = Date.now() + expiresIn * 1000;

        try {
          // Guardar refresh token em local seguro
          await SecureStore.setItemAsync('spotify_refresh_token', refreshToken);

          set({
            accessToken,
            refreshToken,
            expiresAt,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          console.error('Failed to set tokens:', error);
          set({ error: 'Failed to save tokens' });
        }
      },

      setUserId: (userId: string) => {
        set({ userId });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          set({ error: 'No refresh token available' });
          return;
        }

        try {
          set({ isLoading: true });

          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: process.env.SPOTIFY_CLIENT_ID || '',
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to refresh token');
          }

          const data = await response.json();

          set({
            accessToken: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Failed to refresh token:', error);
          set({
            error: 'Token refresh failed',
            isLoading: false,
            isAuthenticated: false,
          });

          // Logout se falhar
          await get().logout();
        }
      },

      logout: async () => {
        try {
          // Remover refresh token
          await SecureStore.deleteItemAsync('spotify_refresh_token');
        } catch (error) {
          console.error('Failed to delete refresh token:', error);
        }

        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          userId: null,
          isAuthenticated: false,
          error: null,
        });
      },

      restoreSession: async () => {
        try {
          set({ isLoading: true });

          // Tentar recuperar refresh token do secure store
          const refreshToken = await SecureStore.getItemAsync(
            'spotify_refresh_token',
          );

          if (!refreshToken) {
            set({ isLoading: false });
            return;
          }

          // Recuperar access token do AsyncStorage
          const stored = await AsyncStorage.getItem('auth-store');
          if (stored) {
            const parsed = JSON.parse(stored);
            const { state } = parsed;

            // Se token ainda válido, usar
            if (state.expiresAt && state.expiresAt > Date.now()) {
              set({
                ...state,
                isLoading: false,
              });
              return;
            }
          }

          // Token expirou, tentar refresh
          set({
            refreshToken,
            isLoading: false,
          });

          await get().refreshAccessToken();
        } catch (error) {
          console.error('Failed to restore session:', error);
          set({ isLoading: false });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      isTokenExpired: (): boolean => {
        const { expiresAt } = get();
        if (!expiresAt) return true;

        // Considerar expirado 1 minuto antes
        return Date.now() > expiresAt - 60000;
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Não persistir tokens (apenas metadados)
      partialize: (state) => ({
        userId: state.userId,
        expiresAt: state.expiresAt,
        // refreshToken e accessToken são salvos em SecureStore
      }),
    },
  ),
);
