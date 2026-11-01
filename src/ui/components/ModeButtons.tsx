// src/ui/components/ModeButtons.tsx

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayerStore } from '@/stores/playerStore';
import { RepeatMode } from '@/core/audio/types';
import { useAuthStore } from '@/stores/authStore';

interface ModeButtonsProps {
  size?: 'small' | 'large';
}

export const ModeButtons: React.FC<ModeButtonsProps> = ({ size = 'large' }) => {
  const { shuffle, repeat, toggleShuffle, setRepeatMode } = usePlayerStore();
  const { isTokenExpired, refreshAccessToken } = useAuthStore();

  const iconSize = size === 'large' ? 24 : 20;

  const handleToggleShuffle = async () => {
    try {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }
      await toggleShuffle();
    } catch (error) {
      console.error('Toggle shuffle failed:', error);
    }
  };

  const handleToggleRepeat = async () => {
    try {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }

      const nextMode =
        repeat === RepeatMode.OFF
          ? RepeatMode.ALL
          : repeat === RepeatMode.ALL
            ? RepeatMode.ONE
            : RepeatMode.OFF;

      await setRepeatMode(nextMode);
    } catch (error) {
      console.error('Set repeat mode failed:', error);
    }
  };

  const repeatIconName =
    repeat === RepeatMode.OFF
      ? 'repeat-off'
      : repeat === RepeatMode.ONE
        ? 'repeat-once'
        : 'repeat';

  if (size === 'large') {
    return (
      <View style={styles.largeContainer}>
        {/* Shuffle */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            shuffle && styles.modeButtonActive,
          ]}
          onPress={handleToggleShuffle}
          accessible
          accessibilityLabel={`Shuffle ${shuffle ? 'on' : 'off'}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: shuffle }}
        >
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={iconSize}
            color={shuffle ? '#1DB954' : '#b3b3b3'}
          />
          {shuffle && <View style={styles.activeBadge} />}
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            repeat !== RepeatMode.OFF && styles.modeButtonActive,
          ]}
          onPress={handleToggleRepeat}
          accessible
          accessibilityLabel={`Repeat mode: ${repeat}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: repeat !== RepeatMode.OFF }}
        >
          <View style={styles.repeatButtonContent}>
            <MaterialCommunityIcons
              name={repeatIconName}
              size={iconSize}
              color={repeat !== RepeatMode.OFF ? '#1DB954' : '#b3b3b3'}
            />
            {repeat === RepeatMode.ONE && (
              <Text style={styles.repeatBadgeText}>1</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Small buttons
  return (
    <View style={styles.smallContainer}>
      <TouchableOpacity
        onPress={handleToggleShuffle}
        style={[shuffle && styles.smallButtonActive]}
      >
        <MaterialCommunityIcons
          name="shuffle-variant"
          size={iconSize}
          color={shuffle ? '#1DB954' : '#b3b3b3'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleToggleRepeat}
        style={[repeat !== RepeatMode.OFF && styles.smallButtonActive]}
      >
        <MaterialCommunityIcons
          name={repeatIconName}
          size={iconSize}
          color={repeat !== RepeatMode.OFF ? '#1DB954' : '#b3b3b3'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  largeContainer: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  smallContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  modeButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  activeBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1DB954',
  },
  repeatButtonContent: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadgeText: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    fontSize: 10,
    fontFamily: 'Spotify-Bold',
    color: '#1DB954',
    backgroundColor: '#191414',
    borderRadius: 4,
    paddingHorizontal: 2,
  },
  smallButtonActive: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderRadius: 6,
    padding: 6,
  },
});
