import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';
import { searchSongs } from '../services/api/dataService';
import { useSampleStore } from '../store/sampleStore';
import { Haptic } from '../utils/haptics';
import type { Song } from '../types/entities';

type GroupMode = 'album' | 'year';
type SortDir = 'desc' | 'asc';

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [groupMode, setGroupMode] = useState<GroupMode>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [artist, setArtist] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState<Array<{title:string;artist:string;year?:number;id?:string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Real-time suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(`http://localhost:8000/api/v1/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await resp.json();
        if (data.success) {
          setSuggestions(data.data.map((s:any)=>({title:s.title,artist:s.primary_artist_name,year:s.release_year,id:s.itunes_id||s.spotify_id})));
          setShowSuggestions(true);
        }
      } catch {}
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSearch = useCallback(async (p = 1) => {
    if (!query.trim()) return;
    setShowSuggestions(false);
    if (p === 1) { Haptic.medium(); setSearching(true); setArtist(query); }
    else setLoadingMore(true);
    setError('');

    try {
      const results = await searchSongs(query, p);
      if (p === 1) {
        setSongs(results);
        setPage(1);
      } else {
        setSongs(prev => [...prev, ...results]);
        setPage(p);
      }
      setHasMore(results.length >= 200);
    } catch {
      if (p === 1) setError('搜索失败，请确保后端已启动');
    }
    setSearching(false);
    setLoadingMore(false);
  }, [query]);

  const sections = useMemo(() => {
    if (groupMode === 'album') {
      const grouped: Record<string, Song[]> = {};
      songs.forEach(s => {
        const key = s.albumTitle || '未知专辑';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
      });
      return Object.entries(grouped)
        .sort(([a],[b]) => sortDir==='desc' ? b.localeCompare(a) : a.localeCompare(b))
        .map(([title, data]) => ({ title, data, count: data.length }));
    }
    const grouped: Record<string, Song[]> = {};
    songs.forEach(s => {
      const y = String(s.releaseYear || '未知');
      if (!grouped[y]) grouped[y] = [];
      grouped[y].push(s);
    });
    return Object.entries(grouped)
      .sort(([a],[b]) => sortDir==='desc' ? Number(b)-Number(a) : Number(a)-Number(b))
      .map(([year, data]) => ({ title: year, data, count: data.length }));
  }, [songs, groupMode, sortDir]);

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={st.header}>
        <Text style={st.title}>搜索</Text>
        <Text style={st.sub}>输入艺人名，无限滚动浏览全部作品</Text>
      </View>

      <View style={st.searchRow}>
        <TextInput style={st.input} placeholder="周杰伦 / Drake / Kendrick Lamar..." placeholderTextColor={Colors.textTertiary}
          value={query} onChangeText={setQuery} onSubmitEditing={()=>handleSearch(1)}
          returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
        <TouchableOpacity style={st.btn} onPress={()=>handleSearch(1)} activeOpacity={0.7}>
          <Text style={st.btnText}>溯源</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={st.sugDrop}>
          {suggestions.map((s, i) => (
            <TouchableOpacity key={i} style={st.sugItem} onPress={() => { setQuery(s.title); setArtist(s.artist); handleSearch(1); }} activeOpacity={0.7}>
              <Text style={st.sugIcon}>🎵</Text>
              <View style={{flex:1}}>
                <Text style={st.sugTitle} numberOfLines={1}>{s.title}</Text>
                <Text style={st.sugArtist}>{s.artist}{s.year ? ` · ${s.year}` : ''}</Text>
              </View>
              <Text style={st.sugArrow}>↗</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={st.sugMore} onPress={() => { setShowSuggestions(false); handleSearch(1); }} activeOpacity={0.7}>
            <Text style={st.sugMoreText}>搜索 "{query}" 的全部结果 →</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={st.error}>{error}</Text> : null}
      {searching ? <ActivityIndicator size="large" color={Colors.accent} style={{marginTop:40}} /> : null}

      {songs.length > 0 && !searching && (
        <>
          <Text style={st.count}>{artist} · {songs.length}+ 首 · {sections.length} {groupMode==='album'?'专辑':'年份'}</Text>
          <View style={st.controls}>
            <View style={st.toggle}>
              <TouchableOpacity style={[st.togBtn, groupMode==='album'&&st.togOn]} onPress={()=>setGroupMode('album')}>
                <Text style={[st.togText, groupMode==='album'&&st.togTextOn]}>📀 专辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.togBtn, groupMode==='year'&&st.togOn]} onPress={()=>setGroupMode('year')}>
                <Text style={[st.togText, groupMode==='year'&&st.togTextOn]}>📅 年份</Text>
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
        onEndReached={() => { if (hasMore && !loadingMore) handleSearch(page + 1); }}
        onEndReachedThreshold={0.3}
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
            <Text style={st.songTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={st.songMeta}>{item.primaryArtist.name} · {item.releaseYear||'?'} · {item.bpm||'?'}BPM</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color={Colors.accent} style={{padding:20}}/> :
          hasMore ? <Text style={st.loadMore}>↓ 下滑加载更多</Text> :
          songs.length > 0 ? <Text style={st.loadMore}>— 已加载全部结果 —</Text> :
          null
        }
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
  card: { backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  loadMore: { textAlign: 'center', color: Colors.textTertiary, padding: Spacing.xl, ...Typography.small },
  sugDrop: { marginHorizontal: Spacing.lg, backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, overflow: 'hidden' },
  sugItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.divider },
  sugIcon: { fontSize: 18 },
  sugTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  sugArtist: { ...Typography.small, color: Colors.textTertiary, marginTop: 1 },
  sugArrow: { ...Typography.h3, color: Colors.textTertiary },
  sugMore: { padding: Spacing.lg, alignItems: 'center', backgroundColor: Colors.accentMuted },
  sugMoreText: { ...Typography.captionBold, color: Colors.accent },
});
