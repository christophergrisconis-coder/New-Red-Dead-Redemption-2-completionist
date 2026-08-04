import type { Outfit, Region } from "./types";

/**
 * Outfits tracked for 100% completion. IGN's "Key Outfits" checklist lists
 * 9 outfits as counting toward the official 100% key-outfits requirement:
 *  - Elegant Suit
 *  - Bollard Twins Outfit
 *  - Treasure Hunter Outfit
 *  - Bandito Outfit
 *  - Reyes' Rebels Outfit
 *  - U.S. Army Uniform
 *  - U.S. Marshal Uniform
 *  - Mexican Poncho
 *  - Legend of the West Outfit (challenge reward)
 *
 * Not counted toward the "key outfits" requirement (tracked as extras):
 *  - Cowboy (default starting outfit)
 *  - Rancher (auto: 'The Outlaw's Return')
 *  - Bureau Uniform (100% reward — awarded AFTER hitting 100%)
 *  - Optional cosmetic / achievement-only: Walton's Gang, Deadly Assassin,
 *    Expert Hunter, Savvy Merchant, Duster Coat, Gentleman's Attire.
 */

interface Seed {
  slug: string;
  title: string;
  unlock: string;
  region?: Region;
  summary: string;
  walkthrough: string;
  scrapSteps?: string[];
  /** Parallel to scrapSteps — one location per scrap. Enables the rich
   * step-by-step unlock UI in the DetailPanel. */
  scrapLocations?: string[];
  outcomes: string[];
  requiredFor100?: boolean;
  tags?: string[];
}

function outfit(s: Seed): Outfit {
  const steps = s.scrapSteps?.length
    ? s.scrapSteps.map((label, i) => ({ id: `s${i + 1}`, label }))
    : [{ id: "own", label: "Unlock" }];

  const unlockSteps = s.scrapSteps && s.scrapLocations
    ? s.scrapSteps.map((label, i) => ({
        label,
        location: s.scrapLocations![i] ?? "See walkthrough",
      }))
    : undefined;

  return {
    id: `outfit-${s.slug}`,
    title: s.title,
    category: "outfits",
    unlockMethod: s.unlock,
    region: s.region ?? "Other",
    isRequiredForOfficial100: s.requiredFor100 ?? true,
    isOptionalSideContent: !(s.requiredFor100 ?? true),
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: s.scrapSteps ?? [s.unlock],
    rewardsOrOutcomes: s.outcomes,
    checklistSteps: steps,
    unlockSteps,
    quickFacts: [
      { label: "Unlock", value: s.unlock },
      { label: "Region", value: s.region ?? "Various" },
      { label: "100%", value: (s.requiredFor100 ?? true) ? "Yes" : "No" },
    ],
    tags: s.tags,
  };
}


