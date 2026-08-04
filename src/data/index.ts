import type { CategoryId, Trackable, Challenge } from "./types";
import { isOfficial, isExtra } from "./types";
import { STORY_MISSIONS } from "./story";
import { STRANGER_MISSIONS } from "./strangers";
import { CHALLENGES } from "./challenges";
import { BOUNTIES } from "./bounties";
import { JOBS } from "./jobs";
import { HIDEOUTS } from "./hideouts";
import { MINIGAMES } from "./minigames";
import { COLLECTIBLES } from "./collectibles";
import { LOCATIONS } from "./locations";
import { OUTFITS } from "./outfits";
import { WEAPONS } from "./weapons";
import { SAFEHOUSES } from "./safehouses";

export const DATA_BY_CATEGORY: Record<CategoryId, Trackable[]> = {
  story: STORY_MISSIONS,
  strangers: STRANGER_MISSIONS,
  challenges: CHALLENGES,
  bounties: BOUNTIES,
  jobs: JOBS,
  hideouts: HIDEOUTS,
  minigames: MINIGAMES,
  collectibles: COLLECTIBLES,
  locations: LOCATIONS,
  outfits: OUTFITS,
  weapons: WEAPONS,
  safehouses: SAFEHOUSES,
};

export const ALL_TRACKABLES: Trackable[] = Object.values(DATA_BY_CATEGORY).flat();

export const TRACKABLE_BY_ID = ALL_TRACKABLES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<string, Trackable>,
);

export function getByCategory(id: CategoryId): Trackable[] {
  return DATA_BY_CATEGORY[id] ?? [];
}

// -----------------------------------------------------------------------
// Official 100% vs Completionist Extra selectors
// -----------------------------------------------------------------------
export function officialItemsInCategory(id: CategoryId): Trackable[] {
  return (DATA_BY_CATEGORY[id] ?? []).filter((t) => isOfficial(t));
}
export function extraItemsInCategory(id: CategoryId): Trackable[] {
  return (DATA_BY_CATEGORY[id] ?? []).filter((t) => isExtra(t));
}

// -----------------------------------------------------------------------
// Dataset validation — expected counts sourced from IGN's official
// checklists (taskCount fields on ign.com/games/red-dead-redemption/
// checklists/*): story-missions, strangers, bounty-locations, hideouts,
// jobs, minigames, rare-weapons, key-outfits, safehouses, locations,
// challenges.
// -----------------------------------------------------------------------
export type CategoryMode = "official-only" | "extras-only" | "mixed";

export interface ExpectedCategory {
  categoryId: CategoryId;
  label: string;
  mode: CategoryMode;
  expectedOfficial: number;
  /** Total entries expected in-app (official + extras). Undefined = no bound. */
  expectedTotal?: number;
  /** Optional secondary metric (e.g. total challenge ranks). */
  subMetric?: { label: string; expected: number };
  officialRequirementText: string;
  note?: string;
}

export const EXPECTED_COUNTS: ExpectedCategory[] = [
  { categoryId: "story",       label: "Story Missions",    mode: "official-only", expectedOfficial: 57, expectedTotal: 57,
    officialRequirementText: "Complete all main story missions (IGN Walkthrough)." },
  { categoryId: "strangers",   label: "Stranger Missions", mode: "mixed",         expectedOfficial: 18, expectedTotal: 19,
    officialRequirementText: "18 count toward official 100% (19 total; 'I Know You' is tracked as extra)." },
  { categoryId: "bounties",    label: "Bounty Locations",  mode: "official-only", expectedOfficial: 20, expectedTotal: 20,
    officialRequirementText: "20 bounty locations (8 New Austin + 8 Nuevo Paraíso + 4 West Elizabeth)." },
  { categoryId: "hideouts",    label: "Gang Hideouts",     mode: "mixed",         expectedOfficial: 7,
    officialRequirementText: "Clear 7 hideouts once each. IGN's Hideouts checklist lists 8 — Solomon's Folly is tracked here as an extra (required only for the optional Walton's Gang outfit)." },
  { categoryId: "minigames",   label: "Minigames",         mode: "official-only", expectedOfficial: 6, expectedTotal: 6,
    officialRequirementText: "Win each of 6 minigame types once." },
  { categoryId: "jobs",        label: "Ambient Jobs",      mode: "official-only", expectedOfficial: 5, expectedTotal: 5,
    officialRequirementText: "5 job stations (3 Nightwatch + 2 Horsebreaking)." },
  { categoryId: "outfits",     label: "Key Outfits",       mode: "mixed",         expectedOfficial: 9,
    officialRequirementText: "9 key outfits (IGN Key Outfits checklist). Extras are auto-granted / cosmetic (Cowboy, Rancher, Bureau Uniform) plus optional achievement outfits.",
    note: "Card counts official key outfits separately from cosmetic extras." },
  { categoryId: "safehouses",  label: "Safehouses",        mode: "official-only", expectedOfficial: 13, expectedTotal: 13,
    officialRequirementText: "13 safehouses (IGN Safehouses checklist): 8 purchasable rooms + 3 story-granted + Ridgewood Farm + Plainview.",
    note: "Some legacy guides claim Ridgewood and Plainview don't count — IGN's checklist includes them." },
  { categoryId: "locations",   label: "Map Locations",     mode: "mixed",         expectedOfficial: 94,
    officialRequirementText: "Discover all 94 locations (per project spec). IGN's Locations checklist lists 85 — the additional entries are tracked here as completionist map-discovery landmarks." },
  { categoryId: "weapons",     label: "Rare Weapons",      mode: "mixed",         expectedOfficial: 5,
    officialRequirementText: "5 rare weapons (IGN Rare Weapons checklist): LeMat, Semi-Auto Shotgun, Carcano, Mauser, Evans Repeater.",
    note: "Full weapon roster tracked as extras — not part of official 100%." },
  { categoryId: "challenges",  label: "Ambient Challenges", mode: "mixed",        expectedOfficial: 4,
    subMetric: { label: "Ranks", expected: 38 },
    officialRequirementText: "4 required chains (Sharpshooter, Master Hunter, Survivalist, Treasure Hunter) — 38 individual ranks (10 + 10 + 9 + 9). Card shows both the chain count and the underlying rank count so completionists see the real workload.",
    note: "Tomahawk and Explosive Rifle chains tracked as achievement-only extras (5 ranks each)." },
  { categoryId: "collectibles", label: "Collectibles",     mode: "extras-only",   expectedOfficial: 0,
    officialRequirementText: "Completionist tracking only. Not part of Rockstar's official 100%.",
    note: "Underlying pickups score through Challenges." },
];

