/**
 * 音迹 SoundTrace — Design Token v3 "Glass Edition"
 * 玻璃态 + 毛玻璃 + 大字号 + 彩色阴影
 */

// ═══════════════════════════════════════
// COLOR — Dark luxury palette
// ═══════════════════════════════════════

const gray = {
  0:   '#F8F8FA', 50:'#EEEEF2', 100:'#E0E0E8',
  200:'#BEBEC8', 300:'#9898A8', 400:'#78788A',
  500:'#5C5C6E', 600:'#444454', 700:'#30303E',
  750:'#242430', 800:'#1A1A24', 850:'#12121A',
  900:'#0C0C12', 950:'#06060A',
};

const warm = {
  400:'#FF8C5A', 500:'#FF6B35', 600:'#E05528', 700:'#B8421E',
};

const purple = {
  400:'#A78BFA', 500:'#7C5CFC', 600:'#6547E0',
};

export const Colors = {
  bg:           gray[950],
  bgSecondary:  gray[900],
  bgTertiary:   gray[850],
  bgCard:       gray[800] + 'CC',  // 80% opacity → glass
  bgCardSolid:  gray[800],
  bgGlass:      gray[800] + '99',  // 60% glass
  bgOverlay:    'rgba(0,0,0,0.75)',

  accent:       warm[500],
  accentLight:  warm[400],
  accentDark:   warm[600],
  accentMuted:  warm[500] + '18',
  accentGlass:  warm[500] + '0D',

  purple:       purple[500],
  purpleLight:  purple[400],
  purpleMuted:  purple[500] + '18',

  success:      '#2DD4A0',
  warning:      '#F5A623',
  error:        '#FF4757',

  drum:         '#FF5E5E',
  melody:       '#6C8CFF',
  vocalChop:    '#FFB347',
  bass:         '#A78BFA',
  fx:           '#2DD4BF',

  textPrimary:  gray[50],
  textSecondary:gray[300],
  textTertiary: gray[500],
  textInverse:  gray[950],

  divider:      gray[750],
  border:       gray[700] + '80',
  borderGlow:   warm[500] + '40',

  tabBarBg:     gray[900] + 'F2',
  tabActive:    warm[500],
  tabInactive:  gray[500],

  // Colored shadows
  glowOrange:   warm[500] + '40',
  glowPurple:   purple[500] + '30',
  glowGreen:    '#2DD4A0' + '30',
} as const;

// ═══════════════════════════════════════
// SPACING — 8px grid
// ═══════════════════════════════════════

export const Spacing = {
  xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, xxxl:32,
  huge:48, giant:64,
  safeTop:56, safeBottom:34,
} as const;

// ═══════════════════════════════════════
// RADIUS
// ═══════════════════════════════════════

export const Radius = {
  xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, xxxl:32,
  full:9999,
} as const;

// ═══════════════════════════════════════
// TYPOGRAPHY — Bigger, bolder
// ═══════════════════════════════════════

export const Typography = {
  hero:       { fontSize:40, fontWeight:'900' as const, letterSpacing:-1.2, lineHeight:48 },
  display:    { fontSize:32, fontWeight:'800' as const, letterSpacing:-0.8, lineHeight:40 },
  h1:         { fontSize:26, fontWeight:'700' as const, letterSpacing:-0.5, lineHeight:34 },
  h2:         { fontSize:21, fontWeight:'700' as const, letterSpacing:-0.3, lineHeight:28 },
  h3:         { fontSize:17, fontWeight:'600' as const, letterSpacing:-0.1, lineHeight:24 },
  body:       { fontSize:16, fontWeight:'400' as const, letterSpacing:0, lineHeight:24 },
  bodyBold:   { fontSize:16, fontWeight:'600' as const, letterSpacing:0, lineHeight:24 },
  caption:    { fontSize:14, fontWeight:'400' as const, letterSpacing:0, lineHeight:20 },
  captionBold:{ fontSize:14, fontWeight:'600' as const, letterSpacing:0, lineHeight:20 },
  small:      { fontSize:12, fontWeight:'400' as const, letterSpacing:0.1, lineHeight:16 },
  smallBold:  { fontSize:12, fontWeight:'600' as const, letterSpacing:0.1, lineHeight:16 },
  label:      { fontSize:10, fontWeight:'700' as const, letterSpacing:1.0, lineHeight:14, textTransform:'uppercase' as const },
  mono:       { fontSize:13, fontWeight:'500' as const, letterSpacing:0.1, lineHeight:20 },
} as const;

// ═══════════════════════════════════════
// SHADOWS — Colored glows
// ═══════════════════════════════════════

export const Shadows = {
  sm:   { shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.3, shadowRadius:4, elevation:2 },
  md:   { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.4, shadowRadius:12, elevation:6 },
  lg:   { shadowColor:'#000', shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:24, elevation:10 },
  glow: { shadowColor:warm[500], shadowOffset:{width:0,height:0}, shadowOpacity:0.4, shadowRadius:24, elevation:8 },
  glowPurple: { shadowColor:purple[500], shadowOffset:{width:0,height:0}, shadowOpacity:0.35, shadowRadius:20, elevation:6 },
  glowGreen:  { shadowColor:'#2DD4A0', shadowOffset:{width:0,height:0}, shadowOpacity:0.35, shadowRadius:16, elevation:4 },
  glass: { shadowColor:'#000', shadowOffset:{width:0,height:8}, shadowOpacity:0.3, shadowRadius:32, elevation:12 },
} as const;

// ═══════════════════════════════════════
// GLASS — Glass morphism presets
// ═══════════════════════════════════════

export const Glass = {
  card: {
    backgroundColor: Colors.bgGlass,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backdropFilter: 'blur(20px)',
    ...Shadows.glass,
  } as const,
  sheet: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xxxl,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backdropFilter: 'blur(30px)',
  } as const,
} as const;

// ═══════════════════════════════════════
// ANIMATION
// ═══════════════════════════════════════

export const Timing = {
  fast:150, normal:250, slow:400, slower:600,
  spring:{ stiffness:200, damping:20 },
  snappy:{ stiffness:300, damping:25 },
  bouncy:{ stiffness:150, damping:12 },
} as const;

// Backward compat aliases
export const SampleTypeColor = { drum:Colors.drum, melody:Colors.melody, vocal_chop:Colors.vocalChop, bass:Colors.bass, fx:Colors.fx, texture:Colors.textSecondary, dialog:Colors.accent } as const;
export const GraphNodeColor = { artist:'#6C8CFF', producer:Colors.accent, featured:'#FFB347', engineer:gray[400], songwriter:Colors.purple, center:'#4DFFA5' } as const;
