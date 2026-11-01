// src/core/audio/LocalPlayer.ts

import { Audio } from 'expo-av';
import { AudioPlayer } from './AudioPlayer';
import {
  Track,
  PlaybackState,
  RepeatMode,
  LocalPlayerConfig,
  PlaybackInfo,
} from './types';

/**
 * Player para arquivos de áudio locais usando Expo AV
 * Suporta playback de arquivos no dispositivo
 */
export class LocalPlayer extends AudioPlayer {
  private sound: Audio.Sound | null = null;
  private config: LocalPlayerConfig;

  constructor(config: LocalPlayerConfig) {
    super();
    this.config = config;
  }

  async init(): Promise<void> {
    try {
      // Configurar modo de áudio para permitir playback mesmo com som silenciado
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
      });

      this.updatePlaybackState({
        state: PlaybackState.IDLE,
      });
    } catch (error) {
      console.error('Failed to initialize LocalPlayer:', error);
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: String(error),
      });
    }
  }

  async destroy(): Promise<void> {
    await this.pause();
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.cleanup();
  }

  /**
   * Carregar e reproduzir uma track local
   */
  async playTrack(track: Track): Promise<void> {
    try {
      if (!track.localPath) {
        throw new Error('Track does not have a local path');
      }

      // Parar playback anterior
      if (this.sound) {
        await this.sound.pauseAsync();
        await this.sound.unloadAsync();
      }

      // Carregar novo áudio
      this.updatePlaybackState({ state: PlaybackState.LOADING });

      this.sound = new Audio.Sound();

      // Setup event listeners
      this.sound.setOnPlaybackStatusUpdate(this.handlePlaybackStatus.bind(this));

      // Carregar arquivo
      await this.sound.loadAsync(track.localPath);

      // Definir volume
      await this.sound.setVolumeAsync(this.state.volume / 100);

      // Reproduzir
      await this.sound.playAsync();

      // Atualizar estado
      const status = await this.sound.getStatusAsync();
      this.updatePlaybackState({
        track,
        isPlaying: true,
        state: PlaybackState.PLAYING,
        duration: status.durationMillis || 0,
        position: 0,
      });

      this.startProgressTracking();
    } catch (error) {
      console.error('Failed to play track:', error);
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: String(error),
      });
    }
  }

  async play(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.playAsync();
      this.updatePlaybackState({
        isPlaying: true,
        state: PlaybackState.PLAYING,
      });
      this.startProgressTracking();
    } catch (error) {
      console.error('Play failed:', error);
      this.updatePlaybackState({
        state: PlaybackState.ERROR,
        error: String(error),
      });
    }
  }

  async pause(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.pauseAsync();
      this.stopProgressTracking();
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
    if (!this.sound) return;

    try {
      const status = await this.sound.getStatusAsync();
      const targetMs = Math.min(ms, status.durationMillis || 0);

      await this.sound.setPositionAsync(targetMs);
      this.updatePlaybackState({ position: targetMs });
    } catch (error) {
      console.error('Seek failed:', error);
    }
  }

  async next(): Promise<void> {
    // LocalPlayer não gerencia fila
    // Implementado no PlayerController
  }

  async previous(): Promise<void> {
    // LocalPlayer não gerencia fila
    // Implementado no PlayerController
  }

  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(100, volume));

    try {
      if (this.sound) {
        await this.sound.setVolumeAsync(clampedVolume / 100);
      }

      this.state.volume = clampedVolume;
      this.emit('volumeChanged', clampedVolume);
    } catch (error) {
      console.error('Set volume failed:', error);
    }
  }

  async setRepeatMode(mode: RepeatMode): Promise<void> {
    // Repeat é gerenciado no nível da fila
    this.state.repeat = mode;
  }

  async toggleShuffle(): Promise<void> {
    // Shuffle é gerenciado no nível da fila
    this.state.shuffle = !this.state.shuffle;
  }

  /**
   * Handler para atualizações de status do Expo Sound
   */
  private handlePlaybackStatus(status: Audio.AVPlaybackStatus) {
    if (!status.isLoaded) {
      if (status.error) {
        console.error('Error loading sound:', status.error);
        this.updatePlaybackState({
          state: PlaybackState.ERROR,
          error: status.error,
        });
      }
      return;
    }

    // Atualizar posição
    this.updatePlaybackState({
      position: status.positionMillis,
      duration: status.durationMillis || 0,
      isPlaying: status.isPlaying,
    });

    // Detectar final da track
    if (status.didJustFinish && !status.isLooping) {
      this.emit('trackEnded', this.state.playback.track);
    }
  }
}
