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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass } from '../constants/theme';
import { SectionHeader, LoadingSpinner } from '../components/common';
import { useSampleStore } from '../store/sampleStore';
import type { Song } from '../types/entities';

export default function RecommendationsScreen() {
  const navigation = useNavigation<any>();
  const { recommendations, loadRecommendations, currentSong, loading } = useSampleStore();

  useEffect(() => {
    // Load recommendations for the most recently viewed song or default
    if (currentSong) {
      loadRecommendations(currentSong.id);
    } else {
      loadRecommendations('s07'); // Otis as default (has known samples)
    }
  }, []);

  const handleSongPress = (song: Song) => {
    navigation.navigate('SongDetail', { songId: song.id });
  };

  if (loading || !recommendations) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>发现</Text>
          <Text style={styles.subtitle}>基于采样DNA的智能推荐</Text>
        </View>
        <LoadingSpinner message="正在分析采样关联..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>发现</Text>
          <Text style={styles.subtitle}>基于采样DNA & 制作人人脉的独家推荐</Text>
        </View>

        {/* Section 1: Same Sample */}
        <View style={styles.section}>
          <SectionHeader
            title="🧬 同采样源"
            actionLabel={`${recommendations.sameSample.length}首`}
          />
          <FlatList
            horizontal
            data={recommendations.sameSample}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <RecommendCard song={item} onPress={() => handleSongPress(item)} badge="同采样" badgeColor={Colors.purple} />
            )}
          />
        </View>

        {/* Section 2: Same Producer */}
        <View style={styles.section}>
          <SectionHeader
            title="🎛 同制作人作品"
            actionLabel={`${recommendations.sameProducer.length}首`}
          />
          <FlatList
            horizontal
            data={recommendations.sameProducer}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <RecommendCard song={item} onPress={() => handleSongPress(item)} badge="同制作人" badgeColor={Colors.accent} />
            )}
          />
        </View>

        {/* Section 3: Same Style */}
        <View style={styles.section}>
          <SectionHeader
            title="🎵 同曲风/BPM"
            actionLabel={`${recommendations.sameStyle.length}首`}
          />
          <FlatList
            horizontal
            data={recommendations.sameStyle}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <RecommendCard song={item} onPress={() => handleSongPress(item)} badge={item.subGenre.replace(/_/g, ' ')} badgeColor={Colors.fx} />
            )}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Recommend Card ───────────────────────────────────

function RecommendCard({
  song,
  onPress,
  badge,
  badgeColor,
}: {
  song: Song;
  onPress: () => void;
  badge: string;
  badgeColor: string;
}) {
  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={cardStyles.cover}>
        <Text style={cardStyles.coverEmoji}>💿</Text>
        <View style={[cardStyles.badge, { backgroundColor: badgeColor + '30' }]}>
          <Text style={[cardStyles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      </View>
      <View style={cardStyles.info}>
        <Text style={cardStyles.title} numberOfLines={1}>{song.title}</Text>
        <Text style={cardStyles.artist} numberOfLines={1}>{song.primaryArtist.name}</Text>
        <View style={cardStyles.meta}>
          <Text style={cardStyles.metaText}>{song.bpm} BPM</Text>
          <Text style={cardStyles.metaText}>·</Text>
          <Text style={cardStyles.metaText}>{song.key}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.divider,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.md,
  },
  cover: {
    height: 120,
    backgroundColor: Colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEmoji: { fontSize: 40 },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  badgeText: { ...Typography.label, textTransform: 'none' },
  info: {
    padding: Spacing.md,
    gap: 2,
  },
  title: { ...Typography.captionBold, color: Colors.textPrimary },
  artist: { ...Typography.caption, color: Colors.textSecondary },
  meta: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  metaText: { ...Typography.label, color: Colors.textTertiary, textTransform: 'none' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  section: {
    marginBottom: Spacing.sm,
  },
  horizontalList: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
