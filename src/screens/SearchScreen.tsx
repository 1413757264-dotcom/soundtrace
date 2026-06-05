import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';
import { searchSongs } from '../services/api/dataService';
import { useSampleStore } from '../store/sampleStore';
import { Haptic } from '../utils/haptics';
import type { Song } from '../types/entities';

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = useCallback(async (p = 1) => {
    if (!query.trim()) return;
    Haptic.medium();
    setSearching(true);
    setError('');
    try {
      const songs = await searchSongs(query);
      if (p === 1) setResults(songs);
      else setResults(prev => [...prev, ...songs]);
      setPage(p);
    } catch {
      setError('搜索失败，请重试');
    }
    setSearching(false);
  }, [query]);

  const loadMore = () => handleSearch(page + 1);

  // Group results by release year
  const sections = useMemo(() => {
    const grouped: Record<number, Song[]> = {};
    results.forEach(s => {
      const year = s.releaseYear || 0;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(s);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, data]) => ({ year: Number(year), data }));
  }, [results]);

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={st.header}>
        <Text style={st.title}>搜索</Text>
        <Text style={st.sub}>输入艺人名，按年份查看全部作品</Text>
      </View>
      <View style={st.searchRow}>
        <TextInput style={st.input} placeholder="搜索艺人，如 周杰伦、Drake..." placeholderTextColor={Colors.textTertiary}
          value={query} onChangeText={setQuery} onSubmitEditing={() => handleSearch(1)}
          returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
        <TouchableOpacity style={st.btn} onPress={() => handleSearch(1)} activeOpacity={0.7}>
          <Text style={st.btnText}>溯源</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={st.error}>{error}</Text> : null}
      {searching ? <Text style={st.status}>搜索中...</Text> : null}
      {results.length > 0 && (
        <Text style={st.count}>找到 {results.length} 首，按年份排列</Text>
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item, i) => item.id || String(i)}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { year } }) => (
          <View style={st.yearHeader}>
            <Text style={st.yearText}>{year || '未知年份'}</Text>
            <Text style={st.yearCount}>{results.filter(s => (s.releaseYear||0) === year).length} 首</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={st.card} onPress={() => {
            useSampleStore.getState().setSongDirect(item);
            nav.navigate('SongDetail', { songId: item.id });
          }} activeOpacity={0.7}>
            <Text style={st.songTitle}>{item.title}</Text>
            <Text style={st.songArtist}>{item.primaryArtist.name} · {item.bpm || '?'}BPM</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={results.length >= 200 ? (
          <TouchableOpacity style={st.loadMore} onPress={loadMore} activeOpacity={0.7}>
            <Text style={st.loadMoreText}>加载更多 200 首...</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 80 }} />
        )}
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
  error: { color: Colors.error, textAlign: 'center', marginBottom: Spacing.sm },
  status: { color: Colors.accent, textAlign: 'center', marginBottom: Spacing.sm },
  count: { ...Typography.captionBold, color: Colors.textSecondary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  yearHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: Colors.divider,
  },
  yearText: { ...Typography.h3, color: Colors.accent },
  yearCount: { ...Typography.smallBold, color: Colors.textTertiary },
  card: { backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songArtist: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  loadMore: { padding: Spacing.xxl, alignItems: 'center' as const },
  loadMoreText: { ...Typography.captionBold, color: Colors.accent },
});
