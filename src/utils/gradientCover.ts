/**
 * 渐变色封面生成器
 * 基于艺人名+歌名哈希 → 唯一双色渐变
 * 类似 Apple Music / Spotify 的自动封面
 */

export interface GradientCover {
  colors: [string, string];
  angle: number;
  textColor: string;
}

// Curated warm palettes — no ugly greens or browns
const PALETTES: [string, string][] = [
  ['#FF6B35', '#D93A1E'],  // warm orange-red
  ['#7C5CFC', '#4A30D4'],  // purple
  ['#FF4081', '#C51162'],  // pink
  ['#448AFF', '#1A56D4'],  // blue
  ['#FFB347', '#FF7B00'],  // amber
  ['#2DD4BF', '#0D9488'],  // teal
  ['#A78BFA', '#7C5CFC'],  // lavender
  ['#F97316', '#EA580C'],  // deep orange
  ['#3B82F6', '#1D4ED8'],  // royal blue
  ['#EC4899', '#BE185D'],  // magenta
  ['#8B5CF6', '#6D28D9'],  // violet
  ['#F43F5E', '#BE123C'],  // rose
  ['#06B6D4', '#0E7490'],  // cyan
  ['#E11D48', '#9F1239'],  // crimson
  ['#7E22CE', '#581C87'],  // dark purple
  ['#16A34A', '#15803D'],  // emerald
  ['#EA580C', '#C2410C'],  // rust
  ['#475569', '#1E293B'],  // slate
  ['#DC2626', '#991B1B'],  // red
  ['#2563EB', '#1E40AF'],  // indigo
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getGradientCover(
  artistName: string,
  title?: string
): GradientCover {
  const input = title ? `${artistName}:${title}` : artistName;
  const hash = hashString(input);

  const paletteIdx = hash % PALETTES.length;
  const [c1, c2] = PALETTES[paletteIdx];

  // Swap colors based on another hash bit for variety
  const swap = (hash >> 4) & 1;
  const colors: [string, string] = swap ? [c2, c1] : [c1, c2];

  const angle = 135 + ((hash >> 8) & 0x3f); // 135°–198°

  // Light text for dark-ish backgrounds
  const textColor = '#FFFFFF';

  return { colors, angle, textColor };
}

/**
 * Generate CSS gradient string for web
 */
export function gradientCSS(cover: GradientCover): string {
  return `linear-gradient(${cover.angle}deg, ${cover.colors[0]}, ${cover.colors[1]})`;
}

/**
 * Extract initials from artist name
 */
export function artistInitials(name: string): string {
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
