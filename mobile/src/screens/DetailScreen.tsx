import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DetailPanel } from '../components/DetailPanel';
import { ALL_TRACKABLES } from '../data/seed';
import { theme } from '../theme/theme';

export function DetailScreen({ route }: any) {
  const item = ALL_TRACKABLES.find((t) => t.id === route.params.itemId) ?? null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={['bottom']}>
      <DetailPanel item={item} />
    </SafeAreaView>
  );
}
