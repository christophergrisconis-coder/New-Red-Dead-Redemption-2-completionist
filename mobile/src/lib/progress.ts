import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_TRACKABLES, DATA_BY_CATEGORY } from '../data/seed';
import type { CategoryId, Trackable } from '../data/types';
import { isOfficial, isExtra } from '../data/types';

export interface ItemProgress {
  done: boolean;
  steps: Record<string, boolean>;
  pinned?: boolean;
  notes?: string;
  completedAt?: number;
}

interface ProgressState {
  items: Record<string, ItemProgress>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleItem: (id: string) => void;
  setItem: (id: string, done: boolean) => void;
  toggleStep: (id: string, stepId: string) => void;
  togglePin: (id: string) => void;
  setNote: (id: string, note: string) => void;
  markAllInCategory: (cat: CategoryId, done: boolean) => void;
  clearAll: () => void;
  importJSON: (json: string) => { ok: true } | { ok: false; error: string };
  exportJSON: () => string;
}

const KEY = 'rdr1-progress-v1';

async function persist(items: Record<string, ItemProgress>) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export const useProgress = create<ProgressState>((set, get) => ({
  items: {},
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) set({ items: JSON.parse(raw), hydrated: true });
      else set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  toggleItem: (id) => {
    const cur = get().items[id] ?? { done: false, steps: {} };
    const next = { ...cur, done: !cur.done, completedAt: !cur.done ? Date.now() : undefined };
    const items = { ...get().items, [id]: next };
    set({ items });
    persist(items);
  },
  setItem: (id, done) => {
    const cur = get().items[id] ?? { done: false, steps: {} };
    const items = {
      ...get().items,
      [id]: { ...cur, done, completedAt: done ? Date.now() : undefined },
    };
    set({ items });
    persist(items);
  },
  toggleStep: (id, stepId) => {
    const cur = get().items[id] ?? { done: false, steps: {} };
    const items = {
      ...get().items,
      [id]: { ...cur, steps: { ...cur.steps, [stepId]: !cur.steps[stepId] } },
    };
    set({ items });
    persist(items);
  },
  togglePin: (id) => {
    const cur = get().items[id] ?? { done: false, steps: {} };
    const items = { ...get().items, [id]: { ...cur, pinned: !cur.pinned } };
    set({ items });
    persist(items);
  },
  setNote: (id, notes) => {
    const cur = get().items[id] ?? { done: false, steps: {} };
    const items = { ...get().items, [id]: { ...cur, notes } };
    set({ items });
    persist(items);
  },
  markAllInCategory: (cat, done) => {
    const ids = (DATA_BY_CATEGORY[cat] ?? []).map((t) => t.id);
    const items = { ...get().items };
    for (const id of ids) {
      const cur = items[id] ?? { done: false, steps: {} };
      items[id] = { ...cur, done, completedAt: done ? Date.now() : undefined };
    }
    set({ items });
    persist(items);
  },
  clearAll: () => {
    set({ items: {} });
    persist({});
  },
  importJSON: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'Invalid JSON shape' };
      set({ items: parsed as Record<string, ItemProgress> });
      persist(parsed);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Invalid JSON' };
    }
  },
  exportJSON: () => JSON.stringify(get().items, null, 2),
}));

export interface Rollup {
  done: number;
  total: number;
  pct: number;
}

export function rollup(list: Trackable[], items: Record<string, ItemProgress>): Rollup {
  const total = list.length;
  const done = list.filter((t) => items[t.id]?.done).length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function useOverallRollup(): Rollup {
  const items = useProgress((s) => s.items);
  return rollup(ALL_TRACKABLES, items);
}
export function useOfficialRollup(): Rollup {
  const items = useProgress((s) => s.items);
  return rollup(ALL_TRACKABLES.filter(isOfficial), items);
}
export function useExtrasRollup(): Rollup {
  const items = useProgress((s) => s.items);
  return rollup(ALL_TRACKABLES.filter(isExtra), items);
}
export function useCategoryRollup(cat: CategoryId): Rollup {
  const items = useProgress((s) => s.items);
  return rollup(DATA_BY_CATEGORY[cat] ?? [], items);
}
export function useOfficialCategoryRollup(cat: CategoryId): Rollup {
  const items = useProgress((s) => s.items);
  return rollup((DATA_BY_CATEGORY[cat] ?? []).filter(isOfficial), items);
}
export function useExtrasCategoryRollup(cat: CategoryId): Rollup {
  const items = useProgress((s) => s.items);
  return rollup((DATA_BY_CATEGORY[cat] ?? []).filter(isExtra), items);
}
