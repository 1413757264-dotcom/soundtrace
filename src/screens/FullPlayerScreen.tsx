import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing,
  Dimensions, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { GradientCover } from '../components/common/GradientCover';
import { BouncyPressable, AnimatedNumber } from '../components/common/interactions';
import { Haptic } from '../utils/haptics';
import { usePlayerStore } from '../store/playerStore';
import { getAudioEngine } from '../services/audio/AudioEngine';
import { mockSongs } from '../services/api/mockData';

const W = Dimensions.get('window').width;

export default function FullPlayerScreen() {
  const nav = useNavigation<any>();
  const {
    miniPlayerSongTitle, miniPlayerArtist, trackAPosition, trackADuration,
    trackAIsPlaying, playbackMode,
  } = usePlayerStore();
  const engine = getAudioEngine();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [song] = useState(() => mockSongs[Math.floor(Math.random() * 22)]);

  // Album art rotation
  useEffect(() => {
    if (trackAIsPlaying) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1, duration: 20000, useNativeDriver: true, easing: Easing.linear,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [trackAIsPlaying]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
  });

  const progress = trackADuration > 0 ? trackAPosition / trackADuration : 0;

  const handleSeek = (x: number) => {
    const ratio = Math.max(0, Math.min(1, x / (W - Spacing.lg * 2)));
    engine.seekA(ratio * trackADuration);
  };

  return (
    <SafeAreaView style={s.c} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={s.down}>↓</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle} numberOfLines={1}>{miniPlayerSongTitle || '采样对比'}</Text>
          <Text style={s.headerSub}>{miniPlayerArtist || 'SoundTrace'}</Text>
        </View>
        <TouchableOpacity><Text style={s.moreIcon}>⋯</Text></TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={s.artWrap}>
        <View style={s.artShadow}>
          <Animated.View style={[s.art, { transform: [{ rotate }] }]}>
            <GradientCover
              artistName={miniPlayerArtist || 'SoundTrace'}
              title={miniPlayerSongTitle || ''}
              size={W * 0.7} radius={W * 0.35} fontSize={60} showInitials
            />
          </Animated.View>
        </View>
      </View>

      {/* Song Info */}
      <View style={s.info}>
        <View style={{flex:1}}>
          <Text style={s.songTitle} numberOfLines={1}>{miniPlayerSongTitle || '采样对比模式'}</Text>
          <Text style={s.songArtist}>{miniPlayerArtist || '选择采样开始溯源'}</Text>
        </View>
        <BouncyPressable onPress={() => { Haptic.medium(); }} haptic="medium">
          <View style={s.favBtn}><Text style={s.favIcon}>♡</Text></View>
        </BouncyPressable>
      </View>

      {/* Progress Bar */}
      <View style={s.progArea}>
        <TouchableOpacity style={s.progBar} onPress={(e) => handleSeek(e.nativeEvent.locationX)} activeOpacity={1}>
          <View style={[s.progFill, { width: `${progress * 100}%` }]} />
          <View style={[s.progThumb, { left: `${progress * 100}%` }]} />
        </TouchableOpacity>
        <View style={s.progTimes}>
          <Text style={s.progTime}>{fmt(trackAPosition)}</Text>
          <Text style={s.progTime}>{fmt(trackADuration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={s.ctrls}>
        <TouchableOpacity><Text style={s.ctrlIcon}>🔀</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => engine.seekA(Math.max(0, trackAPosition - 5000))}>
          <Text style={s.ctrlIcon}>⏪</Text>
        </TouchableOpacity>
        <BouncyPressable onPress={() => { Haptic.heavy(); engine.toggle(); }}>
          <View style={s.playPause}>
            <Text style={s.playIcon}>{trackAIsPlaying ? '⏸' : '▶'}</Text>
          </View>
        </BouncyPressable>
        <TouchableOpacity onPress={() => engine.seekA(Math.min(trackADuration, trackAPosition + 5000))}>
          <Text style={s.ctrlIcon}>⏩</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={s.ctrlIcon}>🔁</Text></TouchableOpacity>
      </View>

      {/* Extra */}
      <View style={s.extra}>
        <TouchableOpacity style={s.extraItem}>
          <Text style={s.extraIcon}>🎧</Text>
          <Text style={s.extraLabel}>均衡器</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.extraItem}>
          <Text style={s.extraIcon}>📋</Text>
          <Text style={s.extraLabel}>播放队列</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.extraItem}>
          <Text style={s.extraIcon}>💤</Text>
          <Text style={s.extraLabel}>定时关闭</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.extraItem}>
          <Text style={s.extraIcon}>📤</Text>
          <Text style={s.extraLabel}>分享</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function fmt(ms: number) { const se=Math.floor(ms/1000),m=Math.floor(se/60); return `${m}:${(se%60).toString().padStart(2,'0')}`; }

const s = StyleSheet.create({
  c: { flex:1, backgroundColor: Colors.bg },
  header: { flexDirection:'row', alignItems:'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.lg },
  down: { ...Typography.h2, color: Colors.textSecondary },
  headerCenter: { flex:1, alignItems:'center' },
  headerTitle: { ...Typography.captionBold, color: Colors.textPrimary },
  headerSub: { ...Typography.small, color: Colors.textTertiary },
  moreIcon: { ...Typography.h2, color: Colors.textSecondary },
  artWrap: { alignItems:'center', marginVertical: Spacing.xxl },
  artShadow: {
    borderRadius: W * 0.35,
    shadowColor: Colors.accent, shadowOffset: {width:0,height:0},
    shadowOpacity: 0.3, shadowRadius: 40,
  },
  art: { width: W*0.7, height: W*0.7, borderRadius: W*0.35, overflow:'hidden', borderWidth:4, borderColor: Colors.border },
  info: { flexDirection:'row', alignItems:'center', paddingHorizontal: Spacing.xxl, gap: Spacing.lg, marginBottom: Spacing.xxl },
  songTitle: { ...Typography.h2, color: Colors.textPrimary },
  songArtist: { ...Typography.body, color: Colors.textSecondary, marginTop: 4 },
  favBtn: { width:48, height:48, borderRadius:24, backgroundColor: Colors.bgCardSolid, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor: Colors.border },
  favIcon: { fontSize:24, color: Colors.accent },
  progArea: { paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
  progBar: { height:6, backgroundColor: Colors.bgTertiary, borderRadius:3, position:'relative', justifyContent:'center' },
  progFill: { height:'100%', backgroundColor: Colors.accent, borderRadius:3, position:'absolute', left:0, top:0 },
  progThumb: { width:14, height:14, borderRadius:7, backgroundColor: Colors.accent, position:'absolute', marginLeft:-7, borderWidth:2, borderColor:Colors.textPrimary },
  progTimes: { flexDirection:'row', justifyContent:'space-between', marginTop:Spacing.sm },
  progTime: { ...Typography.mono, color: Colors.textTertiary },
  ctrls: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap: Spacing.xl, marginBottom: Spacing.xxl },
  ctrlIcon: { fontSize:28 },
  playPause: { width:72, height:72, borderRadius:36, backgroundColor:Colors.accent, justifyContent:'center', alignItems:'center', ...Shadows.glow },
  playIcon: { fontSize:30, color:Colors.textInverse },
  extra: { flexDirection:'row', justifyContent:'space-around', paddingHorizontal: Spacing.lg },
  extraItem: { alignItems:'center', gap:6 },
  extraIcon: { fontSize:20 },
  extraLabel: { ...Typography.small, color: Colors.textTertiary },
});
