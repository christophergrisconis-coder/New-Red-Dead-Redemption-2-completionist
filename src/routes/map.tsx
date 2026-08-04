import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DATA_BY_CATEGORY } from "@/data";
import { BORDER_STATES_MAP } from "@/data/assets";
import type { CategoryId, MapPin, Trackable } from "@/data/types";
import { BadgeCheck, CircleHelp, ExternalLink, MapPin as MapPinIcon } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — RDR1 Guide" },
      { name: "description", content: "The RDR1 Border States map with every tracked pin overlaid." },
    ],
  }),
  component: MapPage,
});

interface PinRow {
  id: string;
  title: string;
  category: CategoryId;
  pin: MapPin;
  caption: string;
  coords?: string;
}

const CATEGORY_FILTERS: { id: CategoryId | "all"; label: string; color: string }[] = [
  { id: "all",         label: "All",           color: "#e85d3a" },
  { id: "collectibles",label: "Treasures",     color: "#e0b040" },
  { id: "weapons",     label: "Rare weapons",  color: "#4fa8ff" },
  { id: "hideouts",    label: "Hideouts",      color: "#c44e4e" },
  { id: "bounties",    label: "Bounties",      color: "#a67cff" },
  { id: "outfits",     label: "Outfit scraps", color: "#6ecb63" },
];

function collectPins(cat: CategoryId | "all"): PinRow[] {
  const rows: PinRow[] = [];
  const push = (t: Trackable, pin: MapPin, caption: string, coords?: string) => {
    rows.push({ id: t.id, title: t.title, category: t.category, pin, caption, coords });
  };
  const cats: CategoryId[] = cat === "all"
    ? (Object.keys(DATA_BY_CATEGORY) as CategoryId[])
    : [cat];
  for (const c of cats) {
    for (const t of DATA_BY_CATEGORY[c]) {
      if (t.mapMarker?.pin) push(t, t.mapMarker.pin, t.mapMarker.caption, t.mapMarker.coords);
      // Outfit unlock steps can each hold their own pin
      t.unlockSteps?.forEach((s) => {
        if (s.marker?.pin) push(t, s.marker.pin, `${t.title} — ${s.label}`, s.marker.coords);
      });
    }
  }
  return rows;
}

function categoryColor(cat: CategoryId): string {
  return CATEGORY_FILTERS.find((f) => f.id === cat)?.color ?? "#e85d3a";
}

function MapPage() {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const pins = useMemo(() => collectPins(filter), [filter]);
  const verifiedCount = pins.filter((p) => p.pin.verified).length;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hairline-b bg-panel/40 px-6 py-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-brass-dim">World</div>
          <h1 className="mt-0.5 font-display text-3xl text-parchment">Border States, 1910</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Authentic RDR1 map with every tracked item pinned. Verified pins are measured
            against the reference map + IGN. Region-anchor pins are pending verification.
          </p>
        </div>
        <a
          href="https://www.ign.com/maps/red-dead-redemption/world"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-brass/40 px-3 py-2 text-xs text-brass hover:bg-brass/10"
        >
          <ExternalLink className="h-3.5 w-3.5" /> IGN Interactive Map
        </a>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Map + pins */}
        <div className="relative bg-ink p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  filter === f.id
                    ? "border-brass bg-brass/10 text-parchment"
                    : "border-hairline text-muted-foreground hover:text-parchment"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: f.color }}
                />
                {f.label}
              </button>
            ))}
            <div className="ml-auto self-center text-[11px] uppercase tracking-widest text-muted-foreground">
              {verifiedCount} / {pins.length} pins verified
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded border border-hairline">
            <img
              src={BORDER_STATES_MAP.url}
              alt={BORDER_STATES_MAP.alt}
              className="block w-full select-none"
              draggable={false}
            />
            {pins.map((row) => (
              <MapPinDot
                key={`${row.id}-${row.pin.x}-${row.pin.y}`}
                row={row}
                hover={hoverId === row.id}
                onHover={setHoverId}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Map: Rockstar Games — Red Dead Redemption. Pin coordinates cross-checked
            against the IGN Interactive Map.
          </p>
        </div>

        {/* Marker index */}
        <aside className="hairline-t lg:hairline-t-0 lg:border-l lg:border-hairline overflow-y-auto p-4 bg-panel/40">
          <h2 className="font-display text-parchment text-lg mb-3">Marker index</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Hover a row to highlight its pin. Click through to open the item's guide.
          </p>
          <ul className="space-y-1.5">
            {pins.map((row) => (
              <li
                key={`${row.id}-${row.pin.x}-${row.pin.y}`}
                onMouseEnter={() => setHoverId(row.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <Link
                  to={`/${row.category}`}
                  className={`block rounded border px-2.5 py-2 text-xs transition-colors ${
                    hoverId === row.id
                      ? "border-brass bg-brass/10"
                      : "border-hairline hover:border-brass/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: categoryColor(row.category) }}
                    />
                    <span className="font-medium text-parchment truncate">{row.title}</span>
                    {row.pin.verified ? (
                      <BadgeCheck className="ml-auto h-3 w-3 text-brass shrink-0" />
                    ) : (
                      <CircleHelp className="ml-auto h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
                    {row.caption}
                  </div>
                  {row.coords ? (
                    <div className="text-[10px] text-muted-foreground/80 truncate">
                      {row.coords}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
            {pins.length === 0 ? (
              <li className="text-sm text-muted-foreground">No pins in this category yet.</li>
            ) : null}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function MapPinDot({
  row,
  hover,
  onHover,
}: {
  row: PinRow;
  hover: boolean;
  onHover: (id: string | null) => void;
}) {
  const color = categoryColor(row.category);
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(row.id)}
      onMouseLeave={() => onHover(null)}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${row.pin.x * 100}%`,
        top: `${row.pin.y * 100}%`,
        zIndex: hover ? 20 : 10,
      }}
      title={`${row.title} — ${row.caption}`}
      aria-label={`${row.title} — ${row.caption}`}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        {hover ? (
          <span
            className="absolute inline-flex h-6 w-6 rounded-full opacity-60 animate-ping"
            style={{ background: color }}
          />
        ) : null}
        <span
          className="relative h-3 w-3 rounded-full border-2 border-parchment shadow"
          style={{ background: color }}
        />
      </span>
      {hover ? (
        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-background/95 px-2 py-1 text-[10px] uppercase tracking-widest text-parchment border border-hairline">
          <MapPinIcon className="inline h-3 w-3 mr-1 text-brass" />
          {row.title}
        </span>
      ) : null}
    </button>
  );
}