export interface CategoryStat {
  categoryId: CategoryId;
  label: string;
  mode: CategoryMode;
  actualOfficial: number;
  actualExtras: number;
  actualTotal: number;
  expectedOfficial: number;
  expectedTotal?: number;
  officialRequirementText: string;
  note?: string;
  officialOk: boolean;
  totalOk: boolean;
  mismatchReason?: string;
  /** Secondary metric (e.g. challenge ranks). */
  subMetric?: { label: string; actual: number; expected: number };
  /** Titles of a few extras — used to explain what "extras: N" means in the UI. */
  extrasSample: string[];
}

function countChallengeRanks(): number {
  return (CHALLENGES as Challenge[])
    .filter((c) => isOfficial(c))
    .reduce((n, c) => n + (c.ranks?.length ?? 0), 0);
}

export function computeDatasetStats(): CategoryStat[] {
  return EXPECTED_COUNTS.map((e) => {
    const rows = DATA_BY_CATEGORY[e.categoryId] ?? [];
    const officialRows = rows.filter((t) => isOfficial(t));
    const extrasRows = rows.filter((t) => isExtra(t));
    const actualOfficial = officialRows.length;
    const actualExtras = extrasRows.length;
    const actualTotal = rows.length;
    const officialOk = actualOfficial === e.expectedOfficial;
    const totalOk = e.expectedTotal === undefined ? true : actualTotal === e.expectedTotal;
    let mismatchReason: string | undefined;
    if (!officialOk) {
      mismatchReason = `Official ${actualOfficial}, expected ${e.expectedOfficial}`;
    } else if (!totalOk) {
      mismatchReason = `Total ${actualTotal}, expected ${e.expectedTotal}`;
    }
    let subMetric: CategoryStat["subMetric"];
    if (e.subMetric) {
      const actual = e.categoryId === "challenges" ? countChallengeRanks() : 0;
      subMetric = { label: e.subMetric.label, expected: e.subMetric.expected, actual };
    }
    return {
      categoryId: e.categoryId,
      label: e.label,
      mode: e.mode,
      actualOfficial,
      actualExtras,
      actualTotal,
      expectedOfficial: e.expectedOfficial,
      expectedTotal: e.expectedTotal,
      officialRequirementText: e.officialRequirementText,
      note: e.note,
      officialOk,
      totalOk,
      mismatchReason,
      subMetric,
      extrasSample: extrasRows.slice(0, 4).map((r) => r.title),
    };
  });
}

export interface DatasetHealth {
  entriesTotal: number;
  officialTotal: number;
  extrasTotal: number;
  categoriesPassing: number;
  categoriesTotal: number;
  mismatchCount: number;
  allCategoriesPass: boolean;
}

export function computeDatasetHealth(): DatasetHealth {
  const stats = computeDatasetStats();
  const passing = stats.filter((s) => s.officialOk && s.totalOk).length;
  const official = ALL_TRACKABLES.filter((t) => isOfficial(t)).length;
  const extras = ALL_TRACKABLES.filter((t) => isExtra(t)).length;
  return {
    entriesTotal: ALL_TRACKABLES.length,
    officialTotal: official,
    extrasTotal: extras,
    categoriesPassing: passing,
    categoriesTotal: stats.length,
    mismatchCount: stats.length - passing,
    allCategoriesPass: passing === stats.length,
  };
}
