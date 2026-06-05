import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Colors } from '../../constants/theme';

interface Props {
  size?: number;
  animated?: boolean;
  showText?: boolean;
}

/**
 * 音迹 App Icon — DNA 双螺旋 × 声波
 *
 * 抽象化的"S"形双螺旋结构
 * 左侧: 暖橙 (#FF6B35) — 代表采样溯源
 * 右侧: 电紫 (#7C5CFC) — 代表制作人图谱
 * 交叉点: 波形绿 — 代表音乐连接
 */
export const AppIcon: React.FC<Props> = ({ size = 64, animated = false, showText = false }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1, duration: 8000, useNativeDriver: true,
        easing: Easing.linear,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animated]);

  const s = size;
  const half = s / 2;
  const stroke = s * 0.12;

  return (
    <View style={[st.wrap, { width: showText ? undefined : s, height: showText ? undefined : s }]}>
      <Animated.View
        style={[
          st.icon,
          {
            width: s, height: s, borderRadius: s * 0.22,
          },
          animated && {
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1], outputRange: ['0deg', '360deg'],
              }),
            }],
          },
        ]}
      >
        {/* Background */}
        <View style={[st.bg, { width: s, height: s, borderRadius: s * 0.22 }]}>
          {/* DNA Helix Left — Orange */}
          <View style={[st.helix, st.helixLeft, {
            width: stroke, height: s * 0.7,
            borderRadius: stroke / 2,
            left: s * 0.22, top: s * 0.15,
          }]}>
            <View style={[st.rung, st.rung1, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.08 }]} />
            <View style={[st.rung, st.rung2, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.25 }]} />
            <View style={[st.rung, st.rung3, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.42 }]} />
          </View>

          {/* DNA Helix Right — Purple */}
          <View style={[st.helix, st.helixRight, {
            width: stroke, height: s * 0.7,
            borderRadius: stroke / 2,
            right: s * 0.22, top: s * 0.15,
          }]}>
            <View style={[st.rung, st.rung1, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.15 }]} />
            <View style={[st.rung, st.rung2, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.32 }]} />
            <View style={[st.rung, st.rung3, { width: stroke * 0.6, height: stroke * 0.6, top: s * 0.49 }]} />
          </View>

          {/* Crossbar — Green */}
          <View style={[st.cross, {
            width: s * 0.35, height: stroke * 0.7,
            borderRadius: stroke * 0.35,
            left: s * 0.325, top: s * 0.44,
          }]} />

          {/* Soundwave arcs */}
          <View style={[st.wave, st.wave1, { width: s * 0.15, height: s * 0.15, borderRadius: s * 0.075, left: s * 0.55, top: s * 0.08, borderWidth: stroke * 0.25 }]} />
          <View style={[st.wave, st.wave2, { width: s * 0.22, height: s * 0.22, borderRadius: s * 0.11, left: s * 0.35, top: s * 0.65, borderWidth: stroke * 0.2 }]} />
        </View>
      </Animated.View>

      {showText && (
        <View style={st.textWrap}>
          <Text style={[st.logoText, { fontSize: s * 0.45 }]}>音迹</Text>
          <Text style={[st.tagline, { fontSize: s * 0.14 }]}>SoundTrace</Text>
        </View>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  icon: {
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  bg: {
    backgroundColor: Colors.bgSecondary,
    position: 'relative',
    overflow: 'hidden',
  },
  helix: {
    position: 'absolute',
  },
  helixLeft: {
    backgroundColor: Colors.accent,
  },
  helixRight: {
    backgroundColor: Colors.purple,
  },
  rung: {
    position: 'absolute',
    backgroundColor: Colors.bgSecondary,
    borderRadius: 99,
    left: '20%',
  },
  rung1: {},
  rung2: {},
  rung3: {},
  cross: {
    position: 'absolute',
    backgroundColor: Colors.success,
  },
  wave: {
    position: 'absolute',
    borderColor: Colors.accent + '60',
  },
  wave1: {},
  wave2: {},
  textWrap: {
    gap: 0,
  },
  logoText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Colors.textTertiary,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

/**
 * Simple square icon variant — for web favicon / smaller sizes
 */
export const AppIconSquare: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <View style={[sq.c, {
    width: size, height: size, borderRadius: size * 0.2,
    backgroundColor: Colors.bgSecondary,
  }]}>
    <View style={[sq.dna, {
      width: size * 0.75, height: size * 0.1,
    }]}>
      <View style={[sq.dnaLeft, { flex: 0.45, backgroundColor: Colors.accent, borderRadius: size * 0.05 }]} />
      <View style={[sq.dnaMid, { width: size * 0.08, height: size * 0.08, borderRadius: size * 0.04, backgroundColor: Colors.success }]} />
      <View style={[sq.dnaRight, { flex: 0.45, backgroundColor: Colors.purple, borderRadius: size * 0.05 }]} />
    </View>
  </View>
);

const sq = StyleSheet.create({
  c: {
    justifyContent: 'center', alignItems: 'center',
  },
  dna: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
  },
  dnaLeft: {},
  dnaMid: {},
  dnaRight: {},
});
