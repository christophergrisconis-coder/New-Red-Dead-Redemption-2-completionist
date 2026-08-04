export type Region =
  | "New Austin"
  | "West Elizabeth"
  | "Nuevo Paraiso"
  | "Blackwater"
  | "Tall Trees"
  | "Great Plains"
  | "Cholla Springs"
  | "Gaptooth Ridge"
  | "Hennigan's Stead"
  | "Rio Bravo"
  | "Perdido"
  | "Punta Orgullo"
  | "Diez Coronas"
  | "Other";

export const REGIONS: Region[] = [
  "New Austin",
  "West Elizabeth",
  "Nuevo Paraiso",
  "Blackwater",
  "Tall Trees",
  "Great Plains",
  "Cholla Springs",
  "Gaptooth Ridge",
  "Hennigan's Stead",
  "Rio Bravo",
  "Perdido",
  "Punta Orgullo",
  "Diez Coronas",
  "Other",
];

export type CategoryId =
  | "story"
  | "strangers"
  | "challenges"
  | "bounties"
  | "jobs"
  | "hideouts"
  | "minigames"
  | "collectibles"
  | "locations"
  | "outfits"
  | "weapons"
  | "safehouses";

export interface ChecklistStep {
  id: string;
  label: string;
}

export interface MapMarker {
  label: string;
  region?: Region;
  note?: string;
}

/** Reference to an image asset with alt text and optional credit string. */
export interface AssetRef {
  url: string;
  alt: string;
  credit?: string;
}

/** Normalized 0..1 pin coord on the shared border-states base map. */
export interface MapPin {
  x: number;
  y: number;
  region: Region;
  caption: string;
  coordNote?: string;
  verified: boolean;
}

/** Rich map marker — imagery + optional precise pin on the shared base map. */
export interface RichMapMarker {
  image: AssetRef;
  caption: string;
  coords?: string;
  pin?: MapPin;
}

/** Per-scrap / per-step unlock instruction used by Outfits. */
export interface UnlockStep {
  label: string;
  location: string;
  prerequisite?: string;
  marker?: RichMapMarker;
}

/** Compact fact list rendered in the DetailPanel side card. */
export interface QuickFact {
  label: string;
  value: string;
}

export interface TrackableBase {
  id: string;
  title: string;
  category: CategoryId;
  region: Region;
  isRequiredForOfficial100: boolean;
  isOfficial100?: boolean;
  isCompletionistExtra?: boolean;
  categorySubtype?: string;
  isOptionalSideContent: boolean;
  unlocksAfter?: string[];
  summary: string;
  descriptiveWalkthrough: string;
  keyObjectives: string[];
  rewardsOrOutcomes: string[];
  followUpOpportunities?: string[];
  relatedCollectibles?: string[];
  missableWarnings?: string[];
  checklistSteps: ChecklistStep[];
  mapMarkers?: MapMarker[];
  tags?: string[];

  // ---- New magazine-template fields (all optional, additive) ----
  /** Full-bleed banner shown at the top of the detail view. */
  heroImage?: AssetRef;
  /** Single rich map marker with imagery. Prefer over mapMarkers for singletons. */
  mapMarker?: RichMapMarker;
  /** Additional inline images (screenshots, portrait art). */
  gallery?: AssetRef[];
  /** IGN Gold Medal requirements (story missions). */
  goldMedal?: string[];
  /** Concise sidebar facts (giver, prereq, reward). */
  quickFacts?: QuickFact[];
  /** Missable window callout, e.g. "Only available before X". */
  missableWindow?: string;
  /** Per-scrap / per-step instructions with location + image. Used by Outfits. */
  unlockSteps?: UnlockStep[];
}


// -----------------------------------------------------------------------
// Selectors — the app should read Official vs Extra via these helpers so
// individual data files can be edited without touching consumers.
// -----------------------------------------------------------------------
export function isOfficial(t: Pick<TrackableBase, "isRequiredForOfficial100" | "isOfficial100">): boolean {
  return t.isOfficial100 ?? t.isRequiredForOfficial100;
}
export function isExtra(t: Pick<TrackableBase, "isRequiredForOfficial100" | "isOfficial100" | "isCompletionistExtra">): boolean {
  if (t.isCompletionistExtra !== undefined) return t.isCompletionistExtra;
  return !isOfficial(t);
}

export interface StoryMission extends TrackableBase {
  category: "story";
  missionGiver: string;
  chapter: string;
}

export interface StrangerMission extends TrackableBase {
  category: "strangers";
  missionGiver: string;
  chain?: string;
  step?: number;
}

export interface Challenge extends TrackableBase {
  category: "challenges";
  challengeType: "Hunting" | "Sharpshooter" | "Survivalist" | "Treasure Hunter" | "Tomahawk" | "Explosive Rifle";
  ranks: { rank: number; requirement: string }[];
}

export interface Bounty extends TrackableBase {
  category: "bounties";
  bountyValue?: string;
  aliveOrDead?: "Alive" | "Dead" | "Either";
}

export interface Job extends TrackableBase {
  category: "jobs";
  jobType: string;
  payout?: string;
}

export interface Hideout extends TrackableBase {
  category: "hideouts";
  gang?: string;
}

export interface Minigame extends TrackableBase {
  category: "minigames";
  gameType: string;
  locations: string[];
}

export interface Collectible extends TrackableBase {
  category: "collectibles";
  collectibleType: string;
  count?: number;
}

export interface LocationEntry extends TrackableBase {
  category: "locations";
  locationType: "Town" | "Settlement" | "Landmark" | "Property" | "Point of Interest";
}

export interface Outfit extends TrackableBase {
  category: "outfits";
  unlockMethod: string;
}

export interface Weapon extends TrackableBase {
  category: "weapons";
  weaponType: string;
  ammo?: string;
}

export interface Safehouse extends TrackableBase {
  category: "safehouses";
  cost?: string;
}

export type Trackable =
  | StoryMission
  | StrangerMission
  | Challenge
  | Bounty
  | Job
  | Hideout
  | Minigame
  | Collectible
  | LocationEntry
  | Outfit
  | Weapon
  | Safehouse;

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
}
