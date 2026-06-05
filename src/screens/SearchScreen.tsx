import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';
import { useSampleStore } from '../store/sampleStore';
import { Haptic } from '../utils/haptics';
import type { Song } from '../types/entities';

type GroupMode = 'album' | 'year';
type SortDir = 'desc' | 'asc';

const API = 'http://localhost:8000/api/v1';

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [artistName, setArtistName] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [groupMode, setGroupMode] = useState<GroupMode>('album');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSearch = async () => {
    if (!query.trim()) return;
    Haptic.medium();
    setSearching(true); setError(''); setSongs([]); setAlbums([]);

    try {
      // Step 1: Search for artist to get their iTunes ID
      const searchResp = await fetch(`${API}/search?q=${encodeURIComponent(query)}&limit=5`);
      const searchData = await searchResp.json();
      const firstResult = searchData.data?.[0];
      const artistId = firstResult?.primary_artist_itunes_id || firstResult?.itunes_id;

      if (artistId) {
        // Step 2: Lookup FULL discography via iTunes Lookup API
        const lookupResp = await fetch(`${API}/artist-lookup/${artistId}`);
        const lookupData = await lookupResp.json();

        if (lookupData.success) {
          setArtistName(lookupData.data.artist.name);
          setSongs(lookupData.data.songs);
          setAlbums(lookupData.data.albums);
        }
      }

      // Fallback: use regular search results
      if (songs.length === 0 && searchData.data?.length > 0) {
        setSongs(searchData.data);
      }
    } catch (e) {
      setError('搜索失败，请检查后端是否运行');
    }
    setSearching(false);
  };

  // Flatten albums into sections for SectionList
  const sections = useMemo(() => {
    if (groupMode === 'album') {
      const list = albums.map(a => ({
        title: `${a.name} (${a.year || '?'})`,
        data: a.songs,
        count: a.songs.length,
      }));
      if (sortDir === 'asc') list.reverse();
      return list;
    } else {
      const grouped: Record<string, Song[]> = {};
      songs.forEach(s => {
        const y = String(s.releaseYear || '未知');
        if (!grouped[y]) grouped[y] = [];
        grouped[y].push(s);
      });
      return Object.entries(grouped)
        .sort(([a],[b]) => sortDir==='desc' ? Number(b)-Number(a) : Number(a)-Number(b))
        .map(([year, data]) => ({ title: year, data, count: data.length }));
    }
  }, [albums, songs, groupMode, sortDir]);

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={st.header}>
        <Text style={st.title}>搜索</Text>
        <Text style={st.sub}>输入艺人名，拉取全部专辑和歌曲</Text>
      </View>

      <View style={st.searchRow}>
        <TextInput style={st.input} placeholder="艺人名，如 周杰伦、Drake..." placeholderTextColor={Colors.textTertiary}
          value={query} onChangeText={setQuery} onSubmitEditing={handleSearch}
          returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
        <TouchableOpacity style={st.btn} onPress={handleSearch} activeOpacity={0.7}>
          <Text style={st.btnText}>溯源</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={st.error}>{error}</Text> : null}
      {searching ? <Text style={st.status}>拉取全部作品中...</Text> : null}

      {songs.length > 0 && (
        <>
          <Text style={st.count}>{artistName} · {songs.length} 首歌 · {albums.length} 张专辑</Text>

          {/* Controls */}
          <View style={st.controls}>
            <View style={st.toggle}>
              <TouchableOpacity style={[st.togBtn, groupMode==='album'&&st.togOn]} onPress={()=>setGroupMode('album')}>
                <Text style={[st.togText, groupMode==='album'&&st.togTextOn]}>📀 按专辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.togBtn, groupMode==='year'&&st.togOn]} onPress={()=>setGroupMode('year')}>
                <Text style={[st.togText, groupMode==='year'&&st.togTextOn]}>📅 按年份</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={st.sortBtn} onPress={()=>setSortDir(d=>d==='desc'?'asc':'desc')}>
              <Text style={st.sortText}>{sortDir==='desc' ? '↓ 新→旧' : '↑ 旧→新'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, i) => item.id || String(i)}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section }) => (
          <View style={st.secHead}>
            <Text style={st.secTitle} numberOfLines={1}>{section.title}</Text>
            <Text style={st.secCount}>{section.count} 首</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={st.card} onPress={() => {
            useSampleStore.getState().setSongDirect(item);
            nav.navigate('SongDetail', { songId: item.id });
          }} activeOpacity={0.7}>
            <View style={{flex:1}}>
              <Text style={st.songTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={st.songMeta}>{item.primaryArtist.name} · {item.bpm||'?'}BPM</Text>
            </View>
            {item.previewUrl && (
              <TouchableOpacity onPress={(e)=>{e.stopPropagation();}} style={st.previewBtn}>
                <Text style={st.previewIcon}>▶</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: Spacing.xl },
  title: { ...Typography.hero, color: Colors.accent },
  sub: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  searchRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md },
  input: { flex: 1, height: 46, backgroundColor: Colors.bgCardSolid, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, color: Colors.textPrimary, ...Typography.body, borderWidth: 1, borderColor: Colors.border },
  btn: { height: 46, paddingHorizontal: Spacing.xxl, backgroundColor: Colors.accent, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { ...Typography.bodyBold, color: Colors.textInverse },
  error: { color: Colors.error, textAlign: 'center', padding: Spacing.md },
  status: { color: Colors.accent, textAlign: 'center', padding: Spacing.md },
  count: { ...Typography.captionBold, color: Colors.textSecondary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  toggle: { flexDirection: 'row', backgroundColor: Colors.bgTertiary, borderRadius: Radius.sm, padding: 2 },
  togBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: Radius.xs },
  togOn: { backgroundColor: Colors.accent },
  togText: { ...Typography.smallBold, color: Colors.textTertiary },
  togTextOn: { color: Colors.textInverse },
  sortBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  sortText: { ...Typography.smallBold, color: Colors.accent },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bgSecondary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.divider },
  secTitle: { ...Typography.h3, color: Colors.accent, flex: 1 },
  secCount: { ...Typography.smallBold, color: Colors.textTertiary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, gap: Spacing.md },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  previewBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  previewIcon: { fontSize: 12, color: Colors.textInverse },
});
