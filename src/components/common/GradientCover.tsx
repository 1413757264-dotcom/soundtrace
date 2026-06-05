import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getGradientCover, artistInitials } from '../../utils/gradientCover';
import { Typography } from '../../constants/theme';

interface Props {
  artistName: string;
  title?: string;
  size: number;
  radius?: number;
  fontSize?: number;
  showInitials?: boolean;
}

export const GradientCover: React.FC<Props> = ({
  artistName, title, size, radius = 8, fontSize, showInitials = true,
}) => {
  const cover = useMemo(() => getGradientCover(artistName, title), [artistName, title]);
  const initials = useMemo(() => artistInitials(artistName), [artistName]);
  const fs = fontSize ?? size * 0.35;

  return (
    <View style={[s.wrap, { width: size, height: size, borderRadius: radius }]}>
      <LinearGradient
        colors={cover.colors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.grad, { borderRadius: radius }]}
      />
      {showInitials && (
        <Text style={[s.initials, { fontSize: fs }]}>{initials}</Text>
      )}
    </View>
  );
};

const abs = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

const s = StyleSheet.create({
  wrap: { overflow: 'hidden', position: 'relative' },
  grad: abs,
  initials: {
    ...abs,
    textAlign: 'center', textAlignVertical: 'center',
    color: '#FFFFFF', fontWeight: '700', opacity: 0.85,
    includeFontPadding: false,
  },
});
