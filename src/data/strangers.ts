import type { StrangerMission, Region } from "./types";

/**
 * All 19 Stranger side-missions. Per community-wiki verification, 18 of these
 * are required for official 100% completion. "I Know You" (the Strange Man
 * arc) is not required for the 100% checklist but is included as a
 * completionist entry.
 */

interface Seed {
  slug: string;
  title: string;
  giver: string;
  region: Region;
  summary: string;
  walkthrough: string;
  objectives: string[];
  outcomes: string[];
  missable?: string[];
  chain?: string;
  step?: number;
  after?: string[];
  requiredFor100?: boolean;
  tags?: string[];
}

function stranger(s: Seed): StrangerMission {
  return {
    id: `stranger-${s.slug}`,
    title: s.title,
    category: "strangers",
    missionGiver: s.giver,
    region: s.region,
    isRequiredForOfficial100: s.requiredFor100 ?? true,
    isOptionalSideContent: !(s.requiredFor100 ?? true),
    unlocksAfter: s.after?.map((a) => `stranger-${a}`),
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: s.objectives,
    rewardsOrOutcomes: s.outcomes,
    missableWarnings: s.missable,
    chain: s.chain,
    step: s.step,
    checklistSteps: [
      { id: "meet", label: "Meet the stranger" },
      { id: "task", label: "Complete the task" },
      { id: "resolve", label: "Resolve the chain" },
    ],
    tags: s.tags,
  };
}

