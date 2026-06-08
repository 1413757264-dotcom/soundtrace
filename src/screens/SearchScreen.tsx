import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API = 'http://localhost:8000/api/v1';

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [groupBy, setGroupBy] = useState<'album' | 'year'>('album');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (query.trim().length < 1) { setData([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`${API}/search?q=${encodeURIComponent(query)}&limit=200`);
        const j = await r.json();
        if (j.success) setData(j.data);
      } catch { }
      setSearching(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const sections = (() => {
    const g: any = {};
    data.forEach((s: any) => {
      const k = groupBy === 'album' ? (s.album_title || 'Unknown') : String(s.release_year || '?');
      if (!g[k]) g[k] = [];
      g[k].push(s);
    });
    return Object.entries(g)
      .sort(([a]: any, [b]: any) => {
        const cmp = groupBy === 'album' ? a.localeCompare(b) : Number(a) - Number(b);
        return order === 'desc' ? -cmp : cmp;
      })
      .map(([title, items]: any) => ({ title, data: items }));
  })();

  const totalResults = data.length;
  const totalSamples = data.reduce((s: number, x: any) => s + x.sample_count, 0);

  return (
    <SafeAreaView style={S.bg} edges={['top']}>
      {/* Header */}
      <View style={S.header}>
        <Text style={S.headerLabel}>TRACE</Text>
        <Text style={S.headerTitle}>SAMPLE<Text style={{ color: '#CC3333' }}> ARCHIVE</Text></Text>
      </View>

      {/* Search */}
      <View style={S.searchRow}>
        <TextInput style={S.input}
          placeholder="Search discography"
          placeholderTextColor="#333"
          value={query} onChangeText={setQuery}
          autoCapitalize="none" autoCorrect={false} />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={S.clearBtn}>
            <Text style={S.clearText}>CLEAR</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Controls */}
      {data.length > 0 && (
        <View style={S.controls}>
          <Text style={S.resultCount}>{totalResults} RESULTS {totalSamples > 0 ? `* ${totalSamples} SAMPLES` : ''}</Text>
          <View style={S.toggleRow}>
            <TouchableOpacity style={[S.toggleBtn, groupBy === 'album' && S.toggleActive]}
              onPress={() => setGroupBy('album')}>
              <Text style={[S.toggleText, groupBy === 'album' && S.toggleTextOn]}>ALBUM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.toggleBtn, groupBy === 'year' && S.toggleActive]}
              onPress={() => setGroupBy('year')}>
              <Text style={[S.toggleText, groupBy === 'year' && S.toggleTextOn]}>YEAR</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}>
            <Text style={S.orderBtn}>{order === 'asc' ? 'OLD' : 'NEW'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {searching && <ActivityIndicator size="small" color="#CC3333" style={{ marginTop: 24 }} />}

      {/* Results */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={S.secHead}>
            <Text style={S.secTitle}>{section.title}</Text>
            <Text style={S.secCount}>{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={S.resultCard} activeOpacity={0.6}
            onPress={() => nav.navigate('SongDetail', {
              songId: item.id, songTitle: item.title,
              artistName: 'Kanye West', songYear: item.release_year,
              songBpm: item.bpm, songKey: item.key_signature,
              songGenre: item.sub_genre, songAlbum: item.album_title,
            })}>
            <View style={{ flex: 1 }}>
              <Text style={S.resultTitle}>{item.title}</Text>
              <Text style={S.resultMeta}>{item.release_year} {item.bpm ? `* ${item.bpm}BPM` : ''} {item.key_signature || ''}</Text>
            </View>
            {item.sample_count > 0 && (
              <View style={S.resultBadge}>
                <Text style={S.resultBadgeText}>{item.sample_count}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !searching && query.length > 0 ? (
            <Text style={S.emptyText}>NO MATCHES FOUND</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  headerLabel: { color: '#CC3333', fontSize: 10, letterSpacing: 3, fontWeight: '800' },
  headerTitle: { color: '#EBEBEB', fontSize: 26, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#0A0A0A', paddingHorizontal: 16, borderWidth: 1, borderColor: '#1A1A1A' },
  input: { flex: 1, height: 46, color: '#EBEBEB', fontSize: 14, fontWeight: '600' },
  clearBtn: { paddingLeft: 12 },
  clearText: { color: '#CC3333', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  resultCount: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  toggleRow: { flexDirection: 'row', backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#1A1A1A' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 5 },
  toggleActive: { backgroundColor: '#CC3333' },
  toggleText: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  toggleTextOn: { color: '#EBEBEB' },
  orderBtn: { color: '#D4A843', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080808', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0D0D0D' },
  secTitle: { color: '#D4A843', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  secCount: { color: '#444', fontSize: 11, fontWeight: '700' },
  resultCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#0D0D0D' },
  resultTitle: { color: '#CCC', fontSize: 14, fontWeight: '600' },
  resultMeta: { color: '#444', fontSize: 11, marginTop: 2 },
  resultBadge: { backgroundColor: '#CC333312', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2 },
  resultBadgeText: { color: '#CC3333', fontSize: 10, fontWeight: '800' },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 60, letterSpacing: 2, fontWeight: '700', fontSize: 12 },
});
