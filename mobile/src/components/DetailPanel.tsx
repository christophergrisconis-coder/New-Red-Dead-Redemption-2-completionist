import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { theme } from '../theme/theme';
import type { Trackable } from '../data/types';
import { useProgress } from '../lib/progress';

export function DetailPanel({ item }: { item: Trackable | null }) {
  if (!item) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Select an entry to see the walkthrough.</Text>
      </View>
    );
  }
  const progress = useProgress((s) => s.items[item.id]);
  const toggleItem = useProgress((s) => s.toggleItem);
  const toggleStep = useProgress((s) => s.toggleStep);
  const togglePin = useProgress((s) => s.togglePin);
  const setNote = useProgress((s) => s.setNote);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>
            {item.region} · {item.isRequiredForOfficial100 ? 'Official 100%' : 'Completionist Extra'}
          </Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Pressable onPress={() => togglePin(item.id)} style={styles.pinBtn}>
          <Text style={styles.pinTxt}>{progress?.pinned ? '★ Pinned' : '☆ Pin'}</Text>
        </Pressable>
      </View>

      <Text style={styles.summary}>{item.summary}</Text>

      <Pressable
        onPress={() => toggleItem(item.id)}
        style={[styles.doneBtn, progress?.done && styles.doneBtnActive]}
      >
        <Text style={[styles.doneTxt, progress?.done && styles.doneTxtActive]}>
          {progress?.done ? '✓ Completed' : 'Mark complete'}
        </Text>
      </Pressable>

      <Section title="Walkthrough">
        <Text style={styles.body}>{item.walkthrough}</Text>
      </Section>

      <Section title="Objectives">
        {item.objectives.map((o, i) => (
          <Text key={i} style={styles.bullet}>• {o}</Text>
        ))}
      </Section>

      <Section title="Rewards">
        {item.rewards.map((o, i) => (
          <Text key={i} style={styles.bullet}>• {o}</Text>
        ))}
      </Section>

      {item.steps.length > 0 && (
        <Section title="Checklist">
          {item.steps.map((s) => {
            const on = !!progress?.steps?.[s.id];
            return (
              <Pressable key={s.id} onPress={() => toggleStep(item.id, s.id)} style={styles.step}>
                <View style={[styles.checkbox, on && styles.checkboxDone]}>
                  {on ? <Text style={styles.tick}>✓</Text> : null}
                </View>
                <Text style={[styles.stepLabel, on && styles.stepLabelDone]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </Section>
      )}

      <Section title="Notes">
        <TextInput
          value={progress?.notes ?? ''}
          onChangeText={(t) => setNote(item.id, t)}
          placeholder="Add personal notes…"
          placeholderTextColor={theme.colors.muted}
          multiline
          style={styles.notes}
        />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ marginTop: 8, gap: 6 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: theme.colors.bg },
  emptyText: { color: theme.colors.muted, fontSize: 14, textAlign: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  eyebrow: { color: theme.colors.brass, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: theme.colors.parchment, fontSize: 26, fontWeight: '700', fontFamily: 'Georgia', marginTop: 4 },
  summary: { color: theme.colors.parchmentDim, fontSize: 15, lineHeight: 22, marginTop: 12 },
  pinBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  pinTxt: { color: theme.colors.parchment, fontSize: 13 },
  doneBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.brass,
    alignItems: 'center',
  },
  doneBtnActive: { backgroundColor: theme.colors.brass },
  doneTxt: { color: theme.colors.brass, fontWeight: '700', letterSpacing: 0.5 },
  doneTxtActive: { color: theme.colors.bg },
  sectionTitle: { color: theme.colors.brass, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700' },
  body: { color: theme.colors.parchmentDim, fontSize: 15, lineHeight: 22 },
  bullet: { color: theme.colors.parchmentDim, fontSize: 14, lineHeight: 20 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 1.5,
    borderColor: theme.colors.borderStrong, alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
  checkboxDone: { backgroundColor: theme.colors.brass, borderColor: theme.colors.brass },
  tick: { color: theme.colors.bg, fontWeight: '800' },
  stepLabel: { color: theme.colors.parchment, fontSize: 14, flex: 1 },
  stepLabelDone: { color: theme.colors.muted, textDecorationLine: 'line-through' },
  notes: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    color: theme.colors.parchment,
    backgroundColor: theme.colors.surface,
    textAlignVertical: 'top',
  },
});
