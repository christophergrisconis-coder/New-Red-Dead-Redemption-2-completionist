import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { StatBlock } from './ProgressBar';
import type { CategoryMeta } from '../data/types';
import { useOfficialCategoryRollup, useExtrasCategoryRollup } from '../lib/progress';

export function CategoryCard({
  meta,
  onPress,
}: {
  meta: CategoryMeta;
  onPress: () => void;
}) {
  const official = useOfficialCategoryRollup(meta.id);
  const extras = useExtrasCategoryRollup(meta.id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{meta.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{meta.label}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {meta.description}
          </Text>
        </View>
      </View>

      {official.total > 0 && (
        <StatBlock
          label="Official 100%"
          done={official.done}
          total={official.total}
          pct={official.pct}
          tint={theme.colors.official}
        />
      )}
      {extras.total > 0 && (
        <StatBlock
          label="Completionist Extras"
          done={extras.done}
          total={extras.total}
          pct={extras.pct}
          tint={theme.colors.extra}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  icon: { fontSize: 28 },
  title: {
    color: theme.colors.parchment,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Georgia',
    letterSpacing: 0.3,
  },
  desc: { color: theme.colors.muted, fontSize: 13, marginTop: 2 },
});
