import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";
import { ALL_TRACKABLES, computeDatasetStats, computeDatasetHealth, type CategoryStat } from "@/data";
import { REGIONS, type Region, type CategoryId } from "@/data/types";
import {
  useOfficialRollup,
  useCompletionistRollup,
  useExtrasRollup,
  useOfficialCategoryRollup,
  useExtrasCategoryRollup,
  useRegionRollup,
  useProgress,
} from "@/lib/progress";
import { useMemo } from "react";
import { ImportExportButtons } from "@/components/guide/ImportExportButtons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RDR1 Completion Guide" },
      { name: "description", content: "Track your Red Dead Redemption 100% progress across every category and region." },
    ],
  }),
  component: DashboardPage,
});

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-panel/60 p-5">
      <div className="text-[11px] uppercase tracking-[0.2em] text-brass-dim">{label}</div>
      <div className="mt-1 font-display text-4xl text-parchment">{value}</div>
      {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}

function CategoryCard({ id, label, description, stat }: {
  id: CategoryId;
  label: string;
  description: string;
  stat: CategoryStat | undefined;
}) {
  const official = useOfficialCategoryRollup(id);
  const extras = useExtrasCategoryRollup(id);
  const mode = stat?.mode ?? "mixed";
  const officialPct = official.total > 0 ? official.pct : 0;
  const barPct = mode === "extras-only"
    ? (extras.total ? extras.pct : 0)
    : officialPct;

  return (
    <Link
      to={`/${id}`}
      className="group rounded-lg border border-hairline bg-panel/40 p-4 transition-colors hover:border-brass/40 hover:bg-panel/70"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-display text-parchment text-lg group-hover:text-brass transition-colors">
          {label}
        </div>
        <div className="text-sm font-display text-brass">{barPct}%</div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-brass transition-all" style={{ width: `${barPct}%` }} />
      </div>

      {mode === "extras-only" ? (
        <div className="mt-2 flex items-baseline justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">Completionist tracking</span>
          <span className="text-parchment/85">{extras.done} / {extras.total}</span>
        </div>
      ) : (
        <div className="mt-2 space-y-0.5">
          <div className="flex items-baseline justify-between text-[11px]">
            <span className="uppercase tracking-wider text-brass-dim">Official 100%</span>
            <span className="text-parchment/85 font-mono">{official.done} / {official.total}</span>
          </div>
          {stat?.subMetric ? (
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="uppercase tracking-wider text-brass-dim/70">{stat.subMetric.label} tracked</span>
              <span className="text-parchment/70 font-mono">{stat.subMetric.actual} / {stat.subMetric.expected}</span>
            </div>
          ) : null}
          {extras.total > 0 ? (
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="uppercase tracking-wider text-muted-foreground">Extras (non-official)</span>
              <span className="text-muted-foreground font-mono">{extras.done} / {extras.total}</span>
            </div>
          ) : null}
        </div>
      )}
      {stat && stat.extrasSample.length > 0 && mode !== "extras-only" ? (
        <div className="mt-1.5 text-[10px] leading-snug text-muted-foreground/80 line-clamp-2">
          Extras: {stat.extrasSample.join(", ")}{extras.total > stat.extrasSample.length ? "…" : ""}
        </div>
      ) : null}
      {mode !== "extras-only" && stat && !stat.officialOk ? (
        <div className="mt-2 rounded border border-ember/50 bg-ember/10 px-2 py-1 text-[10px] uppercase tracking-wider text-ember">
          Validation: {stat.mismatchReason}
        </div>
      ) : null}
    </Link>
  );
}

function RegionRow({ region }: { region: Region }) {
  const r = useRegionRollup(region);
  if (r.total === 0) return null;
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-parchment/85">{region}</span>
        <span className="text-muted-foreground">{r.done} / {r.total}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-ember" style={{ width: `${r.pct}%` }} />
      </div>
    </div>
  );
}

