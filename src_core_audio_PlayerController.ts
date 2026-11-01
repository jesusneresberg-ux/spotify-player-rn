// src/core/audio/PlayerController.ts

import { LocalPlayer } from './LocalPlayer';
import { SpotifyPlayer } from './SpotifyPlayer';
import { AudioPlayer } from './AudioPlayer';
import {
  IPlayer,
  Track,
  PlayerState,
  PlaybackInfo,
  PlaybackState,
  RepeatMode,
  PlayerType,
  PlayerConfig,
  SpotifyPlayerConfig,
  LocalPlayerConfig,
} from './types';

/**
 * Controlador central que orquestra o playback
 * Gerencia switching entre players, fila e modos de reprodução
 */
export class PlayerController implements IPlayer {
  private currentPlayer: AudioPlayer | null = null;
  private queue: Track[] = [];
  private history: Track[] = [];
  private currentIndex: number = -1;
  private shuffledIndices: number[] = [];

  constructor() {
    // Inicialização lazy
  }

  /**
   * Inicializar com um tipo específico de player
   */
  async init(config: PlayerConfig): Promise<void> {
    if (config.type === PlayerType.SPOTIFY) {
      const spotifyConfig = config as SpotifyPlayerConfig;
      this.currentPlayer = new SpotifyPlayer(spotifyConfig);
    } else {
      const localConfig = config as LocalPlayerConfig;
      this.currentPlayer = new LocalPlayer(localConfig);
    }

    await this.currentPlayer.init();
    this.setupEventListeners();
  }

  /**
   * Configurar listeners de eventos do player
   */
  private setupEventListeners() {
    if (!this.currentPlayer) return;

    this.currentPlayer.on('trackEnded', () => {
      this.handleTrackEnded();
    });

    this.currentPlayer.on('error', (error: string) => {
      console.error('Player error:', error);
    });
  }

  /**
   * Adicionar tracks à fila
   */
  addToQueue(tracks: Track | Track[]): void {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];

