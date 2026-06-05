import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Glass } from '../constants/theme';
import { SongRow, LoadingSpinner, Chip } from '../components/common';
import { EmptyStateIllustration } from '../components/common/EmptyStateIllustration';
import { useSearchStore } from '../store/searchStore';
import { searchSongs } from '../services/api/mockData';
import type { Song } from '../types/entities';

const SUBGENRE_FILTERS = ['全部', 'boom_bap', 'trap', 'jazz_rap', 'g_funk', 'memphis'];

export default function SearchResultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { query: routeQuery = '', method = 'text' } = route.params || {};
  const { isSearching } = useSearchStore();
  const [activeFilter, setActiveFilter] = React.useState('全部');

  const results = useMemo(() => {
    return searchSongs(routeQuery);
  }, [routeQuery]);

  const filteredResults = useMemo(() => {
    if (activeFilter === '全部') return results;
    return results.filter(s => s.subGenre === activeFilter);
  }, [results, activeFilter]);

  const handleSongPress = (song: Song) => {
    navigation.navigate('SongDetail', { songId: song.id });
  };

  if (isSearching) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner message="正在溯源采样数据..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.queryText} numberOfLines={1}>{routeQuery}</Text>
          <Text style={styles.resultCount}>
            {results.length} 首歌曲 · {method === 'audio' ? '录音识曲' : method === 'link' ? '链接搜索' : '歌名搜索'}
          </Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          data={SUBGENRE_FILTERS}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <Chip
              label={item === '全部' ? '全部' : item.replace(/_/g, ' ').toUpperCase()}
              active={activeFilter === item}
              onPress={() => setActiveFilter(item)}
            />
          )}
        />
      </View>

      {/* Results */}
      {filteredResults.length === 0 ? (
        <EmptyStateIllustration scene="search" actionLabel="返回搜索" onAction={() => navigation.goBack()} />
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SongRow
              title={item.title}
              artist={item.primaryArtist.name}
              bpm={item.bpm}
              keySignature={item.key}
              subGenre={item.subGenre}
              sampleCount={item.sampleCount}
              onPress={() => handleSongPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  headerInfo: { flex: 1 },
  queryText: { ...Typography.h3, color: Colors.textPrimary },
  resultCount: { ...Typography.caption, color: Colors.textTertiary, marginTop: 2 },
  filterRow: { marginVertical: Spacing.sm },
  filterList: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  list: { paddingBottom: 120 },
});
