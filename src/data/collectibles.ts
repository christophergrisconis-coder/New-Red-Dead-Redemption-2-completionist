import type { Collectible } from "./types";
import { mapMarker, verifiedPin } from "./assets";

/**
 * Collectibles is a COMPLETIONIST TRACKING category — none of these entries
 * are part of Rockstar's / IGN's official 100% checklist as standalone
 * counters. The underlying pickups (treasure maps, wild flowers) are
 * scored through the Challenges category instead. Sets are surfaced here
 * for players who want a single-pane checklist of every collectable in
 * the game.
 */

/** The 9 Treasure Hunter map rewards — location, region, terrain hint. */
const TREASURE_LOCATIONS = [
  { n: 1, where: "Rathskeller Fork",  region: "Gaptooth Ridge" as const,
    hint: "Fireplace of the ruined cabin south of Rathskeller Fork.",
    coords: "SW of Rathskeller Fork — burned homestead", x: 0.24, y: 0.50 },
  { n: 2, where: "Gaptooth Breach",   region: "Gaptooth Ridge" as const,
    hint: "Rock pile below the twin peak west of Gaptooth Breach.",
    coords: "West of the Gaptooth mine entrance", x: 0.15, y: 0.47 },
  { n: 3, where: "Rio del Lobo Rock", region: "Cholla Springs" as const,
    hint: "Base of the cliff face just north of Rio del Lobo Rock.",
    coords: "Follow the river north from Fort Mercer", x: 0.35, y: 0.34 },
  { n: 4, where: "Nekoti Rock",       region: "Tall Trees" as const,
    hint: "Beside the tallest rock at the base of Nekoti Rock.",
    coords: "NE of Manzanita Post", x: 0.68, y: 0.14 },
  { n: 5, where: "Twin Rocks",        region: "Hennigan's Stead" as const,
    hint: "Behind the boulder overlooking the Twin Rocks hideout.",
    coords: "Cliff overlook above the hideout", x: 0.72, y: 0.36 },
  { n: 6, where: "Ojo del Diablo",    region: "Diez Coronas" as const,
    hint: "Water's-edge rock at the western tip of Ojo del Diablo lake.",
    coords: "SW shore of Ojo del Diablo", x: 0.76, y: 0.66 },
  { n: 7, where: "El Presidio",       region: "Diez Coronas" as const,
    hint: "Ledge on the mountain south of El Presidio fort.",
    coords: "S ridge overlooking the fort", x: 0.86, y: 0.65 },
  { n: 8, where: "Torquemada",        region: "Punta Orgullo" as const,
    hint: "Rock face at the seaside cliff south of Torquemada.",
    coords: "Coast trail SW of the settlement", x: 0.13, y: 0.90 },
  { n: 9, where: "Aurora Basin",      region: "Tall Trees" as const,
    hint: "Boulder cluster on the west shore of Aurora Basin lake.",
    coords: "West shore, near the cabins", x: 0.66, y: 0.20 },
];

const TREASURES: Collectible[] = TREASURE_LOCATIONS.map((t) => ({
  id: `collectible-treasure-${t.n}`,
  title: `Treasure ${t.n} — ${t.where}`,
  category: "collectibles",
  collectibleType: "Treasure Map",
  region: t.region,
  isRequiredForOfficial100: false,
  isCompletionistExtra: true,
  categorySubtype: "treasure",
  isOptionalSideContent: true,
  summary: `Buried Treasure ${t.n} of 9 — near ${t.where}.`,
  descriptiveWalkthrough:
    `${t.hint}\n\nUse the previous rank's map to spawn this one, then dig at the marked rock. Each treasure pays out cash and progresses the Treasure Hunter challenge.`,
  keyObjectives: [`Solve the map for Treasure ${t.n}`, "Dig at the marked rock", "Return to sell any lockbox contents"],
  rewardsOrOutcomes: ["Gold bar / cash payout", "Advances Treasure Hunter rank"],
  checklistSteps: [
    { id: "map", label: "Received map" },
    { id: "dig", label: "Dug up treasure" },
  ],
  mapMarker: mapMarker(verifiedPin(t.x, t.y, t.region, `${t.where} — ${t.region}`, t.coords), t.coords),
  quickFacts: [
    { label: "Region", value: t.region },
    { label: "Landmark", value: t.where },
    { label: "Rank", value: `Treasure Hunter Rank ${t.n}` },
  ],
  tags: ["treasure"],
}));

export const COLLECTIBLES: Collectible[] = [
  ...TREASURES,
  {
    id: "collectible-wild-flowers",
    title: "Wild Flowers (Survivalist Set)",
    category: "collectibles",
    collectibleType: "Flowers",
    region: "Other",
    isRequiredForOfficial100: false,
    isCompletionistExtra: true,
    categorySubtype: "collection-mirror",
    isOptionalSideContent: true,
    summary: "Mirror tracker for the Survivalist flower pick list (scored via Challenges).",
    descriptiveWalkthrough:
      "Buy the Survivalist Map first. Sweep New Austin, Nuevo Paraíso and finally West Elizabeth. Tall Trees Feverfew is gated by story progress.",
    keyObjectives: ["Pick every flower requirement across all 9 ranks"],
    rewardsOrOutcomes: ["Elegant Suit"],
    checklistSteps: [
      { id: "s1", label: "New Austin flora complete" },
      { id: "s2", label: "Nuevo Paraíso flora complete" },
      { id: "s3", label: "West Elizabeth flora complete" },
    ],
    tags: ["flora", "mirror"],
  },
  {
    id: "collectible-outfit-scraps",
    title: "Outfit Scrap Hunts (Cleanup)",
    category: "collectibles",
    collectibleType: "Outfit fragments",
    region: "Other",
    isRequiredForOfficial100: false,
    isCompletionistExtra: true,
    categorySubtype: "cleanup",
    isOptionalSideContent: true,
    summary: "Aggregate cleanup tracker for outfit component pickups (Bollard, Bandito, Reyes, U.S. Army, Treasure Hunter).",
    descriptiveWalkthrough:
      "Cross-reference with the Outfits category — each gang outfit lists per-scrap locations with map markers.",
    keyObjectives: ["Progress each outfit's unlock chain"],
    rewardsOrOutcomes: ["Faster outfit completion"],
    checklistSteps: [
      { id: "bollard", label: "Bollard Twins scraps" },
      { id: "treasure", label: "Treasure Hunter scraps" },
      { id: "bandito", label: "Bandito scraps" },
      { id: "reyes", label: "Reyes' Rebels scraps" },
      { id: "army", label: "U.S. Army scraps" },
    ],
    tags: ["cleanup", "outfits"],
  },
  {
    id: "collectible-legendary-animals",
    title: "Legendary Animals",
    category: "collectibles",
    collectibleType: "Rare Kills",
    region: "Other",
    isRequiredForOfficial100: false,
    isCompletionistExtra: true,
    categorySubtype: "cleanup",
    isOptionalSideContent: true,
    summary: "Legendary Bear (Khan Tanka), Cougars, and other rare hunt targets.",
    descriptiveWalkthrough:
      "Cleanup checklist for the game's rare kills. Only Khan Tanka indirectly affects 100% (via Master Hunter Rank 10). The rest are prestige-only.",
    keyObjectives: ["Skin each legendary animal"],
    rewardsOrOutcomes: ["Bragging rights + rare pelts"],
    checklistSteps: [
      { id: "khan-tanka", label: "Khan Tanka (Legendary Bear)" },
      { id: "cougars", label: "Cougar cluster hunts" },
      { id: "buffalo", label: "American Buffalo herd" },
    ],
    tags: ["hunting"],
  },
];
