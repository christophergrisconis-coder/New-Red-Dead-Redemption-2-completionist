import { useProgress, type ItemProgress } from "@/lib/progress";
import type { RichMapMarker, Trackable } from "@/data/types";
import { BORDER_STATES_MAP, regionAnchor } from "@/data/assets";
import {
  Check,
  Pin,
  PinOff,
  AlertTriangle,
  MapPin,
  Sparkles,
  Trophy,
  Info,
  Shirt,
  Compass,
  BadgeCheck,
  CircleHelp,
} from "lucide-react";
import { Fragment } from "react";

interface DetailPanelProps {
  item: Trackable | null;
}

function Section({
  title,
  icon: Icon,
  children,
  tone = "default",
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: "default" | "warn";
}) {
  return (
    <section className="rounded-lg border border-hairline bg-panel/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon ? (
          <Icon
            className={`h-4 w-4 ${tone === "warn" ? "text-ember" : "text-brass"}`}
          />
        ) : null}
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function DetailPanel({ item }: DetailPanelProps) {
  const items = useProgress((s) => s.items);
  const toggle = useProgress((s) => s.toggleItem);
  const toggleStep = useProgress((s) => s.toggleStep);
  const togglePin = useProgress((s) => s.togglePin);
  const setNote = useProgress((s) => s.setNote);

  if (!item) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 text-muted-foreground">
        <Sparkles className="h-8 w-8 text-brass-dim mb-3" />
        <div className="font-display text-parchment text-lg">Select an entry</div>
        <p className="mt-1 text-sm max-w-sm">
          Pick a mission, challenge or location from the list to see the full walkthrough.
        </p>
      </div>
    );
  }

  const p: ItemProgress = items[item.id] ?? { done: false, steps: {} };
  // Hero pin: prefer the item's own map pin, otherwise fall back to the region anchor.
  const heroAnchor = item.mapMarker?.pin ?? {
    ...regionAnchor(item.region),
    region: item.region,
    caption: item.region,
    verified: false,
  };

  return (
    <div className="@container h-full overflow-y-auto">
      {/* Hero: cropped tile of the real RDR1 map centered on this item */}
      <HeroBanner
        pin={{ x: heroAnchor.x, y: heroAnchor.y }}
        title={item.title}
        region={item.region}
        category={item.category}
        official={item.isRequiredForOfficial100}
      />

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Action row */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground max-w-2xl">{item.summary}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePin(item.id)}
              className="inline-flex items-center gap-2 rounded-md border border-hairline px-3 py-2 text-xs text-muted-foreground hover:text-parchment"
            >
              {p.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
              {p.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={() => toggle(item.id)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors min-h-11 ${
                p.done
                  ? "bg-brass text-primary-foreground"
                  : "border border-brass/40 text-brass hover:bg-brass/10"
              }`}
            >
              <Check className="h-4 w-4" />
              {p.done ? "Completed" : "Mark complete"}
            </button>
          </div>
        </div>

        {/* Two-column magazine layout — container query so the sidebar only
            splits when the detail pane itself is wide enough (not the viewport). */}
        <div className="grid grid-cols-1 @[860px]:grid-cols-[minmax(0,1fr)_320px] gap-5">
          {/* Main column */}
          <div className="space-y-5 min-w-0">
            {item.missableWindow ? (
              <div className="flex items-start gap-3 rounded-lg border border-ember/40 bg-ember/5 p-4">
                <AlertTriangle className="h-4 w-4 text-ember mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-ember">Missable window</div>
                  <p className="mt-1 text-sm text-parchment/90">{item.missableWindow}</p>
                </div>
              </div>
            ) : null}

            <Section title="Walkthrough">
              <p className="text-[15px] leading-relaxed text-parchment/90 whitespace-pre-line">
                {item.descriptiveWalkthrough}
              </p>
            </Section>

            {item.goldMedal?.length ? (
              <Section title="Gold Medal requirements" icon={Trophy}>
                <ul className="space-y-1.5">
                  {item.goldMedal.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-parchment/85">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-brass shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {item.keyObjectives.length ? (
              <Section title="Key objectives">
                <ul className="space-y-1.5">
                  {item.keyObjectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-parchment/85">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-brass shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {/* Outfit-style unlock steps with per-scrap imagery */}
            {item.unlockSteps?.length ? (
              <Section title="How to unlock (step-by-step)" icon={Shirt}>
                <ol className="space-y-3">
                  {item.unlockSteps.map((s, i) => {
                    const stepId = `unlock-${i}`;
                    const done = !!p.steps[stepId];
                    return (
                      <li key={i} className="grid grid-cols-[auto_1fr] gap-3">
                        <button
                          onClick={() => toggleStep(item.id, stepId)}
                          className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold shrink-0 ${
                            done
                              ? "bg-brass border-brass text-primary-foreground"
                              : "border-brass/50 text-brass"
                          }`}
                          aria-label={done ? "Mark step incomplete" : "Mark step complete"}
                        >
                          {done ? <Check className="h-3 w-3" /> : i + 1}
                        </button>
                        <div className="min-w-0">
                          <div className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-parchment"}`}>
                            {s.label}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            <MapPin className="inline h-3 w-3 mr-1 text-brass" />
                            {s.location}
                          </div>
                          {s.prerequisite ? (
                            <div className="mt-0.5 text-xs text-muted-foreground/80">
                              Prereq: {s.prerequisite}
                            </div>
                          ) : null}
                          {s.marker ? <MarkerCard marker={s.marker} compact /> : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </Section>
            ) : null}

            {/* Generic checklist (falls back when no unlockSteps) */}
            {item.checklistSteps.length && !item.unlockSteps?.length ? (
              <Section title="Checklist">
                <ul className="space-y-1.5">
                  {item.checklistSteps.map((step) => {
                    const done = !!p.steps[step.id];
                    return (
                      <li key={step.id}>
                        <button
                          onClick={() => toggleStep(item.id, step.id)}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors min-h-11 ${
                            done
                              ? "bg-brass/10 text-parchment"
                              : "hover:bg-accent/40 text-parchment/85"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border shrink-0 ${
                              done ? "bg-brass border-brass" : "border-hairline"
                            }`}
                          >
                            {done ? <Check className="h-3.5 w-3.5 text-primary-foreground" /> : null}
                          </span>
                          <span className={done ? "line-through opacity-70" : ""}>
                            {step.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            ) : null}

            {item.rewardsOrOutcomes.length ? (
              <Section title="Rewards & outcomes" icon={Trophy}>
                <ul className="space-y-1.5">
                  {item.rewardsOrOutcomes.map((r, i) => (
                    <li key={i} className="text-sm text-parchment/85">
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {item.missableWarnings?.length ? (
              <Section title="Missables" icon={AlertTriangle} tone="warn">
                <ul className="space-y-1.5">
                  {item.missableWarnings.map((m, i) => (
                    <li key={i} className="text-sm text-ember/90">{m}</li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {item.followUpOpportunities?.length ? (
              <Section title="After this, look at">
                <ul className="space-y-1.5">
                  {item.followUpOpportunities.map((f, i) => (
                    <li key={i} className="text-sm text-parchment/80">{f}</li>
                  ))}
                </ul>
              </Section>
            ) : null}

            <Section title="Your notes">
              <textarea
                value={p.notes ?? ""}
                onChange={(e) => setNote(item.id, e.target.value)}
                rows={3}
                placeholder="Reminders, save file spots, honor state…"
                className="w-full resize-none rounded-md border border-hairline bg-background/40 px-3 py-2 text-sm text-parchment placeholder:text-muted-foreground focus:border-brass focus:outline-none"
              />
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {item.quickFacts?.length ? (
              <Section title="Quick facts" icon={Info}>
                <dl className="space-y-2">
                  {item.quickFacts.map((f, i) => (
                    <div key={i} className="flex justify-between gap-3 text-sm">
                      <dt className="text-muted-foreground">{f.label}</dt>
                      <dd className="text-parchment/90 text-right">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            ) : null}

            {item.mapMarker ? (
              <Section title="Map marker" icon={MapPin}>
                <MarkerCard marker={item.mapMarker} />
              </Section>
            ) : null}

            {item.mapMarkers?.length ? (
              <Section title="Map references" icon={Compass}>
                <ul className="space-y-1">
                  {item.mapMarkers.map((m, i) => (
                    <li key={i} className="text-sm text-parchment/80">
                      <span className="text-brass">{m.label}</span>
                      {m.region ? <span className="text-muted-foreground"> — {m.region}</span> : null}
                      {m.note ? (
                        <Fragment>
                          <br />
                          <span className="text-xs text-muted-foreground">{m.note}</span>
                        </Fragment>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Cropped hero tile of the real world map, centered on the item's pin. */
function HeroBanner({
  pin,
  title,
  region,
  category,
  official,
}: {
  pin: { x: number; y: number };
  title: string;
  region: string;
  category: string;
  official: boolean;
}) {
  // Show ~35% of the map's width around the pin — enough context to place
  // the region without losing the pin itself.
  const zoom = 2.8;
  const bgSize = `${zoom * 100}%`;
  const bgPosX = `${pin.x * 100}%`;
  const bgPosY = `${pin.y * 100}%`;

  return (
    <div className="relative h-56 md:h-64 w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BORDER_STATES_MAP.url})`,
          backgroundSize: bgSize,
          backgroundPosition: `${bgPosX} ${bgPosY}`,
          filter: "sepia(0.15) saturate(0.9) brightness(0.85)",
        }}
        aria-label={`Map crop centered on ${region}`}
      />
      {/* Pin ring at the exact center of the crop */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/40 animate-ping" />
          <div className="relative h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-parchment bg-ember shadow-lg" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brass">
            <span>{region}</span>
            <span className="text-hairline">•</span>
            <span>{category}</span>
            <span className="text-hairline">•</span>
            <span className={official ? "text-brass" : "text-muted-foreground"}>
              {official ? "Official 100%" : "Completionist Extra"}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl text-parchment drop-shadow">
            {title}
          </h1>
        </div>
      </div>
      <div className="absolute right-2 top-2 rounded bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        Map: Rockstar / RDR
      </div>
    </div>
  );
}

function MarkerCard({
  marker,
  compact = false,
}: {
  marker: RichMapMarker;
  compact?: boolean;
}) {
  const pin = marker.pin;
  const zoom = compact ? 4.5 : 3.6;
  const bgSize = `${zoom * 100}%`;
  const bgPosX = pin ? `${pin.x * 100}%` : "50%";
  const bgPosY = pin ? `${pin.y * 100}%` : "50%";
  const verified = pin?.verified ?? false;

  return (
    <div className={`overflow-hidden rounded border border-hairline bg-background/30 ${compact ? "mt-2" : ""}`}>
      <div className="relative">
        <div
          className={`w-full ${compact ? "h-24" : "h-40"}`}
          style={{
            backgroundImage: `url(${marker.image.url})`,
            backgroundSize: bgSize,
            backgroundPosition: `${bgPosX} ${bgPosY}`,
            filter: "sepia(0.1) brightness(0.95)",
          }}
          aria-label={marker.image.alt}
        />
        {/* Pin dot at the true center of the crop */}
        {pin ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/40 animate-ping" />
              <div className="relative h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-parchment bg-ember shadow" />
            </div>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/85 to-transparent" />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-background/70 px-1.5 py-0.5 text-[10px] uppercase tracking-widest">
          {verified ? (
            <>
              <BadgeCheck className="h-3 w-3 text-brass" />
              <span className="text-brass">Verified</span>
            </>
          ) : (
            <>
              <CircleHelp className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Region anchor</span>
            </>
          )}
        </div>
      </div>
      <div className="p-2.5">
        <div className={`text-sm ${compact ? "text-parchment/85" : "text-parchment"}`}>
          {marker.caption}
        </div>
        {marker.coords ? (
          <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            {marker.coords}
          </div>
        ) : null}
      </div>
    </div>
  );
}
