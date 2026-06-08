import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API = 'http://localhost:8000/api/v1';
const { width: W, height: H } = Dimensions.get('window');

const ERA: Record<string, { color: string; year: string; sub: string }> = {
  'The College Dropout':       { color: '#A67C52', year: '2004', sub: 'THE CHIPMUNK SOUL MANIFESTO' },
  'Late Registration':          { color: '#8B7355', year: '2005', sub: 'ORCHESTRAL HIP-HOP REVOLUTION' },
  'Graduation':                 { color: '#C4457A', year: '2007', sub: 'STADIUM SOUND TAKEOVER' },
  '808s and Heartbreak':        { color: '#808080', year: '2008', sub: 'THE BIRTH OF EMO RAP' },
  'My Beautiful Dark Twisted Fantasy': { color: '#CC3333', year: '2010', sub: 'MAXIMALIST MASTERPIECE' },
  'Yeezus':                     { color: '#D4D4D4', year: '2013', sub: 'INDUSTRIAL SELF-DESTRUCTION' },
  'The Life of Pablo':          { color: '#F2652E', year: '2016', sub: 'THE LIVING ALBUM' },
  'Ye':                         { color: '#4A9058', year: '2018', sub: 'WYOMING CONFESSIONS' },
  'Jesus Is King':              { color: '#3B6FB6', year: '2019', sub: 'GOSPEL CONVERSION' },
  'Donda':                      { color: '#1A1A1A', year: '2021', sub: 'THE MOTHER MONUMENT' },
  'Donda 2':                    { color: '#E84820', year: '2022', sub: 'STEM PLAYER EXCLUSIVE' },
  'Vultures 1':                 { color: '#8B1A1A', year: '2024', sub: 'SURVIVAL ARC PT.1' },
  'Vultures 2':                 { color: '#A0522D', year: '2024', sub: 'SURVIVAL ARC PT.2' },
  'Bully':                      { color: '#B0B0B0', year: '2025', sub: 'THE REBIRTH' },
};

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [totalStats, setTotalStats] = useState({ tracks: 0, samples: 0, albums: 0 });

  useEffect(() => {
    fetch(`${API}/samples/artist-songs?artist_id=a01`)
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        const grouped: any = {};
        res.data.forEach((s: any) => {
          const a = s.album || 'Unknown';
          if (!grouped[a]) grouped[a] = [];
          grouped[a].push(s);
        });
        const list = Object.entries(grouped)
          .map(([name, songs]: [string, any]) => ({
            name, songs,
            totalSamples: songs.reduce((t: number, s: any) => t + s.sample_count, 0),
            year: songs[0]?.release_year || 0,
          }))
          .sort((a: any, b: any) => a.year - b.year);
        setAlbums(list);
        setTotalStats({
          tracks: res.meta.total,
          samples: res.data.reduce((t: number, s: any) => t + s.sample_count, 0),
          albums: list.length,
        });
        setExpanded(list[0]?.name || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={S.bg}>
        <View style={S.loadingContainer}>
          <ActivityIndicator size="large" color="#CC3333" />
          <Text style={S.loadingText}>LOADING ARCHIVE</Text>
        </View>
      </View>
    );
  }

  const sampledCount = albums.reduce((t, a) => t + a.totalSamples, 0);

  return (
    <View style={S.bg}>
      {/* HERO - Asymmetric, left-aligned, no center slogans */}
      <View style={S.hero}>
        <Text style={S.heroLabel}>ARCHIVE</Text>
        <Text style={S.heroTitle}>KANYE{'\n'}WEST</Text>
        <View style={S.heroRule} />
        <View style={S.heroStats}>
          <View style={S.heroStat}>
            <Text style={S.heroStatNum}>{totalStats.albums}</Text>
            <Text style={S.heroStatLab}>ALBUMS</Text>
          </View>
          <View style={S.heroStat}>
            <Text style={[S.heroStatNum, { color: '#CC3333' }]}>{totalStats.tracks}</Text>
            <Text style={S.heroStatLab}>TRACKS</Text>
          </View>
          <View style={S.heroStat}>
            <Text style={[S.heroStatNum, { color: '#D4A843' }]}>{sampledCount}</Text>
            <Text style={S.heroStatLab}>SAMPLES</Text>
          </View>
        </View>
      </View>

      {/* TIMELINE */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.timeline}
        style={S.scroll}>
        {/* Timeline rail */}
        <View style={S.rail} />

        {albums.map((album: any, i: number) => {
          const era = ERA[album.name] || { color: '#333', sub: '' };
          const isOpen = expanded === album.name;
          const hasSamples = album.totalSamples > 0;

          return (
            <View key={album.name} style={S.eraBlock}>
              {/* Node on rail */}
              <TouchableOpacity
                style={[S.node, { borderColor: era.color, backgroundColor: isOpen ? era.color : '#0A0A0A' }]}
                activeOpacity={0.7}
                onPress={() => setExpanded(isOpen ? null : album.name)}>
                <Text style={[S.nodeYear, { color: isOpen ? '#EBEBEB' : era.color }]}>
                  {era.year.slice(2)}
                </Text>
              </TouchableOpacity>

              {/* Album info */}
              <TouchableOpacity
                style={S.albumInfo}
                activeOpacity={0.7}
                onPress={() => setExpanded(isOpen ? null : album.name)}>
                <Text style={[S.albumName, { color: isOpen ? era.color : '#CCC' }]}>
                  {album.name}
                </Text>
                <Text style={S.albumSub}>{era.sub}</Text>
                <View style={S.albumMeta}>
                  <Text style={S.albumMetaText}>{album.songs.length} TRACKS</Text>
                  {hasSamples && (
                    <Text style={[S.albumMetaText, { color: '#CC3333' }]}>
                      {album.totalSamples} SAMPLES
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Expanded track list */}
              {isOpen && (
                <View style={S.trackList}>
                  {album.songs.map((song: any) => (
                    <TouchableOpacity
                      key={song.id}
                      style={[S.track, { borderLeftColor: era.color }]}
                      activeOpacity={0.6}
                      onPress={() => nav.navigate('SongDetail', {
                        songId: song.id, songTitle: song.title,
                        artistName: 'Kanye West', songYear: song.release_year,
                        songBpm: song.bpm, songKey: song.key,
                        songGenre: song.sub_genre, songAlbum: song.album,
                      })}>
                      <Text style={S.trackTitle}>{song.title}</Text>
                      <View style={S.trackRight}>
                        <Text style={S.trackMeta}>
                          {song.bpm || '?'}BPM {song.key ? '· ' + song.key : ''}
                        </Text>
                        {song.sample_count > 0 && (
                          <View style={[S.trackBadge, { backgroundColor: '#CC333320' }]}>
                            <Text style={[S.trackBadgeText, { color: '#CC3333' }]}>
                              {song.sample_count}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Bottom anchor */}
        <View style={S.railEnd} />
        <Text style={S.endText}>"I AM THE #1 LIVING AND BREATHING SAMPLE"<Text style={{ color: '#CC3333' }}> KANYE WEST</Text></Text>
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#444', fontSize: 11, letterSpacing: 3, fontWeight: '700' },

  // Hero - left aligned, asymmetric whitespace
  hero: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32 },
  heroLabel: { color: '#CC3333', fontSize: 10, letterSpacing: 4, fontWeight: '800' },
  heroTitle: { color: '#EBEBEB', fontSize: 48, fontWeight: '900', lineHeight: 52, letterSpacing: -1, marginTop: 8 },
  heroRule: { width: 48, height: 3, backgroundColor: '#CC3333', marginTop: 16, marginBottom: 20 },
  heroStats: { flexDirection: 'row', gap: 32 },
  heroStat: {},
  heroStatNum: { color: '#EBEBEB', fontSize: 28, fontWeight: '900' },
  heroStatLab: { color: '#555', fontSize: 9, letterSpacing: 2, fontWeight: '700', marginTop: 2 },

  // Timeline
  scroll: {},
  timeline: { paddingLeft: 44, paddingRight: 20 },
  rail: {
    position: 'absolute', left: 27, top: 0, bottom: 0,
    width: 1, backgroundColor: '#1A1A1A',
  },
  railEnd: {
    position: 'absolute', left: 22, bottom: 60,
    width: 11, height: 11, borderRadius: 6,
    borderWidth: 2, borderColor: '#CC3333', backgroundColor: '#050505',
  },

  // Era block
  eraBlock: { marginBottom: 4 },
  node: {
    position: 'absolute', left: 22,
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
    marginTop: 10, zIndex: 2,
  },
  nodeYear: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  // Album info
  albumInfo: { paddingVertical: 14, paddingLeft: 0 },
  albumName: { fontSize: 17, fontWeight: '800', letterSpacing: 1 },
  albumSub: { color: '#444', fontSize: 9, letterSpacing: 3, fontWeight: '700', marginTop: 3 },
  albumMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  albumMetaText: { color: '#555', fontSize: 10, fontWeight: '700' },

  // Track list
  trackList: { marginBottom: 8, marginTop: 2 },
  track: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingLeft: 12, borderLeftWidth: 2,
    backgroundColor: '#0A0A0A', marginBottom: 1,
  },
  trackTitle: { color: '#AAA', fontSize: 13, fontWeight: '600', flex: 1 },
  trackRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trackMeta: { color: '#444', fontSize: 10 },
  trackBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  trackBadgeText: { fontSize: 10, fontWeight: '800' },

  // Footer
  endText: { color: '#333', fontSize: 9, letterSpacing: 1, fontWeight: '700', marginTop: 40, marginBottom: 40, textAlign: 'center' },
});