function DashboardPage() {
  const official = useOfficialRollup();
  const all = useCompletionistRollup();
  const extras = useExtrasRollup();
  const items = useProgress((s) => s.items);
  const stats = useMemo(() => computeDatasetStats(), []);
  const statsById = useMemo(
    () => Object.fromEntries(stats.map((s) => [s.categoryId, s])) as Record<CategoryId, CategoryStat>,
    [stats],
  );

  const pinned = useMemo(
    () => ALL_TRACKABLES.filter((t) => items[t.id]?.pinned && !items[t.id]?.done).slice(0, 8),
    [items],
  );
  const nextBest = useMemo(() => {
    return ALL_TRACKABLES.filter((t) => {
      const p = items[t.id];
      if (p?.done) return false;
      if (t.unlocksAfter?.length) {
        const gate = t.unlocksAfter.every((id) => items[id]?.done);
        if (!gate) return false;
      }
      return t.isRequiredForOfficial100;
    }).slice(0, 6);
  }, [items]);

  const recent = useMemo(() => {
    return ALL_TRACKABLES.filter((t) => items[t.id]?.done && items[t.id]?.completedAt)
      .sort((a, b) => (items[b.id]!.completedAt! - items[a.id]!.completedAt!))
      .slice(0, 5);
  }, [items]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-brass-dim">Companion</div>
          <h1 className="mt-1 font-display text-4xl text-parchment">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Official 100% requirements (IGN-verified) are tracked separately from the completionist sweep.
            Everything saves locally on this device.
          </p>
        </div>
        <ImportExportButtons />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Official 100%" value={`${official.pct}%`} sub={`${official.done} / ${official.total} required`} />
        <Stat label="Completionist" value={`${all.pct}%`} sub={`${all.done} / ${all.total} total`} />
        <Stat label="Extras cleared" value={`${extras.pct}%`} sub={`${extras.done} / ${extras.total} optional`} />
        <Stat label="Pinned tasks" value={String(pinned.length)} sub="Highest priority" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-hairline bg-panel/40 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-parchment text-xl">Categories</h2>
            <span className="text-xs text-muted-foreground">Official vs completionist</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} id={c.id} label={c.label} description={c.description} stat={statsById[c.id]} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-hairline bg-panel/40 p-5">
          <h2 className="font-display text-parchment text-xl mb-3">Region sweep</h2>
          <div className="space-y-3">
            {REGIONS.map((r) => (
              <RegionRow key={r} region={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-hairline bg-panel/40 p-5">
          <h2 className="font-display text-parchment text-xl mb-3">Pinned</h2>
          {pinned.length === 0 ? (
            <p className="text-sm text-muted-foreground">Pin items from any detail page to keep them handy here.</p>
          ) : (
            <ul className="space-y-2">
              {pinned.map((t) => (
                <li key={t.id}>
                  <Link to={`/${t.category}`} className="block rounded-md p-2 hover:bg-accent/40">
                    <div className="text-sm font-display text-parchment">{t.title}</div>
                    <div className="text-[11px] uppercase tracking-wider text-brass-dim">{t.region}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-hairline bg-panel/40 p-5">
          <h2 className="font-display text-parchment text-xl mb-3">Next best actions</h2>
          {nextBest.length === 0 ? (
            <p className="text-sm text-muted-foreground">Complete a mission or two to see recommended next steps.</p>
          ) : (
            <ul className="space-y-2">
              {nextBest.map((t) => (
                <li key={t.id}>
                  <Link to={`/${t.category}`} className="block rounded-md p-2 hover:bg-accent/40">
                    <div className="text-sm font-display text-parchment">{t.title}</div>
                    <div className="text-[11px] uppercase tracking-wider text-brass-dim">{t.category} · {t.region}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-hairline bg-panel/40 p-5">
          <h2 className="font-display text-parchment text-xl mb-3">Recently completed</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Newly finished items appear here.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((t) => (
                <li key={t.id} className="rounded-md p-2">
                  <div className="text-sm font-display text-parchment">{t.title}</div>
                  <div className="text-[11px] uppercase tracking-wider text-brass-dim">{t.category}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <DatasetHealthPanel />
    </div>
  );
}

function DatasetHealthPanel() {
  const stats = useMemo(() => computeDatasetStats(), []);
  const health = useMemo(() => computeDatasetHealth(), []);
  const mismatches = stats.filter((s) => !s.officialOk || !s.totalOk);
  return (
    <section className="rounded-lg border border-hairline bg-panel/40 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <h2 className="font-display text-parchment text-xl">Dataset validation</h2>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Compares in-app records against IGN's official 100% Completion Checklist, Walkthrough, Strangers, and Locations references.
            Official counts must match exactly; extras are custom completionist tracking.
          </p>
        </div>
        <div className={`text-xs uppercase tracking-[0.2em] ${health.allCategoriesPass ? "text-emerald-400" : "text-ember"}`}>
          {health.categoriesPassing}/{health.categoriesTotal} categories pass · {health.entriesTotal} entries ·{" "}
          {health.officialTotal} official · {health.extrasTotal} extras
        </div>
      </div>

      {mismatches.length > 0 ? (
        <div className="mb-4 rounded-md border border-ember/50 bg-ember/5 p-3">
          <div className="text-[11px] uppercase tracking-[0.2em] text-ember mb-1.5">
            {mismatches.length} mismatch{mismatches.length === 1 ? "" : "es"}
          </div>
          <ul className="space-y-1 text-sm text-parchment/90">
            {mismatches.map((m) => (
              <li key={m.categoryId}>
                <span className="font-display text-parchment">{m.label}:</span>{" "}
                <span className="text-ember">{m.mismatchReason}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-brass-dim">
            <tr className="text-left">
              <th className="py-2 pr-4 font-normal">Category</th>
              <th className="py-2 pr-4 font-normal">Mode</th>
              <th className="py-2 pr-4 font-normal">Official (actual/expected)</th>
              <th className="py-2 pr-4 font-normal">Extras</th>
              <th className="py-2 pr-4 font-normal">Total</th>
              <th className="py-2 pr-4 font-normal">Official requirement</th>
              <th className="py-2 pr-4 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-parchment/90">
            {stats.map((s) => {
              const ok = s.officialOk && s.totalOk;
              const modeLabel = s.mode === "official-only" ? "Official" : s.mode === "extras-only" ? "Extras" : "Mixed";
              return (
                <tr key={s.categoryId} className="border-t border-hairline/60 align-top">
                  <td className="py-2 pr-4 font-display text-parchment">{s.label}</td>
                  <td className="py-2 pr-4 text-xs uppercase tracking-wider text-muted-foreground">{modeLabel}</td>
                  <td className={`py-2 pr-4 font-mono ${s.officialOk ? "" : "text-ember"}`}>
                    {s.actualOfficial} / {s.expectedOfficial}
                  </td>
                  <td className="py-2 pr-4 font-mono">{s.actualExtras}</td>
                  <td className={`py-2 pr-4 font-mono ${s.totalOk ? "" : "text-ember"}`}>
                    {s.actualTotal}{s.expectedTotal !== undefined ? ` / ${s.expectedTotal}` : ""}
                  </td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground max-w-md">
                    {s.officialRequirementText}
                    {s.note ? <div className="mt-0.5 italic">{s.note}</div> : null}
                  </td>
                  <td className={`py-2 pr-4 text-right text-xs uppercase tracking-widest ${ok ? "text-emerald-400" : "text-ember"}`}>
                    {ok ? "OK" : "Check"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
