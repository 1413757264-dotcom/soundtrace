import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, ImageBackground } from 'react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animation sequence
    Animated.sequence([
      // Phase 1: Logo appears with scale
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1, useNativeDriver: true,
          friction: 6, tension: 80,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Phase 2: Glow expands
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 0.6, duration: 800, useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1, useNativeDriver: true,
          friction: 8, tension: 60,
        }),
      ]),
      // Phase 3: Line draws + tagline fades
      Animated.parallel([
        Animated.timing(lineWidth, {
          toValue: 1, duration: 500, useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
      ]),
      // Hold
      Animated.delay(600),
      // Phase 4: Fade out
      Animated.timing(bgOpacity, {
        toValue: 0, duration: 350, useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const lineW = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[S.container, { opacity: bgOpacity }]}>
      {/* Background image */}
      <ImageBackground
        source={require('../../../assets/splash-bg.png')}
        style={S.bgImage}
        resizeMode="cover"
      />
      {/* Dark overlay for text readability */}
      <View style={S.overlay} />
      {/* Ambient glow */}
      <Animated.View style={[S.glow, {
        opacity: glowOpacity,
        transform: [{ scale: glowScale }],
      }]} />

      {/* Logo area */}
      <View style={S.logoArea}>
        {/* DNA Helix Icon */}
        <Animated.View style={[S.iconWrap, {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }]}>
          {/* Orange strand */}
          <View style={[S.strand, S.strandLeft]} />
          {/* Purple strand */}
          <View style={[S.strand, S.strandRight]} />
          {/* Green node */}
          <View style={S.node} />
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[S.appName, { opacity: logoOpacity }]}>
          音迹
        </Animated.Text>
        <Animated.Text style={[S.subtitle, { opacity: logoOpacity }]}>
          SoundTrace
        </Animated.Text>
      </View>

      {/* Bottom area */}
      <View style={S.bottom}>
        {/* Animated line */}
        <View style={S.lineTrack}>
          <Animated.View style={[S.lineFill, { width: lineW }]} />
        </View>
        <Animated.Text style={[S.tagline, { opacity: taglineOpacity }]}>
          单曲DNA溯源引擎
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const ICON = 80;
const STRAND_W = 8;
const STRAND_H = 56;

const S = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.bg,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9999,
    paddingTop: H * 0.28,
    paddingBottom: H * 0.12,
  },
  bgImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  glow: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.accent + '20',
    top: H * 0.28 - 60,
    left: W / 2 - 100,
  },
  logoArea: {
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: ICON + 16, height: ICON + 16,
    borderRadius: (ICON + 16) / 2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
    backgroundColor: Colors.bgSecondary,
    ...Shadows.glow,
  },
  strand: {
    position: 'absolute',
    width: STRAND_W,
    height: STRAND_H,
    borderRadius: STRAND_W / 2,
  },
  strandLeft: {
    left: ICON * 0.22,
    top: (ICON - STRAND_H) / 2 + 8,
    backgroundColor: Colors.accent,
  },
  strandRight: {
    right: ICON * 0.22,
    top: (ICON - STRAND_H) / 2 + 8,
    backgroundColor: Colors.purple,
  },
  node: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success,
  },
  appName: {
    ...Typography.hero,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    ...Typography.label,
    color: Colors.textTertiary,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  bottom: {
    alignItems: 'center',
    gap: 16,
    width: 200,
  },
  lineTrack: {
    width: '100%',
    height: 1.5,
    backgroundColor: Colors.divider,
    borderRadius: 1,
    overflow: 'hidden',
  },
  lineFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
});
