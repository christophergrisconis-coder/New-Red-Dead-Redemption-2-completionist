import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export function ProgressBar({ pct, tint = theme.colors.brass }: { pct: number; tint?: string }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: tint }]} />
    </View>
  );
}

export function StatBlock({
  label,
  done,
  total,
  pct,
  tint,
}: {
  label: string;
  done: number;
  total: number;
  pct: number;
  tint?: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: tint ?? theme.colors.parchment }]}>
          {done}/{total} · {pct}%
        </Text>
      </View>
      <ProgressBar pct={pct} tint={tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: theme.colors.bgElev,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fill: { height: '100%', borderRadius: 999 },
  stat: { gap: 6, marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: theme.colors.parchmentDim, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' },
  statValue: { fontVariant: ['tabular-nums'], fontWeight: '600' },
});
