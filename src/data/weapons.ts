import type { Weapon, Region, QuickFact } from "./types";
import { mapMarker, regionPin, verifiedPin } from "./assets";

/**
 * Weapons roster relevant to 100% and completion tracking. Per the Jimbatron
 * RDR 100% guide, the 5 rare weapons required are: LeMat Revolver,
 * Semi-Auto Shotgun, Carcano Rifle, Mauser Pistol, and Evans Repeater.
 * The rest are tracked as completionist entries.
 */

interface Seed {
  slug: string;
  title: string;
  type: string;
  ammo?: string;
  region: Region;
  summary: string;
  walkthrough: string;
  requiredFor100?: boolean;
  tags?: string[];
  markerCaption?: string;
  markerCoords?: string;
  /** Verified pin coord on the base map. */
  pin?: { x: number; y: number };
  price?: string;
}

function weapon(s: Seed): Weapon {
  const caption = s.markerCaption ?? `${s.title} — ${s.region}`;
  const pin = s.pin
    ? verifiedPin(s.pin.x, s.pin.y, s.region, caption, s.markerCoords)
    : regionPin(s.region, caption, s.markerCoords);
  const marker = mapMarker(pin, s.markerCoords);
  const quickFacts: QuickFact[] = [
    { label: "Type", value: s.type },
    ...(s.ammo ? [{ label: "Ammo", value: s.ammo }] : []),
    { label: "Region", value: s.region },
    ...(s.price ? [{ label: "Price", value: s.price }] : []),
    { label: "100%", value: (s.requiredFor100 ?? false) ? "Yes" : "No" },
  ];
  return {
    id: `weapon-${s.slug}`,
    title: s.title,
    category: "weapons",
    weaponType: s.type,
    ammo: s.ammo,
    region: s.region,
    isRequiredForOfficial100: s.requiredFor100 ?? false,
    isOptionalSideContent: !(s.requiredFor100 ?? false),
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: ["Purchase or acquire"],
    rewardsOrOutcomes: ["Adds to weapon wheel"],
    checklistSteps: [{ id: "own", label: "Own" }],
    mapMarker: marker,
    quickFacts,
    tags: s.tags,
  };
}


