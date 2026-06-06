import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockSongs } from '../services/api/mockData';
import { useSampleStore } from '../store/sampleStore';
import type { Song } from '../types/entities';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const sampled = mockSongs.filter(s => s.sampleCount > 0);

  return (
    <View style={S.bg}>
      <View style={S.header}>
        <Text style={S.logo}>音迹</Text>
        <Text style={S.sub}>单曲DNA溯源引擎 · {sampled.length}首完整采样数据</Text>
      </View>
      <ScrollView>
        {sampled.map((song: Song) => (
          <TouchableOpacity key={song.id} style={S.card}
            onPress={() => {
              useSampleStore.getState().setSongDirect(song);
              nav.navigate('SongDetail', { songId: song.id });
            }}>
            <Text style={S.title}>{song.title}</Text>
            <Text style={S.artist}>{song.primaryArtist.name} · {song.releaseYear} · {song.bpm}BPM · {song.key}</Text>
            <View style={S.row}>
              <Text style={S.badge}>{song.subGenre.replace(/_/g,' ').toUpperCase()}</Text>
              <Text style={[S.badge,{color:'#7C5CFC'}]}>{song.sampleCount} 个采样源</Text>
              <Text style={[S.badge,{color:'#2DD4A0'}]}>{song.credits.length} 位制作人</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  bg: { flex:1, backgroundColor:'#000' },
  header: { padding:20, paddingTop:50 },
  logo: { color:'#FF6B35', fontSize:34, fontWeight:'900' },
  sub: { color:'#666', fontSize:14, marginTop:4 },
  card: {
    backgroundColor:'#111', borderRadius:12, padding:16, marginHorizontal:16, marginBottom:10,
    borderWidth:1, borderColor:'#222',
  },
  title: { color:'#fff', fontSize:16, fontWeight:'700' },
  artist: { color:'#888', fontSize:13, marginTop:4 },
  row: { flexDirection:'row', gap:8, marginTop:8 },
  badge: {
    backgroundColor:'#1a1a1a', paddingHorizontal:10, paddingVertical:3,
    borderRadius:6, color:'#FF6B35', fontSize:11, fontWeight:'600',
  },
});
