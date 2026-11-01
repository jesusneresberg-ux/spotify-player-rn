// src/ui/components/NowPlayingCard.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { usePlayerStore } from '@/stores/playerStore';
import { PlaybackState } from '@/core/audio/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ARTWORK_SIZE = SCREEN_WIDTH - 64;

export const NowPlayingCard: React.FC = () => {
  const { playback } = usePlayerStore();
  const { track, state, error } = playback;

  if (!track) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.placeholderArtwork}>
          <Text style={styles.placeholderText}>No track</Text>
        </View>
      </View>
    );
  }

  const isLoading = state === PlaybackState.LOADING;
  const hasError = state === PlaybackState.ERROR;

  return (
    <View style={styles.container}>
      {/* Artwork */}
      <View style={styles.artworkWrapper}>
        {track.artworkUrl ? (
          <>
            <Image
              source={{ uri: track.artworkUrl }}
              style={styles.artwork}
              onError={(error) => {
                console.error('Image load error:', error);
              }}
              accessibilityIgnoresInvertColors
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#1DB954" />
              </View>
            )}
            {hasError && (
              <View style={styles.errorOverlay}>
                <Text style={styles.errorText}>Error loading</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderArtwork}>
            <Text style={styles.placeholderText}>♪</Text>
          </View>
        )}

        {/* Corner badge para track explícita */}
        {track.explicit && (
          <View style={styles.explicitBadge}>
            <Text style={styles.explicitText}>E</Text>
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {track.title}
        </Text>

        {/* Artist */}
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>

        {/* Album */}
        <Text style={styles.album} numberOfLines={1}>
          {track.album}
        </Text>

        {/* Error message */}
        {hasError && error && (
          <Text style={styles.errorMessage}>{error}</Text>
        )}

        {/* Popularity indicator (opcional) */}
        {track.popularity !== undefined && (
          <View style={styles.popularityContainer}>
            <View style={styles.popularityBar}>
              <View
                style={[
                  styles.popularityFill,
                  { width: `${track.popularity}%` },
                ]}
              />
            </View>
            <Text style={styles.popularityText}>
              {Math.round(track.popularity)}% popular
            </Text>
          </View>
        )}

        {/* Local indicator */}
        {track.isLocal && (
          <View style={styles.localBadge}>
            <Text style={styles.localText}>Local file</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  artworkWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 12,
    backgroundColor: '#282828',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  placeholderArtwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 12,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    color: '#404040',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Spotify-Bold',
  },
  explicitBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  explicitText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Spotify-Bold',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Spotify-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  album: {
    fontSize: 14,
    color: '#818181',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'Spotify-Medium',
  },
  popularityContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  popularityBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#404040',
    overflow: 'hidden',
    marginBottom: 6,
  },
  popularityFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  popularityText: {
    fontSize: 12,
    color: '#b3b3b3',
    fontFamily: 'Spotify-Regular',
  },
  localBadge: {
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#1DB954',
  },
  localText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Spotify-Bold',
  },
});
