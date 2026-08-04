import type { Bounty, Region } from "./types";
import { mapMarker, regionPin } from "./assets";

/**
 * 20 bounty locations required for official 100% (verified against the
 * Jimbatron RDR 100% Total Completion Strategy Guide on gtaforums.com):
 *  - 8 in New Austin (Cholla Springs / Hennigan's Stead / Rio Bravo / Gaptooth)
 *  - 8 in Nuevo Paraíso (Perdido / Diez Coronas / Punta Orgullo)
 *  - 4 in West Elizabeth (Tall Trees)
 *
 * The target NPC is randomised per bounty draw, but the target LOCATION is
 * fixed — you must complete one bounty at each of these 20 locations.
 * Aim to capture alive: Bollard Twins, Treasure Hunter, and Bandito targets
 * MUST be taken alive to unlock outfit scraps also required for 100%.
 */

interface Seed {
  slug: string;
  title: string;
  region: Region;
  office: string;
  bloc: "New Austin" | "Nuevo Paraíso" | "West Elizabeth";
  walkthrough: string;
  tags?: string[];
}

function bounty(s: Seed): Bounty {
  return {
    id: `bounty-${s.slug}`,
    title: s.title,
    category: "bounties",
    region: s.region,
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    aliveOrDead: "Either",
    summary: `${s.bloc} bounty location. Poster drawn from ${s.office}.`,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: ["Take a bounty poster in-region", "Ride to this location", "Capture the target (alive when possible)"],
    rewardsOrOutcomes: [
      "Cash + Fame",
      "Alive bonus doubles payout",
      "Bollard Twins / Treasure Hunter / Bandito captures unlock outfit scraps",
    ],
    checklistSteps: [
      { id: "poster", label: "Draw poster for this location" },
      { id: "complete", label: "Complete bounty here" },
    ],
    mapMarker: mapMarker(regionPin(s.region, `${s.title} — ${s.region}`, `Poster from ${s.office}`)),
    tags: [s.bloc.toLowerCase().replace(/ /g, "-"), ...(s.tags ?? [])],
  };
}

