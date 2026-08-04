import type { Trackable, CategoryId, Region } from './types';

// -----------------------------------------------------------------------
// Seed data — scaffold sample records per category. Counts are padded to
// match the official expected totals so the dashboard rollups line up.
// Replace with full descriptions when porting the complete dataset.
// -----------------------------------------------------------------------

function pad(
  category: CategoryId,
  official: number,
  extras: number,
  seed: Partial<Trackable>[],
  defaults: { region?: Region; subtype?: string } = {},
): Trackable[] {
  const out: Trackable[] = [];
  const totalOfficial = official;
  const totalExtras = extras;
  const bank = [...seed];

  for (let i = 0; i < totalOfficial; i++) {
    const base = bank[i];
    out.push({
      id: `${category}-o-${i + 1}`,
      title: base?.title ?? `${category} entry ${i + 1}`,
      category,
      region: base?.region ?? defaults.region ?? 'Other',
      isRequiredForOfficial100: true,
      isCompletionistExtra: false,
      categorySubtype: base?.categorySubtype ?? defaults.subtype,
      summary: base?.summary ?? 'Required for official 100% completion.',
      walkthrough:
        base?.walkthrough ?? 'Walkthrough content to be expanded in a later pass.',
      objectives: base?.objectives ?? ['Complete the objective'],
      rewards: base?.rewards ?? ['Progress toward 100%'],
      steps: base?.steps ?? [{ id: 'done', label: 'Mark complete' }],
      tags: base?.tags,
      meta: base?.meta,
    });
  }
  for (let i = 0; i < totalExtras; i++) {
    const idx = totalOfficial + i;
    const base = bank[idx];
    out.push({
      id: `${category}-x-${i + 1}`,
      title: base?.title ?? `${category} extra ${i + 1}`,
      category,
      region: base?.region ?? defaults.region ?? 'Other',
      isRequiredForOfficial100: false,
      isCompletionistExtra: true,
      categorySubtype: base?.categorySubtype ?? 'completionist-extra',
      summary: base?.summary ?? 'Completionist extra — not required for official 100%.',
      walkthrough: base?.walkthrough ?? 'Notes for completionists.',
      objectives: base?.objectives ?? ['Complete for full clear'],
      rewards: base?.rewards ?? ['Completionist credit'],
      steps: base?.steps ?? [{ id: 'done', label: 'Mark complete' }],
      tags: base?.tags,
      meta: base?.meta,
    });
  }
  return out;
}

// Story — 57 missions. Named seeds for the openers; rest are padded.
const STORY_NAMES = [
  ['Exodus in America', "Hennigan's Stead"],
  ['New Friends, Old Problems', "Hennigan's Stead"],
  ['Obstacles in Our Path', 'Cholla Springs'],
  ['This is Armadillo, USA', 'Cholla Springs'],
  ["Justice in Pike's Basin", 'Cholla Springs'],
  ['Political Realities in Armadillo', 'Cholla Springs'],
  ['A Tempest Looms', "Hennigan's Stead"],
  ['The Burning', 'Cholla Springs'],
  ['The Assault on Fort Mercer', 'Cholla Springs'],
  ['We Shall Be Together in Paradise', 'Nuevo Paraiso'],
] as const;

const STORY: Trackable[] = pad(
  'story',
  57,
  0,
  STORY_NAMES.map(([title, region]) => ({
    title,
    region: region as Region,
    summary: 'Storyline mission.',
    walkthrough: 'Walkthrough to be expanded.',
    objectives: ['Complete the mission'],
    rewards: ['Story progress'],
    steps: [
      { id: 'complete', label: 'Complete mission' },
      { id: 'gold', label: 'Earn Gold Medal (optional)' },
    ],
  })),
);

// Strangers — 18 official + 1 extra ("I Know You")
const STRANGER_NAMES = [
  'California',
  'Poppycock',
  'Deadalus and Son',
  'American Appetites',
  'Water and Honesty',
  'Aztec Gold',
  'Lights, Camera, Action!',
  'Funny Man',
  'Let No Man Put Asunder',
  'Love is the Opiate',
  'The Prohibitionist',
  "Man is Born Unto Trouble",
  "Remember My Family",
  "I'm a Doctor, Not a Mechanic",
  'The Wronged Woman',
  'Flowers for a Lady',
  'Eva in Peril',
  'Race to the Finish',
  'I Know You',
];
const STRANGERS: Trackable[] = pad(
  'strangers',
  18,
  1,
  STRANGER_NAMES.map((title) => ({ title })),
);

