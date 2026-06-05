import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radius, Shadows } from '../../constants/theme';
import { Haptic } from '../../utils/haptics';

const W = Dimensions.get('window').width;
const TAB_W = W / 5; // 5 slots, center is the button

const TABS = [
  { key: 'HomeTab', label: '首页', icon: '🏠' },
  { key: 'SearchTab', label: '搜索', icon: '🔍' },
  { key: null, label: '', icon: '' }, // center placeholder
  { key: 'DiscoverTab', label: '发现', icon: '🧬' },
  { key: 'ProfileTab', label: '我的', icon: '👤' },
];

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
  onRecordPress: () => void;
}

export default function CustomTabBar({ state, descriptors, navigation, onRecordPress }: Props) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(ringAnim, { toValue: 1.6, duration: 1500, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(ringAnim, { toValue: 1, duration: 1, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.4, duration: 1, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={[s.bar, { paddingBottom: insets.bottom + 4 }]}>
      {/* Pulsing ring behind center button */}
      <Animated.View
        style={[s.ring, {
          transform: [{ scale: ringAnim }],
          opacity: ringOpacity,
        }]}
      />

      {TABS.map((tab, index) => {
        if (tab.key === null) {
          // Center record button
          return (
            <View key="center" style={s.tabItem}>
              <Animated.View style={[s.centerBtnOuter, { transform: [{ scale: pulseAnim }] }]}>
                <TouchableOpacity
                  style={s.centerBtn}
                  onPress={() => { Haptic.heavy(); onRecordPress(); }}
                  activeOpacity={0.85}
                >
                  <Text style={s.centerIcon}>🎙️</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        }

        const isFocused = state.index === index;
        const route = state.routes.find((r: any) => r.name === tab.key);
        if (!route) return null;
        const { options } = descriptors[route.key];

        return (
          <TouchableOpacity
            key={tab.key}
            style={s.tabItem}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                Haptic.light();
                navigation.navigate(route.name);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[s.tabInner, isFocused && s.tabInnerActive]}>
              <Text style={[s.tabIcon, isFocused && s.tabIconActive]}>{tab.icon}</Text>
              <Text style={[s.tabLabel, isFocused && s.tabLabelActive]}>{tab.label}</Text>
              {isFocused && <View style={s.dot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBg,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    height: 88,
    paddingTop: 6,
    position: 'relative',
    alignItems: 'flex-start',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  tabInner: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 2,
    position: 'relative',
  },
  tabInnerActive: {},
  tabIcon: { fontSize: 18, opacity: 0.45 },
  tabIconActive: { opacity: 1 },
  tabLabel: { ...Typography.smallBold, fontSize: 10, color: Colors.tabInactive },
  tabLabelActive: { color: Colors.tabActive },
  dot: {
    position: 'absolute', top: -4, width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  // Center button
  ring: {
    position: 'absolute',
    top: -24,
    left: W / 2 - 28,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.accent + '40',
  },
  centerBtnOuter: {
    marginTop: -24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.glow,
    borderWidth: 3,
    borderColor: Colors.bg,
  },
  centerBtn: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  },
  centerIcon: { fontSize: 22 },
});