const SEEDS: Seed[] = [
  // ==== New Austin (8) ====
  {
    slug: "rattlesnake-hollow",
    title: "Rattlesnake Hollow",
    region: "Cholla Springs",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Small camp east of Armadillo. Rope the target from the northern ridge — the four henchmen aggro toward the road, not the ridge.",
  },
  {
    slug: "rio-del-lobo",
    title: "Rio Del Lobo",
    region: "Cholla Springs",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Riverbank camp along the Rio del Lobo. Snipe the two river lookouts, then lasso the target as they bolt for a horse.",
  },
  {
    slug: "mercer-station",
    title: "Mercer Station",
    region: "Gaptooth Ridge",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Rail-stop camp in the western ridges. Approach from the eastern rocks and Deadeye the tower shooter first.",
  },
  {
    slug: "repentance-rock",
    title: "Repentance Rock",
    region: "Cholla Springs",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Rocky outcrop bandit camp. Push from the west trail so the target's mounted escape route runs into your line of fire.",
  },
  {
    slug: "silent-stead",
    title: "Silent Stead",
    region: "Cholla Springs",
    office: "Rathskeller Fork",
    bloc: "New Austin",
    walkthrough:
      "Small farmstead. IMPORTANT: also search the hut here — the chest holds a Treasure Hunter outfit scrap required for 100%.",
    tags: ["scrap"],
  },
  {
    slug: "the-hanging-rock",
    title: "The Hanging Rock",
    region: "Cholla Springs",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "The Hanging Rock formation north of Armadillo. Take the rock's overhang for the sightline down onto the camp.",
  },
  {
    slug: "brittlebrush-trawl",
    title: "Brittlebrush Trawl",
    region: "Rio Bravo",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Fishing-shack camp on the Lower Montana. The dock is a chokepoint — set up on the ridge and pick them off as they cross.",
  },
  {
    slug: "mescalero",
    title: "Mescalero",
    region: "Cholla Springs",
    office: "Armadillo",
    bloc: "New Austin",
    walkthrough:
      "Small mission ruin. Rope the target when they break through the front arch — the interior is a Deadeye trap.",
  },

  // ==== Nuevo Paraíso (8) ====
  {
    slug: "plata-grande",
    title: "Plata Grande",
    region: "Perdido",
    office: "Chuparosa",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Mining outpost. Approach on the eastern trail so their scripted patrol runs perpendicular to your line.",
  },
  {
    slug: "ojo-del-diablo",
    title: "Ojo Del Diablo",
    region: "Perdido",
    office: "Chuparosa",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Cliffside cave camp. Snipe the ridge lookouts first — the interior fight is close-quarters and forgiving with a shotgun.",
  },
  {
    slug: "hendidura-grande",
    title: "Hendidura Grande",
    region: "Diez Coronas",
    office: "Chuparosa",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Canyon crevice camp. Use the northern rim for the initial Deadeye rotation, then drop in to rope the target.",
  },
  {
    slug: "primera-quebrada",
    title: "Primera Quebrada",
    region: "Diez Coronas",
    office: "Chuparosa",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Small canyon hideout. Snipe from the outside cliff — pushing directly triggers a mounted escape.",
  },
  {
    slug: "sepulcro",
    title: "Sepulcro",
    region: "Diez Coronas",
    office: "Escalera",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Cemetery camp outside Escalera. Also worth searching for a Reyes' Rebels outfit scrap while you're here.",
    tags: ["scrap"],
  },
  {
    slug: "laguna-borrego",
    title: "Laguna Borrego",
    region: "Diez Coronas",
    office: "Escalera",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Lakeside camp. Approach from the shore road; the treeline flank protects your escape if you take the alive-capture over the kill.",
  },
  {
    slug: "rancho-polvo",
    title: "Rancho Polvo",
    region: "Punta Orgullo",
    office: "Escalera",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Southern Mexico ranch camp. Long ride from Escalera — sleep at Casa Madrugada first to respawn the poster window.",
  },
  {
    slug: "barranca",
    title: "Barranca",
    region: "Punta Orgullo",
    office: "Escalera",
    bloc: "Nuevo Paraíso",
    walkthrough:
      "Ravine camp in southern Mexico. Deadeye the mounted rider that flanks north-east — losing them = mission fail on the alive capture.",
  },

  // ==== West Elizabeth (4) ====
  {
    slug: "aurora-basin",
    title: "Aurora Basin",
    region: "Tall Trees",
    office: "Blackwater",
    bloc: "West Elizabeth",
    walkthrough:
      "Lakeside camp deep in Tall Trees. Reinforcements arrive fast — Carcano the lookouts, then rope the target inside 60 seconds. Also holds a US Army Uniform outfit scrap.",
    tags: ["scrap"],
  },
  {
    slug: "tanners-reach",
    title: "Tanner's Reach",
    region: "Tall Trees",
    office: "Blackwater",
    bloc: "West Elizabeth",
    walkthrough:
      "Tanning outpost. Push the north side of the buildings — the yard's cover funnels enemies through the front door.",
  },
  {
    slug: "bearclaw-camp",
    title: "Bearclaw Camp",
    region: "Tall Trees",
    office: "Blackwater",
    bloc: "West Elizabeth",
    walkthrough:
      "Hunter's camp overrun by outlaws. Bears may spawn during the fight — a real threat, keep an eye on the treeline.",
  },
  {
    slug: "nekoti-rock",
    title: "Nekoti Rock",
    region: "Tall Trees",
    office: "Blackwater",
    bloc: "West Elizabeth",
    walkthrough:
      "Native ceremonial rock overrun by bandits. Take the rock's north face for a full-camp sightline.",
  },
];

export const BOUNTIES: Bounty[] = SEEDS.map(bounty);