// Challenges — 4 official chains + 2 optional (Tomahawk, Explosive Rifle)
const CHALLENGE_SEED: Partial<Trackable>[] = [
  { title: 'Hunting Challenges (10 ranks)', summary: 'Rank 1–10 hunting objectives.' },
  { title: 'Sharpshooter Challenges (10 ranks)', summary: 'Rank 1–10 combat objectives.' },
  { title: 'Survivalist Challenges (10 ranks)', summary: 'Pick 10 of each medicinal plant per rank.' },
  { title: 'Treasure Hunter Challenges (10 maps)', summary: 'Follow 10 treasure maps to their prizes.' },
  { title: 'Tomahawk Mastery (optional)', summary: 'Optional weapon mastery chain.' },
  { title: 'Explosive Rifle Mastery (optional)', summary: 'Optional weapon mastery chain.' },
];
const CHALLENGES: Trackable[] = pad('challenges', 4, 2, CHALLENGE_SEED);

// Bounties — 20 official
const BOUNTY_SEED: Partial<Trackable>[] = [
  { title: 'Rattlesnake Hollow', region: 'Cholla Springs' },
  { title: 'Plainview', region: 'Cholla Springs' },
  { title: "Hanging Rock", region: 'Cholla Springs' },
  { title: 'Coot’s Chapel', region: 'Cholla Springs' },
  { title: 'Rathskeller Fork', region: "Hennigan's Stead" },
  { title: 'Ridgewood Farm', region: 'Cholla Springs' },
  { title: 'Repentance Rock', region: 'Gaptooth Ridge' },
  { title: 'Twin Rocks', region: 'Cholla Springs' },
  { title: 'Plata Grande', region: 'Perdido' },
  { title: 'El Presidio', region: 'Perdido' },
  { title: 'Casa Madrugada', region: 'Perdido' },
  { title: 'Torquemada', region: 'Punta Orgullo' },
  { title: 'Sepulcro', region: 'Diez Coronas' },
  { title: 'Chuparosa', region: 'Perdido' },
  { title: 'Escalera', region: 'Diez Coronas' },
  { title: 'Las Hermanas', region: 'Perdido' },
  { title: 'Aurora Basin', region: 'Tall Trees' },
  { title: 'Manzanita Post', region: 'Tall Trees' },
  { title: 'Nekoti Rock', region: 'Tall Trees' },
  { title: 'Blackwater', region: 'Blackwater' },
];
const BOUNTIES: Trackable[] = pad('bounties', 20, 0, BOUNTY_SEED);

// Jobs — 5 official
const JOB_SEED: Partial<Trackable>[] = [
  { title: "Nightwatch — MacFarlane's Ranch", region: "Hennigan's Stead" },
  { title: 'Horsebreaking — Ridgewood Farm', region: 'Cholla Springs' },
  { title: 'Horsebreaking — Chuparosa', region: 'Perdido' },
  { title: 'Nightwatch — Chuparosa', region: 'Perdido' },
  { title: 'Nightwatch — Blackwater', region: 'Blackwater' },
];
const JOBS: Trackable[] = pad('jobs', 5, 0, JOB_SEED);

// Hideouts — 7 official + 1 extra
const HIDEOUT_SEED: Partial<Trackable>[] = [
  { title: 'Twin Rocks', region: 'Cholla Springs' },
  { title: "Pike's Basin", region: 'Cholla Springs' },
  { title: 'Fort Mercer', region: 'Cholla Springs' },
  { title: 'Gaptooth Breach', region: 'Gaptooth Ridge' },
  { title: 'Tesoro Azul', region: 'Perdido' },
  { title: 'Nosalida', region: 'Perdido' },
  { title: 'Tumbleweed', region: 'Gaptooth Ridge' },
  { title: "Solomon's Folly (extra)", region: 'Cholla Springs' },
];
const HIDEOUTS: Trackable[] = pad('hideouts', 7, 1, HIDEOUT_SEED);

// Minigames — 6 official
const MINIGAME_SEED: Partial<Trackable>[] = [
  { title: 'Win a Poker hand' },
  { title: 'Win a Blackjack hand' },
  { title: 'Win at Liar’s Dice' },
  { title: 'Win at Five Finger Fillet' },
  { title: 'Win at Horseshoes' },
  { title: 'Win at Arm Wrestling' },
];
const MINIGAMES: Trackable[] = pad('minigames', 6, 0, MINIGAME_SEED);

