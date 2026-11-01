// src/core/audio/types.ts

export enum PlaybackState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

export enum RepeatMode {
  OFF = 'off',
  ONE = 'track',
  ALL = 'context',
}

export enum PlayerType {
  SPOTIFY = 'SPOTIFY',
  LOCAL = 'LOCAL',
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // ms
  uri?: string; // Spotify URI
  localPath?: string; // Caminho local
  artworkUrl?: string;
  isLocal: boolean;
  previewUrl?: string; // URL de preview do Spotify
  explicit: boolean;
  popularity?: number;
}

export interface PlayerConfig {
  type: PlayerType;
  accessToken?: string;
  spotifyRefreshToken?: string;
}

export interface PlaybackInfo {
  track: Track | null;
  isPlaying: boolean;
  position: number; // ms
  duration: number; // ms
  state: PlaybackState;
  error?: string;
}

export interface PlayerState {
  playback: PlaybackInfo;
  volume: number; // 0-100
  shuffle: boolean;
  repeat: RepeatMode;
  activeDevice?: string;
}

export interface PlayerEvents {
  onPlaybackStateChanged: (state: PlaybackInfo) => void;
  onTrackChanged: (track: Track | null) => void;
  onProgressUpdate: (progress: number) => void;
  onError: (error: string) => void;
  onVolumeChanged: (volume: number) => void;
}

export interface IPlayer {
  // Playback controls
  play(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  seek(ms: number): Promise<void>;

  // Queue controls
  playTrack(track: Track): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;

  // Volume
  setVolume(volume: number): Promise<void>;

  // Modes
  setRepeatMode(mode: RepeatMode): Promise<void>;
  toggleShuffle(): Promise<void>;

  // State
  getState(): Promise<PlayerState>;
  getPlaybackInfo(): Promise<PlaybackInfo>;

  // Lifecycle
  init(): Promise<void>;
  destroy(): Promise<void>;

  // Events
  addEventListener(event: keyof PlayerEvents, listener: any): void;
  removeEventListener(event: keyof PlayerEvents, listener: any): void;
}

export interface SpotifyPlayerConfig extends PlayerConfig {
  type: PlayerType.SPOTIFY;
  accessToken: string;
  spotifyRefreshToken: string;
}

export interface LocalPlayerConfig extends PlayerConfig {
  type: PlayerType.LOCAL;
}