const SEEDS: Seed[] = [
  // ===== Required for 100% =====
  {
    slug: "cowboy",
    title: "Cowboy",
    unlock: "Default",
    summary: "Starting outfit. Tracked for completeness — NOT counted in IGN's key-outfits requirement.",
    walkthrough: "Equipped by default.",
    outcomes: ["Default appearance"],
    requiredFor100: false,
    tags: ["default"],
  },
  {
    slug: "elegant-suit",
    title: "Elegant Suit",
    unlock: "Buy the scrap from the tailor at Thieves' Landing",
    region: "Rio Bravo",
    summary: "Card-cheating suit. Lets you deal seconds without detection.",
    walkthrough:
      "Single scrap purchased directly from the Thieves' Landing tailor. Enables cheating at Poker and Blackjack — pair with the Blackwater Saloon poker table for the U.S. Army scrap and the 'High Roller' achievement.",
    outcomes: ["Cheating enabled at poker/blackjack", "He Cleans Up Well! achievement"],
    tags: ["tailor"],
  },
  {
    slug: "bollard-twins",
    title: "Bollard Twins Outfit",
    unlock: "6 scraps — Bollard Twins gang membership required",
    summary: "Bollard Twins gang won't attack when worn (unless provoked).",
    walkthrough:
      "Collect all 6 scraps to unlock at any tailor. Requires searching Thieves' Landing (during 'On Shaky's Ground'), completing MacFarlane's Nightwatch, winning Horseshoes at MacFarlane's, capturing a Bollard Twins bounty ALIVE, defending Hennigan's Stead residents from a Bollard Twins random event, and buying the final scrap at the Thieves' Landing tailor.",
    scrapSteps: [
      "Search Thieves' Landing (during 'On Shaky's Ground')",
      "Complete Nightwatch at MacFarlane's Ranch",
      "Win Horseshoes at MacFarlane's Ranch",
      "Capture a Bollard Twins bounty ALIVE",
      "Random event: defend Hennigan's Stead residents",
      "Buy scrap from the Thieves' Landing tailor",
    ],
    scrapLocations: [
      "Thieves' Landing, Rio Bravo — search barrels/crates during the mission",
      "MacFarlane's Ranch, Hennigan's Stead — evening Nightwatch job giver",
      "MacFarlane's Ranch corral — Horseshoes pitch behind the barn",
      "Roam Hennigan's Stead / Rio Bravo — lasso Bollard bounty on any poster",
      "Hennigan's Stead random encounter — travel roads at day/dusk",
      "Thieves' Landing tailor storefront",
    ],

    outcomes: ["Bollard Twins non-hostile", "Passive infiltration in bandit country"],
    tags: ["scrap-chain", "gang"],
  },
  {
    slug: "treasure-hunter",
    title: "Treasure Hunter Outfit",
    unlock: "6 scraps — Treasure Hunter gang membership required",
    summary: "Treasure Hunter gang won't attack when worn.",
    walkthrough:
      "Search Silent Stead (during a bounty), complete the California stranger chain, profit at Blackjack in Rathskeller Fork, capture a Treasure Hunter bounty ALIVE, complete the Gaptooth Breach Hideout, and buy the final scrap at the Thieves' Landing tailor.",
    scrapSteps: [
      "Search Silent Stead (during a bounty)",
      "Complete 'California' stranger chain",
      "Profit at Blackjack in Rathskeller Fork",
      "Capture a Treasure Hunter bounty ALIVE",
      "Complete the Gaptooth Breach Hideout",
      "Buy scrap from the Thieves' Landing tailor",
    ],
    scrapLocations: [
      "Silent Stead, Gaptooth Ridge — abandoned farmhouse (spawns during bounty)",
      "Manzanita Post, Tall Trees — 'California' stranger giver near the store",
      "Rathskeller Fork saloon, Gaptooth Ridge — Blackjack table",
      "Roam Gaptooth Ridge — lasso Treasure Hunter bounty (do not kill)",
      "Gaptooth Breach hideout — western edge of Gaptooth Ridge",
      "Thieves' Landing tailor storefront",
    ],

    outcomes: ["Treasure Hunter gang non-hostile"],
    tags: ["scrap-chain", "gang"],
  },
  {
    slug: "bandito",
    title: "Bandito Outfit",
    unlock: "6 scraps — Bandito gang membership required",
    region: "Perdido",
    summary: "Banditos won't attack when worn.",
    walkthrough:
      "Search Sidewinder Gulch (along the route to 'Aztec Gold'), complete Nightwatch at Chuparosa, defeat all players at Liar's Dice in Casa Madrugada, capture a Bandito bounty ALIVE, defend Mexican residents from a Bandito random event, and buy the final scrap at the Chuparosa general store.",
    scrapSteps: [
      "Search Sidewinder Gulch (near 'Aztec Gold')",
      "Complete Nightwatch at Chuparosa",
      "Win Liar's Dice at Casa Madrugada",
      "Capture a Bandito bounty ALIVE",
      "Random event: defend Mexican residents from Banditos",
      "Buy scrap from the Chuparosa general store",
    ],
    scrapLocations: [
      "Sidewinder Gulch, Perdido — canyon south of Chuparosa (during 'Aztec Gold')",
      "Chuparosa, Perdido — Nightwatch giver at the town square",
      "Casa Madrugada, Diez Coronas — Liar's Dice table inside the cantina",
      "Roam Perdido/Diez Coronas — lasso Bandito bounty from a poster",
      "Perdido random encounter — patrol the roads north of Chuparosa",
      "Chuparosa general store storefront",
    ],

    outcomes: ["Banditos non-hostile"],
    tags: ["scrap-chain", "gang", "mexico"],
  },
  {
    slug: "reyes-rebels",
    title: "Reyes' Rebels Outfit",
    unlock: "6 scraps — Rebel affinity",
    region: "Diez Coronas",
    summary: "Rebel-aligned outfit — Federales still hostile, but civilians friendly in rebel country.",
    walkthrough:
      "Search Sepulcro (easiest after the final part of 'Eva in Peril'), complete 'Poppycock' and 'Love is the Opiate' stranger quests, complete Horsebreaking at Chuparosa, win Five Finger Fillet at Torquemada (best right after 'Empty Promises'), and buy the final scrap at the Escalera general store (only after 'An Appointed Time').",
    scrapSteps: [
      "Search Sepulcro",
      "Complete 'Poppycock' stranger",
      "Complete Horsebreaking at Chuparosa",
      "Complete 'Love is the Opiate' stranger",
      "Win Five Finger Fillet at Torquemada",
      "Buy scrap from the Escalera general store (post 'An Appointed Time')",
    ],
    scrapLocations: [
      "Sepulcro cemetery, Diez Coronas — SE of Escalera; search graves after 'Eva in Peril'",
      "Agave Viejo, Diez Coronas — 'Poppycock' giver near the field",
      "Chuparosa corral, Perdido — Horsebreaking job giver at the fence",
      "El Presidio, Diez Coronas — 'Love is the Opiate' stranger",
      "Torquemada, Punta Orgullo — Five Finger Fillet table at the cantina",
      "Escalera general store — only sells scrap after 'An Appointed Time'",
    ],

    outcomes: ["Rebel non-hostility"],
    tags: ["scrap-chain", "mexico"],
  },
  {
    slug: "us-army",
    title: "U.S. Army Uniform",
    unlock: "6 scraps — Blackwater sweep required",
    region: "Blackwater",
    summary: "Army-aligned outfit unlocked in the West Elizabeth chapter.",
    walkthrough:
      "Search Aurora Basin (drawn from a bounty or hunt), win Arm Wrestling at the Pacific Union Railroad Camp (during 'Lights, Camera, Action' Part II), eliminate all players in Poker at Blackwater (Saloon table + Elegant Suit cheating), complete the 'Lights, Camera, Action' stranger chain, complete Nightwatch at Blackwater, and buy the final scrap from the Blackwater tailor (only after 'The Last Enemy That Shall Be Destroyed').",
    scrapSteps: [
      "Search Aurora Basin",
      "Win Arm Wrestling at Pacific Union RR Camp",
      "Eliminate all players at Poker in Blackwater Saloon",
      "Complete 'Lights, Camera, Action' stranger chain",
      "Complete Nightwatch at Blackwater",
      "Buy scrap from the Blackwater tailor (post 'The Last Enemy...')",
    ],
    scrapLocations: [
      "Aurora Basin, Tall Trees — abandoned lakeside cabins NW of Blackwater",
      "Pacific Union RR Camp, Great Plains — Arm Wrestling table during 'Lights, Camera, Action' Pt II",
      "Blackwater Saloon poker table — bring the Elegant Suit for cheating",
      "Blackwater — 'Lights, Camera, Action' stranger (D. S. MacKenna)",
      "Blackwater Marshal's office — Nightwatch job giver at dusk",
      "Blackwater tailor storefront (post-'The Last Enemy That Shall Be Destroyed')",
    ],

    outcomes: ["Army non-hostile"],
    tags: ["scrap-chain", "blackwater"],
  },
  {
    slug: "us-marshal",
    title: "U.S. Marshal Uniform",
    unlock: "Clear 5 hideouts in 24 in-game hours",
    summary: "Reward for the 24-hour hideout run: Gaptooth Breach, Tumbleweed, Fort Mercer, Twin Rocks, Pike's Basin.",
    walkthrough:
      "Complete all 5 New Austin hideouts within a single 24 in-game hour window. Sleep at safehouses between runs to reset spawns without advancing the clock too far. Only worth attempting after unlocking Blackwater weapons.",
    scrapSteps: [
      "Clear Gaptooth Breach",
      "Clear Tumbleweed",
      "Clear Fort Mercer",
      "Clear Twin Rocks",
      "Clear Pike's Basin",
    ],
    outcomes: ["Law-aligned appearance"],
    tags: ["hideout-run"],
  },
  {
    slug: "mexican-poncho",
    title: "Mexican Poncho",
    unlock: "Auto — buy any Mexico safehouse",
    region: "Perdido",
    summary: "Auto-unlocked as part of purchasing any Nuevo Paraíso safehouse (Chuparosa / Casa Madrugada / El Matadero / Escalera).",
    walkthrough: "Buy any Mexico safehouse. Handed to you automatically.",
    outcomes: ["Passive appearance"],
    tags: ["auto"],
  },
  {
    slug: "rancher",
    title: "Rancher",
    unlock: "Auto — 'The Outlaw's Return'",
    region: "Great Plains",
    summary: "Awarded automatically at the start of the epilogue. Not counted in IGN's key-outfits requirement.",
    walkthrough: "Handed to you during 'The Outlaw's Return'. Purely aesthetic.",
    outcomes: ["Aesthetic only"],
    requiredFor100: false,
    tags: ["auto", "epilogue"],
  },
  {
    slug: "legend-of-the-west",
    title: "Legend of the West Outfit",
    unlock: "Complete all 4 required ambient challenges",
    summary: "Awarded on completing Survivalist, Sharpshooter, Master Hunter, and Treasure Hunter Rank 10. Counted in IGN's key-outfits list.",
    walkthrough:
      "Automatic when the last of the four required challenge chains hits Legendary rank. Doubles Deadeye duration — the benefit applies just by owning it (you can wear the Deadly Assassin Outfit instead for stacked effect).",
    outcomes: ["Deadeye duration doubled (passive)", "Frontiersman achievement"],
    tags: ["challenge-reward", "auto"],
  },
  {
    slug: "bureau-uniform",
    title: "Bureau Uniform",
    unlock: "Reach 100% completion",
    summary: "The 100% reward outfit. Awarded AFTER hitting 100%, so it does NOT count toward the requirement itself.",
    walkthrough: "Automatically unlocked on hitting 100% completion. Purely a trophy.",
    outcomes: ["Law immunity while worn"],
    requiredFor100: false,
    tags: ["auto", "reward"],
  },

  // ===== Optional / non-100% tracked =====
  {
    slug: "waltons-gang",
    title: "Walton's Gang Outfit",
    unlock: "6 scraps — Walton's Gang membership",
    summary: "Formerly PS3-exclusive. Not required for 100% or any achievement.",
    walkthrough:
      "Search Solomon's Folly, complete Horsebreaking at Ridgewood Farm, win Poker at Armadillo, capture a Walton's Gang bounty ALIVE, defend Cholla Springs residents from a Walton's Gang random event, and buy the final scrap at the Thieves' Landing tailor.",
    scrapSteps: [
      "Search Solomon's Folly",
      "Complete Horsebreaking at Ridgewood Farm",
      "Eliminate all players in Poker at Armadillo",
      "Capture a Walton's Gang bounty ALIVE",
      "Random event: defend Cholla Springs residents",
      "Buy scrap at Thieves' Landing tailor",
    ],
    outcomes: ["Walton's Gang non-hostile (unless provoked)"],
    requiredFor100: false,
    tags: ["scrap-chain", "gang", "optional"],
  },
  {
    slug: "deadly-assassin",
    title: "Deadly Assassin Outfit",
    unlock: "5 scraps — combat & duel prerequisites",
    summary: "Doubles Deadeye recharge speed. Best-in-slot for combat.",
    walkthrough:
      "Search Coot's Chapel, complete the Twin Rocks Hideout, kill or capture Mo van Barr from a bounty poster, win a duel in Armadillo (trigger by cheating at Poker in the Elegant Suit), and complete the 'American Appetites' stranger chain.",
    scrapSteps: [
      "Search Coot's Chapel",
      "Complete the Twin Rocks Hideout",
      "Kill or capture Mo van Barr (bounty)",
      "Win a duel in Armadillo",
      "Complete 'American Appetites' stranger",
    ],
    outcomes: ["Deadeye recharge doubled while worn"],
    requiredFor100: false,
    tags: ["scrap-chain", "optional"],
  },
  {
    slug: "expert-hunter",
    title: "Expert Hunter Outfit",
    unlock: "5 hunting prerequisites",
    summary: "Doubles pelts and animal parts received (except hearts).",
    walkthrough:
      "Harvest 5,000lbs of meat, kill a cougar with dynamite (easiest during 'At Home with Dutch'), kill and skin 8 snakes (great spawn at El Matadero), kill the Legendary Jackalope (Pleasance House area), and complete the 'Deadalus and Son' stranger chain.",
    scrapSteps: [
      "Harvest 5,000lbs of meat",
      "Kill a cougar with dynamite",
      "Kill and skin 8 snakes",
      "Kill the Legendary Jackalope",
      "Complete 'Deadalus and Son' stranger",
    ],
    outcomes: ["Double pelts & animal parts (except hearts)"],
    requiredFor100: false,
    tags: ["hunting", "optional"],
  },
  {
    slug: "savvy-merchant",
    title: "Savvy Merchant Outfit",
    unlock: "5 commerce prerequisites",
    summary: "50% discount at every gunsmith when worn. Essential for buying the Explosive Rifle cheaply.",
    walkthrough:
      "Win $1,000 total from gambling, buy or sell at every gunsmith, gather $200 worth of herbs, execute 20 people (hideout runs are best), and complete 'The Prohibitionist' stranger chain.",
    scrapSteps: [
      "Win $1,000 total from gambling",
      "Buy/sell at every gunsmith",
      "Gather $200 worth of herbs",
      "Execute 20 people",
      "Complete 'The Prohibitionist' stranger",
    ],
    outcomes: ["50% gunsmith discount while worn"],
    requiredFor100: false,
    tags: ["commerce", "optional"],
  },
  {
    slug: "duster-coat",
    title: "Duster Coat",
    unlock: "Reach Peace Maker honor rank",
    summary: "Cosmetic-only. Not required for anything.",
    walkthrough: "Automatic when honor hits Peace Maker rank.",
    outcomes: ["Aesthetic"],
    requiredFor100: false,
    tags: ["auto", "optional"],
  },
  {
    slug: "gentlemans-attire",
    title: "Gentleman's Attire",
    unlock: "Available from game start",
    summary: "Grants access to the high-stakes Blackwater Hotel poker table.",
    walkthrough: "Buy at any tailor. Only needed if you specifically want the hotel high-stakes poker (the saloon table is better for U.S. Army scrap + Elegant Suit cheating).",
    outcomes: ["High-stakes poker access"],
    requiredFor100: false,
    tags: ["optional"],
  },
];

export const OUTFITS: Outfit[] = SEEDS.map(outfit);
