import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSampleStore } from '../store/sampleStore';
import { getSongWithSamples } from '../services/api/mockData';

export default function SongDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { songId } = route.params || {};
  const { currentSong } = useSampleStore();

  const [samples, setSamples] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);

  useEffect(() => {
    if (songId) {
      const data = getSongWithSamples(songId);
      if (data) {
        setSamples(data.samples);
        setCredits(data.song.credits);
      }
    }
  }, [songId]);

  const song = currentSong;

  if (!song) return <View style={S.bg}><Text style={S.loading}>加载中...</Text></View>;

  const TYPE_CN: Record<string,string> = {drum:'🥁 鼓组',melody:'🎹 旋律',vocal_chop:'🎤 人声',bass:'🎸 Bass',fx:'⚡ 音效'};
  const ROLE_CN: Record<string,string> = {producer:'制作人',featured:'客串',mixing_engineer:'混音师',songwriter:'词曲'};

  return (
    <View style={S.bg}>
      <TouchableOpacity style={S.back} onPress={() => nav.goBack()}>
        <Text style={{color:'#FF6B35',fontSize:24}}>←</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={S.content}>
        {/* Hero */}
        <View style={S.hero}>
          <View style={S.cover}>
            <Text style={{fontSize:48}}>💿</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={S.songTitle}>{song.title}</Text>
        <Text style={S.artistName}>{song.primaryArtist.name}</Text>

        {/* Meta */}
        <View style={S.metaBar}>
          <View style={S.metaItem}><Text style={S.metaVal}>{song.bpm}</Text><Text style={S.metaLab}>BPM</Text></View>
          <View style={S.metaDiv}/>
          <View style={S.metaItem}><Text style={S.metaVal}>{song.key}</Text><Text style={S.metaLab}>调式</Text></View>
          <View style={S.metaDiv}/>
          <View style={S.metaItem}><Text style={S.metaVal}>{song.releaseYear}</Text><Text style={S.metaLab}>年份</Text></View>
          <View style={S.metaDiv}/>
          <View style={S.metaItem}><Text style={[S.metaVal,{color:'#FF6B35'}]}>{samples.length}</Text><Text style={S.metaLab}>采样</Text></View>
        </View>

        <Text style={S.genre}>{song.subGenre.replace(/_/g,' ').toUpperCase()}</Text>

        {/* Credits */}
        {credits.length > 0 && (
          <View style={S.section}>
            <Text style={S.secTitle}>🎛 幕后主创</Text>
            <View style={S.creditRow}>
              {credits.map((c:any,i:number) => (
                <View key={i} style={S.creditCard}>
                  <View style={S.creditAvatar}><Text style={{color:'#FF6B35',fontSize:18}}>{c.artist.name[0]}</Text></View>
                  <Text style={S.creditName}>{c.artist.name}</Text>
                  <Text style={S.creditRole}>{ROLE_CN[c.role]||c.role}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Samples */}
        {samples.length > 0 && (
          <View style={S.section}>
            <Text style={S.secTitle}>🧬 采样拆解 ({samples.length}个)</Text>
            {samples.map((sp:any,i:number) => (
              <View key={i} style={S.sampleCard}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <View style={{flex:1}}>
                    <Text style={S.sampleTitle}>{sp.sourceSongTitle}</Text>
                    <Text style={S.sampleArtist}>{sp.sourceArtist.name} · {sp.sourceReleaseYear}</Text>
                  </View>
                  <View style={[S.typeBadge,{backgroundColor:sp.type==='drum'?'#FF5E5E20':sp.type==='melody'?'#6C8CFF20':sp.type==='vocal_chop'?'#FFB34720':'#2DD4BF20'}]}>
                    <Text style={{color:sp.type==='drum'?'#FF5E5E':sp.type==='melody'?'#6C8CFF':sp.type==='vocal_chop'?'#FFB347':'#2DD4BF',fontSize:11,fontWeight:'700'}}>
                      {TYPE_CN[sp.type]||sp.type}
                    </Text>
                  </View>
                </View>
                <View style={S.sampleRow}>
                  <Text style={S.sampleLabel}>原始时段: </Text>
                  <Text style={S.sampleValue}>{fmt(sp.startTimeMs)} – {fmt(sp.endTimeMs)}</Text>
                  <Text style={[S.sampleLabel,{marginLeft:16}]}>置信度: </Text>
                  <Text style={[S.sampleValue,{color:'#2DD4A0'}]}>{Math.round(sp.confidenceScore*100)}%</Text>
                </View>
                {sp.description && <Text style={S.sampleDesc}>{sp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}

function fmt(ms:number){const s=Math.floor(ms/1000),m=Math.floor(s/60);return `${m}:${(s%60).toString().padStart(2,'0')}`;}

const S = StyleSheet.create({
  bg:{flex:1,backgroundColor:'#000'},
  loading:{color:'#fff',textAlign:'center',marginTop:100},
  back:{position:'absolute',top:50,left:16,zIndex:10,width:40,height:40,borderRadius:20,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'},
  content:{paddingBottom:100},
  hero:{height:260,backgroundColor:'#111',justifyContent:'center',alignItems:'center'},
  cover:{width:140,height:140,borderRadius:20,backgroundColor:'#222',justifyContent:'center',alignItems:'center'},
  songTitle:{color:'#fff',fontSize:28,fontWeight:'800',paddingHorizontal:20,marginTop:-30},
  artistName:{color:'#FF6B35',fontSize:18,fontWeight:'600',paddingHorizontal:20,marginTop:6},
  metaBar:{flexDirection:'row',marginHorizontal:16,marginTop:20,backgroundColor:'#111',borderRadius:12,padding:16,borderWidth:1,borderColor:'#222'},
  metaItem:{flex:1,alignItems:'center'},
  metaVal:{color:'#fff',fontSize:20,fontWeight:'700'},
  metaLab:{color:'#666',fontSize:11,marginTop:2},
  metaDiv:{width:1,height:30,backgroundColor:'#222'},
  genre:{color:'#FF6B35',fontSize:12,fontWeight:'700',paddingHorizontal:20,marginTop:12},
  section:{paddingHorizontal:16,marginTop:24},
  secTitle:{color:'#fff',fontSize:18,fontWeight:'700',marginBottom:12},
  creditRow:{flexDirection:'row',flexWrap:'wrap',gap:10},
  creditCard:{alignItems:'center',backgroundColor:'#111',borderRadius:12,padding:16,width:80,borderWidth:1,borderColor:'#222'},
  creditAvatar:{width:40,height:40,borderRadius:20,backgroundColor:'#FF6B3520',justifyContent:'center',alignItems:'center',marginBottom:8},
  creditName:{color:'#fff',fontSize:11,fontWeight:'600',textAlign:'center'},
  creditRole:{color:'#666',fontSize:10,marginTop:2},
  sampleCard:{backgroundColor:'#111',borderRadius:12,padding:16,marginBottom:10,borderWidth:1,borderColor:'#222'},
  sampleTitle:{color:'#fff',fontSize:15,fontWeight:'600'},
  sampleArtist:{color:'#888',fontSize:13,marginTop:2},
  typeBadge:{paddingHorizontal:10,paddingVertical:4,borderRadius:6},
  sampleRow:{flexDirection:'row',marginTop:10,alignItems:'center'},
  sampleLabel:{color:'#666',fontSize:12},
  sampleValue:{color:'#ccc',fontSize:12,fontWeight:'600'},
  sampleDesc:{color:'#888',fontSize:12,marginTop:8,fontStyle:'italic'},
});
