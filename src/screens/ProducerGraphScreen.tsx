import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions,
  Animated, PanResponder, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Glass, Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';
import { LoadingSpinner } from '../components/common';
import { useSampleStore } from '../store/sampleStore';
import type { GraphNode, GraphEdge, CreditRole } from '../types/entities';

const { width: W } = Dimensions.get('window');
const GRAPH_SIZE = W * 1.2;
const CENTER = GRAPH_SIZE / 2;

const ROLE_CN: Record<string, string> = {
  producer: '制作人', featured: '客串艺人', mixing_engineer: '混音师',
  songwriter: '词曲作者', sampled_artist: '采样来源', co_producer: '联合制作',
  arranger: '编曲', mastering_engineer: '母带工程师',
};

const NODE_COLORS: Record<string, string> = {artist:'#6C8CFF',producer:Colors.accent,featured:'#FFB347',engineer:'#9696A0',songwriter:Colors.purple,center:'#4DFFA5'};

export default function ProducerGraphScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { songId } = route.params || {};
  const { graphData, loadGraph, loading } = useSampleStore();
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  // Animated values
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => { if (songId) loadGraph(songId); }, [songId]);

  // Pulsing center node
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Layout nodes in concentric circles
  const positioned = useMemo(() => {
    if (!graphData) return [];
    const { nodes } = graphData;
    const center = nodes.find(n => n.type === 'center');
    const rest = nodes.filter(n => n.type !== 'center');
    const result: GraphNode[] = [];
    if (center) result.push({ ...center, x: CENTER, y: CENTER });
    const inner = rest.slice(0, Math.min(5, rest.length));
    const outer = rest.slice(inner.length);
    inner.forEach((n, i) => {
      const a = (i / inner.length) * Math.PI * 2 - Math.PI / 2;
      result.push({ ...n, x: CENTER + Math.cos(a) * 130, y: CENTER + Math.sin(a) * 130 });
    });
    outer.forEach((n, i) => {
      const a = (i / Math.max(1, outer.length)) * Math.PI * 2 - Math.PI / 2 + 0.3;
      result.push({ ...n, x: CENTER + Math.cos(a) * 220, y: CENTER + Math.sin(a) * 220 });
    });
    return result;
  }, [graphData]);

  // PanResponder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => { pan.extractOffset(); },
    })
  ).current;

  const handleZoomIn = () => {
    const newZ = Math.min(2, zoom + 0.25);
    setZoom(newZ);
    Animated.spring(scaleAnim, { toValue: newZ, useNativeDriver: true, friction: 7 }).start();
  };
  const handleZoomOut = () => {
    const newZ = Math.max(0.5, zoom - 0.25);
    setZoom(newZ);
    Animated.spring(scaleAnim, { toValue: newZ, useNativeDriver: true, friction: 7 }).start();
  };

  if (loading || !graphData) {
    return <SafeAreaView style={st.container} edges={['top']}><LoadingSpinner message="加载关系图谱..." /></SafeAreaView>;
  }

  // Edge connections for rendering
  const edgeLines: { from: GraphNode; to: GraphNode; label: string }[] = [];
  graphData.edges.forEach(e => {
    const from = positioned.find(n => n.id === e.source);
    const to = positioned.find(n => n.id === e.target);
    if (from && to) edgeLines.push({ from, to, label: e.label });
  });

  return (
    <SafeAreaView style={st.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Top bar */}
      <View style={st.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()} style={st.backBtn}>
          <Text style={st.backText}>←</Text>
        </TouchableOpacity>
        <Text style={st.topTitle}>制作人/艺人关系图谱</Text>
      </View>

      {/* Graph area */}
      <View style={st.graphArea} {...panResponder.panHandlers}>
        <Animated.View style={[
          st.graphContent,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scaleAnim },
            ],
          },
        ]}>
          {/* Edge lines */}
          {edgeLines.map(({ from, to, label }, i) => {
            const fx = from.x ?? CENTER, fy = from.y ?? CENTER;
            const tx = to.x ?? CENTER, ty = to.y ?? CENTER;
            const dx = tx - fx, dy = ty - fy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <View
                key={`edge-${i}`}
                style={[st.edgeLine, {
                  left: fx, top: fy,
                  width: len,
                  transform: [{ rotate: `${angle}deg` }],
                  transformOrigin: '0 50%',
                }]}
              >
                <Text style={st.edgeLabel}>{label}</Text>
              </View>
            );
          })}

          {/* Nodes */}
          {positioned.map(node => {
            const cx = (node.x ?? CENTER) - CENTER;
            const cy = (node.y ?? CENTER) - CENTER;
            const isCenter = node.type === 'center';
            const nodeColor = NODE_COLORS[node.type] || Colors.textSecondary;
            const size = isCenter ? 48 : 36;

            return (
              <Animated.View
                key={node.id}
                style={[
                  st.node,
                  {
                    left: CENTER + cx - size / 2,
                    top: CENTER + cy - size / 2,
                    width: size, height: size, borderRadius: size / 2,
                    backgroundColor: nodeColor,
                    borderColor: isCenter ? Colors.success : nodeColor,
                  },
                  isCenter && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={[st.nodeTouch, { width: size, height: size, borderRadius: size / 2 }]}
                  onPress={() => setSelected(node)}
                  activeOpacity={0.6}
                >
                  <Text style={[st.nodeEmoji, { fontSize: isCenter ? 18 : 14 }]}>
                    {isCenter ? '🎯' : node.role === 'producer' ? '🎛' : node.role === 'featured' ? '🎤' :
                     node.role === 'mixing_engineer' ? '🎚' : node.role === 'songwriter' ? '✍️' : '🎵'}
                  </Text>
                </TouchableOpacity>

                {/* Label below node */}
                <View style={[st.nodeLabelWrap, { top: size + 6, left: -30, width: size + 60 }]}>
                  <Text style={[st.nodeLabel, isCenter && st.centerLabel]} numberOfLines={1}>
                    {node.name}
                  </Text>
                  {!isCenter && (
                    <Text style={st.nodeRole} numberOfLines={1}>{ROLE_CN[node.role] || node.role}</Text>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>

      {/* Legend */}
      <View style={st.legend}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.legendScroll}>
          {Object.entries(NODE_COLORS).filter(([t]) => t !== 'center').map(([type, color]) => (
            <View key={type} style={st.legendItem}>
              <View style={[st.legendDot, { backgroundColor: color }]} />
              <Text style={st.legendText}>{ROLE_CN[type] || type}</Text>
            </View>
          ))}
          <View style={st.legendItem}>
            <View style={[st.legendDot, { backgroundColor: NODE_COLORS.center }]} />
            <Text style={st.legendText}>目标歌曲</Text>
          </View>
        </ScrollView>
      </View>

      {/* Zoom controls */}
      <View style={st.zoomCtrls}>
        <TouchableOpacity style={st.zoomBtn} onPress={handleZoomIn}><Text style={st.zoomText}>+</Text></TouchableOpacity>
        <TouchableOpacity style={st.zoomBtn} onPress={handleZoomOut}><Text style={st.zoomText}>−</Text></TouchableOpacity>
      </View>

      {/* Node detail sheet */}
      {selected && (
        <View style={st.sheet}>
          <View style={st.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={st.sheetName}>{selected.name}</Text>
              <Text style={st.sheetRole}>{ROLE_CN[selected.role] || selected.role}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)} style={st.sheetClose}>
              <Text style={st.sheetCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={st.sheetActions}>
            <TouchableOpacity
              style={st.sheetAction}
              onPress={() => { setSelected(null); nav.navigate('SearchTab', { screen: 'Search' }); }}
            >
              <Text style={st.sheetActionText}>🔍 搜索作品</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.sheetAction, st.sheetActionPrimary]}
              onPress={() => {
                setSelected(null);
                nav.navigate('SongDetail', { songId });
              }}
            >
              <Text style={[st.sheetActionText, { color: Colors.textInverse }]}>🎵 查看关联歌曲</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  backBtn: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  backText: { ...Typography.h3, color: Colors.textPrimary },
  topTitle: { flex: 1, ...Typography.h3, color: Colors.textPrimary },

  graphArea: { flex: 1, backgroundColor: Colors.bgSecondary, overflow: 'hidden' },
  graphContent: { width: GRAPH_SIZE, height: GRAPH_SIZE, position: 'relative' },

  // Edges
  edgeLine: {
    position: 'absolute', height: 2, backgroundColor: Colors.divider,
    justifyContent: 'center', alignItems: 'center',
  },
  edgeLabel: {
    ...Typography.label, color: Colors.textTertiary, fontSize: 9,
    backgroundColor: Colors.bgSecondary, paddingHorizontal: 4,
    textTransform: 'none',
  },

  // Nodes
  node: {
    position: 'absolute', borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6,
    elevation: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  nodeTouch: { justifyContent: 'center', alignItems: 'center' },
  nodeEmoji: {},
  nodeLabelWrap: { position: 'absolute', alignItems: 'center' },
  nodeLabel: {
    ...Typography.label, color: Colors.textSecondary, textAlign: 'center',
    textTransform: 'none', fontSize: 9,
    backgroundColor: Colors.bgOverlay, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3,
    overflow: 'hidden',
  },
  centerLabel: { color: Colors.accent, fontWeight: '700', fontSize: 10 },
  nodeRole: { ...Typography.label, color: Colors.textTertiary, fontSize: 8, textTransform: 'none', marginTop: 1 },

  // Legend
  legend: { backgroundColor: Colors.bgSecondary, paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.divider },
  legendScroll: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 11 },

  // Zoom
  zoomCtrls: { position: 'absolute', right: Spacing.md, top: '40%', gap: Spacing.sm },
  zoomBtn: { width: 42, height: 42, borderRadius: Radius.sm, backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  zoomText: { ...Typography.h2, color: Colors.textPrimary },

  // Sheet
  sheet: {
    position: 'absolute', bottom: 100, left: Spacing.md, right: Spacing.md,
    backgroundColor: Colors.bgCardSolid, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.lg,
    ...Shadows.md,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  sheetName: { ...Typography.h2, color: Colors.textPrimary },
  sheetRole: { ...Typography.captionBold, color: Colors.accent, marginTop: 4 },
  sheetClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bgSecondary, justifyContent: 'center', alignItems: 'center' },
  sheetCloseText: { ...Typography.captionBold, color: Colors.textTertiary },
  sheetActions: { flexDirection: 'row', gap: Spacing.sm },
  sheetAction: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.bgSecondary, alignItems: 'center',
  },
  sheetActionPrimary: { backgroundColor: Colors.accent },
  sheetActionText: { ...Typography.captionBold, color: Colors.textPrimary },
});
