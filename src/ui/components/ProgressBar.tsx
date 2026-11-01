// src/ui/components/ProgressBar.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { usePlayerStore } from '@/stores/playerStore';

interface ProgressBarProps {
  showTime?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ showTime = true }) => {
  const { playback, seek } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragProgress = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width;
  const barWidth = screenWidth - 32; // padding

  const progress = playback.duration ? playback.position / playback.duration : 0;
  const progressWidth = barWidth * progress;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newProgress = Math.max(0, Math.min(barWidth, touchX));
        dragProgress.setValue(newProgress);
      },
      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newProgress = Math.max(0, Math.min(barWidth, touchX));
        const percentage = newProgress / barWidth;
        const newPosition = percentage * playback.duration;

        seek(newPosition);
        setIsDragging(false);
      },
    }),
  ).current;

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayPosition = isDragging
    ? dragProgress.__getValue() / barWidth * playback.duration
    : playback.position;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View
        style={[styles.barContainer]}
        {...panResponder.panHandlers}
      >
        {/* Background track */}
        <View style={[styles.track, { width: barWidth }]}>
          {/* Played portion */}
          <Animated.View
            style={[
              styles.progress,
              {
                width: isDragging
                  ? dragProgress
                  : `${progress * 100}%`,
              },
            ]}
          />

          {/* Buffered portion (futuro feature) */}
          <View
            style={[
              styles.buffered,
              {
                width: `${(progress + 0.2) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              left: isDragging
                ? dragProgress
                : `${progress * 100}%`,
              marginLeft: -6,
            },
          ]}
        />
      </View>

      {/* Time display */}
      {showTime && (
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(displayPosition)}</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.time}>{formatTime(playback.duration)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  barContainer: {
    height: 30,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#404040',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  buffered: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#b3b3b3',
    fontFamily: 'Spotify-Medium',
  },
});
