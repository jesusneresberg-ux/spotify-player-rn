// src/core/audio/AudioPlayer.ts

import EventEmitter from 'events';
import {
  IPlayer,
  PlayerState,
  PlaybackInfo,
  PlaybackState,
  RepeatMode,
  Track,
  PlayerEvents,
} from './types';

/**
 * Classe abstrata base para todos os tipos de players
 * Define a interface comum e gerencia eventos
 */
export abstract class AudioPlayer extends EventEmitter implements IPlayer {
  protected state: PlayerState = {
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
  };

  protected progressUpdateInterval?: NodeJS.Timeout;

  abstract init(): Promise<void>;
  abstract destroy(): Promise<void>;

  // Playback controls
  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract resume(): Promise<void>;
  abstract seek(ms: number): Promise<void>;

  // Queue controls
  abstract playTrack(track: Track): Promise<void>;
  abstract next(): Promise<void>;
  abstract previous(): Promise<void>;

  // Volume
  abstract setVolume(volume: number): Promise<void>;

  // Modes
  abstract setRepeatMode(mode: RepeatMode): Promise<void>;
  abstract toggleShuffle(): Promise<void>;

  /**
   * Obter estado completo do player
   */
  async getState(): Promise<PlayerState> {
    return { ...this.state };
  }

  /**
   * Obter informações de playback
   */
  async getPlaybackInfo(): Promise<PlaybackInfo> {
    return { ...this.state.playback };
  }

  /**
   * Atualizar estado de playback
   */
  protected updatePlaybackState(updates: Partial<PlaybackInfo>) {
    this.state.playback = {
      ...this.state.playback,
      ...updates,
    };

    // Emitir evento apropriado
    if (updates.isPlaying !== undefined) {
      this.emit('playbackStateChanged', this.state.playback);
    }

    if (updates.track !== undefined) {
      this.emit('trackChanged', this.state.playback.track);
    }

    if (updates.position !== undefined) {
      this.emit('progressUpdate', this.state.playback.position);
    }

    if (updates.state !== undefined && updates.state === PlaybackState.ERROR) {
      this.emit('error', updates.state);
    }
  }

  /**
   * Iniciar polling de progresso
   */
  protected startProgressTracking(intervalMs: number = 1000) {
    this.stopProgressTracking();

    this.progressUpdateInterval = setInterval(async () => {
      const info = await this.getPlaybackInfo();

      if (info.isPlaying) {
        const newPosition = info.position + intervalMs;
        if (newPosition <= info.duration) {
          this.updatePlaybackState({ position: newPosition });
        }
      }
    }, intervalMs);
  }

  /**
   * Parar polling de progresso
   */
  protected stopProgressTracking() {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = undefined;
    }
  }

  /**
   * Event listeners
   */
  override on<T extends keyof PlayerEvents>(
    event: T,
    listener: PlayerEvents[T],
  ): this {
    return super.on(event, listener);
  }

  override once<T extends keyof PlayerEvents>(
    event: T,
    listener: PlayerEvents[T],
  ): this {
    return super.once(event, listener);
  }

  override removeListener<T extends keyof PlayerEvents>(
    event: T,
    listener: PlayerEvents[T],
  ): this {
    return super.removeListener(event, listener);
  }

  /**
   * Cleanup
   */
  protected cleanup() {
    this.stopProgressTracking();
    this.removeAllListeners();
  }
}
