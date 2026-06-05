import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass } from '../constants/theme';
import { SectionHeader, SongRow } from '../components/common';
import { showToast } from '../components/common/toast';
import { mockSongs } from '../services/api/mockData';
import type { Song } from '../types/entities';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const handleSongPress = (song: Song) => {
    navigation.navigate('SongDetail', { songId: song.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.username}>音乐探索者</Text>
          <Text style={styles.bio}>发现采样背后的故事</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>溯源歌曲</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>收藏采样</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>关注制作人</Text>
            </View>
          </View>
        </View>

        {/* Saved Samples */}
        <SectionHeader title="📌 收藏的采样" actionLabel="查看全部" onAction={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedScroll}
        >
          {[
            { name: 'Try a Little Tenderness', artist: 'Aretha Franklin', year: 1963, type: 'vocal_chop' },
            { name: 'Funky Drummer', artist: 'James Brown', year: 1970, type: 'drum' },
            { name: 'Impeach the President', artist: 'James Brown', year: 1973, type: 'drum' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.savedCard} activeOpacity={0.7}>
              <View style={styles.savedCover}>
                <Text style={styles.savedCoverIcon}>🎵</Text>
              </View>
              <Text style={styles.savedName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.savedArtist} numberOfLines={1}>{item.artist}</Text>
              <Text style={styles.savedYear}>{item.year}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent History */}
        <SectionHeader title="🕐 最近浏览" actionLabel="清除" onAction={() => showToast('浏览历史已清除', 'success')} />
        {mockSongs.slice(0, 3).map(song => (
          <SongRow
            key={song.id}
            title={song.title}
            artist={song.primaryArtist.name}
            bpm={song.bpm}
            keySignature={song.key}
            subGenre={song.subGenre}
            sampleCount={song.sampleCount}
            onPress={() => handleSongPress(song)}
          />
        ))}

        {/* Settings Link */}
        <TouchableOpacity
          style={styles.settingsLink}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
          <Text style={styles.settingsText}>设置</Text>
          <Text style={styles.settingsArrow}>→</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  profileHeader: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.bgSecondary,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bgCardSolid,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
    marginBottom: Spacing.md,
    ...Shadows.glow
  },
  avatarText: { fontSize: 36 },
  username: { ...Typography.h2, color: Colors.textPrimary },
  bio: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...Typography.h2, color: Colors.accent },
  statLabel: { ...Typography.label, color: Colors.textTertiary, textTransform: 'none', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.divider },
  savedScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  savedCard: {
    width: 120,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  savedCover: {
    width: 80, height: 80, borderRadius: Radius.sm,
    backgroundColor: Colors.bgSecondary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  savedCoverIcon: { fontSize: 32 },
  savedName: { ...Typography.captionBold, color: Colors.textPrimary, textAlign: 'center' },
  savedArtist: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  savedYear: { ...Typography.label, color: Colors.accent, textTransform: 'none' },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  settingsIcon: { fontSize: 18 },
  settingsText: { flex: 1, ...Typography.bodyBold, color: Colors.textPrimary },
  settingsArrow: { ...Typography.h3, color: Colors.textTertiary },
});
