import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";
import { ALL_TRACKABLES, DATA_BY_CATEGORY } from "@/data";
import { REGIONS } from "@/data/types";
import { useProgress, rollup } from "@/lib/progress";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Reference — RDR1 Guide" },
      { name: "description", content: "The full official 100% checklist, region counts, dependencies and cleanup summary." },
    ],
  }),
  component: ReferencePage,
});

function ReferencePage() {
  const items = useProgress((s) => s.items);
  const requiredIds = ALL_TRACKABLES.filter((t) => t.isRequiredForOfficial100).map((t) => t.id);
  const overall = rollup(requiredIds, items);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.2em] text-brass-dim">Reference</div>
        <h1 className="mt-0.5 font-display text-4xl text-parchment">100% Checklist</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Structure verified against the IGN Red Dead Redemption 100% Completion Checklist. All
          walkthrough prose in this guide is original.
        </p>
      </header>

      <section className="rounded-lg border border-hairline bg-panel/40 p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-parchment text-xl">Official completion</h2>
          <span className="font-display text-brass text-2xl">{overall.pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-brass" style={{ width: `${overall.pct}%` }} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {overall.done} of {overall.total} required entries complete.
        </div>
      </section>

      <section className="rounded-lg border border-hairline bg-panel/40 p-5">
        <h2 className="font-display text-parchment text-xl mb-3">By category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => {
            const req = DATA_BY_CATEGORY[c.id].filter((t) => t.isRequiredForOfficial100);
            const r = rollup(req.map((t) => t.id), items);
            return (
              <Link
                key={c.id}
                to={`/${c.id}`}
                className="rounded-md border border-hairline bg-background/40 p-3 hover:border-brass/40"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-parchment">{c.label}</span>
                  <span className="text-sm text-brass">{r.pct}%</span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {r.done} / {r.total} required
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brass" style={{ width: `${r.pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-hairline bg-panel/40 p-5">
        <h2 className="font-display text-parchment text-xl mb-3">Region cleanup</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REGIONS.map((region) => {
            const ids = ALL_TRACKABLES.filter((t) => t.region === region).map((t) => t.id);
            if (ids.length === 0) return null;
            const r = rollup(ids, items);
            return (
              <div key={region} className="rounded-md border border-hairline bg-background/40 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-parchment">{region}</span>
                  <span className="text-sm text-ember">{r.pct}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-ember" style={{ width: `${r.pct}%` }} />
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {r.done} / {r.total} tracked
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-hairline bg-panel/40 p-5">
        <h2 className="font-display text-parchment text-xl mb-3">Notes on sources</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>Mission titles, chapter grouping and category structure verified against IGN's RDR wiki.</li>
          <li>All walkthrough text in this app is original and paraphrased, not copied.</li>
          <li>Data is seeded with a working subset per category; the schema is complete for expansion.</li>
        </ul>
      </section>
    </div>
  );
}