    if (this.queue.length === 0 && this.currentIndex === -1) {
      // Se fila está vazia, começar a reproduzir primeiro track
      this.queue = tracksArray;
      this.currentIndex = 0;
      this.playTrackAtIndex(0);
    } else {
      // Adicionar após track atual
      this.queue.push(...tracksArray);
    }
  }

  /**
   * Reproduzir específica na fila
   */
  private async playTrackAtIndex(index: number): Promise<void> {
    if (index < 0 || index >= this.queue.length) {
      return;
    }

    this.currentIndex = index;
    const track = this.queue[index];

    try {
      await this.currentPlayer?.playTrack(track);

      // Adicionar ao histórico
      this.history.push(track);
      if (this.history.length > 100) {
        this.history.shift(); // Manter últimas 100
      }
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  }

  /**
   * Quando uma track termina
   */
  private async handleTrackEnded(): Promise<void> {
    const { repeat, shuffle } = await this.currentPlayer!.getState();

    if (repeat === RepeatMode.ONE) {
      // Repetir mesma track
      await this.playTrackAtIndex(this.currentIndex);
    } else if (this.currentIndex < this.queue.length - 1) {
      // Próxima track
      await this.next();
    } else if (repeat === RepeatMode.ALL) {
      // Voltar ao início da fila
      await this.playTrackAtIndex(0);
    }
  }

  // ===== Implementation of IPlayer =====

  async play(): Promise<void> {
    if (this.currentIndex === -1 && this.queue.length > 0) {
      await this.playTrackAtIndex(0);
    } else {
      await this.currentPlayer?.play();
    }
  }

  async pause(): Promise<void> {
    await this.currentPlayer?.pause();
  }

  async resume(): Promise<void> {
    await this.currentPlayer?.resume();
  }

  async seek(ms: number): Promise<void> {
    await this.currentPlayer?.seek(ms);
  }

  async playTrack(track: Track): Promise<void> {
    // Adicionar à fila e reproduzir
    const index = this.queue.length;
    this.queue.push(track);
    await this.playTrackAtIndex(index);
  }

  async next(): Promise<void> {
    const state = await this.currentPlayer!.getState();

    if (state.shuffle && this.shuffledIndices.length === 0) {
      // Gerar índices shuffled na primeira vez
      this.shuffledIndices = this.generateShuffledIndices();
    }

    let nextIndex = this.currentIndex + 1;

    if (state.shuffle && this.shuffledIndices.length > 0) {
      const currentShufflePos = this.shuffledIndices.indexOf(this.currentIndex);
      nextIndex = this.shuffledIndices[currentShufflePos + 1];
    }

    if (nextIndex < this.queue.length) {
      await this.playTrackAtIndex(nextIndex);
    } else if (state.repeat === RepeatMode.ALL) {
      await this.playTrackAtIndex(0);
    }
  }

  async previous(): Promise<void> {
    // Se passou de 3 segundos, voltar ao início da track
    const info = await this.currentPlayer!.getPlaybackInfo();

    if (info.position > 3000) {
      await this.seek(0);
    } else if (this.currentIndex > 0) {
      // Senão, ir para track anterior
      await this.playTrackAtIndex(this.currentIndex - 1);
    } else {
      // No início, voltar ao início da track
      await this.seek(0);
    }
  }

  async setVolume(volume: number): Promise<void> {
    await this.currentPlayer?.setVolume(volume);
  }

  async setRepeatMode(mode: RepeatMode): Promise<void> {
    await this.currentPlayer?.setRepeatMode(mode);
  }

  async toggleShuffle(): Promise<void> {
    const state = await this.currentPlayer!.getState();

    if (!state.shuffle) {
      // Ao ativar shuffle, regenerar fila
      this.shuffledIndices = this.generateShuffledIndices();
    } else {
      // Ao desativar, limpar
      this.shuffledIndices = [];
    }

    await this.currentPlayer?.toggleShuffle();
  }

  async getState(): Promise<PlayerState> {
    return await this.currentPlayer!.getState();
  }

  async getPlaybackInfo(): Promise<PlaybackInfo> {
    return await this.currentPlayer!.getPlaybackInfo();
  }

  /**
   * Obter dados da fila
   */
  getQueue(): Track[] {
    return [...this.queue];
  }

  getQueueAtIndex(index: number): Track | undefined {
    return this.queue[index];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getHistory(): Track[] {
    return [...this.history];
  }

  /**
   * Manipular fila
   */
  removeFromQueue(index: number): void {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1);

      if (index < this.currentIndex) {
        this.currentIndex--;
      }
    }
  }

  moveQueueItem(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      fromIndex >= this.queue.length ||
      toIndex < 0 ||
      toIndex >= this.queue.length
    ) {
      return;
    }

    const [item] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, item);

    // Ajustar índice atual
    if (fromIndex === this.currentIndex) {
      this.currentIndex = toIndex;
    } else if (fromIndex < this.currentIndex && toIndex >= this.currentIndex) {
      this.currentIndex--;
    } else if (fromIndex > this.currentIndex && toIndex < this.currentIndex) {
      this.currentIndex++;
    }
  }

  clearQueue(): void {
    this.queue = [];
    this.currentIndex = -1;
    this.shuffledIndices = [];
  }

  /**
   * Gerar índices shuffled usando Fisher-Yates
   */
  private generateShuffledIndices(): number[] {
    const indices = Array.from({ length: this.queue.length }, (_, i) => i);

    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    return indices;
  }

  async destroy(): Promise<void> {
    if (this.currentPlayer) {
      await this.currentPlayer.destroy();
      this.currentPlayer = null;
    }

    this.queue = [];
    this.history = [];
    this.currentIndex = -1;
  }

  addEventListener(event: string, listener: any): void {
    // Delegado ao currentPlayer
  }

  removeEventListener(event: string, listener: any): void {
    // Delegado ao currentPlayer
  }
}
