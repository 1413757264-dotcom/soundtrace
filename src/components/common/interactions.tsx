/**
 * Premium Interaction Components
 * - RippleButton (Material ripple)
 * - AnimatedNumber (smooth count transitions)
 * - StaggeredList (cascading item entrance)
 * - BouncyPressable (spring scale + haptic)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing,
  ViewStyle, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../constants/theme';
import { Haptic } from '../../utils/haptics';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ═══════════════════════════════════════════════════════
// AnimatedNumber — smooth number transitions
// ═══════════════════════════════════════════════════════

export const AnimatedNumber: React.FC<{
  value: number; style?: object; duration?: number;
}> = ({ value, style, duration = 600 }) => {
  const anim = useRef(new Animated.Value(value)).current;
  const [display, setDisplay] = useState(Math.round(value));

  useEffect(() => {
    const listener = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(anim, {
      toValue: value, duration, useNativeDriver: false, easing: Easing.out(Easing.cubic),
    }).start();
    return () => anim.removeListener(listener);
  }, [value]);

  return <Text style={style}>{display}</Text>;
};

// ═══════════════════════════════════════════════════════
// BouncyPressable — spring scale + optional haptic
// ═══════════════════════════════════════════════════════

export const BouncyPressable: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  scale?: number;
  haptic?: 'light' | 'medium' | 'heavy';
  disabled?: boolean;
}> = ({ onPress, children, style, scale = 0.95, haptic, disabled }) => {
  const anim = useRef(new Animated.Value(1)).current;

  const handleIn = () => {
    haptic && Haptic[haptic]();
    Animated.spring(anim, { toValue: scale, useNativeDriver: true, friction: 7, tension: 200 }).start();
  };
  const handleOut = () => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 200 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handleIn}
        onPressOut={handleOut}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════
// StaggeredList — cascading child entrance
// ═══════════════════════════════════════════════════════

export const StaggeredList: React.FC<{
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor: (item: any) => string;
  staggerDelay?: number;
}> = ({ data, renderItem, keyExtractor, staggerDelay = 60 }) => {
  const animations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    // Reset and animate
    data.forEach((_, i) => {
      if (!animations[i]) animations[i] = new Animated.Value(0);
      Animated.timing(animations[i], {
        toValue: 1, duration: 400, delay: i * staggerDelay,
        useNativeDriver: true, easing: Easing.out(Easing.back(1.2)),
      }).start();
    });
  }, [data.length]);

  return (
    <View>
      {data.map((item, i) => {
        const anim = animations[i] || new Animated.Value(1);
        return (
          <Animated.View
            key={keyExtractor(item)}
            style={{
              opacity: anim,
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
              ],
            }}
          >
            {renderItem(item, i)}
          </Animated.View>
        );
      })}
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// PulseDot — live indicator
// ═══════════════════════════════════════════════════════

export const PulseDot: React.FC<{ color?: string; size?: number }> = ({
  color = Colors.success, size = 8,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[pd.dot, {
      width: size, height: size, borderRadius: size/2,
      backgroundColor: color, opacity: pulse,
    }]} />
  );
};

const pd = StyleSheet.create({ dot: {} });

// ═══════════════════════════════════════════════════════
// ShimmerText — loading text placeholder
// ═══════════════════════════════════════════════════════

export const ShimmerText: React.FC<{ width: number; height?: number; style?: ViewStyle }> = ({
  width, height = 14, style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[{
      width, height, borderRadius: 4,
      backgroundColor: Colors.textTertiary,
      opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }),
    }, style]} />
  );
};
