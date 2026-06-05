import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';
import DualWaveformPlayer from '../components/player/DualWaveformPlayer';
import { useSampleStore } from '../store/sampleStore';
import { usePlayerStore } from '../store/playerStore';
import { mockWaveformOriginal, mockWaveformTarget } from '../services/api/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SampleComparisonScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sampleId, songId } = route.params || {};

  const { currentSamples, currentSong } = useSampleStore();
  const { setHighlight, playbackMode, setPlaybackMode } = usePlayerStore();

  const sample = currentSamples.find(s => s.id === sampleId);

  useEffect(() => {
    if (sample) setHighlight(sample.startTimeMs, sample.endTimeMs);
  }, [sample]);

  if (!sample || !currentSong) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>未找到采样数据</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <Text style={styles.topTitle} numberOfLines={1}>采样对比</Text>
          <Text style={styles.topSub}>{sample.sourceSongTitle} vs {currentSong.title}</Text>
        </View>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, playbackMode === 'linked' && styles.modeBtnActive]}
            onPress={() => setPlaybackMode('linked')}
          >
            <Text style={[styles.modeBtnText, playbackMode === 'linked' && styles.modeBtnTextActive]}>联动</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, playbackMode === 'independent' && styles.modeBtnActive]}
            onPress={() => setPlaybackMode('independent')}
          >
            <Text style={[styles.modeBtnText, playbackMode === 'independent' && styles.modeBtnTextActive]}>独立</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full-screen Waveform */}
      <View style={styles.playerArea}>
        <DualWaveformPlayer
          originalWaveform={mockWaveformOriginal}
          targetWaveform={mockWaveformTarget}
          originalLabel={`原采样 · ${sample.sourceSongTitle}`}
          targetLabel={`新歌 · ${currentSong.title}`}
          highlightStartMs={sample.startTimeMs}
          highlightEndMs={sample.endTimeMs}
        />
      </View>

      {/* Info Cards */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>原始</Text>
          <Text style={styles.infoValue}>{sample.sourceArtist.name}</Text>
          <Text style={styles.infoSub}>{sample.sourceReleaseYear} · {sample.sourceSongTitle}</Text>
        </View>
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={[styles.infoCard, styles.infoCardTarget]}>
          <Text style={styles.infoLabel}>采样运用</Text>
          <Text style={styles.infoValue}>{currentSong.primaryArtist.name}</Text>
          <Text style={styles.infoSub}>{currentSong.releaseYear} · {currentSong.title}</Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
        <Text style={styles.saveBtnText}>💾 保存此对比</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.textSecondary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
  },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  topInfo: { flex: 1 },
  topTitle: { ...Typography.h3, color: Colors.textPrimary },
  topSub: { ...Typography.caption, color: Colors.textTertiary },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.sm,
    padding: 2,
  },
  modeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.sm },
  modeBtnActive: { backgroundColor: Colors.accent },
  modeBtnText: { ...Typography.captionBold, color: Colors.textTertiary },
  modeBtnTextActive: { color: Colors.textInverse },
  playerArea: { flex: 1, justifyContent: 'center' },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  infoCardTarget: { borderColor: Colors.accent, borderWidth: 1 },
  infoLabel: { ...Typography.label, color: Colors.textTertiary, textTransform: 'none' },
  infoValue: { ...Typography.bodyBold, color: Colors.textPrimary, marginTop: 4 },
  infoSub: { ...Typography.caption, color: Colors.textTertiary, marginTop: 2 },
  vsBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.accent,
  },
  vsText: { ...Typography.captionBold, color: Colors.accent },
  saveBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    height: 48,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtnText: { ...Typography.bodyBold, color: Colors.textSecondary },
});