// Locations — 94 official (pad with generic entries by region)
const LOCATIONS: Trackable[] = pad(
  'locations',
  94,
  0,
  [
    { title: 'Armadillo', region: 'Cholla Springs' },
    { title: 'Thieves’ Landing', region: "Hennigan's Stead" },
    { title: 'Blackwater', region: 'Blackwater' },
    { title: 'Escalera', region: 'Diez Coronas' },
    { title: 'Chuparosa', region: 'Perdido' },
    { title: 'Manzanita Post', region: 'Tall Trees' },
  ],
);

// Outfits — 9 official + 3 extras
const OUTFIT_SEED: Partial<Trackable>[] = [
  { title: 'Elegant Suit' },
  { title: 'Bollard Twins' },
  { title: 'Treasure Hunter' },
  { title: 'Bandito' },
  { title: 'Reyes’ Rebels' },
  { title: 'US Army Uniform' },
  { title: 'US Marshal' },
  { title: 'Mexican Poncho' },
  { title: 'Legend of the West' },
  { title: 'Cowboy (extra)' },
  { title: 'Rancher (extra)' },
  { title: 'Bureau Uniform (extra)' },
];
const OUTFITS: Trackable[] = pad('outfits', 9, 3, OUTFIT_SEED);

// Weapons — 5 official + a handful of extras
const WEAPON_SEED: Partial<Trackable>[] = [
  { title: 'LeMat Revolver' },
  { title: 'Semi-Automatic Shotgun' },
  { title: 'Carcano Rifle' },
  { title: 'Mauser Pistol' },
  { title: 'Evans Repeater' },
  { title: 'Cattleman Revolver (extra)' },
  { title: 'Bolt-Action Rifle (extra)' },
  { title: 'Repeater Carbine (extra)' },
  { title: 'Volcanic Pistol (extra)' },
  { title: 'Sawed-Off Shotgun (extra)' },
];
const WEAPONS: Trackable[] = pad('weapons', 5, 5, WEAPON_SEED);

// Safehouses — 13 official
const SAFEHOUSE_SEED: Partial<Trackable>[] = [
  { title: 'MacFarlane’s Ranch (story)', region: "Hennigan's Stead" },
  { title: 'Armadillo Room', region: 'Cholla Springs' },
  { title: 'Rathskeller Fork Room', region: "Hennigan's Stead" },
  { title: 'Thieves’ Landing Room', region: "Hennigan's Stead" },
  { title: 'Casa Madrugada Room', region: 'Perdido' },
  { title: 'Chuparosa Room', region: 'Perdido' },
  { title: 'Escalera Room', region: 'Diez Coronas' },
  { title: 'El Matadero Room', region: 'Punta Orgullo' },
  { title: 'Blackwater Hotel', region: 'Blackwater' },
  { title: 'Manzanita Post Room', region: 'Tall Trees' },
  { title: 'Beecher’s Hope (story)', region: 'Great Plains' },
  { title: 'Ridgewood Farm Room', region: 'Cholla Springs' },
  { title: 'Plainview Room', region: 'Cholla Springs' },
];
const SAFEHOUSES: Trackable[] = pad('safehouses', 13, 0, SAFEHOUSE_SEED);

// Collectibles — extras only
const COLLECTIBLES: Trackable[] = pad(
  'collectibles',
  0,
  15,
  [
    { title: 'Treasure Map 1' },
    { title: 'Treasure Map 2' },
    { title: 'Wild Flower — Prairie Poppy' },
    { title: 'Wild Flower — Desert Sage' },
  ],
);

export const DATA_BY_CATEGORY: Record<CategoryId, Trackable[]> = {
  story: STORY,
  strangers: STRANGERS,
  challenges: CHALLENGES,
  bounties: BOUNTIES,
  jobs: JOBS,
  hideouts: HIDEOUTS,
  minigames: MINIGAMES,
  locations: LOCATIONS,
  outfits: OUTFITS,
  weapons: WEAPONS,
  safehouses: SAFEHOUSES,
  collectibles: COLLECTIBLES,
};

export const ALL_TRACKABLES: Trackable[] = Object.values(DATA_BY_CATEGORY).flat();
