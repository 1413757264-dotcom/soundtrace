/**
 * 触觉反馈引擎
 * iOS: UIImpactFeedbackGenerator 三种强度
 * Android: Vibrate 时长映射
 * Web: 静默降级
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const Haptic = {
  /** 轻触 — 按钮按下 */
  light: () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /** 中等 — 选择/确认 */
  medium: () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /** 重击 — 成功/错误 */
  heavy: () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /** 选择 — 拨盘/滚动到位 */
  selection: () => {
    if (Platform.OS === 'ios') Haptics.selectionAsync();
  },

  /** 成功通知 */
  success: () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /** 警告通知 */
  warning: () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /** 错误通知 */
  error: () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
