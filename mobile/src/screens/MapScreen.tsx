import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

const IGN_MAP = 'https://www.ign.com/maps/red-dead-redemption/red-dead-redemption';
const FANDOM_MAP = 'https://reddead.fandom.com/wiki/Interactive_Map';

export function MapScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={styles.eyebrow}>Reference</Text>
        <Text style={styles.title}>Map & External Guides</Text>
        <Text style={styles.body}>
          Interactive maps and full IGN wiki reference open in your device's browser. This
          keeps the guide reliable inside Expo Go without embedding fragile web views.
        </Text>

        <LinkCard label="Open IGN Interactive Map" url={IGN_MAP} />
        <LinkCard label="Open Fandom Interactive Map" url={FANDOM_MAP} />
        <LinkCard label="IGN Walkthrough" url="https://www.ign.com/wikis/red-dead-redemption/Walkthrough" />
        <LinkCard label="IGN 100% Completion Checklist" url="https://www.ign.com/wikis/red-dead-redemption/100_Completion_Checklist" />

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Region cheat-sheet</Text>
        {REGIONS.map((r) => (
          <View key={r.name} style={styles.regionCard}>
            <Text style={styles.regionName}>{r.name}</Text>
            <Text style={styles.regionSub}>{r.note}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function LinkCard({ label, url }: { label: string; url: string }) {
  return (
    <Pressable onPress={() => Linking.openURL(url)} style={({ pressed }) => [styles.linkCard, pressed && { opacity: 0.85 }]}>
      <Text style={styles.linkLabel}>{label}</Text>
      <Text style={styles.linkArrow}>↗</Text>
    </Pressable>
  );
}

const REGIONS = [
  { name: 'New Austin', note: 'Chapters 1–2. Ranch work, first bounties, Sharpshooter start.' },
  { name: 'Nuevo Paraíso', note: 'Chapter 3. Rebels, Rurales, Bandito outfit chain.' },
  { name: 'West Elizabeth', note: 'Chapters 4–5. Blackwater, Tall Trees, endgame.' },
  { name: 'Great Plains', note: 'Epilogue. Beecher’s Hope + Jack Marston.' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  eyebrow: { color: theme.colors.brass, letterSpacing: 2, fontSize: 12, textTransform: 'uppercase' },
  title: { color: theme.colors.parchment, fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', marginTop: 4, marginBottom: 8 },
  body: { color: theme.colors.parchmentDim, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  linkCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.colors.brassDim, backgroundColor: theme.colors.surface,
    marginBottom: 10,
  },
  linkLabel: { color: theme.colors.parchment, fontWeight: '600' },
  linkArrow: { color: theme.colors.brass, fontSize: 18 },
  sectionHeader: {
    color: theme.colors.brass, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginBottom: 10,
  },
  regionCard: {
    padding: 14, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  regionName: { color: theme.colors.parchment, fontWeight: '700', fontFamily: 'Georgia', fontSize: 16 },
  regionSub: { color: theme.colors.muted, fontSize: 13, marginTop: 4 },
});
