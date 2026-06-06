import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass } from '../constants/theme';
import { mockSongs } from '../services/api/mockData';
import { getTrending } from '../services/api/dataService';
import { SongRow, SectionHeader } from '../components/common';
import { SongRowSkeleton, refreshColors } from '../components/common/ux';
import { BouncyPressable } from '../components/common/interactions';
import { useSampleStore } from '../store/sampleStore';
import { Haptic } from '../utils/haptics';
import { SearchMethod } from '../types/entities';
import type { Song } from '../types/entities';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState<SearchMethod>('text');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
    getTrending().then(setTrending).catch(() => {});
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); await new Promise(r=>setTimeout(r,600)); setRefreshing(false);
  }, []);

  const handleSearch = () => {
    if (!query.trim() && method==='text') return;
    Haptic.medium();
    nav.navigate('SearchTab', { screen:'SearchMain', params:{ query, method } });
  };

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} colors={refreshColors} />}>

        <View style={st.header}>
          <Text style={st.logo}>音迹</Text>
          <Text style={st.tagline}>单曲DNA溯源引擎</Text>
        </View>

        {/* Search card */}
        <View style={st.searchCard}>
          <View style={st.methodRow}>
            {[{method:'text',label:'歌名'},{method:'link',label:'链接'},{method:'audio',label:'识曲'}].map(m=>(
              <TouchableOpacity key={m.method} style={[st.methodTab, method===m.method&&st.methodOn]}
                onPress={()=>{ setMethod(m.method as SearchMethod); Haptic.light(); }} activeOpacity={0.7}>
                <Text style={[st.methodLabel, method===m.method&&st.methodLabelOn]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={st.inputRow}>
            <TextInput style={st.input} placeholder="搜索歌曲、艺人..." placeholderTextColor={Colors.textTertiary}
              value={query} onChangeText={setQuery} onSubmitEditing={handleSearch}
              returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
            <BouncyPressable onPress={handleSearch} haptic="medium">
              <View style={st.searchBtn}><Text style={st.searchBtnText}>溯源</Text></View>
            </BouncyPressable>
          </View>
        </View>

        {/* Trending pills */}
        {trending.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.trendScroll} contentContainerStyle={st.trendContent}>
            {trending.map((t,i)=>(
              <TouchableOpacity key={i} style={st.trendPill} activeOpacity={0.7}
                onPress={()=>{ nav.navigate('SearchTab',{screen:'SearchMain'}); }}>
                <Text style={st.trendText} numberOfLines={1}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Song list */}
        <SectionHeader title="经典采样歌曲" actionLabel={`${mockSongs.length}首`} />
        {loading ? (
          <View style={st.list}>{Array.from({length:4}).map((_,i)=><SongRowSkeleton key={i}/>)}</View>
        ) : (
          <View style={st.list}>
            {mockSongs.filter(s=>s.sampleCount>0).map((item: Song) => (
              <SongRow key={item.id} title={item.title} artist={item.primaryArtist.name}
                bpm={item.bpm} keySignature={item.key} subGenre={item.subGenre}
                sampleCount={item.sampleCount}
                onPress={() => {
                  useSampleStore.getState().setSongDirect(item);
                  nav.navigate('SongDetail', { songId: item.id });
                }}
                onArtistPress={() => nav.navigate('ArtistDetail', { artistId: item.primaryArtist.id, artistName: item.primaryArtist.name })} />
            ))}
          </View>
        )}
        <View style={{height:120}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex:1, backgroundColor:Colors.bg },
  header: { paddingHorizontal:Spacing.lg, paddingTop:Spacing.xl, paddingBottom:Spacing.md },
  logo: { ...Typography.hero, color:Colors.accent },
  tagline: { ...Typography.caption, color:Colors.textTertiary, marginTop:4 },
  searchCard: { marginHorizontal:Spacing.lg, ...Glass.card, padding:Spacing.lg },
  methodRow: { flexDirection:'row', backgroundColor:Colors.bgTertiary, borderRadius:Radius.md, padding:3, marginBottom:Spacing.lg },
  methodTab: { flex:1, paddingVertical:Spacing.sm, alignItems:'center', borderRadius:Radius.sm },
  methodOn: { backgroundColor:Colors.accent },
  methodLabel: { ...Typography.smallBold, color:Colors.textTertiary },
  methodLabelOn: { color:Colors.textInverse },
  inputRow: { flexDirection:'row', gap:Spacing.sm },
  input: { flex:1, height:46, backgroundColor:Colors.bgTertiary, borderRadius:Radius.md, paddingHorizontal:Spacing.lg, color:Colors.textPrimary, ...Typography.body, borderWidth:1, borderColor:Colors.border },
  searchBtn: { height:46, paddingHorizontal:Spacing.xxl, backgroundColor:Colors.accent, borderRadius:Radius.md, justifyContent:'center', alignItems:'center', ...Shadows.glow },
  searchBtnText: { ...Typography.bodyBold, color:Colors.textInverse },
  trendScroll: { marginTop:Spacing.lg },
  trendContent: { paddingHorizontal:Spacing.lg, gap:Spacing.sm },
  trendPill: { paddingHorizontal:Spacing.lg, paddingVertical:Spacing.sm, backgroundColor:Colors.bgCardSolid, borderRadius:Radius.full, borderWidth:0.5, borderColor:Colors.border },
  trendText: { ...Typography.caption, color:Colors.textSecondary },
  list: { paddingTop:Spacing.sm, paddingHorizontal:Spacing.lg },
});
