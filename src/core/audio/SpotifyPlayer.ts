// src/core/audio/SpotifyPlayer.ts

import axios from 'axios';
import { AudioPlayer } from './AudioPlayer';
import {
  Track,
  PlaybackState,
  RepeatMode,
  SpotifyPlayerConfig,
  PlaybackInfo,
} from './types';

/**
 * Player para Spotify usando a API Web
 * Funciona como "remote control" para controlar dispositivos Spotify
 */
export class SpotifyPlayer extends AudioPlayer {
  private config: SpotifyPlayerConfig;
  private pollingInterval?: NodeJS.Timeout;
  private lastPolledPosition: number = 0;
  private pollIntervalMs: number = 1000;

  constructor(config: SpotifyPlayerConfig) {
    super();
    this.config = config;
  }

  async init(): Promise<void> {
    try {
      // Verificar se há device ativo
      const hasDevice = await this.checkAvailableDevices();

      if (!hasDevice) {
        this.updatePlaybackState({
          state: PlaybackState.ERROR,
          error: 'No active Spotify device found. Open Spotify app first.',
        });
      } else {
        this.updatePlaybackState({
          state: PlaybackState.IDLE,
        });
        // Começar a fazer polling do estado
        this.startPolling();
      }
    } catch (error) {
      console.error('Failed to initialize SpotifyPlayer:', error);
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: String(error),
      });
    }
  }

  async destroy(): Promise<void> {
    this.stopPolling();
    this.cleanup();
  }

  /**
   * Verificar dispositivos Spotify ativos
   */
  private async checkAvailableDevices(): Promise<boolean> {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: this.getAuthHeaders(),
      });

      const hasDevice = response.data.devices?.some(
        (device: any) => device.is_active || device.type === 'Smartphone',
      );

      return hasDevice;
    } catch (error) {
      console.error('Failed to check devices:', error);
      return false;
    }
  }

  /**
   * Sincronizar estado com Spotify
   */
  private async syncState(): Promise<void> {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player', {
        headers: this.getAuthHeaders(),
      });

      const player = response.data;

      if (!player.item) {
        this.updatePlaybackState({
          track: null,
          isPlaying: false,
          position: 0,
          state: PlaybackState.IDLE,
        });
        return;
      }

      const track: Track = {
        id: player.item.id,
        title: player.item.name,
        artist: player.item.artists[0]?.name || 'Unknown',
        album: player.item.album?.name || 'Unknown',
        duration: player.item.duration_ms,
        uri: player.item.uri,
        artworkUrl: player.item.album?.images?.[0]?.url,
        isLocal: false,
        explicit: player.item.explicit,
        popularity: player.item.popularity,
      };

      this.lastPolledPosition = player.progress_ms;

      this.updatePlaybackState({
        track,
        isPlaying: player.is_playing,
        position: player.progress_ms,
        duration: player.item.duration_ms,
        state: player.is_playing ? PlaybackState.PLAYING : PlaybackState.PAUSED,
        error: undefined,
      });

      // Atualizar modos
      this.state.shuffle = player.shuffle_state;
      this.state.repeat = player.repeat_state as RepeatMode;
    } catch (error) {
      console.error('Failed to sync state:', error);
      if ((error as any).response?.status === 401) {
        // Token expirado
        this.updatePlaybackState({
          state: PlaybackState.ERROR,
          error: 'Authentication expired',
        });
      }
    }
  }

  /**
   * Iniciar polling do estado
   */
  private startPolling(): void {
    this.stopPolling();

    this.pollingInterval = setInterval(() => {
      this.syncState();
    }, this.pollIntervalMs);

    // Sync imediato
    this.syncState();
  }

  /**
   * Parar polling
   */
  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }

  async playTrack(track: Track): Promise<void> {
    try {
      if (!track.uri) {
        throw new Error('Track does not have Spotify URI');
      }

      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: [track.uri] },
        { headers: this.getAuthHeaders() },
      );

      // Atualizar estado imediatamente
      await this.syncState();
    } catch (error) {
      console.error('Play track failed:', error);
      this.handlePlayError(error);
    }
  }

  async play(): Promise<void> {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {},
        { headers: this.getAuthHeaders() },
      );

      this.updatePlaybackState({
        isPlaying: true,
        state: PlaybackState.PLAYING,
      });
    } catch (error) {
      console.error('Play failed:', error);
      this.handlePlayError(error);
    }
  }

  async pause(): Promise<void> {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/pause',
        {},
        { headers: this.getAuthHeaders() },
      );

      this.updatePlaybackState({
        isPlaying: false,
        state: PlaybackState.PAUSED,
      });
    } catch (error) {
      console.error('Pause failed:', error);
    }
  }

  async resume(): Promise<void> {
    return this.play();
  }

  async seek(ms: number): Promise<void> {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/seek',
        {},
        {
          headers: this.getAuthHeaders(),
          params: { position_ms: Math.floor(ms) },
        },
      );

      this.lastPolledPosition = ms;
      this.updatePlaybackState({ position: ms });
    } catch (error) {
      console.error('Seek failed:', error);
    }
  }

  async next(): Promise<void> {
    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/next',
        {},
        { headers: this.getAuthHeaders() },
      );

      // Sync após mudar track
      setTimeout(() => this.syncState(), 500);
    } catch (error) {
      console.error('Next failed:', error);
    }
  }

  async previous(): Promise<void> {
    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/previous',
        {},
        { headers: this.getAuthHeaders() },
      );

      // Sync após mudar track
      setTimeout(() => this.syncState(), 500);
    } catch (error) {
      console.error('Previous failed:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(100, volume));

    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/volume',
        {},
        {
          headers: this.getAuthHeaders(),
          params: { volume_percent: clampedVolume },
        },
      );

      this.state.volume = clampedVolume;
      this.emit('volumeChanged', clampedVolume);
    } catch (error) {
      console.error('Set volume failed:', error);
    }
  }

  async setRepeatMode(mode: RepeatMode): Promise<void> {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/repeat',
        {},
        {
          headers: this.getAuthHeaders(),
          params: { state: mode },
        },
      );

      this.state.repeat = mode;
    } catch (error) {
      console.error('Set repeat failed:', error);
    }
  }

  async toggleShuffle(): Promise<void> {
    try {
      const newState = !this.state.shuffle;

      await axios.put(
        'https://api.spotify.com/v1/me/player/shuffle',
        {},
        {
          headers: this.getAuthHeaders(),
          params: { state: newState },
        },
      );

      this.state.shuffle = newState;
    } catch (error) {
      console.error('Toggle shuffle failed:', error);
    }
  }

  /**
   * Headers com autenticação
   */
  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Tratar erros de playback
   */
  private handlePlayError(error: any) {
    if (error.response?.status === 403) {
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: 'Spotify Premium required for playback',
      });
    } else if (error.response?.status === 404) {
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: 'No active Spotify device. Open Spotify app first.',
      });
    } else {
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: error.message,
      });
    }
  }
}
