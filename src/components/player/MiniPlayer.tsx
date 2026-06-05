import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants/theme';
import { GradientCover } from '../common/GradientCover';
import { BouncyPressable } from '../common/interactions';
import { Haptic } from '../../utils/haptics';
import { usePlayerStore } from '../../store/playerStore';
import { getAudioEngine } from '../../services/audio/AudioEngine';

export default function MiniPlayer() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const {
    miniPlayerVisible, miniPlayerSongTitle, miniPlayerArtist,
    trackAIsPlaying, trackAPosition, trackADuration,
    hideMiniPlayer,
  } = usePlayerStore();
  const engine = getAudioEngine();

  if (!miniPlayerVisible) return null;

  const progress = trackADuration > 0 ? trackAPosition / trackADuration : 0;

  return (
    <View style={[S.container, { bottom: insets.bottom + 56 }]}>
      {/* Progress bar on top */}
      <View style={S.progressTrack}>
        <View style={[S.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <TouchableOpacity style={S.content} activeOpacity={0.9} onPress={() => nav.navigate('FullPlayer')}>
        {/* Album art */}
        <GradientCover
          artistName={miniPlayerArtist || 'SoundTrace'}
          title={miniPlayerSongTitle || ''}
          size={44} radius={Radius.md}
        />

        {/* Info */}
        <View style={S.info}>
          <Text style={S.title} numberOfLines={1}>{miniPlayerSongTitle || '采样对比'}</Text>
          <Text style={S.artist} numberOfLines={1}>{miniPlayerArtist || '选择采样'}</Text>
        </View>

        {/* Play/Pause */}
        <BouncyPressable onPress={() => { Haptic.medium(); engine.toggle(); }} haptic="medium">
          <View style={S.playBtn}>
            <Text style={S.playIcon}>{trackAIsPlaying ? '⏸' : '▶'}</Text>
          </View>
        </BouncyPressable>

        {/* Close */}
        <TouchableOpacity style={S.closeBtn} onPress={hideMiniPlayer} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={S.closeIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    position: 'absolute', left: Spacing.sm, right: Spacing.sm,
    backgroundColor: Colors.bgCardSolid,
    borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.glass,
  },
  progressTrack: {
    height: 2.5, backgroundColor: Colors.divider,
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.sm, gap: Spacing.md,
  },
  info: { flex: 1, gap: 1 },
  title: { ...Typography.captionBold, color: Colors.textPrimary },
  artist: { ...Typography.small, color: Colors.textSecondary },
  playBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center',
    ...Shadows.glow,
  },
  playIcon: { fontSize: 15, color: Colors.textInverse },
  closeBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  closeIcon: { ...Typography.caption, color: Colors.textTertiary },
});
