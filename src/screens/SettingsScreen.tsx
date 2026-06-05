import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Glass } from '../constants/theme';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, onPress }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Text style={styles.rowArrow}>→</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>设置</Text>
        </View>

        {/* Audio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>音频</Text>
          <SettingRow icon="🔊" label="音频质量" value="高 (320kbps)" />
          <SettingRow icon="🎧" label="自动播放预览" value="开启" />
          <SettingRow icon="📊" label="波形精度" value="标准" />
        </View>

        {/* Cache */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>存储</Text>
          <SettingRow icon="💾" label="缓存大小" value="24.5 MB" />
          <SettingRow icon="🗑" label="清除缓存" onPress={() => {}} />
          <SettingRow icon="📥" label="离线模式" value="关闭" />
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>显示</Text>
          <SettingRow icon="🌓" label="主题" value="暗黑 (默认)" />
          <SettingRow icon="🔤" label="字体大小" value="标准" />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <SettingRow icon="📱" label="版本" value="1.0.0-beta" />
          <SettingRow icon="📄" label="隐私政策" onPress={() => {}} />
          <SettingRow icon="📝" label="用户协议" onPress={() => {}} />
          <SettingRow icon="💬" label="反馈建议" onPress={() => {}} />
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  title: { ...Typography.h1, color: Colors.textPrimary },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textTertiary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  rowIcon: { fontSize: 18 },
  rowLabel: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  rowValue: { ...Typography.caption, color: Colors.textTertiary },
  rowArrow: { ...Typography.h3, color: Colors.textTertiary },
});
