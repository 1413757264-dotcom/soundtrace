/**
 * UX Enhancement Components
 * — Skeleton shimmer, ErrorBoundary, AnimatedPressable, PullToRefresh
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing,
  ViewStyle, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Typography, Radius } from '../../constants/theme';

// ─── Skeleton (Shimmer) ──────────────────────────────

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%', height = 16, borderRadius = Radius.sm, style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true, easing: Easing.ease }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.accentMuted,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ─── SongRow Skeleton ─────────────────────────────────

export const SongRowSkeleton: React.FC = () => (
  <View style={sk.row}>
    <Skeleton width={56} height={56} borderRadius={Radius.sm} />
    <View style={sk.info}>
      <Skeleton width="70%" height={16} />
      <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
      <View style={sk.tags}>
        <Skeleton width={50} height={18} borderRadius={Radius.sm} />
        <Skeleton width={40} height={18} borderRadius={Radius.sm} />
        <Skeleton width={60} height={18} borderRadius={Radius.sm} />
      </View>
    </View>
  </View>
);

const sk = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, backgroundColor: Colors.bgCard,
    borderRadius: Radius.md, marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  info: { flex: 1, gap: 4 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 4 },
});

// ─── Detail Skeleton ──────────────────────────────────

export const DetailSkeleton: React.FC = () => (
  <View style={dsk.container}>
    <Skeleton width="100%" height={280} borderRadius={0} />
    <View style={dsk.content}>
      <Skeleton width="60%" height={24} />
      <Skeleton width="40%" height={18} style={{ marginTop: 8 }} />
      <View style={dsk.meta}>
        <Skeleton width={60} height={40} borderRadius={Radius.sm} />
        <Skeleton width={60} height={40} borderRadius={Radius.sm} />
        <Skeleton width={60} height={40} borderRadius={Radius.sm} />
        <Skeleton width={60} height={40} borderRadius={Radius.sm} />
      </View>
      <Skeleton width="100%" height={100} borderRadius={Radius.md} style={{ marginTop: 16 }} />
      <Skeleton width="100%" height={100} borderRadius={Radius.md} style={{ marginTop: 8 }} />
    </View>
  </View>
);

const dsk = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg },
  meta: { flexDirection: 'row', gap: Spacing.sm, marginTop: 16 },
});

// ─── ErrorBoundary ────────────────────────────────────

interface EBProps { children: React.ReactNode; fallback?: React.ReactNode }
interface EBState { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<EBProps, EBState> {
  state: EBState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={ebStyles.container}>
          <Text style={ebStyles.icon}>⚠️</Text>
          <Text style={ebStyles.title}>出了点问题</Text>
          <Text style={ebStyles.desc}>{this.state.error?.message || '未知错误'}</Text>
          <TouchableOpacity
            style={ebStyles.btn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={ebStyles.btnText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, padding: Spacing.xl, gap: Spacing.sm },
  icon: { fontSize: 48 },
  title: { ...Typography.h2, color: Colors.textPrimary, marginTop: Spacing.sm },
  desc: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
  btn: { marginTop: Spacing.lg, backgroundColor: Colors.accent, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md },
  btnText: { ...Typography.bodyBold, color: Colors.textInverse },
});

// ─── AnimatedPressable ────────────────────────────────

interface APProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  scale?: number;
}

export const AnimatedPressable: React.FC<APProps> = ({
  onPress, children, style, scale = 0.96,
}) => {
  const anim = useRef(new Animated.Value(1)).current;

  const handleIn = () => {
    Animated.spring(anim, { toValue: scale, useNativeDriver: true, friction: 8 }).start();
  };
  const handleOut = () => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handleIn}
        onPressOut={handleOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Pull-to-refresh colors ───────────────────────────

export const refreshColors = [Colors.accent, Colors.purple, Colors.success];

// ─── FadeIn View ──────────────────────────────────────

export const FadeInView: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children, delay = 0,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1, duration: 400, delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};
