import type { CategoryMeta, CategoryId } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "story",
    label: "Story Missions",
    shortLabel: "Story",
    description: "Main campaign missions, chapter milestones and major story beats.",
    icon: "BookOpen",
  },
  {
    id: "strangers",
    label: "Stranger Missions",
    shortLabel: "Strangers",
    description: "Unique side quest chains and memorable encounters across the frontier.",
    icon: "Users",
  },
  {
    id: "challenges",
    label: "Challenges",
    shortLabel: "Challenges",
    description: "Hunting, Sharpshooter, Survivalist and Treasure Hunter ranks with progression goals.",
    icon: "Target",
  },
  {
    id: "bounties",
    label: "Bounties",
    shortLabel: "Bounties",
    description: "Wanted targets available from town sheriffs.",
    icon: "Scroll",
  },
  {
    id: "jobs",
    label: "Ambient Jobs",
    shortLabel: "Jobs",
    description: "Nightwatch, herding, horse breaking and other honest work.",
    icon: "Hammer",
  },
  {
    id: "hideouts",
    label: "Gang Hideouts",
    shortLabel: "Hideouts",
    description: "Clear each gang stronghold. Repeatable for cash.",
    icon: "Skull",
  },
  {
    id: "minigames",
    label: "Minigames",
    shortLabel: "Minigames",
    description: "Poker, Blackjack, Liar's Dice, Five Finger Fillet, Horseshoes, Arm Wrestling.",
    icon: "Dice5",
  },
  {
    id: "collectibles",
    label: "Collectibles (Completionist)",
    shortLabel: "Collectibles",
    description: "Custom completionist tracking — treasure maps, flowers, and other pickup sets. Not counted in Rockstar's official 100%.",
    icon: "Gem",
  },
  {
    id: "locations",
    label: "Locations",
    shortLabel: "Locations",
    description: "Every discoverable town, settlement, landmark and travel reference worth noting.",
    icon: "MapPin",
  },
  {
    id: "outfits",
    label: "Outfits",
    shortLabel: "Outfits",
    description: "Marston outfits and the unlock chains needed to collect them.",
    icon: "Shirt",
  },
  {
    id: "weapons",
    label: "Weapons",
    shortLabel: "Weapons",
    description: "Full weapon roster relevant to 100% and collection.",
    icon: "Crosshair",
  },
  {
    id: "safehouses",
    label: "Safehouses",
    shortLabel: "Safehouses",
    description: "Purchasable safehouses that support saves, fast travel and planning.",
    icon: "Home",
  },
];

export const CATEGORY_BY_ID: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, CategoryMeta>,
);
