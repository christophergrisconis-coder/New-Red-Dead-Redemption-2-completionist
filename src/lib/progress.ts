import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_TRACKABLES, DATA_BY_CATEGORY } from "@/data";
import type { CategoryId, Region } from "@/data/types";
import { isOfficial, isExtra } from "@/data/types";

export interface ItemProgress {
  done: boolean;
  steps: Record<string, boolean>;
  pinned?: boolean;
  notes?: string;
  completedAt?: number;
}

interface ProgressState {
  items: Record<string, ItemProgress>;
  toggleItem: (id: string) => void;
  setItem: (id: string, done: boolean) => void;
  toggleStep: (id: string, stepId: string) => void;
  togglePin: (id: string) => void;
  setNote: (id: string, note: string) => void;
  markAllInCategory: (cat: CategoryId, done: boolean) => void;
  clearAll: () => void;
  importState: (data: Record<string, ItemProgress>) => void;
  exportState: () => Record<string, ItemProgress>;
}

const STORAGE_KEY = "rdr1-progress-v1";

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      items: {},
      toggleItem: (id) =>
        set((s) => {
          const cur = s.items[id] ?? { done: false, steps: {} };
          const done = !cur.done;
          return {
            items: {
              ...s.items,
              [id]: { ...cur, done, completedAt: done ? Date.now() : undefined },
            },
          };
        }),
      setItem: (id, done) =>
        set((s) => {
          const cur = s.items[id] ?? { done: false, steps: {} };
          return {
            items: {
              ...s.items,
              [id]: { ...cur, done, completedAt: done ? Date.now() : undefined },
            },
          };
        }),
      toggleStep: (id, stepId) =>
        set((s) => {
          const cur = s.items[id] ?? { done: false, steps: {} };
          const steps = { ...cur.steps, [stepId]: !cur.steps[stepId] };
          return { items: { ...s.items, [id]: { ...cur, steps } } };
        }),
      togglePin: (id) =>
        set((s) => {
          const cur = s.items[id] ?? { done: false, steps: {} };
          return {
            items: { ...s.items, [id]: { ...cur, pinned: !cur.pinned } },
          };
        }),
      setNote: (id, note) =>
        set((s) => {
          const cur = s.items[id] ?? { done: false, steps: {} };
          return { items: { ...s.items, [id]: { ...cur, notes: note } } };
        }),
      markAllInCategory: (cat, done) =>
        set((s) => {
          const ids = (DATA_BY_CATEGORY[cat] ?? []).map((t) => t.id);
          const items = { ...s.items };
          for (const id of ids) {
            const cur = items[id] ?? { done: false, steps: {} };
            items[id] = { ...cur, done, completedAt: done ? Date.now() : undefined };
          }
          return { items };
        }),
      clearAll: () => set({ items: {} }),
      importState: (data) => set({ items: data }),
      exportState: () => get().items,
    }),
    { name: STORAGE_KEY },
  ),
);

// -----------------------------------------------------------------------
// Selectors
// -----------------------------------------------------------------------
export interface ProgressRollup {
  done: number;
  total: number;
  pct: number;
}

export function rollup(ids: string[], items: Record<string, ItemProgress>): ProgressRollup {
  const total = ids.length;
  const done = ids.filter((id) => items[id]?.done).length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function useOverallRollup(): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    ALL_TRACKABLES.map((t) => t.id),
    items,
  );
}

export function useOfficialRollup(): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    ALL_TRACKABLES.filter((t) => isOfficial(t)).map((t) => t.id),
    items,
  );
}

export function useCompletionistRollup(): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    ALL_TRACKABLES.map((t) => t.id),
    items,
  );
}

export function useExtrasRollup(): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    ALL_TRACKABLES.filter((t) => isExtra(t)).map((t) => t.id),
    items,
  );
}

export function useCategoryRollup(cat: CategoryId): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    (DATA_BY_CATEGORY[cat] ?? []).map((t) => t.id),
    items,
  );
}

export function useOfficialCategoryRollup(cat: CategoryId): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    (DATA_BY_CATEGORY[cat] ?? []).filter((t) => isOfficial(t)).map((t) => t.id),
    items,
  );
}

export function useExtrasCategoryRollup(cat: CategoryId): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    (DATA_BY_CATEGORY[cat] ?? []).filter((t) => isExtra(t)).map((t) => t.id),
    items,
  );
}

export function useRegionRollup(region: Region): ProgressRollup {
  const items = useProgress((s) => s.items);
  return rollup(
    ALL_TRACKABLES.filter((t) => t.region === region).map((t) => t.id),
    items,
  );
}
