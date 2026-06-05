import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Dimensions, StatusBar, RefreshControl, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass, Timing } from '../constants/theme';
import { mockSongs } from '../services/api/mockData';
import { getTrending } from '../services/api/dataService';
import { SongRow, SectionHeader } from '../components/common';
import { AppIcon } from '../components/common/AppIcon';
import { GradientCover } from '../components/common/GradientCover';
import { SongRowSkeleton, refreshColors } from '../components/common/ux';
import { StaggeredList, BouncyPressable, PulseDot } from '../components/common/interactions';
import { Haptic } from '../utils/haptics';
import { SearchMethod } from '../types/entities';
import type { Song } from '../types/entities';

const W = Dimensions.get('window').width;
const HERO_H = W * 0.55;

type SearchMode = { method: SearchMethod; label: string; icon: string };
const MODES: SearchMode[] = [
  { method:'text', label:'歌名', icon:'🔤' },
  { method:'link', label:'链接', icon:'🔗' },
  { method:'audio', label:'识曲', icon:'🎙️' },
];

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState<SearchMethod>('text');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false);
      Animated.timing(fadeAnim, { toValue:1, duration:Timing.slower, useNativeDriver:true }).start();
    }, 400);
    getTrending().then(setTrending).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); await new Promise(r=>setTimeout(r,600)); setRefreshing(false);
  }, []);

  const activeMode = MODES.find(m=>m.method===method)!;

  const handleSearch = () => {
    if (!query.trim() && method==='text') return;
    if (method==='audio') { Haptic.heavy(); return; }
    Haptic.medium();
    nav.navigate('SearchTab', { screen:'SearchResults', params:{ query, method } });
  };

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} colors={refreshColors} />}>

        {/* ── Hero ── */}
        <View style={st.hero}>
          <View style={st.heroBg}>
            <View style={st.heroGrad1} />
            <View style={st.heroGrad2} />
          </View>
          <View style={st.heroContent}>
            <AppIcon size={56} showText />
            <Text style={st.heroTagline}>单曲DNA溯源引擎</Text>
          </View>
        </View>

        {/* ── Search Glass Card ── */}
        <View style={st.searchCard}>
          {/* Method tabs */}
          <View style={st.methodRow}>
            {MODES.map(m => (
              <TouchableOpacity key={m.method} style={[st.methodTab, method===m.method&&st.methodOn]}
                onPress={()=>{ setMethod(m.method); Haptic.light(); }} activeOpacity={0.7}>
                <Text style={st.methodIcon}>{m.icon}</Text>
                <Text style={[st.methodLabel, method===m.method&&st.methodLabelOn]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Input */}
          {method==='audio' ? (
            <TouchableOpacity style={st.recBtn} onPress={handleSearch} activeOpacity={0.8}>
              <PulseDot color={Colors.drum} size={14} />
              <Text style={st.recText}>点击录音识曲</Text>
            </TouchableOpacity>
          ) : (
            <View style={st.inputRow}>
              <TextInput style={st.input} placeholder={activeMode.label==='链接'?'粘贴音乐链接...':'搜索歌曲、艺人...'}
                placeholderTextColor={Colors.textTertiary} value={query} onChangeText={setQuery}
                onSubmitEditing={handleSearch} returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
              <BouncyPressable onPress={handleSearch} haptic="medium">
                <View style={st.searchBtn}><Text style={st.searchBtnText}>溯源</Text></View>
              </BouncyPressable>
            </View>
          )}
        </View>

        {/* ── Trending pills ── */}
        {trending.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.trendScroll} contentContainerStyle={st.trendContent}>
            {trending.map((t,i)=>(
              <TouchableOpacity key={i} style={st.trendPill} activeOpacity={0.7}
                onPress={()=>{ setQuery(t); nav.navigate('SearchTab',{screen:'SearchResults',params:{query:t,method:'text'}}); }}>
                <Text style={st.trendText} numberOfLines={1}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Song list ── */}
        <SectionHeader title="热门采样歌曲" actionLabel={`${mockSongs.length}首`} />
        {loading ? (
          <View style={st.list}>{Array.from({length:4}).map((_,i)=><SongRowSkeleton key={i}/>)}</View>
        ) : (
          <StaggeredList data={mockSongs} keyExtractor={(s:any)=>s.id} staggerDelay={45}
            renderItem={({item}:{item:Song})=>(
              <SongRow title={item.title} artist={item.primaryArtist.name}
                bpm={item.bpm} keySignature={item.key} subGenre={item.subGenre}
                sampleCount={item.sampleCount}
                onPress={()=>nav.navigate('SongDetail',{songId:item.id})}
                onArtistPress={()=>nav.navigate('ArtistDetail',{artistId:item.primaryArtist.id,artistName:item.primaryArtist.name})} />
            )} />
        )}
        <View style={{height:120}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex:1, backgroundColor:Colors.bg },
  hero: { height:HERO_H, overflow:'hidden' },
  heroBg: { position:'absolute', top:0, left:0, right:0, bottom:0 },
  heroGrad1: { position:'absolute', top:-80, right:-40, width:200, height:200, borderRadius:100, backgroundColor:Colors.accent+'18' },
  heroGrad2: { position:'absolute', bottom:-60, left:-30, width:180, height:180, borderRadius:90, backgroundColor:Colors.purple+'14' },
  heroContent: { flex:1, justifyContent:'center', alignItems:'center', paddingBottom:Spacing.xl },
  heroTagline: { ...Typography.caption, color:Colors.textTertiary, marginTop:Spacing.md, letterSpacing:1 },

  searchCard: {
    marginHorizontal:Spacing.lg, marginTop:-Spacing.xxl,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border, padding:Spacing.lg,
  },
  methodRow: { flexDirection:'row', backgroundColor:Colors.bgTertiary, borderRadius:Radius.md, padding:3, marginBottom:Spacing.lg },
  methodTab: { flex:1, paddingVertical:Spacing.sm, alignItems:'center', borderRadius:Radius.sm, flexDirection:'row', justifyContent:'center', gap:Spacing.xs },
  methodOn: { backgroundColor:Colors.accent },
  methodIcon: { fontSize:14 },
  methodLabel: { ...Typography.smallBold, color:Colors.textTertiary },
  methodLabelOn: { color:Colors.textInverse },
  inputRow: { flexDirection:'row', gap:Spacing.sm },
  input: { flex:1, height:50, backgroundColor:Colors.bgTertiary, borderRadius:Radius.md, paddingHorizontal:Spacing.lg, color:Colors.textPrimary, ...Typography.body, borderWidth:1, borderColor:Colors.border },
  searchBtn: { height:50, paddingHorizontal:Spacing.xxl, backgroundColor:Colors.accent, borderRadius:Radius.md, justifyContent:'center', alignItems:'center', ...Shadows.glow },
  searchBtnText: { ...Typography.bodyBold, color:Colors.textInverse },
  recBtn: { height:50, backgroundColor:Colors.bgTertiary, borderRadius:Radius.md, justifyContent:'center', alignItems:'center', flexDirection:'row', gap:Spacing.md, borderWidth:1, borderColor:Colors.border },

  recText: { ...Typography.bodyBold, color:Colors.textPrimary },
  trendScroll: { marginTop:Spacing.lg },
  trendContent: { paddingHorizontal:Spacing.lg, gap:Spacing.sm },
  trendPill: { paddingHorizontal:Spacing.lg, paddingVertical:Spacing.sm, backgroundColor:Colors.bgCardSolid, borderRadius:Radius.full, borderWidth:0.5, borderColor:Colors.border },
  trendText: { ...Typography.caption, color:Colors.textSecondary },
  list: { paddingTop:Spacing.sm },
});
