import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme/theme';
import { useProgress } from '../lib/progress';

export function SettingsScreen() {
  const exportJSON = useProgress((s) => s.exportJSON);
  const importJSON = useProgress((s) => s.importJSON);
  const clearAll = useProgress((s) => s.clearAll);
  const [importText, setImportText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const doExport = () => setPreview(exportJSON());

  const copy = async () => {
    await Clipboard.setStringAsync(exportJSON());
    Alert.alert('Copied', 'Progress JSON copied to clipboard.');
  };

  const share = async () => {
    try {
      await Share.share({ message: exportJSON(), title: 'RDR1 Completionist Progress' });
    } catch (e: any) {
      Alert.alert('Share failed', e?.message ?? 'Unknown error');
    }
  };

  const paste = async () => {
    const txt = await Clipboard.getStringAsync();
    setImportText(txt);
  };

  const doImport = () => {
    const res = importJSON(importText);
    if (res.ok) Alert.alert('Imported', 'Progress restored from JSON.');
    else Alert.alert('Import failed', res.error);
  };

  const confirmClear = () => {
    Alert.alert('Clear all progress?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearAll() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={styles.eyebrow}>Progress</Text>
        <Text style={styles.title}>Import & Export</Text>
        <Text style={styles.body}>
          Progress is saved locally on this device with AsyncStorage. Back it up as JSON or move
          it between devices using copy, share sheet, or paste.
        </Text>

        <Text style={styles.sectionHeader}>Export</Text>
        <View style={styles.row}>
          <Btn label="Preview JSON" onPress={doExport} />
          <Btn label="Copy" onPress={copy} />
          <Btn label="Share…" onPress={share} />
        </View>
        {preview && (
          <ScrollView style={styles.preview}>
            <Text selectable style={styles.previewTxt}>{preview}</Text>
          </ScrollView>
        )}

        <Text style={styles.sectionHeader}>Import</Text>
        <TextInput
          value={importText}
          onChangeText={setImportText}
          multiline
          placeholder="Paste progress JSON here…"
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
        />
        <View style={styles.row}>
          <Btn label="Paste from clipboard" onPress={paste} />
          <Btn label="Import" onPress={doImport} tone="primary" />
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 30 }]}>Danger zone</Text>
        <Btn label="Clear all progress" onPress={confirmClear} tone="danger" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Btn({ label, onPress, tone }: { label: string; onPress: () => void; tone?: 'primary' | 'danger' }) {
  const bg =
    tone === 'primary' ? theme.colors.brass : tone === 'danger' ? theme.colors.danger : theme.colors.surface;
  const color =
    tone === 'primary' ? theme.colors.bg : tone === 'danger' ? '#fff' : theme.colors.parchment;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: tone ? bg : theme.colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={{ color, fontWeight: '700', letterSpacing: 0.4 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  eyebrow: { color: theme.colors.brass, letterSpacing: 2, fontSize: 12, textTransform: 'uppercase' },
  title: { color: theme.colors.parchment, fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', marginTop: 4, marginBottom: 8 },
  body: { color: theme.colors.parchmentDim, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  sectionHeader: { color: theme.colors.brass, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginTop: 18, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  btn: {
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: theme.radius.md, borderWidth: 1,
  },
  input: {
    borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md, padding: 12, color: theme.colors.parchment,
    minHeight: 120, textAlignVertical: 'top', marginBottom: 10,
  },
  preview: {
    maxHeight: 200, marginTop: 10,
    backgroundColor: theme.colors.bgElev, borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.colors.border, padding: 10,
  },
  previewTxt: { color: theme.colors.parchmentDim, fontSize: 12, fontFamily: 'Courier' },
});
