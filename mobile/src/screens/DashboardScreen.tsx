import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { CATEGORIES } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { StatBlock } from '../components/ProgressBar';
import { useOfficialRollup, useExtrasRollup, useOverallRollup } from '../lib/progress';
import { useIsTablet } from '../lib/useIsTablet';

export function DashboardScreen({ navigation }: any) {
  const official = useOfficialRollup();
  const extras = useExtrasRollup();
  const overall = useOverallRollup();
  const isTablet = useIsTablet();
  const { width } = useWindowDimensions();
  const cols = isTablet ? (width > 1100 ? 3 : 2) : 1;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Red Dead Redemption</Text>
          <Text style={styles.title}>Completionist Guide</Text>
          <Text style={styles.tagline}>
            A premium interactive strategy dashboard for John Marston's road to 100%.
          </Text>
        </View>

        <View style={styles.summary}>
          <StatBlock label="Official 100%" done={official.done} total={official.total} pct={official.pct} tint={theme.colors.official} />
          <StatBlock label="Completionist Extras" done={extras.done} total={extras.total} pct={extras.pct} tint={theme.colors.extra} />
          <StatBlock label="Overall" done={overall.done} total={overall.total} pct={overall.pct} tint={theme.colors.parchment} />
        </View>

        <View style={styles.quickRow}>
          <QuickBtn label="Map & Reference" onPress={() => navigation.navigate('Map')} />
          <QuickBtn label="Import / Export" onPress={() => navigation.navigate('Settings')} />
        </View>

        <Text style={styles.sectionHeader}>Categories</Text>
        <View style={[styles.grid, { flexDirection: cols === 1 ? 'column' : 'row', flexWrap: 'wrap' }]}>
          {CATEGORIES.map((cat) => (
            <View key={cat.id} style={{ width: cols === 1 ? '100%' : `${100 / cols - 1}%`, marginRight: cols > 1 ? '1%' : 0 }}>
              <CategoryCard meta={cat} onPress={() => navigation.navigate('Category', { categoryId: cat.id })} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.qbtn, pressed && { opacity: 0.85 }]}>
      <Text style={styles.qbtnTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: 20, paddingBottom: 60 },
  hero: { marginBottom: 20 },
  eyebrow: { color: theme.colors.brass, letterSpacing: 2, fontSize: 12, textTransform: 'uppercase' },
  title: { color: theme.colors.parchment, fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', marginTop: 4 },
  tagline: { color: theme.colors.parchmentDim, fontSize: 14, marginTop: 8, maxWidth: 640 },
  summary: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  qbtn: {
    flex: 1,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.brassDim,
    backgroundColor: theme.colors.bgElev,
    alignItems: 'center',
  },
  qbtnTxt: { color: theme.colors.brass, fontWeight: '700', letterSpacing: 0.6 },
  sectionHeader: {
    color: theme.colors.brass,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 6,
  },
  grid: {},
});
