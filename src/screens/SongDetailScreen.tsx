import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows, Glass, Timing } from '../constants/theme';
import { Chip, SectionHeader } from '../components/common';
import { GradientCover } from '../components/common/GradientCover';
import { DetailSkeleton } from '../components/common/ux';
import { BouncyPressable } from '../components/common/interactions';
import { Haptic } from '../utils/haptics';
import { useSampleStore } from '../store/sampleStore';
import { usePlayerStore } from '../store/playerStore';
import type { Sample, SampleType, Genre } from '../types/entities';

const W = Dimensions.get('window').width;
const HERO_H = W;

const TYPE_LABEL: Record<SampleType, string> = {
  drum:'🥁 鼓组', melody:'🎹 旋律', vocal_chop:'🎤 人声', bass:'🎸 Bass',
  fx:'⚡ 音效', texture:'🌫 质感', dialog:'💬 对白',
};
const SAMPLE_COLORS: Record<SampleType, string> = {
  drum:Colors.drum, melody:Colors.melody, vocal_chop:Colors.vocalChop,
  bass:Colors.bass, fx:Colors.fx, texture:Colors.textSecondary, dialog:Colors.accent,
};
const ROLE_CN: Record<string,string> = {
  producer:'制作人', featured:'客串', mixing_engineer:'混音师', songwriter:'词曲',
  co_producer:'联合制作', arranger:'编曲', sampled_artist:'采样来源',
};
const GENRE_CN: Record<string,string> = {
  soul:'灵魂乐', funk:'Funk', blues:'布鲁斯', jazz:'爵士', rock:'摇滚',
  disco:'迪斯科', rnb:'R&B', electronic:'电子', classical:'古典', unknown:'未知',
  hip_hop:'嘻哈',
};

