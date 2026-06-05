import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass } from '../constants/theme';
import { Chip } from '../components/common';
import { BouncyPressable, PulseDot } from '../components/common/interactions';
import { showToast } from '../components/common/toast';
import { Haptic } from '../utils/haptics';
import { useSearchStore } from '../store/searchStore';
import { searchSongs, mockTrendingSearches } from '../services/api/mockData';
import { SearchMethod } from '../types/entities';
import type { Song } from '../types/entities';

type InputMode = { method: SearchMethod; label: string; icon: string; desc: string };
const MODES: InputMode[] = [
  { method: 'text', label: '歌名搜索', icon: '🔤', desc: '歌曲/艺人/专辑' },
  { method: 'link', label: '粘贴链接', icon: '🔗', desc: 'Spotify/网易云链接' },
  { method: 'audio', label: '录音识曲', icon: '🎙️', desc: '15秒音频识别' },
];

export default function SearchScreen() {
  const nav = useNavigation<any>();
  const { query, history, setQuery, searchMethod, setSearchMethod, addToHistory, clearHistory, loadHistory } = useSearchStore();
  useEffect(() => { loadHistory(); }, []);
  const [linkInput, setLinkInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchSongs(query).slice(0, 5);
  }, [query]);

  const handleSearch = useCallback(() => {
    Haptic.medium();
    const q = searchMethod === 'link' ? linkInput : query;
    if (!q.trim()) return;
    if (searchMethod === 'audio') {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        showToast('识别完成，找到匹配', 'success');
        nav.navigate('SearchResults', { query: '识曲结果', method: 'audio' });
      }, 2000);
      return;
    }
    addToHistory(q);
    nav.navigate('SearchResults', { query: q, method: searchMethod });
  }, [query, linkInput, searchMethod]);

  const handleSuggestion = (song: Song) => {
    Haptic.light();
    nav.navigate('SongDetail', { songId: song.id });
  };

  const handleHistoryTap = (q: string) => {
    setQuery(q);
    addToHistory(q);
    nav.navigate('SearchResults', { query: q, method: searchMethod });
  };

  return (
    <SafeAreaView style={st.c} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={st.header}>
          <Text style={st.title}>搜索</Text>
          <Text style={st.sub}>输入歌曲、艺人、专辑名，追踪采样DNA</Text>
        </View>

        {/* Mode Selector */}
        <View style={st.modes}>
          {MODES.map(m => (
            <BouncyPressable
              key={m.method}
              onPress={() => setSearchMethod(m.method)}
              style={searchMethod === m.method ? st.modeCardActive : st.modeCard}
              haptic="light"
            >
              <View style={st.modeInner}>
                <Text style={st.modeIcon}>{m.icon}</Text>
                <Text style={[st.modeLabel, searchMethod === m.method && st.modeLabelActive]}>{m.label}</Text>
                <Text style={st.modeDesc}>{m.desc}</Text>
              </View>
            </BouncyPressable>
          ))}
        </View>

        {/* Input */}
        <View style={st.inputArea}>
          {searchMethod === 'audio' ? (
            <TouchableOpacity style={[st.recBtn, isRecording && st.recActive]} onPress={handleSearch} activeOpacity={0.8}>
              <PulseDot color={Colors.drum} size={12} />
              <Text style={st.recText}>{isRecording ? '正在识别...' : '点击录制音频片段'}</Text>
              <Text style={st.recHint}>支持识别 15 秒音频</Text>
              {isRecording && <View style={st.liveWave}>
                {Array.from({length:16}).map((_,i)=>(
                  <View key={i} style={[st.waveBar,{height:10+Math.abs(Math.sin(i*0.6+Date.now()*0.005))*30}]}/>
                ))}
              </View>}
            </TouchableOpacity>
          ) : (
            <View style={st.searchRow}>
              <TextInput
                style={st.input}
                placeholder={searchMethod === 'link' ? '粘贴 Spotify / Apple Music / 网易云链接...' : '搜索歌曲、艺人、专辑、BPM...'}
                placeholderTextColor={Colors.textTertiary}
                value={searchMethod === 'link' ? linkInput : query}
                onChangeText={searchMethod === 'link' ? setLinkInput : setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="none" autoCorrect={false}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
              />
              <BouncyPressable onPress={handleSearch} haptic="medium">
                <View style={st.searchBtn}>
                  <Text style={st.searchBtnText}>溯源</Text>
                </View>
              </BouncyPressable>
            </View>
          )}
        </View>

        {/* Real-time Suggestions */}
        {isFocused && suggestions.length > 0 && (
          <View style={st.suggestions}>
            <Text style={st.sugTitle}>💡 搜索建议</Text>
            {suggestions.map(s => (
              <TouchableOpacity key={s.id} style={st.sugRow} onPress={() => handleSuggestion(s)} activeOpacity={0.7}>
                <Text style={st.sugIcon}>🎵</Text>
                <View style={{flex:1}}>
                  <Text style={st.sugName}>{s.title}</Text>
                  <Text style={st.sugArtist}>{s.primaryArtist.name} · {s.releaseYear} · {s.bpm}BPM</Text>
                </View>
                <Text style={st.sugArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* History */}
        <View style={st.section}>
          <View style={st.sectionHead}>
            <Text style={st.sectionTitle}>⏱ 最近搜索</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={() => { clearHistory(); showToast('已清除', 'success'); }}>
                <Text style={st.clearBtn}>清除全部</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={st.chipWrap}>
            {history.slice(0, 10).map((h,i) => (
              <Chip key={i} label={h} onPress={() => handleHistoryTap(h)} />
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>🔥 热门搜索</Text>
          <View style={st.chipWrap}>
            {mockTrendingSearches.map((t,i) => (
              <Chip key={i} label={t} active={i===0} color={i===0?Colors.accent:undefined} onPress={() => handleHistoryTap(t)} />
            ))}
          </View>
        </View>

        {/* Quick Browse */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>🎧 快速浏览</Text>
          <View style={st.grid}>
            {[
              {i:'🥁',l:'经典鼓采样',c:Colors.drum},
              {i:'🎹',l:'Funk旋律',c:Colors.accent},
              {i:'🎤',l:'人声切片',c:Colors.vocalChop},
              {i:'🎸',l:'Bass Line',c:Colors.purple},
              {i:'🎺',l:'爵士说唱',c:Colors.melody},
              {i:'💿',l:'制作人图谱',c:Colors.success},
            ].map((item,i)=>(
              <BouncyPressable key={i} onPress={() => handleHistoryTap(item.l)} style={st.gridCard} haptic="light">
                <View style={st.gridInner}>
                  <Text style={st.gridIcon}>{item.i}</Text>
                  <Text style={st.gridLabel}>{item.l}</Text>
                </View>
              </BouncyPressable>
            ))}
          </View>
        </View>

        <View style={{height:80}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { ...Typography.display, color: Colors.textPrimary },
  sub: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
  modes: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.md },
  modeCard: {
    flex: 1, backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: 'transparent',
    ...Shadows.sm,
  },
  modeCardActive: { borderColor: Colors.accent, backgroundColor: Colors.accentMuted },
  modeInner: { padding: Spacing.lg, alignItems: 'center', gap: 4 },
  modeIcon: { fontSize: 24 },
  modeLabel: { ...Typography.captionBold, color: Colors.textSecondary },
  modeLabelActive: { color: Colors.accent },
  modeDesc: { ...Typography.small, color: Colors.textTertiary },
  inputArea: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  searchRow: { flexDirection: 'row', gap: Spacing.sm },
  input: {
    flex:1, height: 50, backgroundColor: Colors.bgCardSolid,
    borderRadius: Radius.md, paddingHorizontal: Spacing.lg,
    color: Colors.textPrimary, ...Typography.body,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchBtn: {
    height:50, paddingHorizontal: Spacing.xxl,
    backgroundColor: Colors.accent, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.glow,
  },
  searchBtnText: { ...Typography.bodyBold, color: Colors.textInverse },
  recBtn: {
    height: 150, backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  recActive: { borderColor: Colors.accent, ...Shadows.glow },
  recText: { ...Typography.h3, color: Colors.textPrimary },
  recHint: { ...Typography.caption, color: Colors.textTertiary },
  liveWave: { flexDirection:'row',alignItems:'flex-end',gap:3,height:44,marginTop:Spacing.sm },
  waveBar: { width:3,backgroundColor:Colors.accent,borderRadius:2 },
  suggestions: {
    marginHorizontal: Spacing.md, marginBottom: Spacing.lg,
    backgroundColor: Colors.bgCardSolid, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth:1, borderColor: Colors.border,
  },
  sugTitle: { ...Typography.captionBold, color: Colors.accent, marginBottom: Spacing.sm },
  sugRow: { flexDirection:'row',alignItems:'center',paddingVertical:Spacing.md,gap:Spacing.md,borderTopWidth:0.5,borderTopColor:Colors.divider },
  sugIcon: { fontSize:18 },
  sugName: { ...Typography.bodyBold, color: Colors.textPrimary },
  sugArtist: { ...Typography.small, color: Colors.textTertiary },
  sugArrow: { ...Typography.h3, color: Colors.textTertiary },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xxl },
  sectionHead: { flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:Spacing.md },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
  clearBtn: { ...Typography.captionBold, color: Colors.textTertiary },
  chipWrap: { flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm },
  grid: { flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm },
  gridCard: { width:'31%', aspectRatio:1, backgroundColor:Colors.bgCard, borderRadius:Radius.lg, borderWidth:0.5, borderColor:Colors.border },
  gridInner: { flex:1, justifyContent:'center',alignItems:'center',gap:8 },
  gridIcon: { fontSize:28 },
  gridLabel: { ...Typography.captionBold, color: Colors.textSecondary, textAlign:'center' },
});
