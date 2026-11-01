// src/utils/constants.ts

/**
 * Configuração do Spotify
 */
export const SPOTIFY_CONFIG = {
  // Substitua com seu Client ID do Spotify
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE',

  // URL de redirecionamento (deve estar registrada no Spotify Dashboard)
  REDIRECT_URI: 'exp://localhost:19000/--/spotify-callback',

  // Escopos necessários para o app
  SCOPES: [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-library-read',
    'user-library-modify',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
  ],

  // APIs
  API_BASE_URL: 'https://api.spotify.com/v1',
  AUTH_URL: 'https://accounts.spotify.com/api/token',
};

/**
 * Limites da API
 */
export const API_LIMITS = {
  SEARCH_LIMIT: 20,
  BROWSE_LIMIT: 20,
  PLAYLIST_LIMIT: 50,
  REQUEST_TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

/**
 * Duração de cache (em ms)
 */
export const CACHE_DURATION = {
  ARTWORK: 24 * 60 * 60 * 1000, // 24 horas
  METADATA: 60 * 60 * 1000, // 1 hora
  SEARCH: 30 * 60 * 1000, // 30 minutos
  PLAYBACK_STATE: 5 * 60 * 1000, // 5 minutos
};

/**
 * Cores do tema Spotify
 */
export const COLORS = {
  PRIMARY: '#1DB954',
  BACKGROUND: '#121212',
  SURFACE: '#191414',
  SURFACE_LIGHT: '#282828',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B3B3B3',
  TEXT_TERTIARY: '#818181',
  ERROR: '#FF6B6B',
  ACCENT: '#1ed760',
};

/**
 * Tamanhos de fonte
 */
export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  BASE: 14,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

/**
 * Espaçamentos padrão
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
};

/**
 * Raio de borda padrão
 */
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  FULL: 999,
};

/**
 * Modos de repetição
 */
export const REPEAT_MODES = {
  OFF: 'off',
  ONE: 'track',
  ALL: 'context',
} as const;

/**
 * Estados de playback
 */
export const PLAYBACK_STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
} as const;

/**
 * Tipos de player
 */
export const PLAYER_TYPES = {
  SPOTIFY: 'SPOTIFY',
  LOCAL: 'LOCAL',
} as const;

/**
 * Tipos de mídia
 */
export const MEDIA_TYPES = {
  TRACK: 'track',
  ALBUM: 'album',
  PLAYLIST: 'playlist',
  ARTIST: 'artist',
} as const;

/**
 * Mensagens de erro
 */
export const ERROR_MESSAGES = {
  NO_DEVICE: 'No active Spotify device found',
  NO_NETWORK: 'No internet connection',
  PREMIUM_REQUIRED: 'Spotify Premium required',
  AUTH_FAILED: 'Authentication failed',
  PLAYBACK_FAILED: 'Failed to start playback',
  GENERIC: 'An error occurred. Please try again.',
};

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Player
  PLAYER_STATE: '/me/player',
  PLAYER_PLAY: '/me/player/play',
  PLAYER_PAUSE: '/me/player/pause',
  PLAYER_NEXT: '/me/player/next',
  PLAYER_PREVIOUS: '/me/player/previous',
  PLAYER_SEEK: '/me/player/seek',
  PLAYER_VOLUME: '/me/player/volume',
  PLAYER_SHUFFLE: '/me/player/shuffle',
  PLAYER_REPEAT: '/me/player/repeat',
  PLAYER_QUEUE: '/me/player/queue',

  // User
  USER_PROFILE: '/me',
  USER_TRACKS: '/me/tracks',
  USER_PLAYLISTS: '/me/playlists',

  // Search
  SEARCH: '/search',

  // Browse
  NEW_RELEASES: '/browse/new-releases',
  FEATURED_PLAYLISTS: '/browse/featured-playlists',
  RECOMMENDATIONS: '/recommendations',
};

/**
 * Tamanhos de imagem Spotify
 */
export const IMAGE_SIZES = {
  SMALL: 64,
  MEDIUM: 300,
  LARGE: 640,
};
