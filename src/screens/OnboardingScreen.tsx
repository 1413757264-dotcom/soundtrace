import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { markOnboarded } from '../services/storage';
import { BouncyPressable } from '../components/common/interactions';
import { Haptic } from '../utils/haptics';

const W = Dimensions.get('window').width;

const SLIDES = [
  {
    emoji: '🧬', title: '采样DNA溯源',
    desc: '输入任意说唱新歌\nAI 拆解全部采样来源、鼓组、旋律、人声切片',
    color: Colors.accent,
  },
  {
    emoji: '🕸', title: '制作人人脉图谱',
    desc: '从一首歌出发，发现制作人背后的\n完整合作网络和关联作品',
    color: Colors.purple,
  },
  {
    emoji: '🎧', title: '波形对比试听',
    desc: '原采样 vs 新歌双轨对比\n直观看到采样如何被改造和运用',
    color: Colors.success,
  },
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slide = SLIDES[step];

  const next = () => {
    if (step < SLIDES.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      setStep(step + 1);
      Haptic.light();
    } else {
      Haptic.heavy();
      markOnboarded();
      onDone();
    }
  };

  return (
    <SafeAreaView style={s.c}>
      <StatusBar barStyle="light-content" />
      <View style={s.inner}>
        {/* Skip */}
        <TouchableOpacity style={s.skip} onPress={() => { markOnboarded(); onDone(); }}>
          <Text style={s.skipText}>跳过</Text>
        </TouchableOpacity>

        {/* Content */}
        <Animated.View style={[s.content, { opacity: fadeAnim }]}>
          <View style={[s.iconWrap, { backgroundColor: slide.color + '20', borderColor: slide.color }]}>
            <Text style={s.emoji}>{slide.emoji}</Text>
          </View>
          <Text style={s.title}>{slide.title}</Text>
          <Text style={s.desc}>{slide.desc}</Text>
        </Animated.View>

        {/* Bottom */}
        <View style={s.bottom}>
          {/* Dots */}
          <View style={s.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[s.dot, i === step && s.dotActive]} />
            ))}
          </View>

          {/* Button */}
          <BouncyPressable onPress={next} haptic="medium">
            <View style={[s.btn, { backgroundColor: slide.color }]}>
              <Text style={s.btnText}>{step < SLIDES.length - 1 ? '继续' : '开始溯源'}</Text>
            </View>
          </BouncyPressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, justifyContent: 'space-between', paddingHorizontal: Spacing.xxl },
  skip: { alignSelf: 'flex-end', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md },
  skipText: { ...Typography.body, color: Colors.textTertiary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.xxl },
  iconWrap: {
    width: 160, height: 160, borderRadius: 80,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, marginBottom: Spacing.xl,
    ...Shadows.glow,
  },
  emoji: { fontSize: 64 },
  title: { ...Typography.display, color: Colors.textPrimary, textAlign: 'center' },
  desc: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26 },
  bottom: { alignItems: 'center', paddingBottom: Spacing.huge, gap: Spacing.xxl },
  dots: { flexDirection: 'row', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.divider },
  dotActive: { width: 24, backgroundColor: Colors.accent, borderRadius: 4 },
  btn: {
    width: W - Spacing.xxl * 2, height: 56,
    borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center',
    ...Shadows.glow,
  },
  btnText: { ...Typography.h3, color: Colors.textInverse },
});
