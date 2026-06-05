import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass, SampleTypeColor } from '../constants/theme';
import { LoadingSpinner, SongRow, Chip, SectionHeader } from '../components/common';
import DualWaveformPlayer from '../components/player/DualWaveformPlayer';
import { useSampleStore } from '../store/sampleStore';
import { usePlayerStore } from '../store/playerStore';
import { useDualPlayer } from '../hooks/useDualPlayer';
import {
  mockWaveformOriginal,
  mockWaveformTarget,
  getUpstreamTrace,
  getSampleDownstream,
} from '../services/api/mockData';
import type { Sample, Song, Genre } from '../types/entities';

const GENRE_CN: Record<string, string> = {
  soul: '灵魂乐', funk: 'Funk', blues: '布鲁斯', jazz: '爵士',
  rock: '摇滚', disco: '迪斯科', rnb: 'R&B', electronic: '电子',
  classical: '古典', unknown: '未知',
};

export default function SampleDeconstructionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sampleId, songId } = route.params || {};

  const { currentSamples, currentSong, downstreamMap, loadDownstream } = useSampleStore();
  const { setHighlight } = usePlayerStore();
  const { loadAndPlay } = useDualPlayer();

  const sample = currentSamples.find(s => s.id === sampleId);
  const downstream = downstreamMap[sampleId];

  useEffect(() => {
    if (sampleId) {
      loadDownstream(sampleId);
    }
  }, [sampleId]);

  useEffect(() => {
    if (sample) {
      setHighlight(sample.startTimeMs, sample.endTimeMs);
    }
  }, [sample]);

  // Auto-load audio when sample has preview URLs
  useEffect(() => {
    if (sample?.audioPreviewUrl && currentSong) {
      // Use the sample preview for original, and a demo track for target
      const targetAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
      loadAndPlay(
        sample.audioPreviewUrl,
        targetAudioUrl,
        sample.endTimeMs - sample.startTimeMs,
        16000
      ).catch(() => {
        // Audio loading may fail silently in dev — that's OK
      });
    }
  }, [sample?.audioPreviewUrl, currentSong?.id]);

  if (!sample || !currentSong) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner message="加载采样溯源数据..." />
      </SafeAreaView>
    );
  }

  const handleSongPress = (song: Song) => {
    navigation.push('SongDetail', { songId: song.id });
  };

  const typeLabel = { drum: '鼓组', melody: '旋律', vocal_chop: '人声切片', bass: 'Bass', fx: '音效', texture: '质感', dialog: '对白' }[sample.type];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.typeRow}>
              <View style={[styles.typeDot, { backgroundColor: SampleTypeColor[sample.type] }]} />
              <Text style={styles.typeLabel}>{typeLabel}采样</Text>
              {sample.attributionConfirmed && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ 已确认</Text>
                </View>
              )}
            </View>
            <Text style={styles.sourceTitle}>{sample.sourceSongTitle}</Text>
            <Text style={styles.sourceArtist}>
              {sample.sourceArtist.name} · {sample.sourceReleaseYear} · {GENRE_CN[sample.sourceGenre] || sample.sourceGenre}
            </Text>
          </View>
        </View>

        {/* Waveform Comparison */}
        <SectionHeader title="🔬 波形对照" />
        <DualWaveformPlayer
          originalWaveform={mockWaveformOriginal}
          targetWaveform={mockWaveformTarget}
          originalLabel={`原始采样: ${sample.sourceSongTitle} (${formatTime(sample.startTimeMs)}–${formatTime(sample.endTimeMs)})`}
          targetLabel={`采样运用: ${currentSong.title} (${formatTime(sample.targetStartTimeMs)}–${formatTime(sample.targetEndTimeMs)})`}
          highlightStartMs={sample.startTimeMs}
          highlightEndMs={sample.endTimeMs}
        />

        {/* Sample Metadata */}
        <View style={styles.metaSection}>
          <View style={styles.metaGrid}>
            <MetaItem label="采样类型" value={typeLabel!} color={SampleTypeColor[sample.type]} />
            <MetaItem label="原始年代" value={String(sample.sourceReleaseYear)} />
            <MetaItem label="原始曲风" value={GENRE_CN[sample.sourceGenre] || sample.sourceGenre} />
            <MetaItem label="置信度" value={`${Math.round(sample.confidenceScore * 100)}%`} color={Colors.accent} />
          </View>
          {sample.description && (
            <View style={styles.descCard}>
              <Text style={styles.descLabel}>📝 采样分析</Text>
              <Text style={styles.descText}>{sample.description}</Text>
            </View>
          )}
        </View>

        {/* Upstream Trace */}
        <SectionHeader title="⬆️ 向上溯源" />
        <View style={styles.traceSection}>
          <View style={styles.traceChain}>
            <TraceNode
              label={sample.sourceSongTitle}
              sub={sample.sourceArtist.name}
              year={sample.sourceReleaseYear}
              isOrigin
            />
            <View style={styles.traceLine} />
            <TraceNode
              label={currentSong.title}
              sub={currentSong.primaryArtist.name}
              year={currentSong.releaseYear}
              isTarget
            />
          </View>
          <Text style={styles.traceHint}>
            {currentSong.primaryArtist.name} 在 {currentSong.releaseYear} 年采样了 {sample.sourceArtist.name} {sample.sourceReleaseYear}年的 {sample.sourceSongTitle}
          </Text>
        </View>

        {/* Downstream Usage */}
        <SectionHeader
          title="⬇️ 向下溯源 · 同采样歌曲"
          actionLabel={downstream ? `共${downstream.totalCount}首` : ''}
        />
        <View style={styles.downstreamSection}>
          {downstream && downstream.songs.length > 0 ? (
            downstream.songs.map((song, i) => (
              <SongRow
                key={song.id || i}
                title={song.title}
                artist={song.primaryArtist.name}
                bpm={song.bpm}
                keySignature={song.key}
                subGenre={song.subGenre}
                sampleCount={song.sampleCount}
                onPress={() => handleSongPress(song)}
              />
            ))
          ) : (
            <View style={styles.emptyDownstream}>
              <Text style={styles.emptyText}>加载中...</Text>
            </View>
          )}
        </View>

        {/* Compare Button */}
        <TouchableOpacity
          style={styles.compareBtn}
          onPress={() => navigation.navigate('SampleComparison', { sampleId, songId })}
          activeOpacity={0.7}
        >
          <Text style={styles.compareBtnText}>🔬 全屏对比模式</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────

function MetaItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={metaStyles.item}>
      <Text style={metaStyles.label}>{label}</Text>
      <Text style={[metaStyles.value, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  label: { ...Typography.label, color: Colors.textTertiary, textTransform: 'none' },
  value: { ...Typography.bodyBold, color: Colors.textPrimary },
});

function TraceNode({ label, sub, year, isOrigin, isTarget }: {
  label: string; sub: string; year: number; isOrigin?: boolean; isTarget?: boolean;
}) {
  return (
    <View style={[
      traceStyles.node,
      isOrigin && traceStyles.originNode,
      isTarget && traceStyles.targetNode,
    ]}>
      <Text style={traceStyles.year}>{year}</Text>
      <Text style={traceStyles.label} numberOfLines={1}>{label}</Text>
      <Text style={traceStyles.sub} numberOfLines={1}>{sub}</Text>
    </View>
  );
}

const traceStyles = StyleSheet.create({
  node: {
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: 140,
    alignItems: 'center',
    gap: 2,
  },
  originNode: { borderLeftWidth: 3, borderLeftColor: Colors.purple },
  targetNode: { borderLeftWidth: 3, borderLeftColor: Colors.accent },
  year: { ...Typography.mono, color: Colors.accent },
  label: { ...Typography.captionBold, color: Colors.textPrimary, textAlign: 'center' },
  sub: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
});

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  headerInfo: { flex: 1, gap: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  typeDot: { width: 8, height: 8, borderRadius: 4 },
  typeLabel: { ...Typography.captionBold, color: Colors.textSecondary },
  verifiedBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm,
  },
  verifiedText: { ...Typography.label, color: Colors.success, textTransform: 'none' },
  sourceTitle: { ...Typography.h2, color: Colors.textPrimary },
  sourceArtist: { ...Typography.caption, color: Colors.textSecondary },
  metaSection: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  descCard: {
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.divider,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  descLabel: { ...Typography.captionBold, color: Colors.accent, marginBottom: 4 },
  descText: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic' },
  traceSection: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  traceChain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginBottom: Spacing.sm,
  },
  traceLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.divider,
    marginHorizontal: -8,
  },
  traceHint: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.sm },
  downstreamSection: {
    paddingHorizontal: Spacing.md,
  },
  emptyDownstream: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: { ...Typography.caption, color: Colors.textTertiary },
  compareBtn: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    height: 52,
    backgroundColor: Colors.purpleMuted,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  compareBtnText: { ...Typography.bodyBold, color: Colors.purple },
});
