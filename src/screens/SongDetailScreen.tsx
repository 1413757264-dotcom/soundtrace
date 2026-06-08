import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const API = 'http://localhost:8000/api/v1';

const TYPE: Record<string, { color: string; label: string }> = {
  drum: { color: '#FF5E5E', label: 'DRUM BREAK' },
  melody: { color: '#6C8CFF', label: 'MELODY' },
  vocal_chop: { color: '#FFB347', label: 'VOCAL CHOP' },
  bass: { color: '#B347EA', label: 'BASS LINE' },
  fx: { color: '#2DD4BF', label: 'FX' },
  texture: { color: '#47D4B3', label: 'TEXTURE' },
};

export default function SongDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { songId, songTitle, artistName, songYear, songBpm, songKey, songGenre, songAlbum } = route.params || {};

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/search/enrich?song_id=${songId}`)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, [songId]);

  if (loading) {
    return (
      <View style={S.bg}>
        <View style={S.loadingContainer}>
          <ActivityIndicator size="large" color="#CC3333" />
          <Text style={S.loadingText}>DECODING SAMPLE DNA</Text>
        </View>
      </View>
    );
  }

  const d = data || {};
  const samples = d.samples || [];
  const credits = d.credits || [];
  const albumIntro = d.album_intro;

  return (
    <View style={S.bg}>
      <TouchableOpacity style={S.back} onPress={() => nav.goBack()} activeOpacity={0.7}>
        <Text style={S.backText}>BACK</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.content}>
        {/* HEADER - editorial, left-aligned */}
        <View style={S.header}>
          <Text style={S.headerAlbum}>{songAlbum || 'UNKNOWN ALBUM'}</Text>
          <View style={S.headerRule} />
          <Text style={S.headerTitle}>{songTitle}</Text>
          <Text style={S.headerArtist}>KANYE WEST</Text>
        </View>

        {/* META ROW - compact, no card */}
        <View style={S.metaRow}>
          <View style={S.metaBlock}>
            <Text style={S.metaNumber}>{songYear || '-'}</Text>
            <Text style={S.metaUnit}>YEAR</Text>
          </View>
          <View style={S.metaDiv} />
          <View style={S.metaBlock}>
            <Text style={S.metaNumber}>{songBpm || '-'}</Text>
            <Text style={S.metaUnit}>BPM</Text>
          </View>
          <View style={S.metaDiv} />
          <View style={S.metaBlock}>
            <Text style={S.metaNumber}>{songKey || '-'}</Text>
            <Text style={S.metaUnit}>KEY</Text>
          </View>
          <View style={S.metaDiv} />
          <View style={S.metaBlock}>
            <Text style={[S.metaNumber, { color: '#CC3333' }]}>{samples.length}</Text>
            <Text style={S.metaUnit}>SAMPLES</Text>
          </View>
        </View>

        {songGenre ? <Text style={S.genre}>{formatGenre(songGenre)}</Text> : null}

        {/* THEME - large editorial block */}
        {d.theme ? (
          <View style={S.themeBlock}>
            <Text style={S.themeLead}>THE SONG</Text>
            <Text style={S.themeText}>{d.theme}</Text>
          </View>
        ) : null}

        {/* SAMPLE STORY */}
        {d.context ? (
          <View style={S.themeBlock}>
            <Text style={S.themeLead}>THE SAMPLE</Text>
            <Text style={S.themeText}>{d.context}</Text>
          </View>
        ) : null}

        {/* CREDITS - horizontal pills */}
        {credits.length > 0 && (
          <View style={S.themeBlock}>
            <Text style={S.themeLead}>THE TEAM</Text>
            <View style={S.creditScroll}>
              {credits.map((c: any, i: number) => (
                <View key={i} style={S.creditPill}>
                  <Text style={S.creditName}>{c.artist_name}</Text>
                  <Text style={S.creditRole}>{formatRole(c.role)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SAMPLE DNA CHAIN */}
        <View style={S.chainSection}>
          <Text style={S.chainHead}>SAMPLE<Text style={{ color: '#CC3333' }}> DNA</Text></Text>
          <Text style={S.chainSub}>{samples.length} CONFIRMED SOURCES TRACE</Text>

          {samples.length === 0 ? (
            <View style={S.emptyChain}>
              <Text style={S.emptyText}>No known samples. Original composition.</Text>
            </View>
          ) : (
            samples.map((sp: any, i: number) => {
              const t = TYPE[sp.type] || TYPE.melody;
              return (
                <View key={i} style={S.chainLink}>
                  {/* connection */}
                  {i > 0 && (
                    <View style={S.chainConn}>
                      <View style={S.connTrack} />
                      <Text style={S.connArrow}>TO</Text>
                    </View>
                  )}

                  {/* sample card */}
                  <View style={[S.chainCard, { borderLeftColor: t.color }]}>
                    <View style={S.chainTop}>
                      <View style={[S.chainTypeBadge, { backgroundColor: t.color + '20' }]}>
                        <Text style={[S.chainType, { color: t.color }]}>{t.label}</Text>
                      </View>
                      <Text style={[S.chainConf, { color: t.color }]}>
                        {Math.round((sp.confidence || 0) * 100)}% MATCH
                      </Text>
                    </View>
                    <Text style={S.chainSource}>{sp.source_title}</Text>
                    <Text style={S.chainArtist}>
                      {sp.source_artist}{sp.source_year ? ` * ${sp.source_year}` : ''}
                    </Text>
                    {sp.description ? (
                      <Text style={S.chainDesc}>{sp.description}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ALBUM CONTEXT - at the bottom, heavy editorial */}
        {albumIntro?.bio ? (
          <View style={S.albumContext}>
            <View style={S.albumRule} />
            <Text style={S.albumContextHead}>ALBUM CONTEXT</Text>
            <Text style={S.albumNameContext}>{songAlbum}</Text>
            <Text style={S.albumEra}>{albumIntro.era}</Text>
            <Text style={S.albumBio}>{albumIntro.bio}</Text>
            <View style={S.albumGrid}>
              <View style={S.albumCell}>
                <Text style={S.albumCellLab}>SOUND</Text>
                <Text style={S.albumCellVal}>{albumIntro.sound}</Text>
              </View>
              <View style={S.albumCell}>
                <Text style={S.albumCellLab}>THEME</Text>
                <Text style={S.albumCellVal}>{albumIntro.theme}</Text>
              </View>
              <View style={S.albumCell}>
                <Text style={S.albumCellLab}>LEGACY</Text>
                <Text style={S.albumCellVal}>{albumIntro.legacy}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

function formatGenre(g: string): string {
  const m: any = { conscious: 'CONSCIOUS', boom_bap: 'BOOM BAP', trap: 'TRAP', jazz_rap: 'JAZZ RAP', experimental: 'EXPERIMENTAL', rnb: 'R&B', gospel: 'GOSPEL' };
  return m[g] || g?.replace(/_/g, ' ').toUpperCase() || '';
}

function formatRole(r: string): string {
  const m: any = { producer: 'Producer', featured: 'Featured', mixing_engineer: 'Mix', songwriter: 'Writer', sampled_artist: 'Sample Source' };
  return m[r] || r;
}

const S = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#444', fontSize: 11, letterSpacing: 3, fontWeight: '700' },

  // Back
  back: { position: 'absolute', top: 50, left: 16, zIndex: 10, padding: 10 },
  backText: { color: '#CC3333', fontSize: 11, fontWeight: '800', letterSpacing: 3 },

  // Content
  content: { paddingTop: 100 },

  // Header
  header: { paddingHorizontal: 24, marginBottom: 28 },
  headerAlbum: { color: '#555', fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  headerRule: { width: 32, height: 2, backgroundColor: '#CC3333', marginVertical: 16 },
  headerTitle: { color: '#EBEBEB', fontSize: 34, fontWeight: '900', lineHeight: 38, letterSpacing: -0.5 },
  headerArtist: { color: '#CC3333', fontSize: 12, letterSpacing: 5, fontWeight: '700', marginTop: 8 },

  // Meta row
  metaRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24, gap: 0 },
  metaBlock: { flex: 1 },
  metaNumber: { color: '#EBEBEB', fontSize: 22, fontWeight: '900' },
  metaUnit: { color: '#555', fontSize: 9, letterSpacing: 2, fontWeight: '700', marginTop: 2 },
  metaDiv: { width: 1, backgroundColor: '#1A1A1A' },

  genre: { color: '#D4A843', fontSize: 10, letterSpacing: 3, fontWeight: '800', paddingHorizontal: 24, marginBottom: 32 },

  // Theme block
  themeBlock: { paddingHorizontal: 24, marginBottom: 32 },
  themeLead: { color: '#CC3333', fontSize: 10, letterSpacing: 3, fontWeight: '800', marginBottom: 10 },
  themeText: { color: '#AAA', fontSize: 15, lineHeight: 24, fontWeight: '400' },

  // Credits
  creditScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  creditPill: {
    backgroundColor: '#0A0A0A', borderRadius: 2,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  creditName: { color: '#CCC', fontSize: 12, fontWeight: '600' },
  creditRole: { color: '#555', fontSize: 9, fontWeight: '700', marginTop: 1 },

  // Chain
  chainSection: { paddingHorizontal: 24, marginTop: 8 },
  chainHead: { color: '#EBEBEB', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  chainSub: { color: '#555', fontSize: 10, letterSpacing: 2, fontWeight: '700', marginTop: 4, marginBottom: 24 },
  chainLink: { marginBottom: 2 },

  // Connection
  chainConn: {
    flexDirection: 'row', alignItems: 'center', paddingLeft: 16, marginBottom: 2,
  },
  connTrack: { width: 1, height: 20, backgroundColor: '#1A1A1A', marginRight: 12 },
  connArrow: { color: '#333', fontSize: 9, letterSpacing: 2, fontWeight: '800' },

  // Chain card
  chainCard: {
    backgroundColor: '#0A0A0A', borderRadius: 2,
    padding: 16, borderLeftWidth: 3,
  },
  chainTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  chainTypeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 2 },
  chainType: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  chainConf: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  chainSource: { color: '#EBEBEB', fontSize: 16, fontWeight: '700' },
  chainArtist: { color: '#777', fontSize: 13, marginTop: 3 },
  chainDesc: { color: '#555', fontSize: 11, marginTop: 8, fontStyle: 'italic', lineHeight: 16 },

  // Empty chain
  emptyChain: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 13, fontWeight: '600' },

  // Album context
  albumContext: { paddingHorizontal: 24, marginTop: 48, paddingBottom: 40 },
  albumRule: { width: '100%', height: 1, backgroundColor: '#1A1A1A', marginBottom: 32 },
  albumContextHead: { color: '#555', fontSize: 10, letterSpacing: 3, fontWeight: '800', marginBottom: 8 },
  albumNameContext: { color: '#D4A843', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  albumEra: { color: '#CC3333', fontSize: 10, letterSpacing: 3, fontWeight: '700', marginBottom: 16 },
  albumBio: { color: '#999', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  albumGrid: { gap: 10 },
  albumCell: { flexDirection: 'row', gap: 12, paddingVertical: 6 },
  albumCellLab: { color: '#555', fontSize: 9, fontWeight: '700', letterSpacing: 2, width: 50 },
  albumCellVal: { color: '#999', fontSize: 12, flex: 1 },
});
