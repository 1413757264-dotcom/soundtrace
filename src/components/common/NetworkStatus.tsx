import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { checkBackendHealth, isBackendAvailable } from '../../services/api/client';

export const NetworkStatus: React.FC = () => {
  const [online, setOnline] = useState(true);
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const check = async () => {
      const ok = await checkBackendHealth();
      setOnline(ok);
      Animated.timing(opacity, {
        toValue: ok ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (online) return null;

  return (
    <Animated.View style={[s.bar, { opacity }]}>
      <Text style={s.text}>⚠ 后端连接断开 — 使用本地数据</Text>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  bar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    paddingTop: 50,
  },
  text: { ...Typography.smallBold, color: '#FFF' },
});
