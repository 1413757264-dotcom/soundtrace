import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants/theme';
import { GradientCover } from './GradientCover';

// ═══════════════════════════════════════════════════════
// SongRow — Premium list item with glass surface
// ═══════════════════════════════════════════════════════

interface SongRowProps {
  title: string; artist: string; coverArtUrl?: string;
  bpm?: number; keySignature?: string; subGenre?: string;
  sampleCount?: number; previewUrl?: string;
  onPress: () => void;
  onArtistPress?: () => void;
  onPreviewPress?: () => void;
  onLongPress?: () => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  title, artist, bpm, keySignature, subGenre, sampleCount, previewUrl,
  onPress, onArtistPress, onPreviewPress, onLongPress,
}) => {
  const fmt = (st: string) => st.replace(/_/g, ' ').toUpperCase();

  return (
    <TouchableOpacity onPress={onPress} style={s.row} activeOpacity={0.7}>
      <View style={s.rowInner}>
        <GradientCover artistName={artist} title={title} size={52} radius={Radius.md} />
        <View style={s.info}>
          <Text style={s.title} numberOfLines={1}>{title}</Text>
          <TouchableOpacity onPress={onArtistPress} activeOpacity={0.7}>
            <Text style={[s.artist, onArtistPress && {color: Colors.accent}]} numberOfLines={1}>{artist}</Text>
          </TouchableOpacity>
          <View style={s.tags}>
            {bpm != null && <Tag text={`${bpm} BPM`} />}
            {keySignature && <Tag text={keySignature} />}
            {subGenre && <Tag text={fmt(subGenre)} accent />}
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:Spacing.sm}}>
          {previewUrl && onPreviewPress && (
            <TouchableOpacity onPress={onPreviewPress} style={s.previewBtn} activeOpacity={0.7}>
              <Text style={s.previewIcon}>▶</Text>
            </TouchableOpacity>
          )}
          {sampleCount != null && (
            <View style={s.badge}>
              <Text style={s.badgeNum}>{sampleCount}</Text>
              <Text style={s.badgeLabel}>采样</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function Tag({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <View style={[st.tag, accent && st.tagAccent]}>
      <Text style={[st.tagText, accent && st.tagAccentText]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgCardSolid,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  rowInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  cover: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.bgTertiary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.lg,
  },
  coverIcon: { fontSize: 22 },
  info: { flex: 1, gap: 2 },
  title: { ...Typography.bodyBold, color: Colors.textPrimary },
  artist: { ...Typography.caption, color: Colors.textSecondary },
  tags: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.purpleMuted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginLeft: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.purple + '40',
  },
  badgeNum: { ...Typography.h3, color: Colors.purple },
  badgeLabel: { ...Typography.smallBold, color: Colors.purple, marginTop: -1 },
  previewBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.accent, shadowOffset: {width:0,height:0}, shadowOpacity: 0.3, shadowRadius: 6,
  },
  previewIcon: { fontSize: 14, color: Colors.textInverse },
});

const st = StyleSheet.create({
  tag: {
    backgroundColor: Colors.bgTertiary,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  tagText: { ...Typography.smallBold, color: Colors.textTertiary },
  tagAccent: { backgroundColor: Colors.accentMuted },
  tagAccentText: { color: Colors.accent },
});

// ═══════════════════════════════════════════════════════
// Loading / Empty
// ═══════════════════════════════════════════════════════

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <View style={c.center}>
    <ActivityIndicator size="large" color={Colors.accent} />
    {message && <Text style={c.text}>{message}</Text>}
  </View>
);

export const EmptyState: React.FC<{
  icon: string; title: string; description?: string;
  action?: { label: string; onPress: () => void };
}> = ({ icon, title, description, action }) => (
  <View style={c.center}>
    <Text style={c.icon}>{icon}</Text>
    <Text style={c.title}>{title}</Text>
    {description && <Text style={c.desc}>{description}</Text>}
    {action && (
      <TouchableOpacity style={c.btn} onPress={action.onPress} activeOpacity={0.8}>
        <Text style={c.btnText}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ═══════════════════════════════════════════════════════
// SectionHeader
// ═══════════════════════════════════════════════════════

export const SectionHeader: React.FC<{
  title: string; actionLabel?: string; onAction?: () => void;
}> = ({ title, actionLabel, onAction }) => (
  <View style={sh.row}>
    <Text style={sh.title}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={sh.action}>{actionLabel} →</Text>
      </TouchableOpacity>
    )}
  </View>
);

const sh = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginTop: Spacing.xxxl, marginBottom: Spacing.lg,
  },
  title: { ...Typography.h2, color: Colors.textPrimary },
  action: { ...Typography.captionBold, color: Colors.accent },
});

// ═══════════════════════════════════════════════════════
// Chip
// ═══════════════════════════════════════════════════════

export const Chip: React.FC<{
  label: string; active?: boolean; color?: string; onPress?: () => void; style?: ViewStyle;
}> = ({ label, active, color, onPress, style }) => (
  <TouchableOpacity
    style={[ch.chip, active && ch.active, color ? { borderColor: color } : null, style]}
    onPress={onPress} activeOpacity={0.7}
  >
    <Text style={[ch.label, active && ch.activeLabel, color ? { color } : null]}>{label}</Text>
  </TouchableOpacity>
);

const ch = StyleSheet.create({
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
  },
  active: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  label: { ...Typography.caption, color: Colors.textSecondary },
  activeLabel: { color: Colors.accent, fontWeight: '600' },
});

// ═══════════════════════════════════════════════════════
// Center styles
// ═══════════════════════════════════════════════════════

const c = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxxl, gap: Spacing.md },
  text: { ...Typography.body, color: Colors.textSecondary },
  icon: { fontSize: 48 },
  title: { ...Typography.h3, color: Colors.textPrimary, textAlign: 'center' },
  desc: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
  btn: {
    marginTop: Spacing.md, backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    ...Shadows.glow,
  },
  btnText: { ...Typography.bodyBold, color: Colors.textInverse },
});
