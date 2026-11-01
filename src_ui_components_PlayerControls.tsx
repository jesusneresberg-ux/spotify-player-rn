// src/ui/components/PlayerControls.tsx

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayerStore } from '@/stores/playerStore';
import { useAuthStore } from '@/stores/authStore';

interface PlayerControlsProps {
  size?: 'small' | 'large';
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  size = 'large',
  onNext,
  onPrevious,
}) => {
  const { playback, play, pause, next, previous } = usePlayerStore();
  const { isTokenExpired, refreshAccessToken } = useAuthStore();

  const isPlaying = playback.isPlaying;
  const iconSize = size === 'large' ? 48 : 32;
  const containerSize = size === 'large' ? 80 : 56;

  const handlePlayPause = async () => {
    try {
      // Verificar se token expirou
      if (isTokenExpired()) {
        await refreshAccessToken();
      }

      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } catch (error) {
      console.error('Play/pause failed:', error);
    }
  };

  const handleNext = async () => {
    try {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }

      await next();
      onNext?.();
    } catch (error) {
      console.error('Next failed:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }

      await previous();
      onPrevious?.();
    } catch (error) {
      console.error('Previous failed:', error);
    }
  };

  if (size === 'large') {
    return (
      <View style={styles.largeContainer}>
        {/* Previous */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePrevious}
          accessible
          accessibilityLabel="Previous track"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="skip-previous"
            size={iconSize}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          style={[styles.playButton, { width: containerSize, height: containerSize }]}
          onPress={handlePlayPause}
          accessible
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          accessibilityRole="button"
          accessibilityState={{ selected: isPlaying }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={iconSize}
            color="#191414"
          />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleNext}
          accessible
          accessibilityLabel="Next track"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="skip-next"
            size={iconSize}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  }

  // Small controls para mini player
  return (
    <View style={styles.smallContainer}>
      <TouchableOpacity onPress={handlePrevious} disabled={!playback.track}>
        <MaterialCommunityIcons
          name="skip-previous"
          size={iconSize}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePlayPause}
        style={[styles.smallPlayButton]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={iconSize}
          color="#191414"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext} disabled={!playback.track}>
        <MaterialCommunityIcons
          name="skip-next"
          size={iconSize}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  largeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 24,
  },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    borderRadius: 40,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  smallPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
