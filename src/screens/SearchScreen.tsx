import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
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

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    Haptic.medium();
    setSearching(true);
    setError('');
    try {
      const songs = await searchSongs(query);
      setResults(songs);
    } catch {
      setError('搜索失败');
    }
    setSearching(false);
  }, [query]);

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={st.header}>
        <Text style={st.title}>搜索</Text>
        <Text style={st.sub}>输入歌曲或艺人名，搜索8000万曲库</Text>
      </View>
      <View style={st.searchRow}>
        <TextInput style={st.input} placeholder="搜索歌曲、艺人..." placeholderTextColor={Colors.textTertiary}
          value={query} onChangeText={setQuery} onSubmitEditing={handleSearch}
          returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
        <TouchableOpacity style={st.btn} onPress={handleSearch} activeOpacity={0.7}>
          <Text style={st.btnText}>溯源</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={st.error}>{error}</Text> : null}
      {searching ? <Text style={st.status}>搜索中...</Text> : null}
      {results.length > 0 && (
        <Text style={st.count}>找到 {results.length} 首</Text>
      )}
      <FlatList
        data={results}
        keyExtractor={(item, i) => item.id || String(i)}
        renderItem={({ item }) => (
          <TouchableOpacity style={st.card} onPress={() => {
            useSampleStore.getState().setSongDirect(item);
            nav.navigate('SongDetail', { songId: item.id });
          }} activeOpacity={0.7}>
            <Text style={st.songTitle}>{item.title}</Text>
            <Text style={st.songArtist}>{item.primaryArtist.name} · {item.releaseYear || '?'} · {item.bpm || '?'}BPM · {item.key || '?'}</Text>
          </TouchableOpacity>
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
  searchRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  input: { flex: 1, height: 46, backgroundColor: Colors.bgCardSolid, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, color: Colors.textPrimary, ...Typography.body, borderWidth: 1, borderColor: Colors.border },
  btn: { height: 46, paddingHorizontal: Spacing.xxl, backgroundColor: Colors.accent, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { ...Typography.bodyBold, color: Colors.textInverse },
  error: { color: Colors.error, textAlign: 'center', marginBottom: Spacing.md },
  status: { color: Colors.accent, textAlign: 'center', marginBottom: Spacing.md },
  count: { ...Typography.captionBold, color: Colors.textSecondary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  songTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  songArtist: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
});
