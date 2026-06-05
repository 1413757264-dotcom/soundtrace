import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';
import { BouncyPressable } from './interactions';

type EmptyScene = 'search' | 'samples' | 'favorites' | 'queue' | 'network' | 'history';

interface Props {
  scene: EmptyScene;
  actionLabel?: string;
  onAction?: () => void;
}

const SCENES: Record<EmptyScene, { icon: string; title: string; desc: string; color: string }> = {
  search: {
    icon: '🔍', title: '搜索歌曲开始溯源',
    desc: '输入任意说唱歌曲名\nAI 将拆解全部采样来源',
    color: Colors.accent,
  },
  samples: {
    icon: '🧬', title: '暂无采样数据',
    desc: '该歌曲尚未收录采样信息\n试试搜索热门说唱歌曲',
    color: Colors.purple,
  },
  favorites: {
    icon: '♡', title: '收藏夹是空的',
    desc: '在采样详情页点击收藏\n这里会展示你所有的采样收藏',
    color: Colors.drum,
  },
  queue: {
    icon: '📋', title: '播放队列为空',
    desc: '长按歌曲添加到播放队列\n一次听完所有感兴趣的采样',
    color: Colors.melody,
  },
  network: {
    icon: '📡', title: '网络连接异常',
    desc: '请检查网络后重试\n缓存的采样数据仍可离线查看',
    color: Colors.warning,
  },
  history: {
    icon: '🕐', title: '暂无浏览记录',
    desc: '浏览过的歌曲会出现在这里\n方便快速回溯之前的发现',
    color: Colors.success,
  },
};

export const EmptyStateIllustration: React.FC<Props> = ({ scene, actionLabel, onAction }) => {
  const { icon, title, desc, color } = SCENES[scene];
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    );
    float.start();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => float.stop();
  }, []);

  return (
    <Animated.View style={[s.c, { opacity: fadeAnim }]}>
      {/* Background glow */}
      <View style={[s.glow, { backgroundColor: color + '15' }]} />

      {/* Floating icon */}
      <Animated.View style={[s.iconWrap, { borderColor: color + '40', transform: [{ translateY: floatAnim }] }]}>
        <View style={[s.iconInner, { backgroundColor: color + '20' }]}>
          <Text style={s.icon}>{icon}</Text>
        </View>
      </Animated.View>

      {/* Decorative circles */}
      <View style={[s.decoCircle, s.dc1, { backgroundColor: color + '10' }]} />
      <View style={[s.decoCircle, s.dc2, { backgroundColor: color + '08' }]} />

      <Text style={s.title}>{title}</Text>
      <Text style={s.desc}>{desc}</Text>

      {actionLabel && onAction && (
        <BouncyPressable onPress={onAction} haptic="medium" style={s.actionWrap}>
          <View style={[s.actionBtn, { backgroundColor: color }]}>
            <Text style={s.actionText}>{actionLabel}</Text>
          </View>
        </BouncyPressable>
      )}
    </Animated.View>
  );
};

const ICON_SIZE = 100;

const s = StyleSheet.create({
  c: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: Spacing.xxxl, paddingBottom: 80,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    top: '30%',
  },
  iconWrap: {
    width: ICON_SIZE + 24, height: ICON_SIZE + 24, borderRadius: (ICON_SIZE + 24) / 2,
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconInner: {
    width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2,
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 44 },
  decoCircle: {
    position: 'absolute', borderRadius: 999,
  },
  dc1: { width: 80, height: 80, top: '28%', right: Spacing.xxl },
  dc2: { width: 50, height: 50, top: '40%', left: Spacing.xxl },
  title: { ...Typography.h2, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  desc: { ...Typography.body, color: Colors.textTertiary, textAlign: 'center', lineHeight: 22 },
  actionWrap: { marginTop: Spacing.xxl },
  actionBtn: {
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
    borderRadius: Radius.lg, ...Shadows.glow,
  },
  actionText: { ...Typography.bodyBold, color: Colors.textInverse },
});
