import type { Hideout, Region } from "./types";
import { mapMarker, regionPin, verifiedPin } from "./assets";

/**
 * 6 gang hideouts required for official 100% completion (verified against
 * the Jimbatron RDR 100% guide): Nosalida, Tesoro Azul, Gaptooth Breach,
 * Fort Mercer, Twin Rocks, Pike's Basin.
 *
 * Tumbleweed (Del Lobos) is required for the U.S. Marshal Uniform outfit
 * (the "24-hour hideout run") but does NOT count toward the 100% hideout
 * stat. Solomon's Folly is required for the optional Walton's Gang Outfit
 * only. Both are tracked here for completionists.
 */

interface Seed {
  slug: string;
  title: string;
  region: Region;
  gang: string;
  summary: string;
  walkthrough: string;
  requiredFor100?: boolean;
  tags?: string[];
  /** Verified pin coord on the base map. Falls back to region anchor. */
  pin?: { x: number; y: number };
}

const HIDEOUT_PINS: Record<string, { x: number; y: number }> = {
  "fort-mercer":      { x: 0.40, y: 0.42 },
  "twin-rocks":       { x: 0.75, y: 0.35 },
  "pikes-basin":      { x: 0.55, y: 0.40 },
  "gaptooth-breach":  { x: 0.15, y: 0.47 },
  "tesoro-azul":      { x: 0.55, y: 0.78 },
  "nosalida":         { x: 0.63, y: 0.85 },
  tumbleweed:         { x: 0.13, y: 0.42 },
  "solomons-folly":   { x: 0.48, y: 0.34 },
};

function hideout(s: Seed): Hideout {
  const pinCoord = s.pin ?? HIDEOUT_PINS[s.slug];
  const caption = `${s.title} — ${s.region}`;
  const pin = pinCoord
    ? verifiedPin(pinCoord.x, pinCoord.y, s.region, caption)
    : regionPin(s.region, caption);
  return {
    id: `hideout-${s.slug}`,
    title: s.title,
    category: "hideouts",
    region: s.region,
    gang: s.gang,
    isRequiredForOfficial100: s.requiredFor100 ?? true,
    isOptionalSideContent: !(s.requiredFor100 ?? true),
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: ["Kill all outlaws", "Loot the strongbox"],
    rewardsOrOutcomes: [
      "Cash + Fame",
      "Repeatable for cash farming",
      "Clearing in-story does NOT count — you must clear it in free roam",
    ],
    checklistSteps: [{ id: "first", label: "First free-roam clear (100% credit)" }],
    mapMarker: mapMarker(pin),
    tags: s.tags,
  };
}

const SEEDS: Seed[] = [
  {
    slug: "twin-rocks",
    title: "Twin Rocks",
    region: "Cholla Springs",
    gang: "Bollard Twins",
    summary: "Bollard Twins stronghold in the New Austin badlands.",
    walkthrough:
      "Approach from the western ridge for a sniper lane on the front cabin. The interior clearing spawns two waves — take cover behind the wagon and Deadeye the door as reinforcements pour out. Also useful for Sharpshooter Rank 8 (hats + disarms).",
    tags: ["bollard-twins", "challenge-friendly"],
  },
  {
    slug: "pikes-basin",
    title: "Pike's Basin",
    region: "Cholla Springs",
    gang: "Bollard Twins",
    summary: "Bollard Twins camp inside a canyon bowl.",
    walkthrough:
      "Take the north canyon rim first — sniper spawns let you drop six enemies before the interior aggros. The stables at the back are the last-wave spawn.",
    tags: ["bollard-twins"],
  },
  {
    slug: "fort-mercer",
    title: "Fort Mercer",
    region: "Cholla Springs",
    gang: "Post-story bandits",
    summary: "Fort Mercer becomes a repeatable gang hideout after the main story clears it once.",
    walkthrough:
      "Approach from the south gate and use the guard tower for cover. The Evans Repeater is ideal here — the fort's tight interior is perfect for Sharpshooter Rank 10 (disarm 6 with one clip).",
    tags: ["williamson", "challenge-friendly"],
  },
  {
    slug: "gaptooth-breach",
    title: "Gaptooth Breach",
    region: "Gaptooth Ridge",
    gang: "Walton's Gang",
    summary: "Mining pit hideout on the western edge of the map.",
    walkthrough:
      "The pit funnels enemies uphill. Take the eastern cliff overhang, drop dynamite into the pit, and finish stragglers with a rifle. Also required (alive capture) for the Treasure Hunter outfit scrap chain.",
    tags: ["walton"],
  },
  {
    slug: "tesoro-azul",
    title: "Tesoro Azul",
    region: "Perdido",
    gang: "Bandidos",
    summary: "Mexican hideout with a central chapel.",
    walkthrough:
      "Enter from the north road at night. The chapel on the west end is the reinforcement spawn — post outside its door and kill enemies as they exit. Ideal for the optional Tomahawk-only clear.",
    tags: ["mexico", "tomahawk-friendly"],
  },
  {
    slug: "nosalida",
    title: "Nosalida",
    region: "Perdido",
    gang: "Bandidos",
    summary: "Coastal Mexican hideout on the cliff overlooking the Sea of Coronado.",
    walkthrough:
      "Approach via the beach road, not the cliff. The upper compound has a shotgunner in the tower — Deadeye him first, then sweep the buildings clockwise. Great location for the Explosive Rifle 'cover kills' challenge.",
    tags: ["mexico", "coast"],
  },

  // Tumbleweed — promoted to official per IGN's 7-hideout requirement
  // (IGN Locations & 100% Completion Checklist count Tumbleweed as a
  // required hideout clear). Jimbatron's guide lists it under the
  // U.S. Marshal outfit run only; we follow the IGN reference here.
  {
    slug: "tumbleweed",
    title: "Tumbleweed",
    region: "Gaptooth Ridge",
    gang: "Del Lobos",
    summary: "Ghost-town hideout in the western hills. Required for the 100% hideout stat.",
    walkthrough:
      "Approach from the east road and cover-hop building to building. Also part of the U.S. Marshal Uniform 24-hour hideout run alongside Gaptooth Breach, Fort Mercer, Twin Rocks, and Pike's Basin.",
    requiredFor100: true,
    tags: ["del-lobos"],
  },
  {
    slug: "solomons-folly",
    title: "Solomon's Folly",
    region: "Cholla Springs",
    gang: "Walton's Gang",
    summary: "Former PS3-exclusive hideout. Not required for 100%, but the chest here unlocks the optional Walton's Gang Outfit.",
    walkthrough:
      "Small camp with only 5 opponents. Ideal for the optional Explosive Rifle 'kill 3 in one shot' challenge — hogtie the last three and dump them together, then explode.",
    requiredFor100: false,
    tags: ["walton", "optional"],
  },
];

export const HIDEOUTS: Hideout[] = SEEDS.map(hideout);