const SEEDS: Seed[] = [
  {
    slug: "american-appetites",
    title: "American Appetites",
    giver: "Marion Williamson",
    region: "Cholla Springs",
    summary: "A woman outside Armadillo asks Marston to save her from a cannibal wagon-family.",
    walkthrough:
      "Meet Marion on the road east of Armadillo, ride to the wagon camp, and confront the family. The honourable outcome is to shoot the cannibals and free the captives; the dishonourable is to walk away. Return to Marion afterwards.",
    objectives: ["Meet Marion", "Reach the wagon", "Resolve the confrontation"],
    outcomes: ["Honor branch reward", "Chain complete"],
    tags: ["honor-choice"],
  },
  {
    slug: "american-lobbyist",
    title: "American Lobbyist",
    giver: "The American Lobbyist",
    region: "Blackwater",
    summary: "A Blackwater official wants a rival photographed in compromising positions.",
    walkthrough:
      "Meet the lobbyist in Blackwater, then track the rival over three encounters — a saloon, a hotel, and a wagon on the outskirts. Compile the evidence and hand it in for the payoff.",
    objectives: ["Photograph the rival", "Hand in the evidence"],
    outcomes: ["Cash reward"],
    tags: ["blackwater"],
  },
  {
    slug: "aztec-gold",
    title: "Aztec Gold",
    giver: "Vincenzo Barelli",
    region: "Perdido",
    summary: "A treasure hunter in Chuparosa has half a map. Find the other half and split the gold.",
    walkthrough:
      "Meet Vincenzo at the cantina. The second map fragment is with a fisherman near Escalera — a short ride south. Return with both halves, then dig the treasure at the marked spot.",
    objectives: ["Find the map halves", "Dig up the treasure"],
    outcomes: ["Cash bonus + Fame"],
    tags: ["mexico", "treasure"],
  },
  {
    slug: "california",
    title: "California",
    giver: "Jenny",
    region: "Cholla Springs",
    summary: "A woman in Armadillo begs for money to get to California.",
    walkthrough:
      "Give Jenny any amount when prompted (donating $10+ triggers the honourable branch). Return the next in-game day for the resolution — a short cutscene closes the chain.",
    objectives: ["Give Jenny money", "Return the next day"],
    outcomes: ["Honor gain", "Chain complete"],
    tags: ["honor", "armadillo"],
  },
  {
    slug: "deadalus-and-son",
    title: "Deadalus and Son",
    giver: "The Aviator",
    region: "Tall Trees",
    summary: "An inventor in West Elizabeth wants materials for his flying machine.",
    walkthrough:
      "Deliver the components he asks for across two visits. The final flight test resolves in a scripted cutscene — no combat.",
    objectives: ["Deliver the parts", "Return for the flight test"],
    outcomes: ["Fame + Honor"],
    tags: ["west-elizabeth"],
  },
  {
    slug: "eva-in-peril",
    title: "Eva in Peril",
    giver: "Vincente",
    region: "Diez Coronas",
    summary: "A distraught man in Nuevo Paraíso wants his fiancée rescued from a brothel.",
    walkthrough:
      "Ride to the brothel, then choose to pay off the madam or clear the brothel by force. The forceful path unlocks a shootout tuning check — Deadeye the two upstairs shooters first.",
    objectives: ["Reach the brothel", "Free Eva"],
    outcomes: ["Honor branch reward"],
    tags: ["mexico", "honor-choice"],
  },
  {
    slug: "flowers-for-a-lady",
    title: "Flowers for a Lady",
    giver: "Bill Prince",
    region: "Cholla Springs",
    summary: "A shy suitor asks Marston to pick a specific bouquet for his intended.",
    walkthrough:
      "Buy or pick the requested flowers (Wild Feverfew, Prickly Pear, etc.) — the Survivalist Map helps here. Return to Bill; the payoff is a short cutscene.",
    objectives: ["Collect the flowers", "Deliver them"],
    outcomes: ["Cash + Honor"],
    tags: ["armadillo", "collection"],
  },
  {
    slug: "funny-man",
    title: "Funny Man",
    giver: "Deidre Shaw",
    region: "Cholla Springs",
    summary: "A traveling comic keeps getting run out of town. Marston can help — or heckle.",
    walkthrough:
      "Attend two of his shows and choose whether to defend him from hecklers or join in. The honourable branch protects him through the third show for an Honor bonus.",
    objectives: ["Attend the performances", "Choose to defend or heckle"],
    outcomes: ["Honor branch reward"],
    tags: ["armadillo", "honor-choice"],
  },
  {
    slug: "i-know-you",
    title: "I Know You",
    giver: "The Strange Man",
    region: "New Austin",
    summary:
      "The recurring Strange Man encounters. Not required for 100% but included for completionists.",
    walkthrough:
      "First encounter: the wagon south of MacFarlane's Ranch. Second: the cliffside chapel in West Elizabeth. Third: the graveyard at Beecher's Hope after the credits. Story-gated in that exact order.",
    objectives: [
      "First meeting (New Austin)",
      "Second meeting (West Elizabeth chapel)",
      "Final meeting (Beecher's Hope graveyard)",
    ],
    outcomes: ["Completes the game's most notorious side chain"],
    missable: [
      "The chapel meeting only appears during a specific window in the West Elizabeth chapter.",
    ],
    requiredFor100: false,
    tags: ["strange-man", "story-gated", "optional"],
  },
  {
    slug: "jennys-faith",
    title: "Jenny's Faith",
    giver: "Ike Skelding",
    region: "Cholla Springs",
    summary: "An old man near Armadillo has lost his daughter to a cult of snake-handlers.",
    walkthrough:
      "Ride to the meet, then to the cult's cabin. The honourable outcome kills the cult leader and returns the daughter; the dishonourable takes the cult's money.",
    objectives: ["Find the cult", "Resolve the confrontation"],
    outcomes: ["Honor branch reward"],
    tags: ["armadillo", "honor-choice"],
  },
  {
    slug: "let-no-man-put-asunder",
    title: "Let No Man Put Asunder",
    giver: "Aldous Worthington",
    region: "Blackwater",
    summary: "A West Elizabeth husband suspects his wife of infidelity. Investigate.",
    walkthrough:
      "Tail the wife across two locations in Blackwater. Choose to report truthfully or lie — the outcome hinges on the branch you pick.",
    objectives: ["Tail the wife", "Report to Aldous"],
    outcomes: ["Cash reward"],
    tags: ["blackwater", "honor-choice"],
  },
  {
    slug: "lights-camera-action",
    title: "Lights, Camera, Action",
    giver: "The Movie Man",
    region: "Blackwater",
    summary: "A filmmaker in Blackwater wants Marston to reenact scenes for his movie.",
    walkthrough:
      "Three short reenactments (a shootout, a chase, a stand-off). Each is a scripted set-piece — follow the on-screen prompt and don't improvise.",
    objectives: ["Complete three film scenes"],
    outcomes: ["Cash + Fame"],
    tags: ["blackwater"],
  },
  {
    slug: "love-is-the-opiate",
    title: "Love is the Opiate",
    giver: "Sam Odessa",
    region: "Cholla Springs",
    summary: "A shaken man in Armadillo wants a snake charmer's flute recovered.",
    walkthrough:
      "Ride to the shack west of Rathskeller Fork. The flute is on the corpse inside — expect scripted rattlesnakes on the return trip. Give Sam the flute (honourable) or keep it (dishonourable).",
    objectives: ["Retrieve the flute", "Return to Sam"],
    outcomes: ["Honor branch reward"],
    chain: "Sam Odessa",
    step: 1,
    tags: ["armadillo", "honor-choice"],
  },
  {
    slug: "poppycock",
    title: "Poppycock",
    giver: "Sam Odessa",
    region: "Cholla Springs",
    summary: "Follow-up to Sam Odessa's flute chain. He now needs his lost badge.",
    walkthrough:
      "Return to Sam a day or two after Love is the Opiate. Retrieve his badge from the same shack area and hand it back.",
    objectives: ["Retrieve the badge", "Return it"],
    outcomes: ["Chain finale"],
    chain: "Sam Odessa",
    step: 2,
    after: ["love-is-the-opiate"],
    tags: ["armadillo", "chain"],
  },
  {
    slug: "the-prohibitionist",
    title: "The Prohibitionist",
    giver: "Norman Deek's temperance rival",
    region: "Blackwater",
    summary: "A prohibitionist in Blackwater wants a saloon shut down.",
    walkthrough:
      "Deliver anti-liquor pamphlets across two Blackwater locations and stage the confrontation at the saloon. Fists-only brawl at the finale to keep Fame.",
    objectives: ["Deliver the pamphlets", "Confront the saloon"],
    outcomes: ["Cash + Fame"],
    tags: ["blackwater"],
  },
  {
    slug: "remember-my-family-stranger",
    title: "Remember My Family",
    giver: "The Old Man",
    region: "Great Plains",
    summary: "An old man mourning his wife needs help delivering flowers across the ranch.",
    walkthrough:
      "Talk to him on the road east of Beecher's Hope, take the bouquet, and ride to the marker on the ridge. Low-combat — this chain is post-epilogue only.",
    objectives: ["Accept the flowers", "Deliver them"],
    outcomes: ["Honor gain"],
    missable: ["Post-epilogue only — not available before Jack takes over."],
    tags: ["epilogue"],
  },
  {
    slug: "water-and-honesty",
    title: "Water and Honesty",
    giver: "The Rev. Solomon",
    region: "Perdido",
    summary: "A Mexican revolutionary needs a well repaired for his village.",
    walkthrough:
      "Ride to the well, defend the workers from a bandit ambush, and return to the giver. One-visit resolution.",
    objectives: ["Defend the workers", "Return to the reverend"],
    outcomes: ["Honor gain"],
    tags: ["mexico"],
  },
  {
    slug: "who-are-you-to-judge",
    title: "Who Are You to Judge?",
    giver: "The Fugitive",
    region: "New Austin",
    summary: "A wanted man begs Marston to turn a blind eye — or turn him in.",
    walkthrough:
      "Meet the fugitive on the road, then choose to spare him (Honor) or arrest him (Fame + cash). No combat unless you botch the arrest.",
    objectives: ["Meet the fugitive", "Make the choice"],
    outcomes: ["Honor branch reward"],
    tags: ["honor-choice"],
  },
  {
    slug: "the-wronged-woman",
    title: "The Wronged Woman",
    giver: "Millicent Waterbury",
    region: "Cholla Springs",
    summary: "A woman needs help tracking down her husband, who fled with the family savings.",
    walkthrough:
      "Ride out to the husband's hiding spot in Rio Bravo, then choose to return the money to Millicent (Honor) or split it with the husband (dishonour).",
    objectives: ["Find the husband", "Recover the money"],
    outcomes: ["Honor branch reward"],
    tags: ["honor-choice"],
  },
];

export const STRANGER_MISSIONS: StrangerMission[] = SEEDS.map(stranger);
