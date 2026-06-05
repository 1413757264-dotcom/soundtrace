/**
 * Toast notification — Netflix/NetEase-style bottom toast
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows } from '../../constants/theme';

const W = Dimensions.get('window').width;

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
  action?: { label: string; onPress: () => void };
}

let toastId = 0;
let showToastFn: ((text: string, type?: 'success' | 'error' | 'info', action?: { label: string; onPress: () => void }) => void) | null = null;

export function showToast(
  text: string,
  type: 'success' | 'error' | 'info' = 'info',
  action?: { label: string; onPress: () => void }
) {
  showToastFn?.(text, type, action);
}

export const ToastRoot: React.FC = () => {
  const [msg, setMsg] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(60)).current;

  const show = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info', action?: { label: string; onPress: () => void }) => {
    const id = ++toastId;
    setMsg({ id, text, type, action });
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 100 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 60, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setMsg(null));
    }, 3000);
  }, []);

  useEffect(() => { showToastFn = show; return () => { showToastFn = null; }; }, [show]);

  if (!msg) return null;

  const colors = { success: Colors.success, error: Colors.error, info: Colors.accent };

  return (
    <Animated.View style={[st.wrap, { opacity, transform: [{ translateY }] }]}>
      <View style={[st.toast, { borderLeftColor: colors[msg.type] }]}>
        <Text style={st.text}>{msg.text}</Text>
        {msg.action && (
          <TouchableOpacity onPress={msg.action.onPress} style={st.action}>
            <Text style={st.actionText}>{msg.action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const st = StyleSheet.create({
  wrap: {
    position: 'absolute', bottom: 120, left: Spacing.lg, right: Spacing.lg,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 0.5, borderColor: Colors.border,
    ...Shadows.lg,
  },
  text: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  action: { marginLeft: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, backgroundColor: Colors.accent },
  actionText: { ...Typography.captionBold, color: Colors.textInverse },
});
