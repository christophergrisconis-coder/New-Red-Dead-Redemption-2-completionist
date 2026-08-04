import type { Safehouse, Region } from "./types";

/**
 * Safehouses required for official 100% completion. IGN's Safehouses
 * checklist lists 13 total (taskCount = 13):
 *  - 8 purchasable rooms (Armadillo, Rathskeller Fork, Thieves' Landing,
 *    Chuparosa, Casa Madrugada, El Matadero, Escalera, Manzanita Post)
 *  - 3 story-granted (MacFarlane's Ranch, Blackwater Hotel, Beecher's Hope)
 *  - 2 additional rentable rooms (Ridgewood Farm, Plainview) — some legacy
 *    guides claim these don't count, but IGN's Safehouses checklist
 *    includes them, so we track them as official here.
 */

interface Seed {
  slug: string;
  title: string;
  region: Region;
  cost: string;
  summary: string;
  walkthrough: string;
  requiredFor100?: boolean;
  tags?: string[];
}

function safehouse(s: Seed): Safehouse {
  return {
    id: `safehouse-${s.slug}`,
    title: s.title,
    category: "safehouses",
    cost: s.cost,
    region: s.region,
    isRequiredForOfficial100: s.requiredFor100 ?? true,
    isOptionalSideContent: !(s.requiredFor100 ?? true),
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: ["Unlock or purchase"],
    rewardsOrOutcomes: ["Save & change of clothes point", "Chest with free ammo"],
    checklistSteps: [{ id: "own", label: "Unlock" }],
    tags: s.tags,
  };
}

const SEEDS: Seed[] = [
  // ===== Purchasable — required for 100% =====
  {
    slug: "armadillo",
    title: "Armadillo Room",
    region: "Cholla Springs",
    cost: "$50",
    summary: "Rent above the Armadillo Saloon. First purchasable safehouse.",
    walkthrough: "Available from the saloon clerk after your first Marshal mission.",
    tags: ["purchasable"],
  },
  {
    slug: "rathskeller-fork",
    title: "Rathskeller Fork Shack",
    region: "Cholla Springs",
    cost: "$25",
    summary: "Cheapest safehouse in the game — cleared bandit shack.",
    walkthrough:
      "Purchasable after clearing the area during story missions. Handy for Blackjack farming at Rathskeller Fork (Treasure Hunter outfit scrap).",
    tags: ["purchasable"],
  },
  {
    slug: "thieves-landing",
    title: "Thieves' Landing Room",
    region: "Rio Bravo",
    cost: "$100",
    summary: "Rent above the Thieves' Landing saloon. Home base for outfit scrap purchases.",
    walkthrough: "Purchase at the saloon counter. The Thieves' Landing tailor sells scraps for the Elegant Suit, Bollard Twins, Treasure Hunter, and Walton's Gang outfits.",
    tags: ["purchasable"],
  },
  {
    slug: "chuparosa",
    title: "Chuparosa Room",
    region: "Perdido",
    cost: "$50",
    summary: "Rent above the Chuparosa cantina. First Mexican safehouse — unlocks Mexican Poncho.",
    walkthrough: "Available after arriving in Mexico with Ricketts. Buying any Mexican safehouse also unlocks the Mexican Poncho outfit.",
    tags: ["purchasable", "mexico", "poncho-unlock"],
  },
  {
    slug: "casa-madrugada",
    title: "Casa Madrugada",
    region: "Diez Coronas",
    cost: "$50",
    summary: "Small rented room in Casa Madrugada.",
    walkthrough: "Buy from the local clerk. Handy for the required Liar's Dice minigame win here (Bandito outfit scrap).",
    tags: ["purchasable", "mexico"],
  },
  {
    slug: "el-matadero",
    title: "El Matadero Room",
    region: "Diez Coronas",
    cost: "$100",
    summary: "Slaughterhouse-adjacent room. Excellent snake spawn point outside for the Expert Hunter chain.",
    walkthrough: "Purchase from the clerk after the rebellion progresses past 'The Gates of El Presidio'.",
    tags: ["purchasable", "mexico"],
  },
  {
    slug: "escalera",
    title: "Escalera Hotel",
    region: "Diez Coronas",
    cost: "$150",
    summary: "Higher-end room in Escalera. Right next to the gunsmith for LeMat + Semi-Auto Shotgun buys.",
    walkthrough: "Buy at the hotel counter once the rebellion opens the town properly.",
    tags: ["purchasable", "mexico"],
  },
  {
    slug: "manzanita-post",
    title: "Manzanita Post",
    region: "Tall Trees",
    cost: "$100",
    summary: "Trading-post safehouse in West Elizabeth. Also sells the Tomahawk (optional challenge chain).",
    walkthrough: "Available on arrival in West Elizabeth after 'Bear One Another's Burdens'.",
    tags: ["purchasable", "tall-trees"],
  },

  // ===== Auto-granted (also count toward 100%) =====
  {
    slug: "macfarlanes-ranch",
    title: "MacFarlane's Ranch",
    region: "Hennigan's Stead",
    cost: "Free (story)",
    summary: "Awarded during Exodus in America.",
    walkthrough: "Automatic. First safehouse of the game.",
    tags: ["story", "auto"],
  },
  {
    slug: "blackwater",
    title: "Blackwater Hotel",
    region: "Blackwater",
    cost: "Free (story) — room granted with West Elizabeth chapter",
    summary: "Granted alongside Blackwater story access — the premium West Elizabeth save point.",
    walkthrough: "Automatic during 'Bear One Another's Burdens'. Adjacent to the Blackwater tailor (final U.S. Army scrap) and gunsmith (Mauser, Carcano, Evans Repeater, Explosive Rifle).",
    tags: ["story", "auto"],
  },
  {
    slug: "beechers-hope",
    title: "Beecher's Hope",
    region: "Great Plains",
    cost: "Free (story)",
    summary: "John's ranch. Awarded during the epilogue.",
    walkthrough: "Automatic during 'The Outlaw's Return'. Post-story home for Marston and later Jack.",
    tags: ["story", "auto", "epilogue"],
  },

  // ===== Additional rentable rooms — included in IGN's checklist =====
  {
    slug: "ridgewood-farm",
    title: "Ridgewood Farm Room",
    region: "Cholla Springs",
    cost: "Rentable",
    summary: "Rentable room at Ridgewood Farm. Included in IGN's Safehouses checklist.",
    walkthrough: "Rent from the farm's clerk. Legacy 100% guides disagreed on whether this counted, but IGN's Safehouses checklist lists it as one of the 13 tracked safehouses.",
    tags: ["rentable"],
  },
  {
    slug: "plainview",
    title: "Plainview Room",
    region: "Cholla Springs",
    cost: "Rentable",
    summary: "Rentable room at Plainview. Included in IGN's Safehouses checklist.",
    walkthrough: "Rent from the local clerk. Included in IGN's 13-item Safehouses checklist.",
    tags: ["rentable"],
  },
];

export const SAFEHOUSES: Safehouse[] = SEEDS.map(safehouse);
