import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CATEGORIES } from "@/data/categories";
import {
  useOfficialRollup,
  useCompletionistRollup,
} from "@/lib/progress";
import {
  BookOpen,
  Users,
  Target,
  Scroll,
  Hammer,
  Skull,
  Dice5,
  Gem,
  MapPin,
  Shirt,
  Crosshair,
  Home,
  LayoutDashboard,
  Map,
  Library,
} from "lucide-react";

const ICONS = {
  BookOpen, Users, Target, Scroll, Hammer, Skull, Dice5, Gem, MapPin, Shirt, Crosshair, Home,
} as const;

const TOP_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Map", icon: Map },
  { to: "/reference", label: "Reference", icon: Library },
] as const;

function ProgressBar({ pct, tone = "brass" }: { pct: number; tone?: "brass" | "ember" }) {
  const barColor = tone === "brass" ? "bg-brass" : "bg-ember";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full ${barColor} transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function GuideShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const official = useOfficialRollup();
  const completion = useCompletionistRollup();

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left rail — sticky, hidden on small screens */}
      <aside className="hidden md:flex md:w-72 lg:w-80 shrink-0 flex-col hairline-r bg-rail sticky top-0 h-screen">
        <div className="px-5 py-5 hairline-b">
          <div className="text-xs uppercase tracking-[0.2em] text-brass-dim">
            Completion Guide
          </div>
          <h1 className="mt-1 text-2xl font-display text-parchment leading-tight">
            Red Dead Redemption
          </h1>
        </div>

        <div className="px-5 py-4 hairline-b space-y-3">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Official 100%
              </span>
              <span className="text-sm font-display text-brass">{official.pct}%</span>
            </div>
            <div className="mt-1.5"><ProgressBar pct={official.pct} /></div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {official.done} / {official.total} required
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Completionist
              </span>
              <span className="text-sm font-display text-ember">{completion.pct}%</span>
            </div>
            <div className="mt-1.5"><ProgressBar pct={completion.pct} tone="ember" /></div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {completion.done} / {completion.total} tracked
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <div className="px-3 space-y-0.5">
            {TOP_LINKS.map((l) => {
              const Icon = l.icon;
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{l.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-5 pt-5 pb-2 text-[11px] uppercase tracking-[0.18em] text-brass-dim">
            Categories
          </div>
          <div className="px-3 space-y-0.5 pb-6">
            {CATEGORIES.map((c) => {
              const Icon = (ICONS as Record<string, typeof BookOpen>)[c.icon] ?? BookOpen;
              const to = `/${c.id}`;
              const active = isActive(to);
              return (
                <Link
                  key={c.id}
                  to={to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 hairline-b bg-rail/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-brass-dim">Guide</div>
            <div className="font-display text-parchment text-lg leading-none">RDR Completion</div>
          </div>
          <div className="flex items-baseline gap-3 text-xs">
            <span className="text-brass font-display">{official.pct}% <span className="text-muted-foreground">100%</span></span>
            <span className="text-ember font-display">{completion.pct}% <span className="text-muted-foreground">All</span></span>
          </div>
        </div>
        <MobileNav pathname={pathname} />
      </div>

      <main className="flex-1 min-w-0 pt-24 md:pt-0">
        {children}
      </main>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const links = [
    { to: "/", label: "Home" },
    { to: "/story", label: "Story" },
    { to: "/strangers", label: "Strangers" },
    { to: "/challenges", label: "Challenges" },
    { to: "/hideouts", label: "Hideouts" },
    { to: "/collectibles", label: "Collect." },
    { to: "/locations", label: "Locations" },
    { to: "/map", label: "Map" },
    { to: "/reference", label: "Reference" },
  ];
  return (
    <div className="flex gap-1 overflow-x-auto px-3 pb-2">
      {links.map((l) => {
        const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
        return (
          <Link
            key={l.to}
            to={l.to}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors ${
              active
                ? "bg-brass text-primary-foreground"
                : "bg-accent/40 text-muted-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
