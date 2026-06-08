import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API = 'http://localhost:8000/api/v1';
const ERA_COLORS = [
  '#A67C52', '#8B7355', '#C4457A', '#808080', '#CC3333',
  '#D4D4D4', '#F2652E', '#4A9058', '#3B6FB6', '#1A1A1A',
  '#E84820', '#8B1A1A', '#A0522D', '#B0B0B0',
];

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  const [stats, setStats] = useState<any>(null);
  const [topSampled, setTopSampled] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/samples/artist-songs?artist_id=a01`)
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        const songs = res.data;
        const albumSet = new Set(songs.map((s: any) => s.album));
        const totalSamples = songs.reduce((t: number, s: any) => t + s.sample_count, 0);
        const totalCredits = songs.reduce((t: number, s: any) => t + s.credit_count, 0);
        const sampledTracks = songs.filter((s: any) => s.sample_count > 0).length;
        const totalMs = songs.reduce((t: number, s: any) => t + s.duration_ms, 0);

        setStats({
          tracks: songs.length, albums: albumSet.size,
          samples: totalSamples, credits: totalCredits,
          sampledTracks, totalMin: Math.floor(totalMs / 60000),
          avgBpm: Math.round(songs.reduce((t: number, s: any) => t + (s.bpm || 0), 0) / songs.length),
        });

        const grouped: any = {};
        songs.forEach((s: any) => {
          if (!s.album) return;
          if (!grouped[s.album]) grouped[s.album] = { name: s.album, year: s.release_year, tracks: 0, samples: 0, credits: 0 };
          grouped[s.album].tracks += 1;
          grouped[s.album].samples += s.sample_count;
          grouped[s.album].credits += s.credit_count;
        });
        setAlbums(Object.values(grouped).sort((a: any, b: any) => a.year - b.year));

        setTopSampled(
          songs.filter((s: any) => s.sample_count > 0)
            .sort((a: any, b: any) => b.sample_count - a.sample_count)
            .slice(0, 10)
        );
      });
  }, []);

  if (!stats) {
    return (
      <SafeAreaView style={S.bg} edges={['top']}>
        <ActivityIndicator size="large" color="#CC3333" style={{ marginTop: 200 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={S.bg} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.headerLabel}>DATA</Text>
          <Text style={S.headerTitle}>THE<Text style={{ color: '#CC3333' }}> NUMBERS</Text></Text>
        </View>

        {/* Big numbers */}
        <View style={S.bigRow}>
          <View style={S.bigCell}>
            <Text style={S.bigNum}>{stats.tracks}</Text>
            <Text style={S.bigLab}>TRACKS</Text>
          </View>
          <View style={S.bigCell}>
            <Text style={[S.bigNum, { color: '#CC3333' }]}>{stats.samples}</Text>
            <Text style={S.bigLab}>SAMPLES</Text>
          </View>
          <View style={S.bigCell}>
            <Text style={[S.bigNum, { color: '#D4A843' }]}>{stats.credits}</Text>
            <Text style={S.bigLab}>CREDITS</Text>
          </View>
        </View>

        {/* Secondary stats */}
        <View style={S.secRow}>
          {[
            { v: stats.albums, l: 'ALBUMS' },
            { v: stats.sampledTracks, l: 'WITH SAMPLES' },
            { v: `${stats.totalMin}`, l: 'MINUTES' },
            { v: stats.avgBpm, l: 'AVG BPM' },
          ].map((s, i) => (
            <View key={i} style={S.secCell}>
              <Text style={S.secVal}>{s.v}</Text>
              <Text style={S.secLab}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Album bars */}
        <View style={S.section}>
          <Text style={S.secHead}>ALBUM BREAKDOWN</Text>
        </View>
        {albums.map((a: any, i: number) => {
          const maxSamples = Math.max(...albums.map((x: any) => x.samples), 1);
          const barW = Math.max((a.samples / maxSamples) * 120, 2);
          return (
            <View key={a.name} style={S.barRow}>
              <View style={[S.bar, { width: barW, backgroundColor: ERA_COLORS[i % ERA_COLORS.length] }]} />
              <Text style={S.barName} numberOfLines={1}>{a.name}</Text>
              <Text style={S.barStats}>{a.tracks}T {a.samples}S</Text>
            </View>
          );
        })}

        {/* Most sampled */}
        <View style={S.section}>
          <Text style={S.secHead}>MOST SAMPLED</Text>
        </View>
        {topSampled.map((s, i) => (
          <TouchableOpacity key={s.id} style={S.rankRow} activeOpacity={0.6}
            onPress={() => nav.navigate('SongDetail', {
              songId: s.id, songTitle: s.title, artistName: 'Kanye West',
              songYear: s.release_year, songBpm: s.bpm, songKey: s.key,
              songGenre: s.sub_genre, songAlbum: s.album,
            })}>
            <Text style={S.rankNum}>{String(i + 1).padStart(2, '0')}</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.rankTitle}>{s.title}</Text>
              <Text style={S.rankMeta}>{s.album} * {s.release_year}</Text>
            </View>
            <Text style={S.rankSamples}>{s.sample_count} SMPL</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  headerLabel: { color: '#CC3333', fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  headerTitle: { color: '#EBEBEB', fontSize: 26, fontWeight: '900', letterSpacing: 2, marginTop: 4 },

  bigRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 2, marginBottom: 20 },
  bigCell: { flex: 1, backgroundColor: '#0A0A0A', padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  bigNum: { color: '#EBEBEB', fontSize: 36, fontWeight: '900' },
  bigLab: { color: '#555', fontSize: 9, letterSpacing: 2, fontWeight: '700', marginTop: 4 },

  secRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 6, marginBottom: 36 },
  secCell: { flex: 1, backgroundColor: '#0A0A0A', padding: 12, alignItems: 'center' },
  secVal: { color: '#CCC', fontSize: 16, fontWeight: '800' },
  secLab: { color: '#555', fontSize: 8, letterSpacing: 1, fontWeight: '700', marginTop: 2 },

  section: { paddingHorizontal: 24, marginTop: 20, marginBottom: 12 },
  secHead: { color: '#CC3333', fontSize: 11, letterSpacing: 3, fontWeight: '800' },

  barRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 24, gap: 14 },
  bar: { height: 2, maxWidth: 120 },
  barName: { color: '#999', fontSize: 12, fontWeight: '600', flex: 1 },
  barStats: { color: '#444', fontSize: 10, fontWeight: '700' },

  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#0D0D0D' },
  rankNum: { color: '#CC3333', fontSize: 14, fontWeight: '900', width: 28 },
  rankTitle: { color: '#CCC', fontSize: 14, fontWeight: '600' },
  rankMeta: { color: '#444', fontSize: 11, marginTop: 1 },
  rankSamples: { color: '#CC3333', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
