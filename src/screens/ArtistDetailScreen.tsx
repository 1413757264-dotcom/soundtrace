import React, { useEffect, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Timing, Glass } from '../constants/theme';
import { SectionHeader, LoadingSpinner } from '../components/common';
import { GradientCover } from '../components/common/GradientCover';
import { FadeInView } from '../components/common/ux';
import { getArtistSongs, getProducerSongs, getSongWithSamples, mockSongs, mockSamples } from '../services/api/mockData';
import type { Song, Artist, Sample } from '../types/entities';

export default function ArtistDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { artistId, artistName } = route.params || {};
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: Timing.slow, useNativeDriver: true }).start();
  }, []);

  const songs = useMemo(() => getArtistSongs(artistId), [artistId]);
  const prodSongs = useMemo(() => getProducerSongs(artistId), [artistId]);
  const sampledIn = useMemo(() =>
    mockSamples.filter(s => s.sourceArtist.id === artistId).map(s => {
      const target = mockSongs.find(x => x.id === s.targetSongId);
      return { sample: s, song: target };
    }).filter(x => x.song)
  , [artistId]);

  const totalCredits = songs.length;
  const sampleCount = sampledIn.length;

  if (songs.length === 0) {
    return <SafeAreaView style={st.c} edges={['top']}><LoadingSpinner message="加载艺人数据..." /></SafeAreaView>;
  }

  const artist = songs[0].primaryArtist.id === artistId
    ? songs[0].primaryArtist
    : songs[0].featuredArtists.find(a => a.id === artistId) || songs[0].primaryArtist;

  return (
    <SafeAreaView style={st.c} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={st.hero}>
          <GradientCover artistName={artist.name} size={120} radius={Radius.xl} fontSize={48} showInitials />
          <View style={st.heroOverlay}>
            <TouchableOpacity onPress={() => nav.goBack()} style={st.backBtn}>
              <Text style={st.backText}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[st.body, { opacity: fade }]}>
          <Text style={st.name}>{artist.name}</Text>
          <Text style={st.genres}>{artist.genres.map(g => g.replace('_',' ').toUpperCase()).join(' · ')}</Text>

          {/* Stats */}
          <View style={st.stats}>
            <Stat label="作品" value={String(totalCredits)} />
            <Stat label="参与" value={String(songs.filter(s => s.featuredArtists.some(a => a.id === artistId)).length)} />
            <Stat label="被采样" value={String(sampleCount)} accent />
            <Stat label="制作" value={String(prodSongs.length)} />
          </View>

          {/* Discography */}
          <SectionHeader title="💿 作品列表" />
          {songs.map(s => (
            <TouchableOpacity
              key={s.id} style={st.songRow}
              onPress={() => nav.navigate('SongDetail', { songId: s.id })}
              activeOpacity={0.7}
            >
              <GradientCover artistName={s.primaryArtist.name} title={s.title} size={44} radius={Radius.sm} fontSize={16} />
              <View style={st.songInfo}>
                <Text style={st.songTitle} numberOfLines={1}>{s.title}</Text>
                <Text style={st.songMeta}>{s.releaseYear} · {s.subGenre.replace(/_/g, ' ').toUpperCase()} · {s.bpm} BPM · {s.key}</Text>
              </View>
              <Text style={st.songArrow}>→</Text>
            </TouchableOpacity>
          ))}

          {/* Sampled In */}
          {sampledIn.length > 0 && (
            <>
              <SectionHeader title="🧬 被采样于" />
              {sampledIn.map(({ sample, song }) => song && (
                <TouchableOpacity
                  key={sample.id} style={st.songRow}
                  onPress={() => nav.navigate('SongDetail', { songId: song!.id })}
                  activeOpacity={0.7}
                >
                  <GradientCover artistName={song.primaryArtist.name} title={song.title} size={44} radius={Radius.sm} fontSize={16} />
                  <View style={st.songInfo}>
                    <Text style={st.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={st.songMeta}>
                      {song.primaryArtist.name} · {song.releaseYear} · {sample.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={st.songArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Producer Credits */}
          {prodSongs.length > 0 && prodSongs.some(s => s.primaryArtist.id !== artistId) && (
            <>
              <SectionHeader title="🎛 制作作品" />
              {prodSongs.filter(s => s.primaryArtist.id !== artistId).map(s => (
                <TouchableOpacity
                  key={s.id} style={st.songRow}
                  onPress={() => nav.navigate('SongDetail', { songId: s.id })}
                  activeOpacity={0.7}
                >
                  <GradientCover artistName={s.primaryArtist.name} title={s.title} size={44} radius={Radius.sm} fontSize={16} />
                  <View style={st.songInfo}>
                    <Text style={st.songTitle} numberOfLines={1}>{s.title}</Text>
                    <Text style={st.songMeta}>{s.primaryArtist.name} · {s.releaseYear}</Text>
                  </View>
                  <Text style={st.songArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={st.statItem}>
      <Text style={[st.statVal, accent && { color: Colors.accent }]}>{value}</Text>
      <Text style={st.statLab}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  hero: {
    height: 180, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: { position: 'absolute', top: Spacing.safeTop, left: Spacing.lg },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.bgOverlay, justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  body: { paddingHorizontal: Spacing.lg, marginTop: -20 },
  name: { ...Typography.display, color: Colors.textPrimary, marginTop: Spacing.lg },
  genres: { ...Typography.captionBold, color: Colors.accent, marginTop: 4 },
  stats: {
    flexDirection: 'row', marginTop: Spacing.xxl,
    backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { ...Typography.h2, color: Colors.textPrimary },
  statLab: { ...Typography.smallBold, color: Colors.textTertiary, marginTop: 2 },
  songRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  songInfo: { flex: 1, gap: 2 },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songMeta: { ...Typography.small, color: Colors.textTertiary },
  songArrow: { ...Typography.h3, color: Colors.textTertiary },
});
