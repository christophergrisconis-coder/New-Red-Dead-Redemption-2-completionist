import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import type { Trackable } from '../data/types';
import { useProgress } from '../lib/progress';

export function TrackableRow({
  item,
  onPress,
  active,
}: {
  item: Trackable;
  onPress: () => void;
  active?: boolean;
}) {
  const done = useProgress((s) => !!s.items[item.id]?.done);
  const pinned = useProgress((s) => !!s.items[item.id]?.pinned);
  const toggle = useProgress((s) => s.toggleItem);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        active && styles.rowActive,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Pressable
        hitSlop={8}
        onPress={() => toggle(item.id)}
        style={[styles.checkbox, done && styles.checkboxDone]}
      >
        {done ? <Text style={styles.checkboxTick}>✓</Text> : null}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, done && styles.titleDone]} numberOfLines={1}>
          {pinned ? '★ ' : ''}
          {item.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.region}
          {item.isRequiredForOfficial100 ? ' · Official' : ' · Extra'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  rowActive: { backgroundColor: theme.colors.bgElev },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
  checkboxDone: { backgroundColor: theme.colors.brass, borderColor: theme.colors.brass },
  checkboxTick: { color: theme.colors.bg, fontWeight: '800', fontSize: 14 },
  title: { color: theme.colors.parchment, fontSize: 15, fontWeight: '600' },
  titleDone: { color: theme.colors.muted, textDecorationLine: 'line-through' },
  meta: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
});
