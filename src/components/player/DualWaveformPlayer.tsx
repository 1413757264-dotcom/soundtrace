import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated,
} from 'react-native';
import { Colors, Spacing, Typography, Radius, Shadows, Timing } from '../../constants/theme';
import { getAudioEngine } from '../../services/audio/AudioEngine';
import { usePlayerStore } from '../../store/playerStore';
import { Haptic } from '../../utils/haptics';
import { BouncyPressable } from '../common/interactions';
import type { WaveformData } from '../../types/entities';

const W = Dimensions.get('window').width;
const PADDING = Spacing.md + 12;
const WAVE_W = W - PADDING * 2;
const WAVE_H = 90;
const BAR_COUNT = 80;
const GAP = 1;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface Props {
  originalWaveform: WaveformData; targetWaveform: WaveformData;
  originalLabel: string; targetLabel: string;
  highlightStartMs: number; highlightEndMs: number;
}

export default function DualWaveformPlayer(props: Props) {
  const { originalWaveform, targetWaveform, originalLabel, targetLabel, highlightStartMs, highlightEndMs } = props;

  const posA = usePlayerStore(s => s.trackAPosition);
  const posB = usePlayerStore(s => s.trackBPosition);
  const durA = usePlayerStore(s => s.trackADuration);
  const durB = usePlayerStore(s => s.trackBDuration);
  const mode = usePlayerStore(s => s.playbackMode);
  const offset = usePlayerStore(s => s.offsetMs);
  const engine = useMemo(() => getAudioEngine(), []);

  // Play state detection
  const [lastA, setLastA] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (posA !== lastA) { setPlaying(true); setLastA(posA); }
    else { const t = setTimeout(() => setPlaying(false), 250); return () => clearTimeout(t); }
  }, [posA]);

  // Waveform zoom level (number of bars)
  const [zoom, setZoom] = useState(1);
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);
  const [speed, setSpeed] = useState(2); // index into SPEEDS

  const barsA = useMemo(() => downSample(originalWaveform.data, Math.floor(BAR_COUNT * zoom)), [originalWaveform, zoom]);
  const barsB = useMemo(() => downSample(targetWaveform.data, Math.floor(BAR_COUNT * zoom)), [targetWaveform, zoom]);
  const actualBars = Math.floor(BAR_COUNT * zoom);
  const progA = durA > 0 ? posA / originalWaveform.durationMs : 0;
  const progB = durB > 0 ? posB / targetWaveform.durationMs : 0;

  const hlS = originalWaveform.durationMs > 0 ? Math.floor((highlightStartMs / originalWaveform.durationMs) * actualBars) : 0;
  const hlE = originalWaveform.durationMs > 0 ? Math.ceil((highlightEndMs / originalWaveform.durationMs) * actualBars) : 0;

  const handleToggle = () => { Haptic.medium(); engine.toggle(); };
  const handleSeekA = (i: number) => { engine.seekA((i / actualBars) * originalWaveform.durationMs); };
  const handleSeekB = (i: number) => { engine.seekB((i / actualBars) * targetWaveform.durationMs); };
  const handleLoopA = () => { setLoopA(loopA === null ? Math.floor(progA * actualBars) : null); setLoopB(null); };
  const handleLoopB = () => { if (loopA !== null) setLoopB(Math.floor(progA * actualBars)); };

  return (
    <View style={s.outer}>
      {/* Track A */}
      <WaveTrack label={originalLabel} bars={barsA} progress={progA}
        hlS={hlS} hlE={hlE} pos={posA} dur={originalWaveform.durationMs}
        accent={Colors.purple} onSeek={handleSeekA}
        loopA={loopA} loopB={loopB} />

      {/* Track B */}
      <WaveTrack label={targetLabel} bars={barsB} progress={progB}
        hlS={-1} hlE={-1} pos={posB} dur={targetWaveform.durationMs}
        accent={Colors.accent} onSeek={handleSeekB} />

      {/* Controls Row 1: Play + Mode */}
      <View style={s.ctrlRow}>
        <BouncyPressable onPress={handleToggle} haptic="medium">
          <View style={[s.playBtn, playing && s.playActive]}>
            <Text style={s.playIcon}>{playing ? '⏸' : '▶'}</Text>
          </View>
        </BouncyPressable>

        <View style={s.modeGroup}>
          <TouchableOpacity style={[s.modeBtn, mode==='linked'&&s.modeOn]} onPress={() => usePlayerStore.getState().setPlaybackMode('linked')}>
            <Text style={[s.modeTxt, mode==='linked'&&s.modeOnTxt]}>联动</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.modeBtn, mode==='independent'&&s.modeOn]} onPress={() => usePlayerStore.getState().setPlaybackMode('independent')}>
            <Text style={[s.modeTxt, mode==='independent'&&s.modeOnTxt]}>独立</Text>
          </TouchableOpacity>
        </View>

        {/* Offset */}
        <View style={s.offsetGrp}>
          <Text style={s.offLab}>偏移</Text>
          <TouchableOpacity onPress={() => usePlayerStore.getState().setOffset(Math.max(-500,offset-50))}><Text style={s.offBtn}>−</Text></TouchableOpacity>
          <Text style={s.offVal}>{offset>0?'+':''}{offset}ms</Text>
          <TouchableOpacity onPress={() => usePlayerStore.getState().setOffset(Math.min(500,offset+50))}><Text style={s.offBtn}>+</Text></TouchableOpacity>
        </View>
      </View>

      {/* Controls Row 2: Zoom + Loop + Speed */}
      <View style={s.ctrlRow2}>
        {/* Zoom */}
        <View style={s.toolGrp}>
          <Text style={s.toolLab}>缩放</Text>
          <TouchableOpacity onPress={() => setZoom(Math.max(0.5, zoom-0.25))}><Text style={s.toolBtn}>−</Text></TouchableOpacity>
          <Text style={s.toolVal}>{zoom}x</Text>
          <TouchableOpacity onPress={() => setZoom(Math.min(3, zoom+0.25))}><Text style={s.toolBtn}>+</Text></TouchableOpacity>
        </View>

        {/* A-B Loop */}
        <View style={s.toolGrp}>
          <Text style={s.toolLab}>AB循环</Text>
          <TouchableOpacity style={[s.loopBtn, loopA!==null&&s.loopOn]} onPress={handleLoopA}>
            <Text style={[s.loopTxt, loopA!==null&&s.loopOnTxt]}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.loopBtn, loopB!==null&&s.loopOn]} onPress={handleLoopB}>
            <Text style={[s.loopTxt, loopB!==null&&s.loopOnTxt]}>B</Text>
          </TouchableOpacity>
        </View>

        {/* Speed */}
        <View style={s.toolGrp}>
          <Text style={s.toolLab}>变速</Text>
          {SPEEDS.map((sp,i) => (
            <TouchableOpacity key={i} style={[s.spdBtn, speed===i&&s.spdOn]} onPress={() => { setSpeed(i); Haptic.selection(); }}>
              <Text style={[s.spdTxt, speed===i&&s.spdOnTxt]}>{sp}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Waveform Track ───────────────────────────────────

function WaveTrack({ label, bars, progress, hlS, hlE, pos, dur, accent, onSeek, loopA, loopB }: {
  label: string; bars: number[]; progress: number; hlS: number; hlE: number;
  pos: number; dur: number; accent: string; onSeek: (i:number)=>void;
  loopA?: number|null; loopB?: number|null;
}) {
  const hasHL = hlS >= 0 && hlE > hlS;
  const ph = Math.floor(progress * bars.length);
  const bw = WAVE_W / bars.length - GAP;
  const hasLoop = loopA !== null && loopA !== undefined && loopB !== null && loopB !== undefined;

  return (
    <View style={ts.track}>
      <View style={ts.labelRow}>
        <Text style={ts.label}>{label}</Text>
        {hasLoop && <Text style={ts.loopTag}>🔁 A→B</Text>}
      </View>
      <View style={ts.wave}>
        {bars.map((amp, i) => {
          const past = i <= ph;
          const hl = hasHL && i >= hlS && i <= hlE;
          const phd = i === ph && progress > 0;
          const inLoop = hasLoop && i >= loopA! && i <= loopB!;
          let c: string = past ? Colors.textSecondary : Colors.textTertiary;
          if (hl) c = accent;
          if (phd) c = Colors.success;
          if (inLoop) c = Colors.accent;
          return (
            <TouchableOpacity key={i} activeOpacity={0.6} onPress={()=>onSeek(i)}
              style={[ts.bar, { height:Math.max(3,amp*WAVE_H*0.88), width:bw, backgroundColor:c, opacity:past||hl||inLoop?0.95:0.3 }, phd&&ts.phBar]} />
          );
        })}
      </View>
      <Text style={ts.tm}>{fmt(pos)}/{fmt(dur)}</Text>
    </View>
  );
}

const ts = StyleSheet.create({
  track: { marginBottom:Spacing.md, backgroundColor:Colors.bgCard, borderRadius:Radius.lg, padding:Spacing.sm, borderWidth:1, borderColor:Colors.divider },
  labelRow: { flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8,paddingHorizontal:4 },
  label: { ...Typography.label, color:Colors.textSecondary, textTransform:'none' },
  loopTag: { ...Typography.smallBold, color:Colors.accent },
  wave: { flexDirection:'row',alignItems:'flex-end',height:WAVE_H,paddingHorizontal:2,gap:GAP },
  bar: { borderRadius:1 },
  phBar: { shadowColor:Colors.success,shadowOffset:{width:0,height:0},shadowOpacity:0.9,shadowRadius:6 },
  tm: { ...Typography.mono, color:Colors.textTertiary,textAlign:'right',marginTop:6,paddingRight:8 },
});

const s = StyleSheet.create({
  outer: { paddingHorizontal: Spacing.md },
  ctrlRow: { flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:Colors.bgCard,borderRadius:Radius.lg,padding:Spacing.md,marginTop:Spacing.sm },
  playBtn: { width:48,height:48,borderRadius:24,backgroundColor:Colors.accent,justifyContent:'center',alignItems:'center',...Shadows.glow },
  playActive: { backgroundColor:Colors.error },
  playIcon: { fontSize:20,color:Colors.textInverse },
  modeGroup: { flexDirection:'row',backgroundColor:Colors.bgTertiary,borderRadius:Radius.sm,padding:2 },
  modeBtn: { paddingHorizontal:14,paddingVertical:8,borderRadius:Radius.sm },
  modeOn: { backgroundColor:Colors.accent },
  modeTxt: { ...Typography.captionBold,color:Colors.textTertiary },
  modeOnTxt: { color:Colors.textInverse },
  offsetGrp: { flexDirection:'row',alignItems:'center',gap:4 },
  offLab: { ...Typography.small,color:Colors.textTertiary },
  offBtn: { ...Typography.h3,color:Colors.accent,paddingHorizontal:4 },
  offVal: { ...Typography.mono,color:Colors.textPrimary,minWidth:44,textAlign:'center' },
  ctrlRow2: { flexDirection:'row',justifyContent:'space-between',backgroundColor:Colors.bgCard,borderRadius:Radius.lg,padding:Spacing.md,marginTop:Spacing.sm },
  toolGrp: { flexDirection:'row',alignItems:'center',gap:3 },
  toolLab: { ...Typography.small,color:Colors.textTertiary,marginRight:2 },
  toolBtn: { ...Typography.bodyBold,color:Colors.accent,paddingHorizontal:4 },
  toolVal: { ...Typography.mono,color:Colors.textPrimary,minWidth:30,textAlign:'center' },
  loopBtn: { paddingHorizontal:8,paddingVertical:4,borderRadius:Radius.xs,backgroundColor:Colors.bgTertiary },
  loopOn: { backgroundColor:Colors.accent },
  loopTxt: { ...Typography.captionBold,color:Colors.textTertiary },
  loopOnTxt: { color:Colors.textInverse },
  spdBtn: { paddingHorizontal:4,paddingVertical:3,borderRadius:Radius.xs,backgroundColor:Colors.bgTertiary },
  spdOn: { backgroundColor:Colors.accent },
  spdTxt: { ...Typography.small,color:Colors.textTertiary },
  spdOnTxt: { color:Colors.textInverse,fontWeight:'700' },
});

function downSample(d: number[], n: number): number[] {
  if (!d?.length) return new Array(n).fill(0.1);
  const r: number[] = [];
  const step = d.length / n;
  for (let i=0;i<n;i++) { let m=0; const st=Math.floor(i*step),ed=Math.floor((i+1)*step); for(let j=st;j<ed&&j<d.length;j++) m=Math.max(m,d[j]); r.push(m); }
  return r;
}
function fmt(ms: number): string { const s=Math.floor(ms/1000),m=Math.floor(s/60); return `${m}:${(s%60).toString().padStart(2,'0')}`; }
