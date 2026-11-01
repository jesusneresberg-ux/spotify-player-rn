// src/stores/playerStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerController } from '@/core/audio/PlayerController';
import {
  Track,
  PlaybackInfo,
  PlaybackState,
  RepeatMode,
  PlayerType,
  PlayerConfig,
} from '@/core/audio/types';

interface PlayerStore {
  // State
  controller: PlayerController | null;
  playback: PlaybackInfo;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Track[];
  currentIndex: number;
  history: Track[];

  // Actions
  initPlayer: (config: PlayerConfig) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  addToQueue: (tracks: Track | Track[]) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (from: number, to: number) => void;
  setVolume: (volume: number) => Promise<void>;
  setRepeatMode: (mode: RepeatMode) => Promise<void>;
  toggleShuffle: () => Promise<void>;
  clearQueue: () => void;
  updatePlayback: (playback: Partial<PlaybackInfo>) => void;
  destroyPlayer: () => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      controller: null,
      playback: {
        track: null,
        isPlaying: false,
        position: 0,
        duration: 0,
        state: PlaybackState.IDLE,
      },
      volume: 80,
      shuffle: false,
      repeat: RepeatMode.OFF,
      queue: [],
      currentIndex: -1,
      history: [],

      // Actions
      initPlayer: async (config: PlayerConfig) => {
        try {
          const controller = new PlayerController();
          await controller.init(config);

          // Setup listeners
          controller.currentPlayer?.on('playbackStateChanged', (playback) => {
            set({ playback });
          });

          controller.currentPlayer?.on('trackChanged', (track) => {
            set((state) => ({
              playback: { ...state.playback, track },
            }));
          });

          controller.currentPlayer?.on('progressUpdate', (position) => {
            set((state) => ({
              playback: { ...state.playback, position },
            }));
          });

          controller.currentPlayer?.on('volumeChanged', (volume) => {
            set({ volume });
          });

          set({ controller });
        } catch (error) {
          console.error('Failed to init player:', error);
          throw error;
        }
      },

      play: async () => {
        const { controller } = get();
        if (controller) {
          await controller.play();
        }
      },

      pause: async () => {
        const { controller } = get();
        if (controller) {
          await controller.pause();
        }
      },

      resume: async () => {
        const { controller } = get();
        if (controller) {
          await controller.resume();
        }
      },

      seek: async (ms: number) => {
        const { controller } = get();
        if (controller) {
          await controller.seek(ms);
        }
      },

      playTrack: async (track: Track) => {
        const { controller } = get();
        if (controller) {
          await controller.playTrack(track);
        }
      },

      next: async () => {
        const { controller } = get();
        if (controller) {
          await controller.next();
          // Atualizar queue state
          set({
            queue: controller.getQueue(),
            currentIndex: controller.getCurrentIndex(),
          });
        }
      },

      previous: async () => {
        const { controller } = get();
        if (controller) {
          await controller.previous();
          set({
            queue: controller.getQueue(),
            currentIndex: controller.getCurrentIndex(),
          });
        }
      },

      addToQueue: (tracks: Track | Track[]) => {
        const { controller } = get();
        if (controller) {
          controller.addToQueue(tracks);
          set({
            queue: controller.getQueue(),
            currentIndex: controller.getCurrentIndex(),
          });
        }
      },

      removeFromQueue: (index: number) => {
        const { controller } = get();
        if (controller) {
          controller.removeFromQueue(index);
          set({
            queue: controller.getQueue(),
            currentIndex: controller.getCurrentIndex(),
          });
        }
      },

      moveQueueItem: (from: number, to: number) => {
        const { controller } = get();
        if (controller) {
          controller.moveQueueItem(from, to);
          set({
            queue: controller.getQueue(),
            currentIndex: controller.getCurrentIndex(),
          });
        }
      },

      setVolume: async (volume: number) => {
        const { controller } = get();
        if (controller) {
          await controller.setVolume(volume);
        }
      },

      setRepeatMode: async (mode: RepeatMode) => {
        const { controller } = get();
        if (controller) {
          await controller.setRepeatMode(mode);
          set({ repeat: mode });
        }
      },

      toggleShuffle: async () => {
        const { controller, shuffle } = get();
        if (controller) {
          await controller.toggleShuffle();
          set({ shuffle: !shuffle });
        }
      },

      clearQueue: () => {
        const { controller } = get();
        if (controller) {
          controller.clearQueue();
          set({
            queue: [],
            currentIndex: -1,
            playback: {
              track: null,
              isPlaying: false,
              position: 0,
              duration: 0,
              state: PlaybackState.IDLE,
            },
          });
        }
      },

      updatePlayback: (updates: Partial<PlaybackInfo>) => {
        set((state) => ({
          playback: { ...state.playback, ...updates },
        }));
      },

      destroyPlayer: async () => {
        const { controller } = get();
        if (controller) {
          await controller.destroy();
        }

        set({
          controller: null,
          playback: {
            track: null,
            isPlaying: false,
            position: 0,
            duration: 0,
            state: PlaybackState.IDLE,
          },
          queue: [],
          currentIndex: -1,
        });
      },
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Apenas persistir dados não-sensíveis
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }),
    },
  ),
);
