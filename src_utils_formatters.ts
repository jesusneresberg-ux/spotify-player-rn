// src/utils/formatters.ts

/**
 * Formatar tempo em ms para MM:SS
 */
export const formatTime = (ms: number): string => {
  if (!ms || ms < 0) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formatar duração longa em HH:MM:SS
 */
export const formatDuration = (ms: number): string => {
  if (!ms || ms < 0) return '0:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Truncar string com ellipsis
 */
export const truncate = (str: string, length: number = 30): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - 3) + '...';
};

/**
 * Capitalizar primeira letra
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formatar número com separadores
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  return (num / 1000000).toFixed(1) + 'M';
};

/**
 * Formatar popularidade (0-100)
 */
export const formatPopularity = (popularity: number): string => {
  if (popularity >= 80) return 'Very Popular';
  if (popularity >= 60) return 'Popular';
  if (popularity >= 40) return 'Moderate';
  if (popularity >= 20) return 'Low';
  return 'Very Low';
};

/**
 * Data relativa (ex: "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

/**
 * Formatar nome do artista (múltiplos artistas)
 */
export const formatArtists = (artists: string[]): string => {
  if (!artists || artists.length === 0) return 'Unknown Artist';
  if (artists.length === 1) return artists[0];
  if (artists.length === 2) return artists.join(' & ');
  return artists.slice(0, -1).join(', ') + ', & ' + artists[artists.length - 1];
};

/**
 * Gerar iniciais de nome
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Pluralizar palavra
 */
export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

/**
 * Formatar percentual
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return (value * 100).toFixed(decimals) + '%';
};