const SEEDS: Seed[] = [
  // ===== 5 rare weapons required for 100% =====
  {
    slug: "lemat-revolver",
    title: "LeMat Revolver",
    type: "Sidearm",
    ammo: "Pistol",
    region: "Diez Coronas",
    price: "$925",
    summary: "9-shot revolver with a shotgun barrel. Buy at the Escalera gunsmith.",
    walkthrough:
      "Available at the Escalera gunsmith after the rebellion opens the town. One of the 5 rare weapons required for 100% and for the 'Exquisite Taste' achievement.",
    requiredFor100: true,
    tags: ["rare", "escalera"],
    markerCaption: "Escalera Gunsmith — SE Diez Coronas",
    markerCoords: "Enter town → yellow gun icon on main street",
    pin: { x: 0.90, y: 0.61 },
  },
  {
    slug: "semi-auto-shotgun",
    title: "Semi-Auto Shotgun",
    type: "Shotgun",
    ammo: "Shotgun",
    region: "Diez Coronas",
    price: "$1,150",
    summary: "Top-tier close-range weapon. Buy at the Escalera gunsmith.",
    walkthrough:
      "Escalera gunsmith stock after story progression. Ideal for hideout clears. Wear the Savvy Merchant Outfit for a 50% discount if farming money.",
    requiredFor100: true,
    tags: ["rare", "escalera"],
    markerCaption: "Escalera Gunsmith — SE Diez Coronas",
    markerCoords: "Same shop as the LeMat",
    pin: { x: 0.90, y: 0.61 },
  },
  {
    slug: "carcano-rifle",
    title: "Carcano Rifle",
    type: "Sniper",
    ammo: "High-Powered",
    region: "Blackwater",
    price: "$1,000",
    summary: "Bolt-action sniper — buy from the Blackwater gunsmith.",
    walkthrough:
      "Blackwater gunsmith. Best all-round sniper for Legendary hunts and long-range clears.",
    requiredFor100: true,
    tags: ["rare", "blackwater"],
    markerCaption: "Blackwater Gunsmith — Great Plains",
    markerCoords: "North side of Blackwater's main street",
    pin: { x: 0.93, y: 0.16 },
  },
  {
    slug: "mauser-pistol",
    title: "Mauser Pistol",
    type: "Pistol",
    ammo: "Pistol",
    region: "Blackwater",
    price: "$1,100",
    summary: "Highest-capacity semi-auto pistol. Blackwater gunsmith.",
    walkthrough: "Blackwater gunsmith stock. Great sidearm for rapid target chains during hideout sweeps.",
    requiredFor100: true,
    tags: ["rare", "blackwater"],
    markerCaption: "Blackwater Gunsmith — Great Plains",
    markerCoords: "Same shop as the Carcano",
    pin: { x: 0.93, y: 0.16 },
  },
  {
    slug: "evans-repeater",
    title: "Evans Repeater",
    type: "Repeater",
    ammo: "Repeater",
    region: "Blackwater",
    price: "$750",
    summary: "High-capacity repeater with the largest magazine in the game. Blackwater gunsmith.",
    walkthrough:
      "Blackwater gunsmith. Required for Sharpshooter Rank 10 (disarm 6 people with one ammo clip at Fort Mercer).",
    requiredFor100: true,
    tags: ["rare", "blackwater"],
    markerCaption: "Blackwater Gunsmith — Great Plains",
    markerCoords: "Same shop as the Carcano & Mauser",
    pin: { x: 0.93, y: 0.16 },
  },


  // ===== Standard sidearms =====
  { slug: "cattleman", title: "Cattleman Revolver", type: "Sidearm", ammo: "Pistol", region: "Other",
    summary: "Starter revolver. Owned by default.", walkthrough: "Available from mission start.", tags: ["default"] },
  { slug: "volcanic-pistol", title: "Volcanic Pistol", type: "Pistol", ammo: "Pistol", region: "Cholla Springs",
    summary: "Semi-auto pistol, purchased in Armadillo.", walkthrough: "Buy at the Armadillo gunsmith after Political Realities in Armadillo." },
  { slug: "schofield", title: "Schofield Revolver", type: "Sidearm", ammo: "Pistol", region: "Cholla Springs",
    summary: "Higher-damage single-action revolver.", walkthrough: "Buy from Armadillo gunsmith after the second Marshal mission." },
  { slug: "double-action", title: "Double-Action Revolver", type: "Sidearm", ammo: "Pistol", region: "Blackwater",
    summary: "Fastest fire-rate revolver.", walkthrough: "Blackwater gunsmith stock." },
  { slug: "high-power-pistol", title: "High Power Pistol", type: "Pistol", ammo: "Pistol", region: "Blackwater",
    summary: "High-damage semi-auto pistol.", walkthrough: "Blackwater gunsmith after story progression." },

  // ===== Long arms =====
  { slug: "repeater-carbine", title: "Repeater Carbine", type: "Repeater", ammo: "Repeater", region: "Cholla Springs",
    summary: "Starter repeater.", walkthrough: "Armadillo gunsmith." },
  { slug: "henry-repeater", title: "Henry Repeater", type: "Repeater", ammo: "Repeater", region: "Perdido",
    summary: "Higher-capacity repeater.", walkthrough: "Chuparosa or Escalera gunsmith." },
  { slug: "winchester-repeater", title: "Winchester Repeater", type: "Repeater", ammo: "Repeater", region: "Blackwater",
    summary: "Late-game repeater with the best accuracy.", walkthrough: "Blackwater gunsmith." },
  { slug: "springfield-rifle", title: "Springfield Rifle", type: "Rifle", ammo: "Rifle", region: "Cholla Springs",
    summary: "Single-shot rifle, high damage.", walkthrough: "Armadillo gunsmith." },
  { slug: "bolt-action-rifle", title: "Bolt Action Rifle", type: "Rifle", ammo: "Rifle", region: "Blackwater",
    summary: "Bolt-action rifle. Fast follow-ups.", walkthrough: "Blackwater gunsmith." },
  { slug: "rolling-block-rifle", title: "Rolling Block Rifle", type: "Sniper", ammo: "High-Powered", region: "Perdido",
    summary: "Alternative sniper with a large scope.", walkthrough: "Chuparosa or Escalera gunsmith." },
  { slug: "buffalo-rifle", title: "Buffalo Rifle", type: "Sniper", ammo: "High-Powered", region: "Tall Trees",
    summary: "Legacy buffalo rifle. Massive damage — one-shot kills on bears.", walkthrough: "Blackwater gunsmith after Tall Trees becomes reachable." },

  // ===== Shotguns =====
  { slug: "sawed-off", title: "Sawed-Off Shotgun", type: "Shotgun", ammo: "Shotgun", region: "Rio Bravo",
    summary: "Close-range double barrel.", walkthrough: "Thieves' Landing gunsmith (useful buy for the Savvy Merchant chain)." },
  { slug: "double-barrelled", title: "Double-Barreled Shotgun", type: "Shotgun", ammo: "Shotgun", region: "Cholla Springs",
    summary: "Standard double-barrel.", walkthrough: "Armadillo gunsmith." },
  { slug: "pump-shotgun", title: "Pump-Action Shotgun", type: "Shotgun", ammo: "Shotgun", region: "Blackwater",
    summary: "Pump-action shotgun.", walkthrough: "Blackwater gunsmith." },

  // ===== Thrown / explosive =====
  { slug: "throwing-knives", title: "Throwing Knives", type: "Thrown", ammo: "Knife", region: "Other",
    summary: "Silent thrown weapon.", walkthrough: "Any gunsmith." },
  { slug: "tomahawk", title: "Tomahawk", type: "Thrown", ammo: "Tomahawk", region: "Tall Trees",
    summary: "Manzanita Post general-store purchase. Unlocks the Tomahawk Mastery challenge chain.",
    walkthrough: "Buy at the Manzanita Post general store. First step of the optional Tomahawk Mastery challenge (Axe Master achievement).",
    tags: ["challenge-chain"] },
  { slug: "dynamite", title: "Dynamite", type: "Explosive", ammo: "Explosive", region: "Cholla Springs",
    summary: "Thrown explosive.", walkthrough: "Any gunsmith." },
  { slug: "fire-bottle", title: "Fire Bottle", type: "Explosive", ammo: "Fire Bottle", region: "Perdido",
    summary: "Thrown molotov.", walkthrough: "Chuparosa gunsmith and later." },
  { slug: "explosive-rifle", title: "Explosive Rifle", type: "Rifle", ammo: "Explosive",
    region: "Blackwater",
    summary: "Rare DLC-added rifle. Base price $10,000 — required for the Explosive Rifle Mastery challenge.",
    walkthrough: "Blackwater gunsmith. Wear the Savvy Merchant Outfit for 50% off, high honour for another 50% off (final $2,500).",
    tags: ["challenge-chain", "optional"] },

  // ===== Utility =====
  { slug: "lasso", title: "Lasso", type: "Utility", region: "Hennigan's Stead",
    summary: "Rope for capturing horses and bounties alive. Awarded during Wild Horses, Tamed Passions.",
    walkthrough: "Awarded during the Bonnie MacFarlane chain. Essential for alive-capture bounties.",
    tags: ["utility", "story-reward"] },
];

export const WEAPONS: Weapon[] = SEEDS.map(weapon);
