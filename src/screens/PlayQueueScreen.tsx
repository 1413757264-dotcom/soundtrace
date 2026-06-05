import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { GradientCover } from '../components/common/GradientCover';
import { mockSongs } from '../services/api/mockData';
import { BouncyPressable } from '../components/common/interactions';
import { Haptic } from '../utils/haptics';
import { showToast } from '../components/common/toast';

export default function PlayQueueScreen() {
  const nav = useNavigation<any>();
  const songs = mockSongs.slice(0, 12);

  return (
    <SafeAreaView style={st.c} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={st.header}>
        <TouchableOpacity onPress={() => nav.goBack()}><Text style={st.back}>←</Text></TouchableOpacity>
        <Text style={st.title}>播放队列</Text>
        <TouchableOpacity onPress={() => showToast('队列已清空', 'success')}><Text style={st.clear}>清空</Text></TouchableOpacity>
      </View>
      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <BouncyPressable
            onPress={() => { Haptic.light(); nav.navigate('SongDetail', { songId: item.id }); }}
            style={st.row}
            haptic="light"
          >
            <Text style={st.idx}>{index + 1}</Text>
            <GradientCover artistName={item.primaryArtist.name} title={item.title} size={44} radius={Radius.sm} fontSize={16} />
            <View style={{flex:1}}>
              <Text style={st.songName} numberOfLines={1}>{item.title}</Text>
              <Text style={st.songArt}>{item.primaryArtist.name}</Text>
            </View>
            <TouchableOpacity onPress={() => showToast('已从队列移除', 'info')}><Text style={st.remove}>✕</Text></TouchableOpacity>
          </BouncyPressable>
        )}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg},
  header:{flexDirection:'row',alignItems:'center',padding:Spacing.lg,gap:Spacing.lg},
  back:{...Typography.h3,color:Colors.textPrimary},
  title:{flex:1,...Typography.h2,color:Colors.textPrimary},
  clear:{...Typography.captionBold,color:Colors.accent},
  row:{flexDirection:'row',alignItems:'center',paddingHorizontal:Spacing.lg,paddingVertical:Spacing.md,gap:Spacing.md},
  idx:{...Typography.mono,color:Colors.textTertiary,width:24,textAlign:'center'},
  songName:{...Typography.bodyBold,color:Colors.textPrimary},
  songArt:{...Typography.small,color:Colors.textTertiary},
  remove:{...Typography.h3,color:Colors.textTertiary},
});