export default function SongDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { songId } = route.params || {};
  const { currentSong, currentSamples, loading, loadSongDetail } = useSampleStore();
  const showMiniPlayer = usePlayerStore(s=>s.showMiniPlayer);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(()=>{ if(songId) loadSongDetail(songId); },[songId]);
  useEffect(()=>{
    if(!loading && currentSong) Animated.timing(fadeAnim,{toValue:1,duration:Timing.slow,useNativeDriver:true}).start();
  },[loading,currentSong]);

  if(loading||!currentSong) return <SafeAreaView style={S.c} edges={['top']}><DetailSkeleton/></SafeAreaView>;

  const samplesByType: Record<string,Sample[]> = {};
  currentSamples.forEach(s=>{ (samplesByType[s.type]??=[]).push(s); });

  const handleSample = (sample:Sample) => {
    showMiniPlayer(currentSong.title, currentSong.primaryArtist.name);
    nav.navigate('SampleDeconstruction',{sampleId:sample.id,songId:currentSong.id});
  };

  const heroScale = scrollY.interpolate({inputRange:[-100,0],outputRange:[1.15,1],extrapolateLeft:'extend'});
  const heroOpacity = scrollY.interpolate({inputRange:[0,HERO_H*0.5],outputRange:[1,0.3]});

  return (
    <SafeAreaView style={S.c} edges={['bottom']}>
      <StatusBar barStyle="light-content"/>
      {/* Back button overlay */}
      <TouchableOpacity onPress={()=>nav.goBack()} style={S.backBtn} activeOpacity={0.8}>
        <Text style={S.backIcon}>←</Text>
      </TouchableOpacity>

      <Animated.ScrollView showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:true})}
        scrollEventThrottle={16}>

        {/* ── Hero ── */}
        <Animated.View style={[S.hero,{opacity:heroOpacity,transform:[{scale:heroScale}]}]}>
          <GradientCover artistName={currentSong.primaryArtist.name} title={currentSong.title}
            size={W*0.5} radius={Radius.xxl} fontSize={56}/>
          <View style={S.heroGradient}/>
          <View style={S.heroBadge}>
            <Text style={S.heroYear}>{currentSong.releaseYear}</Text>
          </View>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View style={[S.content,{opacity:fadeAnim}]}>
          {/* Title */}
          <Text style={S.songTitle}>{currentSong.title}</Text>
          <TouchableOpacity onPress={()=>nav.navigate('ArtistDetail',{artistId:currentSong.primaryArtist.id,artistName:currentSong.primaryArtist.name})}>
            <Text style={S.artistName}>{currentSong.primaryArtist.name}</Text>
          </TouchableOpacity>
          {currentSong.featuredArtists.length>0 && (
            <Text style={S.feat}>feat. {currentSong.featuredArtists.map(a=>a.name).join(', ')}</Text>
          )}

          {/* ── Meta Bar (Glass) ── */}
          <View style={S.metaBar}>
            <MetaVal label="BPM" value={String(currentSong.bpm)}/>
            <View style={S.metaDiv}/>
            <MetaVal label="调式" value={currentSong.key}/>
            <View style={S.metaDiv}/>
            <MetaVal label="年份" value={String(currentSong.releaseYear)}/>
            <View style={S.metaDiv}/>
            <MetaVal label="采样" value={String(currentSamples.length)} accent/>
          </View>

          {/* Genre */}
          <View style={S.tagRow}>
            <Chip label={currentSong.subGenre.replace(/_/g,' ').toUpperCase()} active color={Colors.accent}/>
            <Chip label={GENRE_CN[currentSong.genre]||currentSong.genre}/>
            {currentSong.albumTitle && <Chip label={currentSong.albumTitle}/>}
          </View>

          {/* ── Credits (Glass cards) ── */}
          <SectionHeader title="🎛 幕后主创" actionLabel="关系图谱"
            onAction={()=>nav.navigate('ProducerGraph',{songId:currentSong.id})}/>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.creditScroll}>
            {currentSong.credits.map(c=>(
              <BouncyPressable key={c.id} onPress={()=>{}} haptic="light" style={S.creditCard}>
                <View style={S.creditAvatar}>
                  <Text style={S.creditAvatarT}>{c.artist.name.charAt(0)}</Text>
                </View>
                <Text style={S.creditName} numberOfLines={1}>{c.artist.name}</Text>
                <Text style={S.creditRole}>{ROLE_CN[c.role]||c.role}</Text>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* ── Sample Breakdown ── */}
          <SectionHeader title="🧬 采样拆解" actionLabel={`${currentSamples.length}个·${Object.keys(samplesByType).length}类`}/>
          {Object.entries(samplesByType).map(([type,samples])=>(
            <View key={type} style={S.sampleGroup}>
              <View style={S.groupHead}>
                <View style={[S.typeDot,{backgroundColor:SAMPLE_COLORS[type as SampleType]}]}/>
                <Text style={S.groupTitle}>{TYPE_LABEL[type as SampleType]}</Text>
                <Text style={S.groupCount}>{samples.length}</Text>
              </View>
              {samples.map(sample=>(
                <BouncyPressable key={sample.id} onPress={()=>handleSample(sample)} haptic="light" style={S.sampleCard}>
                  <View style={S.sampleInner}>
                    <View style={S.sampleTop}>
                      <View style={{flex:1}}>
                        <Text style={S.sampleSrcTitle}>{sample.sourceSongTitle}</Text>
                        <Text style={S.sampleSrcArtist}>{sample.sourceArtist.name}</Text>
                      </View>
                      <View style={S.sampleYearBadge}>
                        <Text style={S.sampleYearText}>{sample.sourceReleaseYear}</Text>
                      </View>
                    </View>
                    <View style={S.sampleMeta}>
                      <Text style={S.sampleMetaLabel}>原始时段</Text>
                      <Text style={S.sampleMetaValue}>{fmt(sample.startTimeMs)}–{fmt(sample.endTimeMs)}</Text>
                    </View>
                    <View style={S.sampleMeta}>
                      <Text style={S.sampleMetaLabel}>采样风格</Text>
                      <Text style={[S.sampleMetaValue,{color:Colors.accent}]}>{GENRE_CN[sample.sourceGenre]||sample.sourceGenre}</Text>
                    </View>
                    {sample.description && (
                      <Text style={S.sampleDesc} numberOfLines={2}>{sample.description}</Text>
                    )}
                  </View>
                </BouncyPressable>
              ))}
            </View>
          ))}
          <View style={{height:120}}/>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function MetaVal({label,value,accent}:{label:string;value:string;accent?:boolean}){
  return <View style={S.metaItem}>
    <Text style={[S.metaVal,accent&&{color:Colors.accent}]}>{value}</Text>
    <Text style={S.metaLab}>{label}</Text>
  </View>;
}

function fmt(ms:number){const s=Math.floor(ms/1000),m=Math.floor(s/60);return `${m}:${(s%60).toString().padStart(2,'0')}`;}

const S = StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg},
  backBtn:{position:'absolute',top:Spacing.safeTop,left:Spacing.lg,zIndex:10,width:44,height:44,borderRadius:22,backgroundColor:Colors.bgOverlay,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:Colors.border},
  backIcon:{...Typography.h3,color:Colors.textPrimary},
  hero:{height:HERO_H,justifyContent:'center',alignItems:'center',backgroundColor:Colors.bgSecondary,position:'relative'},
  heroGradient:{position:'absolute',bottom:0,left:0,right:0,height:HERO_H*0.4,backgroundColor:Colors.bg},
  heroBadge:{position:'absolute',bottom:Spacing.lg,right:Spacing.lg,backgroundColor:Colors.accent,paddingHorizontal:Spacing.lg,paddingVertical:Spacing.xs,borderRadius:Radius.sm,...Shadows.glow},
  heroYear:{...Typography.captionBold,color:Colors.textInverse},
  content:{paddingHorizontal:Spacing.lg,marginTop:-30},
  songTitle:{...Typography.display,color:Colors.textPrimary},
  artistName:{...Typography.h2,color:Colors.accent,marginTop:Spacing.sm},
  feat:{...Typography.caption,color:Colors.textTertiary,marginTop:4},
  metaBar:{flexDirection:'row',alignItems:'center',marginTop:Spacing.xxl,backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,padding:Spacing.xl},
  metaItem:{flex:1,alignItems:'center'},
  metaVal:{...Typography.h1,color:Colors.textPrimary},
  metaLab:{...Typography.smallBold,color:Colors.textTertiary,marginTop:2},
  metaDiv:{width:1,height:32,backgroundColor:Colors.divider},
  tagRow:{flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm,marginTop:Spacing.xl},
  creditScroll:{paddingHorizontal:0,gap:Spacing.md,paddingBottom:Spacing.sm,marginTop:Spacing.sm},
  creditCard:{alignItems:'center',backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,padding:Spacing.xl,minWidth:80,gap:Spacing.sm},
  creditAvatar:{width:48,height:48,borderRadius:24,backgroundColor:Colors.accentMuted,justifyContent:'center',alignItems:'center'},
  creditAvatarT:{...Typography.h3,color:Colors.accent},
  creditName:{...Typography.captionBold,color:Colors.textPrimary,maxWidth:80,textAlign:'center'},
  creditRole:{...Typography.small,color:Colors.textTertiary},
  sampleGroup:{marginBottom:Spacing.xl},
  groupHead:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,marginBottom:Spacing.md,paddingLeft:Spacing.xs},
  typeDot:{width:10,height:10,borderRadius:5},
  groupTitle:{...Typography.bodyBold,color:Colors.textPrimary},
  groupCount:{...Typography.smallBold,color:Colors.textTertiary},
  sampleCard:{backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,marginBottom:Spacing.sm},
  sampleInner:{padding:0},
  sampleTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:Spacing.md},
  sampleSrcTitle:{...Typography.bodyBold,color:Colors.textPrimary},
  sampleSrcArtist:{...Typography.caption,color:Colors.textSecondary,marginTop:2},
  sampleYearBadge:{backgroundColor:Colors.bgTertiary,paddingHorizontal:10,paddingVertical:4,borderRadius:Radius.sm},
  sampleYearText:{...Typography.mono,color:Colors.accent},
  sampleMeta:{flexDirection:'row',justifyContent:'space-between',marginTop:2},
  sampleMetaLabel:{...Typography.caption,color:Colors.textTertiary},
  sampleMetaValue:{...Typography.captionBold,color:Colors.textSecondary},
  sampleDesc:{...Typography.caption,color:Colors.textTertiary,marginTop:Spacing.md,fontStyle:'italic'},
});
