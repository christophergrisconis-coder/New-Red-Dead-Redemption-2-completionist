import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { DATA_BY_CATEGORY } from '../data/seed';
import type { CategoryId, Trackable } from '../data/types';
import { CATEGORY_BY_ID } from '../data/categories';
import { TrackableRow } from '../components/TrackableRow';
import { DetailPanel } from '../components/DetailPanel';
import { useIsTablet } from '../lib/useIsTablet';
import { useOfficialCategoryRollup, useExtrasCategoryRollup, useProgress } from '../lib/progress';
import { StatBlock } from '../components/ProgressBar';

type FilterMode = 'all' | 'official' | 'extras' | 'pinned' | 'todo';

export function CategoryScreen({ route, navigation }: any) {
  const categoryId: CategoryId = route.params.categoryId;
  const meta = CATEGORY_BY_ID[categoryId];
  const isTablet = useIsTablet();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = useProgress((s) => s.items);
  const markAll = useProgress((s) => s.markAllInCategory);

  useEffect(() => {
    navigation.setOptions({ title: meta.label });
  }, [meta.label]);

  const list = DATA_BY_CATEGORY[categoryId] ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q) && !t.region.toLowerCase().includes(q)) return false;
      if (filter === 'official' && !t.isRequiredForOfficial100) return false;
      if (filter === 'extras' && t.isRequiredForOfficial100) return false;
      if (filter === 'pinned' && !items[t.id]?.pinned) return false;
      if (filter === 'todo' && items[t.id]?.done) return false;
      return true;
    });
  }, [list, query, filter, items]);

  useEffect(() => {
    if (isTablet && !selectedId && filtered[0]) setSelectedId(filtered[0].id);
  }, [isTablet, filtered, selectedId]);

  const selected: Trackable | null = useMemo(
    () => filtered.find((t) => t.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const official = useOfficialCategoryRollup(categoryId);
  const extras = useExtrasCategoryRollup(categoryId);

  const listPanel = (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBox}>
        <Text style={styles.h1}>{meta.icon}  {meta.label}</Text>
        <Text style={styles.sub}>{meta.officialText}</Text>
        {official.total > 0 && (
          <StatBlock label="Official 100%" done={official.done} total={official.total} pct={official.pct} tint={theme.colors.official} />
        )}
        {extras.total > 0 && (
          <StatBlock label="Extras" done={extras.done} total={extras.total} pct={extras.pct} tint={theme.colors.extra} />
        )}

        <TextInput
          placeholder="Search…"
          placeholderTextColor={theme.colors.muted}
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {(['all', 'official', 'extras', 'pinned', 'todo'] as FilterMode[]).map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
              <Text style={[styles.chipTxt, filter === f && styles.chipTxtActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.rowBtns}>
          <Pressable onPress={() => markAll(categoryId, true)} style={styles.smallBtn}>
            <Text style={styles.smallBtnTxt}>Mark all done</Text>
          </Pressable>
          <Pressable onPress={() => markAll(categoryId, false)} style={styles.smallBtn}>
            <Text style={styles.smallBtnTxt}>Clear category</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TrackableRow
            item={item}
            active={isTablet && item.id === selectedId}
            onPress={() => {
              if (isTablet) setSelectedId(item.id);
              else navigation.navigate('Detail', { itemId: item.id });
            }}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 40 }}>
            <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>No entries match.</Text>
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {isTablet ? (
        <View style={styles.tablet}>
          <View style={styles.tabletList}>{listPanel}</View>
          <View style={styles.tabletDetail}>
            <DetailPanel item={selected} />
          </View>
        </View>
      ) : (
        listPanel
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  tablet: { flex: 1, flexDirection: 'row' },
  tabletList: { width: 380, borderRightWidth: 1, borderRightColor: theme.colors.border },
  tabletDetail: { flex: 1 },
  headerBox: { padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  h1: { color: theme.colors.parchment, fontSize: 22, fontFamily: 'Georgia', fontWeight: '700' },
  sub: { color: theme.colors.muted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  search: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.parchment,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  chips: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface,
  },
  chipActive: { backgroundColor: theme.colors.brass, borderColor: theme.colors.brass },
  chipTxt: { color: theme.colors.parchmentDim, fontSize: 12, textTransform: 'capitalize' },
  chipTxtActive: { color: theme.colors.bg, fontWeight: '700' },
  rowBtns: { flexDirection: 'row', gap: 8, marginTop: 10 },
  smallBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  smallBtnTxt: { color: theme.colors.parchmentDim, fontSize: 12 },
});
