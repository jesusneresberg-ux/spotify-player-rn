// src/ui/screens/PlayerScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NowPlayingCard } from '../components/NowPlayingCard';
import { PlayerControls } from '../components/PlayerControls';
import { ProgressBar } from '../components/ProgressBar';
import { ModeButtons } from '../components/ModeButtons';
import { usePlayerStore } from '@/stores/playerStore';
import { useAuthStore } from '@/stores/authStore';
import { PlayerType } from '@/core/audio/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const PlayerScreen: React.FC = () => {
  const { controller, playback, queue, currentIndex } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(!controller);

  useEffect(() => {
    // Inicializar player se necessário
    if (!controller && isAuthenticated) {
      const initPlayer = async () => {
        try {
          const playerStore = usePlayerStore.getState();

          // Verificar se há token Spotify
          const authStore = useAuthStore.getState();
          if (authStore.accessToken) {
            await playerStore.initPlayer({
              type: PlayerType.SPOTIFY,
              accessToken: authStore.accessToken,
              spotifyRefreshToken: authStore.refreshToken || '',
            });
          }
        } catch (error) {
          console.error('Failed to initialize player:', error);
        } finally {
          setIsInitializing(false);
        }
      };

      initPlayer();
    }
  }, [controller, isAuthenticated]);

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.initializingText}>Initializing player...</Text>
      </SafeAreaView>
    );
  }

  if (playback.error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color="#FF6B6B"
          />
          <Text style={styles.errorTitle}>Playback Error</Text>
          <Text style={styles.errorMessage}>{playback.error}</Text>
          <Text style={styles.errorHint}>
            Make sure Spotify is open and you have an active device
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191414" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity
            style={styles.queueButton}
            onPress={() => {
              // Navegar para queue screen
            }}
          >
            <MaterialCommunityIcons name="playlist-music" size={24} color="#fff" />
            {queue.length > 0 && (
              <View style={styles.queueBadge}>
                <Text style={styles.queueBadgeText}>{queue.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Now Playing Card */}
        <NowPlayingCard />

        {/* Progress Bar */}
        <ProgressBar showTime />

        {/* Player Controls */}
        <PlayerControls size="large" />

        {/* Mode Buttons (Shuffle/Repeat) */}
        <ModeButtons size="large" />

        {/* Queue Preview */}
        {queue.length > 0 && (
          <View style={styles.queuePreview}>
            <Text style={styles.queuePreviewTitle}>Up next</Text>
            {queue
              .slice(Math.max(0, currentIndex - 1), Math.min(queue.length, currentIndex + 3))
              .map((track, index) => {
                const isCurrentTrack = currentIndex + 1 === index;
                return (
                  <View
                    key={`${track.id}-${index}`}
                    style={[
                      styles.queuePreviewItem,
                      isCurrentTrack && styles.queuePreviewItemActive,
                    ]}
                  >
                    <Text style={styles.queuePreviewItemNumber}>
                      {index}
                    </Text>
                    <View style={styles.queuePreviewItemInfo}>
                      <Text style={styles.queuePreviewItemTitle} numberOfLines={1}>
                        {track.title}
                      </Text>
                      <Text style={styles.queuePreviewItemArtist} numberOfLines={1}>
                        {track.artist}
                      </Text>
                    </View>
                    <Text style={styles.queuePreviewItemTime}>
                      {Math.floor(track.duration / 60)}:{String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
                    </Text>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Spotify-Bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 14,
    color: '#818181',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Spotify-Bold',
    color: '#fff',
  },
  queueButton: {
    position: 'relative',
    padding: 8,
  },
  queueBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#1DB954',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueBadgeText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Spotify-Bold',
  },
  initializingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#b3b3b3',
  },
  queuePreview: {
    paddingHorizontal: 16,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#282828',
    paddingTop: 16,
  },
  queuePreviewTitle: {
    fontSize: 14,
    fontFamily: 'Spotify-Bold',
    color: '#fff',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  queuePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  queuePreviewItemActive: {
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    borderLeftWidth: 2,
    borderLeftColor: '#1DB954',
  },
  queuePreviewItemNumber: {
    fontSize: 12,
    color: '#818181',
    marginRight: 12,
    width: 20,
  },
  queuePreviewItemInfo: {
    flex: 1,
  },
  queuePreviewItemTitle: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Spotify-Medium',
  },
  queuePreviewItemArtist: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 2,
  },
  queuePreviewItemTime: {
    fontSize: 12,
    color: '#818181',
  },
});
