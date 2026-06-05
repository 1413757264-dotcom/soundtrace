import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { mockSongs } from '../services/api/mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={s.c} edges={['top']}>
      <ScrollView>
        <View style={s.header}>
          <Text style={s.logo}>音迹</Text>
          <Text style={s.sub}>单曲DNA溯源引擎</Text>
        </View>
        <View style={s.list}>
          {mockSongs.map(song => (
            <TouchableOpacity key={song.id} style={s.card} activeOpacity={0.7}>
              <Text style={s.songTitle}>{song.title}</Text>
              <Text style={s.songArtist}>{song.primaryArtist.name} · {song.releaseYear}</Text>
              <Text style={s.songMeta}>{song.bpm} BPM · {song.key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: Spacing.xl },
  logo: { ...Typography.hero, color: Colors.accent },
  sub: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  list: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg,
    padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songArtist: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  songMeta: { ...Typography.small, color: Colors.textTertiary, marginTop: 2 },
});
