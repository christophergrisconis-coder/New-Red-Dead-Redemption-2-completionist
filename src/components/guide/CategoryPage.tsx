import { useMemo, useState } from "react";
import { CATEGORY_BY_ID } from "@/data/categories";
import { getByCategory, computeDatasetStats } from "@/data";
import type { CategoryId, Region, Trackable } from "@/data/types";
import { REGIONS, isOfficial, isExtra } from "@/data/types";
import { useProgress } from "@/lib/progress";
import { DetailPanel } from "./DetailPanel";
import { Check, Search, ListChecks, Undo2 } from "lucide-react";

interface CategoryPageProps {
  categoryId: CategoryId;
}

type StatusFilter = "all" | "todo" | "done" | "official" | "extras" | "pinned";

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const meta = CATEGORY_BY_ID[categoryId];
  const all = getByCategory(categoryId);
  const items = useProgress((s) => s.items);
  const markAll = useProgress((s) => s.markAllInCategory);
  const stat = useMemo(
    () => computeDatasetStats().find((s) => s.categoryId === categoryId),
    [categoryId],
  );

  const [selectedId, setSelectedId] = useState<string | null>(all[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return all.filter((t) => {
      if (region !== "all" && t.region !== region) return false;
      const p = items[t.id];
      if (status === "todo" && p?.done) return false;
      if (status === "done" && !p?.done) return false;
      if (status === "official" && !isOfficial(t)) return false;
      if (status === "extras" && !isExtra(t)) return false;
      if (status === "pinned" && !p?.pinned) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.summary.toLowerCase().includes(q) &&
          !(t.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [all, items, region, status, query]);

  const officialItems = all.filter((t) => isOfficial(t));
  const officialDone = officialItems.filter((t) => items[t.id]?.done).length;
  const extrasItems = all.filter((t) => isExtra(t));
  const extrasDone = extrasItems.filter((t) => items[t.id]?.done).length;
  const officialPct = officialItems.length ? Math.round((officialDone / officialItems.length) * 100) : 0;

  const mode = stat?.mode ?? "mixed";
  const modeLabel =
    mode === "official-only"
      ? "Official 100%"
      : mode === "extras-only"
        ? "Completionist Tracking"
        : `Mixed · ${officialItems.length} official + ${extrasItems.length} extras`;

  const selected: Trackable | null =
    (filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null) as Trackable | null;

  return (
    <div className="h-[calc(100vh-0px)] md:h-screen flex flex-col">
      {/* Category header */}
      <div className="hairline-b bg-panel/40 px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-xs uppercase tracking-[0.2em] text-brass-dim">Category</div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${
                mode === "extras-only"
                  ? "bg-muted text-muted-foreground"
                  : "bg-brass/15 text-brass"
              }`}>
                {modeLabel}
              </span>
              {stat && !stat.officialOk ? (
                <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ember">
                  Validation: {stat.mismatchReason}
                </span>
              ) : null}
            </div>
            <h1 className="mt-0.5 font-display text-3xl text-parchment">{meta.label}</h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {meta.description}
            </p>
            {stat ? (
              <p className="mt-1 text-[11px] text-muted-foreground max-w-2xl">
                {stat.officialRequirementText}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {mode === "extras-only" ? (
                <>
                  <div className="font-display text-2xl text-brass">
                    {extrasItems.length ? Math.round((extrasDone / extrasItems.length) * 100) : 0}%
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {extrasDone} / {extrasItems.length} tracked
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display text-2xl text-brass">{officialPct}%</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Official {officialDone} / {officialItems.length}
                  </div>
                  {extrasItems.length > 0 ? (
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Extras {extrasDone} / {extrasItems.length}
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => markAll(categoryId, true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-brass/40 px-3 py-1.5 text-xs text-brass hover:bg-brass/10"
              >
                <ListChecks className="h-3 w-3" /> Mark all
              </button>
              <button
                onClick={() => markAll(categoryId, false)}
                className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-xs text-muted-foreground hover:text-parchment"
              >
                <Undo2 className="h-3 w-3" /> Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split: list + detail */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        {/* List pane */}
        <div className="hairline-r flex flex-col min-h-0">
          {/* Filters */}
          <div className="hairline-b p-3 space-y-2 bg-panel/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, tag or summary…"
                className="w-full rounded-md border border-hairline bg-background/40 py-2.5 pl-9 pr-3 text-sm text-parchment placeholder:text-muted-foreground focus:border-brass focus:outline-none min-h-11"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "todo", "done", "official", "extras", "pinned"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                    status === s
                      ? "bg-brass text-primary-foreground"
                      : "bg-accent/40 text-muted-foreground hover:text-parchment"
                  }`}
                >
                  {s === "official" ? "100%" : s === "extras" ? "Extras" : s}
                </button>
              ))}
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | "all")}
              className="w-full rounded-md border border-hairline bg-background/40 px-3 py-2 text-sm text-parchment focus:border-brass focus:outline-none"
            >
              <option value="all">All regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nothing matches these filters.
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {filtered.map((t) => {
                  const p = items[t.id];
                  const active = selected?.id === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full text-left rounded-md p-3 transition-colors min-h-16 ${
                          active
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              p?.done
                                ? "bg-brass border-brass"
                                : "border-hairline"
                            }`}
                          >
                            {p?.done ? (
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            ) : null}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`font-display text-parchment truncate ${p?.done ? "opacity-60" : ""}`}>
                                {t.title}
                              </div>
                              {p?.pinned ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                              ) : null}
                            </div>
                            <div className="mt-0.5 text-[11px] uppercase tracking-wider text-brass-dim">
                              {t.region}
                              {isOfficial(t) ? (
                                <span className="ml-2 text-brass">100%</span>
                              ) : (
                                <span className="ml-2 text-muted-foreground">Extra</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Detail pane */}
        <div className="min-h-0 bg-background/40">
          <DetailPanel item={selected} />
        </div>
      </div>
    </div>
  );
}
