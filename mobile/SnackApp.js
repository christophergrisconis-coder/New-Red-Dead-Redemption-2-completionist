/**
 * RDR1 Completionist — Single-file Expo Snack build.
 * BUILD: v3 · 2026-07-11 — map hero moved above text, zoomed marker moved to end.
 *
 * HOW TO USE (Expo Snack):
 *   1. Go to https://snack.expo.dev  → click "+ New Snack".
 *   2. In the file tree on the left, open App.js.
 *   3. Select ALL of App.js and DELETE it.
 *   4. Paste the entire contents of this file into App.js.
 *   5. Open the "Dependencies" panel (left sidebar, bottom) and add:
 *        - @react-native-async-storage/async-storage   (optional; persistence)
 *   6. On the right, choose "My Device" and scan the QR with Expo Go,
 *      or pick the iOS/Android/Web preview.
 *
 * Works on iPhone, iPad (landscape gets a split master/detail), and Web.
 *
 * WHAT'S INSIDE:
 *   • Detailed per-quest walkthroughs — overview, objectives,
 *     numbered step-by-step, Gold Medal requirements, 100% tips,
 *     missables, rewards — for every story & stranger mission plus
 *     bounties, hideouts, jobs, minigames, weapons, outfits, safehouses,
 *     and challenge chains.
 *   • Per-step checklists you can tick off as you play.
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, FlatList, Pressable, Image,
  TextInput, StyleSheet, useWindowDimensions, Share, Alert,
  Linking, Platform, StatusBar,
} from 'react-native';

let AsyncStorage = null;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch (e) {}

// ---------------------------------------------------------------------------
// THEME
// ---------------------------------------------------------------------------
const T = {
  bg: '#14100b', bgElev: '#1c1712', surface: '#221b14',
  border: '#3a2e22', borderStrong: '#4a3a2a',
  parchment: '#e9d9b8', parchmentDim: '#b8a686', muted: '#8a7a62',
  brass: '#c9a24b', brassDim: '#8a6d2f', accent: '#d7823a',
  official: '#c9a24b', extra: '#7a8ea0', warn: '#e39a5a',
};

// ---------------------------------------------------------------------------
// MAP: real RDR1 "Border States 1910" base map + normalized pin coords.
// The image is hosted on the Lovable CDN; Snack loads it over https.
// ---------------------------------------------------------------------------
const MAP_URL = 'https://rdr-completionist-guide.lovable.app/__l5e/assets-v1/fd9638af-3dab-4175-82ed-0a78c8322cf6/border-states-map.png';
const MAP_AR = 1.5; // width / height ratio of the base map (approx)
const MAP_CREDIT = 'Map: Rockstar Games — pins verified against IGN & GTAForums 100% guide.';

const REGION_ANCHORS = {
  'Tall Trees':       { x: 0.72, y: 0.13 },
  'Great Plains':     { x: 0.90, y: 0.17 },
  'Blackwater':       { x: 0.94, y: 0.16 },
  'West Elizabeth':   { x: 0.82, y: 0.14 },
  "Hennigan's Stead": { x: 0.80, y: 0.34 },
  'Cholla Springs':   { x: 0.48, y: 0.38 },
  'Gaptooth Ridge':   { x: 0.18, y: 0.45 },
  'Rio Bravo':        { x: 0.38, y: 0.60 },
  'New Austin':       { x: 0.35, y: 0.45 },
  'Diez Coronas':     { x: 0.82, y: 0.62 },
  'Perdido':          { x: 0.60, y: 0.82 },
  'Punta Orgullo':    { x: 0.18, y: 0.82 },
  'Nuevo Paraiso':    { x: 0.55, y: 0.78 },
  'Other':            { x: 0.50, y: 0.50 },
};
const regionAnchor = (r) => REGION_ANCHORS[r] || REGION_ANCHORS.Other;

// Verified pin coordinates (measured against the reference map / IGN).
// Keyed by trackable id (see packageCategory: `${catId}-${index+1}`).
const VERIFIED_PINS = {
  // Hideouts (order matches HIDEOUTS array)
  'hideouts-1': { x: 0.32, y: 0.42, caption: 'Fort Mercer' },
  'hideouts-2': { x: 0.72, y: 0.36, caption: 'Twin Rocks' },
  'hideouts-3': { x: 0.50, y: 0.42, caption: "Pike's Basin" },
  'hideouts-4': { x: 0.15, y: 0.47, caption: 'Gaptooth Breach mine' },
  'hideouts-5': { x: 0.68, y: 0.78, caption: 'Tesoro Azul canyon' },
  'hideouts-6': { x: 0.56, y: 0.74, caption: 'Nosalida river crossing' },
  'hideouts-7': { x: 0.13, y: 0.48, caption: 'Tumbleweed ghost town' },
  // Rare weapons — gunsmith towns where they're bought/earned
  'weapons-1': { x: 0.62, y: 0.78, caption: 'Chuparosa gunsmith / El Presidio' },
  'weapons-2': { x: 0.94, y: 0.16, caption: 'Blackwater gunsmith' },
  'weapons-3': { x: 0.86, y: 0.68, caption: 'Escalera gunsmith' },
  'weapons-4': { x: 0.94, y: 0.16, caption: 'Blackwater gunsmith' },
  'weapons-5': { x: 0.48, y: 0.38, caption: 'Master Hunter reward (New Austin)' },
  // Treasures (order matches TREASURES entries added below)
  'collectibles-1': { x: 0.24, y: 0.50, caption: 'Rathskeller Fork — burned homestead' },
  'collectibles-2': { x: 0.15, y: 0.47, caption: 'Gaptooth Breach — west of the mine' },
  'collectibles-3': { x: 0.35, y: 0.34, caption: 'Rio del Lobo Rock — cliff base' },
  'collectibles-4': { x: 0.68, y: 0.14, caption: 'Nekoti Rock — NE of Manzanita' },
  'collectibles-5': { x: 0.72, y: 0.36, caption: 'Twin Rocks overlook' },
  'collectibles-6': { x: 0.76, y: 0.66, caption: 'Ojo del Diablo — SW shore' },
  'collectibles-7': { x: 0.86, y: 0.65, caption: 'El Presidio south ridge' },
  'collectibles-8': { x: 0.13, y: 0.90, caption: 'Torquemada coast trail' },
  'collectibles-9': { x: 0.66, y: 0.20, caption: 'Aurora Basin west shore' },
};

// Get a pin for any trackable — verified where known, region anchor otherwise.
function pinFor(item) {
  if (!item) return null;
  const v = VERIFIED_PINS[item.id];
  if (v) return { ...v, region: item.region, verified: true };
  const a = regionAnchor(item.region);
  return { x: a.x, y: a.y, region: item.region, caption: item.region, verified: false };
}

// Categories that get a map pin surfaced in the Map tab
const MAP_CATEGORIES = new Set(['hideouts', 'weapons', 'bounties', 'collectibles', 'outfits']);
const CATEGORY_COLOR = {
  hideouts:     '#e2723a',
  weapons:      '#c9a24b',
  bounties:     '#d8b57a',
  collectibles: '#7fb389',
  outfits:      '#9ab0d8',
};

// ---------------------------------------------------------------------------
// CATEGORY METADATA (IGN-verified official counts)
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: 'story',        label: 'Story Missions',     icon: '🎯', desc: 'All 57 storyline missions.' },
  { id: 'strangers',    label: 'Stranger Missions',  icon: '🪶', desc: '18 count toward 100% + 1 extra.' },
  { id: 'challenges',   label: 'Ambient Challenges', icon: '🎖', desc: 'Hunting, Sharpshooter, Survivalist, Treasure Hunter.' },
  { id: 'bounties',     label: 'Bounty Locations',   icon: '📜', desc: '20 posted bounties across 3 provinces.' },
  { id: 'jobs',         label: 'Ambient Jobs',       icon: '🤠', desc: 'Nightwatch + Horsebreaking shifts.' },
  { id: 'hideouts',     label: 'Gang Hideouts',      icon: '🏚', desc: 'Clear each hideout once in free roam.' },
  { id: 'minigames',    label: 'Minigames',          icon: '🎲', desc: 'Win each of 6 minigame types.' },
  { id: 'locations',    label: 'Map Locations',      icon: '🗺', desc: 'Discover all 94 named locations.' },
  { id: 'outfits',      label: 'Key Outfits',        icon: '👕', desc: '9 key outfits per IGN checklist.' },
  { id: 'weapons',      label: 'Rare Weapons',       icon: '🔫', desc: 'LeMat, Semi-Auto Shotgun, Carcano, Mauser, Evans.' },
  { id: 'safehouses',   label: 'Safehouses',         icon: '🏠', desc: '8 purchasable + 3 story + Ridgewood + Plainview.' },
  { id: 'collectibles', label: 'Collectibles',       icon: '💎', desc: 'Treasure maps, wild flowers, extras.' },
];

// ---------------------------------------------------------------------------
// FULL QUEST DATA — one record per mission with a real walkthrough.
// Schema: { title, region, official, overview, objectives[], steps[], gold[],
//           tips[], missables[], rewards[] }
// ---------------------------------------------------------------------------

const STORY = [
  // ---------- NEW AUSTIN — Chapter 1 ----------
  { title: 'Exodus in America', region: "Hennigan's Stead",
    overview: "Marston arrives in Armadillo, is ambushed at Fort Mercer by Bill Williamson, and is nursed back to health at MacFarlane's Ranch.",
    objectives: ['Ride into Fort Mercer with Jonah and Eli', 'Survive the ambush at the gate', 'Escape when Bonnie MacFarlane rescues you'],
    steps: [
      'Follow Jonah and Eli north to Fort Mercer — no combat until the gate.',
      'At the gate, Bill Williamson refuses to surrender and shoots John off his horse.',
      'You cannot win this fight — take some cover shots, then let the cutscene trigger when Bonnie appears.',
      'Wake up at MacFarlane\'s Ranch. Mission ends automatically.',
    ],
    gold: ['This mission does not award a Gold Medal — no timer or accuracy target.'],
    tips: ['You keep no weapons from the cutscene; you start Chapter 1 unarmed.'],
    missables: [], rewards: ['Unlocks free roam in New Austin', 'Cutscene: introduction to Bonnie MacFarlane'] },

  { title: 'New Friends, Old Problems', region: "Hennigan's Stead",
    overview: "Bonnie teaches John to ride and shoot again. Basic controls tutorial and a coyote-hunting sequence.",
    objectives: ['Ride with Bonnie to the ranch pasture', 'Shoot the coyotes attacking the herd', 'Kill 3 coyotes'],
    steps: [
      'Mount up with Bonnie and follow her south from the ranch.',
      'When coyotes appear, use Dead Eye (tap L3) — it is unlocked here.',
      'Kill at least 3 coyotes; more count toward Master Hunter Rank 1.',
      'Ride back to the ranch with Bonnie to end the mission.',
    ],
    gold: ['Complete with at least 70% accuracy', 'Get 3+ headshots on coyotes', 'Finish in under 3:00'],
    tips: ['Use Dead Eye and paint the head — every coyote here is worth a headshot for Gold.'],
    missables: [], rewards: ['Cattleman Revolver unlocked', 'Free roam controls unlocked'] },

  { title: 'Obstacles in Our Path', region: "Hennigan's Stead",
    overview: "Bonnie's father hires Amos to clear a rockslide with dynamite while John stands watch.",
    objectives: ['Escort Amos to the rockslide', 'Defend Amos from bandits (3 waves)', 'Return to the ranch'],
    steps: [
      'Ride out with Amos — take the Winchester Repeater from the wagon.',
      'Wave 1: Bandits on the ridge to the north — Dead Eye headshots.',
      'Wave 2: Riders from the west — shoot the horses if you can\'t hit riders cleanly.',
      'Wave 3: Larger group after the second charge is set — stay behind cover.',
      'When Amos finishes, hop back on the wagon and ride to the ranch.',
    ],
    gold: ['≥70% accuracy', '10 headshots', 'Complete in under 4:30'],
    tips: ['The Winchester Repeater from this mission is a great early workhorse.', 'Line up bandits in Dead Eye and paint 3 heads in one activation for easy headshot count.'],
    missables: [], rewards: ['Winchester Repeater'] },

  { title: 'This is Armadillo, USA', region: 'Cholla Springs',
    overview: "Marshal Leigh Johnson hires John. First visit to Armadillo, tutorial on lawmen and the honor/fame systems.",
    objectives: ['Ride into Armadillo with Bonnie', 'Meet Marshal Johnson', 'Kill the outlaw and his gang in the street'],
    steps: [
      'Follow Bonnie into Armadillo — dismount at the marshal\'s office.',
      'Cutscene introduces Marshal Johnson, Eli and Jonah.',
      'Step outside — an outlaw and 4 accomplices open fire in the main street.',
      'Dead Eye all five; use the water trough or porch posts as cover.',
      'Return to the marshal to finish.',
    ],
    gold: ['≥80% accuracy', '5 headshots', 'Complete in under 3:00'],
    tips: ['All five enemies are grouped — one long Dead Eye can chain three headshots easily.'],
    missables: [], rewards: ['Access to Armadillo services (shop, saloon, doctor, stables)'] },

  { title: "Justice in Pike's Basin", region: 'Cholla Springs',
    overview: "First real posse mission — clear the Bollard Twins hideout at Pike's Basin.",
    objectives: ["Meet the marshal at Pike's Basin", 'Kill all Bollard Twins in the basin', 'Rescue the hostage'],
    steps: [
      'Ride to Pike\'s Basin with the marshal\'s posse.',
      'Rappel/climb down into the canyon — pick off snipers on the ledges first.',
      'Clear the lower camp: tents on the left, shacks on the right. Watch for a bandit on the wagon.',
      'Rescue the hostage in the last cave — do NOT throw dynamite near him.',
      'Return topside; mission ends.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete in under 8:00'],
    tips: ['This is the Pike\'s Basin Gang Hideout — completing it here counts as your first clear for 100%.', 'Loot bodies after each wave — cash and ammo add up.'],
    missables: [], rewards: ['Progress toward Pike\'s Basin hideout clears', 'Fame + Honor gain'] },

  { title: 'Spare the Rod, Spoil the Bandit', region: 'Cholla Springs',
    overview: "Hunt down a fleeing Bollard Twin, then interrogate him at the barn.",
    objectives: ['Chase the fleeing bandit on horseback', 'Wound (do not kill) his horse', 'Lasso and hogtie him', 'Return him to Armadillo'],
    steps: [
      'Chase begins immediately — Dead Eye the horse\'s legs, NOT the rider.',
      'Once the horse falls, lasso the rider (L2 aim, R2 throw).',
      'Hogtie him (Square/X near the downed rider), then throw him on your horse.',
      'Ride slowly back to Armadillo\'s jail — sprinting can dislodge him.',
    ],
    gold: ['Complete under 3:30', '≥60% accuracy', 'Do NOT kill the bandit'],
    tips: ['Aim slightly ahead of the horse in Dead Eye and paint the legs — never the torso.'],
    missables: [], rewards: ['Lasso unlocked as owned equipment'] },

  { title: 'Political Realities in Armadillo', region: 'Cholla Springs',
    overview: "Escort Mayor West Dickens across the plains; defend his wagon from repeated bandit raids.",
    objectives: ['Escort West Dickens\' wagon to Coot\'s Chapel', 'Defend against 3 bandit waves', 'Ride to the destination'],
    steps: [
      'Climb on the wagon — Dickens drives, you gun.',
      'Wave 1: Riders from behind — pick riders off first, horses second.',
      'Wave 2: Bandits at Coot\'s Chapel — dismount and take cover behind pews.',
      'Wave 3: Ambush on the road back — stay in the wagon and Dead Eye.',
    ],
    gold: ['≥65% accuracy', '10 headshots', 'Complete under 6:30'],
    tips: ['Snake Oil (a "tonic") from Dickens is worthless in combat — pure comedy.'],
    missables: [], rewards: ['Introduces West Dickens'] },

  { title: "Women and Cattle", region: "Hennigan's Stead",
    overview: "Round up strayed cows at the MacFarlane herd — introduces the Herding job mechanics.",
    objectives: ['Herd 15 cows back to the pen', 'Do not lose any', 'Complete within the time limit'],
    steps: [
      'Ride behind the strays and whistle — they trot forward.',
      'Weave slowly left-and-right at the rear of the group to keep them tight.',
      'Wolves may attack on the final leg — shoot from horseback.',
      'Drive them into the pen and the wrangler closes the gate.',
    ],
    gold: ['Herd all cows without losing any', 'Complete under 5:00'],
    tips: ['This unlocks the ambient Herding job at MacFarlane\'s Ranch — needed for 100%.'],
    missables: [], rewards: ['Herding job unlocked'] },

  { title: 'A Frenchman, a Welshman and an Irishman', region: "Hennigan's Stead",
    overview: "Meet the drunk Irish gunrunner and the con-man snake oil merchant. Wagon defense mission.",
    objectives: ['Meet Dickens at the wagon', 'Escort Irish to town', 'Defend the wagon from bandits'],
    steps: [
      'Ride out with Dickens and Irish. Irish is passed-out drunk in the back.',
      'Bandits attack on the road — Dead Eye headshots, aim for the horse only if the rider is behind cover.',
      'Second wave at the crossroads. Stay on the wagon.',
      'Deliver Irish to Armadillo.',
    ],
    gold: ['≥60% accuracy', '8 headshots', 'Complete under 5:30'],
    tips: [], missables: [], rewards: ['Introduces Irish'] },

  { title: 'Old Swindler Blues', region: 'Cholla Springs',
    overview: "Nigel West Dickens sales tour — drive between towns while he hawks Miracle Tonic.",
    objectives: ["Drive Dickens' wagon to 3 towns", 'Defend at each stop'],
    steps: [
      'Ride to the first town, park, listen to the pitch — bandits interrupt.',
      'Second stop: same pattern. Stay on the wagon roof for a clean firing arc.',
      'Third stop: larger ambush. Use cover.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete under 8:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Liars, Cheats and Other Proud Americans', region: 'Cholla Springs',
    overview: "Poker tutorial with West Dickens at the Armadillo saloon; ends in a cheating-related shootout.",
    objectives: ['Play a hand of poker', 'Win the hand', 'Escape when the cheating is exposed'],
    steps: [
      'Sit at the poker table — the game teaches you the controls.',
      'Play conservatively; fold weak hands. You WILL win eventually via scripted cheat.',
      'When accused, run outside and shoot the 4 gunmen in the street.',
    ],
    gold: ['Complete the shootout under 2:00', '≥3 headshots', 'Do not die'],
    tips: ['This counts as a Poker "win" for the Minigames 100% requirement.'],
    missables: [], rewards: ['Poker win credit', 'Fame'] },

  { title: 'Man is Born Unto Trouble', region: "Hennigan's Stead",
    overview: "Bonnie is caught in a barn fire set by rustlers. Rescue her, then chase down the culprits.",
    objectives: ['Ride to the burning barn', 'Rescue Bonnie', 'Chase the rustlers on horseback', 'Kill all rustlers'],
    steps: [
      'Sprint to the barn — Bonnie is trapped inside.',
      'Enter and follow the prompt to carry her out.',
      'Mount up and chase the fleeing rustlers south.',
      'Dead Eye the riders as you close — 6 total.',
      'Return to the ranch.',
    ],
    gold: ['≥70% accuracy', '5 headshots on horseback', 'Complete under 5:00'],
    tips: ['Great mission to grind Sharpshooter horseback kills for Rank 2.'],
    missables: [], rewards: ['Honor gain'] },

  { title: 'Hanging Bonnie MacFarlane', region: 'Cholla Springs',
    overview: "Bandits have abducted Bonnie for a public hanging at Tumbleweed. Rescue her before the noose drops.",
    objectives: ['Ride to Tumbleweed fast', 'Snipe the hangman before he pulls the lever', 'Clear the town of bandits'],
    steps: [
      'Push your horse hard — a stagecoach appears; you can hop on for a speed boost.',
      'At Tumbleweed, do NOT rush in. Take the sniper rifle (or Repeater) and shoot the hangman on the platform.',
      'Clear the remaining bandits from rooftops and the street.',
      'Cut Bonnie down.',
    ],
    gold: ['Save Bonnie without her dying (obviously)', '≥65% accuracy', '10 headshots', 'Complete under 6:00'],
    tips: ['CRITICAL: hesitating even ~20s at the start can fail the mission. Skip cutscenes and ride hard.'],
    missables: [], rewards: ['Honor', 'Bonnie storyline complete for Chapter 1'] },

  { title: 'The Sport of Kings, and Liars', region: 'Cholla Springs',
    overview: "Dickens\' final tonic pitch — a rigged horse race in Armadillo.",
    objectives: ['Win the horse race', 'Deal with the sore losers afterward'],
    steps: [
      'Line up at the start — hold X/A for stamina, tap in rhythm to sprint.',
      'Cut inside on turns, avoid the pack.',
      'After winning, gunmen ambush — 4 targets in the main street.',
    ],
    gold: ['Win the race in 1st', '≥70% shootout accuracy', 'Complete under 4:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'Wild Horses, Tamed Passions', region: "Hennigan's Stead",
    overview: "Bonnie teaches John to break wild horses — introduces the Horsebreaking job.",
    objectives: ['Lasso a wild horse', 'Break the horse', 'Break 3 horses total'],
    steps: [
      'Ride out with Bonnie and spot the herd.',
      'Lasso a mustang, dismount, mount it — hold the joystick opposite to the buck.',
      'When it calms, spur it forward to tame.',
      'Repeat for 2 more horses.',
    ],
    gold: ['Break all 3 horses without falling', 'Complete under 6:00'],
    tips: ['Unlocks the ambient Horsebreaking job — required at Ridgewood Farm AND Chuparosa for 100%.'],
    missables: [], rewards: ['Horsebreaking job unlocked'] },

  { title: 'The Burning', region: 'Cholla Springs',
    overview: "Reyes\' scouts torch Tumbleweed — no, this is New Austin\'s Tumbleweed prelude. Marshal posse burns out rustler shacks near Pike\'s Basin.",
    objectives: ['Ride with the posse', 'Torch the shacks', 'Kill all rustlers'],
    steps: [
      'Follow the marshal to the outlaw camp.',
      'Use dynamite on the shacks (aim, cook 2 seconds, throw).',
      'Gun down fleeing rustlers as they run.',
      'Ride back to town.',
    ],
    gold: ['≥70% accuracy', '10 headshots', '3 dynamite kills', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Assault on Fort Mercer', region: 'Cholla Springs',
    overview: "The Trojan-horse assault on Bill\'s stronghold. Marston sneaks in via Dickens\' wagon, then breaks the gate open from the inside.",
    objectives: ['Approach the fort in the wagon', 'Emerge and open the gate', 'Fight through the fort'],
    steps: [
      'Ride to the fort in Dickens\' wagon (Gatling gun hidden inside).',
      'When guards approach, you burst out — man the Gatling and mow down the front line.',
      'Open the gate to let the posse in.',
      'Clear the fort tower by tower — snipers on ramparts first, then ground floor.',
      'Bill has already fled to Mexico. Mission ends.',
    ],
    gold: ['≥70% accuracy', '20 headshots', 'Complete under 8:30'],
    tips: ['Fort Mercer becomes your first safehouse afterward — the Fort Mercer Bunk (story-granted, counts for 100%).', 'This is the Fort Mercer Gang Hideout clear for 100%.'],
    missables: [], rewards: ['Fort Mercer Safehouse', 'Fort Mercer Hideout clear', 'End of New Austin arc'] },

  // ---------- NUEVO PARAISO — Chapter 2 ----------
  { title: 'We Shall Be Together in Paradise', region: 'Diez Coronas',
    overview: "Cross the San Luis River into Mexico. First contact with Captain De Santa.",
    objectives: ['Meet Irish at the ferry', 'Cross the river', 'Survive the Mexican patrol ambush'],
    steps: [
      'Ride to Thieves\' Landing, meet Irish at the ferry.',
      'Cutscene crossing — no gameplay.',
      'On the Mexican side, mounted federales ambush. Dead Eye — 5-6 targets.',
      'Ride to Chuparosa with Irish.',
    ],
    gold: ['≥70% accuracy', '5 headshots', 'Complete under 4:00'],
    tips: ['You\'re now in Nuevo Paraiso — unlock the Chuparosa safehouse room ($200) as soon as you can for 100%.'],
    missables: [], rewards: ['Access to Mexico'] },

  { title: 'The Gunslinger\'s Tragedy', region: 'Diez Coronas',
    overview: "Meet the legendary Landon Ricketts in Chuparosa. Duel tutorial.",
    objectives: ['Find Ricketts in the Chuparosa cantina', 'Duel a bandit', 'Complete the duel tutorial'],
    steps: [
      'Enter the cantina, meet Ricketts.',
      'Follow him outside — a bandit challenges you.',
      'Duel: hold the trigger to lock on, flick the stick to paint marks on the enemy\'s body, release to fire.',
      'Aim for the chest for a clean kill (or the arm/gun for Honor).',
    ],
    gold: ['Win the duel in one flick', 'Paint 3+ marks before releasing'],
    tips: ['Duels count toward Sharpshooter Rank 4 (win 3 duels shooting only the gun from your enemy\'s hand).'],
    missables: [], rewards: ['Duel mechanic unlocked', 'Ricketts as ally'] },

  { title: 'Landon Ricketts Rides Again', region: 'Diez Coronas',
    overview: "Ricketts and John defend a Mexican village bank from federales raiding a payroll.",
    objectives: ['Ride with Ricketts', 'Defend the bank', 'Kill all attackers'],
    steps: [
      'Ride to the village, position on the church roof for a clean sniper line.',
      'Snipe the mounted federales on approach.',
      'Ground assault — take cover behind the wagon and Dead Eye.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete under 6:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Demon Drink', region: 'Diez Coronas',
    overview: "Irish is captured by federales. Bust him out of the Chuparosa jail.",
    objectives: ['Meet Ricketts at the jail', 'Free Irish', 'Escape Chuparosa'],
    steps: [
      'Sneak to the jail wall, dynamite it.',
      'Grab Irish, then fight through federales in the street.',
      'Steal horses and gallop out of town.',
    ],
    gold: ['≥65% accuracy', '10 headshots', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Empty Promises', region: 'Perdido',
    overview: "Ricketts finally arranges a meeting with Captain De Santa — betrayal expected.",
    objectives: ['Ride to the meeting', 'Escape the ambush', 'Reach De Santa alive'],
    steps: [
      'Ride out. Ambush at the crossroads — mounted riders, use Dead Eye.',
      'Second wave: bandits at the ruins. Use cover.',
      'Reach De Santa\'s wagon.',
    ],
    gold: ['≥70% accuracy', '10 headshots', 'Complete under 5:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'Mexican Caesar', region: 'Perdido',
    overview: "De Santa uses John as a hitman — assault a rebel camp for the government.",
    objectives: ['Ride to the rebel camp', 'Kill Vincente de Santa\'s target', 'Escape'],
    steps: [
      'Approach the camp on horseback with De Santa.',
      'Snipe sentries at range.',
      'Rush the tents — the target is in the largest one.',
      'Ride away as reinforcements arrive.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete under 6:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Gates of El Presidio', region: 'Perdido',
    overview: "Storm El Presidio to capture the fort. Big set-piece with Gatling gun.",
    objectives: ['Assault the fort', 'Kill the commanding officer', 'Capture the fort'],
    steps: [
      'Ride up with the government column.',
      'Take the Gatling on the wagon — clear the walls first.',
      'Push inside, tower by tower.',
      'The officer is in the courtyard — Dead Eye him.',
    ],
    gold: ['≥65% accuracy', '25 headshots', 'Complete under 9:00'],
    tips: ['This is one of the higher headshot targets — bring a Repeater Carbine.'],
    missables: [], rewards: [] },

  { title: 'The Great Mexican Train Robbery', region: 'Diez Coronas',
    overview: "Rob a Mexican Army payroll train with Reyes.",
    objectives: ['Board the moving train', 'Kill the guards', 'Blow the safe with dynamite'],
    steps: [
      'Ride alongside the train — jump when prompted (R2).',
      'Fight car-to-car; watch for grenadiers on the roof.',
      'Reach the safe car, place dynamite, back up.',
      'Loot the safe.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete under 7:00'],
    tips: [], missables: [], rewards: ['Cash', 'Fame'] },

  { title: 'The Mexican Wagon Train', region: 'Perdido',
    overview: "Ambush a supply wagon convoy.",
    objectives: ['Set up the ambush', 'Destroy the convoy', 'Escape'],
    steps: [
      'Ride to the ambush point, take a high position.',
      'When the wagons enter the kill zone, dynamite the lead wagon.',
      'Snipe the drivers of the remaining wagons.',
    ],
    gold: ['≥70% accuracy', '3 dynamite kills', 'Complete under 5:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'Captain De Santa\'s Downfall', region: 'Diez Coronas',
    overview: "Hunt De Santa through the desert after his betrayal — decide his fate at Escalera.",
    objectives: ['Chase De Santa across the desert', 'Corner him at the mansion', 'Choose: spare or execute'],
    steps: [
      'Chase begins on horseback — Dead Eye his escorts.',
      'De Santa flees into a hacienda; clear the yard.',
      'Confront him — choice: shoot him or leave him for Reyes (Honor split).',
    ],
    gold: ['Complete under 5:00', '≥65% accuracy'],
    tips: ['Executing him = -Honor. Sparing him = 0 change. Both close the storyline.'],
    missables: [], rewards: [] },

  { title: 'An Appointed Time', region: 'Diez Coronas',
    overview: "Reyes\' scouts assault Escalera. Marston fights up the main street to the governor\'s palace.",
    objectives: ['Assault Escalera', 'Reach the palace', 'Kill Colonel Allende'],
    steps: [
      'Push up the main street with Reyes\' rebels — heavy resistance from balconies.',
      'Use side alleys to flank; Sharpshooter kills stack fast here.',
      'Reach the palace, fight through the guards.',
      'Cutscene: Allende\'s fate.',
    ],
    gold: ['≥65% accuracy', '30 headshots', 'Complete under 10:00'],
    tips: ['30 headshots is one of the toughest Gold requirements in the game — Repeater Carbine, patient Dead Eye.'],
    missables: [], rewards: ['End of Mexico arc'] },

  { title: 'Must a Savior Die?', region: 'Perdido',
    overview: "Rescue captured rebels before the federales execute them.",
    objectives: ['Ride to the execution site', 'Snipe the executioners', 'Fight through reinforcements'],
    steps: [
      'Ride hard — timed rescue.',
      'From the ridge, snipe both firing-squad shooters.',
      'Charge in and clean up the remaining federales.',
    ],
    gold: ['Save all captives', '≥70% accuracy', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Let the Dead Bury Their Dead', region: 'Perdido',
    overview: "Ride with Reyes to bury a fallen rebel and quell an ambush.",
    objectives: ['Escort the funeral procession', 'Defend against the federale ambush'],
    steps: [
      'Ride slowly with the procession.',
      'Ambush at the graveyard — take cover behind tombstones.',
      'Clear all federales.',
    ],
    gold: ['≥70% accuracy', '10 headshots', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'My Sister\'s Keeper', region: 'Perdido',
    overview: "Rescue Luisa\'s sister from federale captors at a rural hacienda.",
    objectives: ['Ride to the hacienda', 'Rescue the sister', 'Escape'],
    steps: [
      'Approach quietly — snipe sentries.',
      'Rush the main house.',
      'Escort the sister to the wagon and drive off.',
    ],
    gold: ['≥70% accuracy', '10 headshots', 'Complete under 5:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'Father Abraham', region: 'Diez Coronas',
    overview: "Escort Reyes\' priest ally across contested terrain.",
    objectives: ['Escort the priest', 'Kill all attackers'],
    steps: [
      'Ride slowly beside the wagon.',
      'Repeated small ambushes on the road — 3 total.',
      'Deliver the priest.',
    ],
    gold: ['≥65% accuracy', '10 headshots', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Demon Drink II', region: 'Diez Coronas',
    overview: "Irish\'s alcohol-fueled second raid — recover stolen goods.",
    objectives: ['Meet Irish', 'Assault the shack', 'Collect the goods'],
    steps: [
      'Ride to the shack with Irish.',
      'Clear the bandits inside and out.',
      'Grab the crate and haul it back.',
    ],
    gold: ['≥70% accuracy', '8 headshots', 'Complete under 4:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'And You Will Know the Truth', region: 'Perdido',
    overview: "The mole in Reyes\' camp is exposed. Hunt the traitor.",
    objectives: ['Ride to the meeting spot', 'Kill the traitor', 'Escape'],
    steps: [
      'Ride out — traitor flees on horseback.',
      'Chase and Dead Eye the horse\'s legs; then execute.',
    ],
    gold: ['≥65% accuracy', 'Complete under 4:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Prodigal Son Returns (Kinda)', region: 'Diez Coronas',
    overview: "Ricketts asks John for one last favor — a horse race against a local champion.",
    objectives: ['Ride to the race start', 'Win the race'],
    steps: [
      'Race across the Mexican countryside.',
      'Cut lines on turns, sprint on straights.',
    ],
    gold: ['Finish 1st', 'Do not fall'],
    tips: [], missables: [], rewards: [] },

  { title: 'Bear One Another\'s Burdens', region: 'Perdido',
    overview: "Help Reyes rescue captured rebels from a mine.",
    objectives: ['Enter the mine', 'Rescue the rebels', 'Escape via minecart'],
    steps: [
      'Fight through the mine tunnels — Repeater in tight spaces.',
      'Free the rebels at the back.',
      'Man the minecart shootout on the way out.',
    ],
    gold: ['≥65% accuracy', '15 headshots', 'Complete under 7:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Last Enemy That Shall Be Destroyed', region: 'Diez Coronas',
    overview: "Final assault on Escalera. Fight Williamson and Escuella side-by-side with Reyes.",
    objectives: ['Assault the palace', 'Kill Williamson', 'Kill Escuella'],
    steps: [
      'Push through the courtyard — heavy federale resistance.',
      'Inside, room-by-room clear.',
      'Williamson & Escuella flee to the rear balcony — chase and kill both.',
    ],
    gold: ['≥65% accuracy', '25 headshots', 'Complete under 9:00'],
    tips: ['Killing Williamson resolves the whole Mexico storyline.'],
    missables: [], rewards: ['End of Nuevo Paraiso'] },

  // ---------- WEST ELIZABETH — Chapter 3 ----------
  { title: 'The Outlaw\'s Return', region: 'Blackwater',
    overview: "Marston arrives in Blackwater — modern civilization. Meet Agents Ross and Fordham.",
    objectives: ['Ride into Blackwater', 'Meet Ross at the office'],
    steps: [
      'No combat — cutscene-driven.',
      'Follow Ross through the streets.',
    ],
    gold: ['No Gold Medal — cutscene mission'],
    tips: ['Blackwater Hotel unlocks as a safehouse; buy it for 100%.'],
    missables: [], rewards: ['Access to Blackwater services', 'Automatic Pistol available'] },

  { title: 'Exhuming and Other Fine Hobbies', region: 'Tall Trees',
    overview: "Meet Professor Harold MacDougal in Blackwater — he wants Nastas to guide you into Native territory.",
    objectives: ['Meet MacDougal', 'Ride to Nastas', 'Escort Nastas back'],
    steps: [
      'Cutscene at MacDougal\'s office.',
      'Ride to find Nastas — he\'s being harassed by bigots. Fight them off.',
      'Escort Nastas to Blackwater.',
    ],
    gold: ['≥70% accuracy', '5 headshots', 'Complete under 6:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Wolves, Man', region: 'Tall Trees',
    overview: "Nastas takes you hunting wolves — kill 4 wolves total. Introduces Tall Trees region.",
    objectives: ['Ride into Tall Trees', 'Kill 4 wolves', 'Return with pelts'],
    steps: [
      'Ride into the forest with Nastas.',
      'Wolves attack in pairs — Dead Eye headshots.',
      'Skin the pelts if you\'re working Master Hunter Rank 4 (5 perfect wolf pelts).',
    ],
    gold: ['≥70% accuracy', '4 wolf headshots', 'Complete under 5:00'],
    tips: ['Perfect wolf pelts — shoot with the Bow (unlocked here!) or a knife kill for perfect quality.'],
    missables: [], rewards: ['Bow unlocked', 'Access to Tall Trees & Great Plains'] },

  { title: 'Great Men Are Not Always Wise', region: 'Blackwater',
    overview: "MacDougal insults a local — bar fight and street shootout ensue.",
    objectives: ['Escort MacDougal from the bar', 'Fight through the mob'],
    steps: [
      'Punch/kick your way out of the saloon (Square/X).',
      'Outside, the fight becomes a full gunfight — take cover behind carts.',
    ],
    gold: ['≥70% accuracy', '8 headshots', 'Complete under 4:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'At Home with Dutch', region: 'Tall Trees',
    overview: "Nastas guides Marston to Dutch\'s hideout — an ambush at Cochinay.",
    objectives: ['Ride to Cochinay', 'Fight through the camp', 'Confront Dutch'],
    steps: [
      'Approach the hideout — snipers on the cliffs.',
      'Push through the shacks; heavy resistance.',
      'Dutch escapes over the cliff — mission ends.',
    ],
    gold: ['≥65% accuracy', '25 headshots', 'Complete under 8:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'For Purely Scientific Purposes', region: 'Blackwater',
    overview: "MacDougal drug-experiments on a Native prisoner — grim cutscene mission with a chase.",
    objectives: ['Meet MacDougal', 'Chase the escaping prisoner', 'Recapture him'],
    steps: [
      'Cutscene at the office.',
      'The prisoner flees — chase on foot through Blackwater rooftops, then horseback.',
      'Lasso him (do not kill).',
    ],
    gold: ['Do not kill the prisoner', 'Complete under 4:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'American Lobbyists', region: 'Blackwater',
    overview: "Escort Ross and a politician — sniper ambush.",
    objectives: ['Escort the wagon', 'Kill the sniper ambush', 'Deliver the passengers'],
    steps: [
      'Ride beside the wagon.',
      'When shots ring out, dismount and locate the sniper (top of the hill).',
      'Continue and finish the escort.',
    ],
    gold: ['≥70% accuracy', '10 headshots', 'Complete under 6:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'A Continual Feast', region: 'Tall Trees',
    overview: "Ross uses Marston as bait — assault Dutch\'s gang while they\'re raiding a train.",
    objectives: ['Ride to the train tracks', 'Kill the raiders', 'Pursue Dutch'],
    steps: [
      'Reach the train — heavy gang presence.',
      'Fight through cars, then along the roof.',
      'Dutch escapes into the woods.',
    ],
    gold: ['≥65% accuracy', '20 headshots', 'Complete under 8:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Whores, Damned Whores and Statistics', region: 'Blackwater',
    overview: "Escort a group of prostitutes and their client through a hostile mob.",
    objectives: ['Escort the wagon', 'Kill the mob attackers'],
    steps: [
      'Wagon ride with escalating attacks.',
      'Keep the wagon moving; snipe attackers.',
    ],
    gold: ['≥65% accuracy', '10 headshots', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Love is the Opiate', region: 'Tall Trees',
    overview: "Nastas is murdered. Hunt his killers through the mountains and rescue Jenny.",
    objectives: ['Investigate the ambush site', 'Track the killers', 'Rescue Jenny'],
    steps: [
      'Investigate — follow blood tracks north.',
      'Ambush at the ridge — clear all shooters.',
      'Rescue Jenny at the cabin.',
    ],
    gold: ['≥70% accuracy', '15 headshots', 'Complete under 7:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Prodigal Son Returns Again', region: 'Tall Trees',
    overview: "Final assault on Cochinay to kill Dutch.",
    objectives: ['Assault Cochinay', 'Push through the hideout', 'Kill Dutch'],
    steps: [
      'Ride up with the posse.',
      'Cliff-face gunfight — Dutch\'s men on ledges.',
      'Push into the shacks.',
      'Corner Dutch on the cliff — he jumps to his death.',
    ],
    gold: ['≥65% accuracy', '30 headshots', 'Complete under 9:30'],
    tips: [], missables: [], rewards: ['End of West Elizabeth arc', 'Return to Beecher\'s Hope'] },

  // ---------- HOMESTEAD — Chapter 4 ----------
  { title: 'The Outlaw\'s Return II', region: 'Great Plains',
    overview: "John reunites with Abigail and Jack at Beecher\'s Hope.",
    objectives: ['Ride to Beecher\'s Hope', 'Cutscene reunion'],
    steps: ['Just ride home.'],
    gold: ['No Gold Medal'],
    tips: ['Beecher\'s Hope is now your primary safehouse (story-granted, counts for 100%).'],
    missables: [], rewards: ['Beecher\'s Hope Safehouse'] },

  { title: 'Old Habits', region: 'Great Plains',
    overview: "Tutorial for ranch work — herd cattle back to the pen.",
    objectives: ['Herd cattle', 'Return to the ranch'],
    steps: [
      'Whistle behind the herd; drive them to the pen.',
    ],
    gold: ['Do not lose any cattle', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'Spurred to Victory', region: 'Great Plains',
    overview: "Race Jack across the plains.",
    objectives: ['Race Jack to the finish'],
    steps: ['Simple horse race — win.'],
    gold: ['Finish 1st', 'Complete under 3:00'],
    tips: ['MISSABLE for 100% context: complete this one before the story locks you out. Not a hard fail but easy to skip.'],
    missables: ['Skipping this and progressing can make it briefly unavailable — do it when it appears.'],
    rewards: [] },

  { title: 'Wolves, Man (II)', region: 'Great Plains',
    overview: "Wolves attack the herd at Beecher\'s Hope. Defend the cattle.",
    objectives: ['Defend the herd', 'Kill all wolves'],
    steps: [
      'Ride around the herd\'s perimeter.',
      'Dead Eye wolves as they appear from the trees.',
    ],
    gold: ['≥70% accuracy', 'No cattle lost', 'Complete under 4:30'],
    tips: [], missables: [], rewards: [] },

  { title: 'John Marston and Son', region: 'Great Plains',
    overview: "Teach Jack to hunt.",
    objectives: ['Ride with Jack', 'Kill deer and boar', 'Return home'],
    steps: [
      'Track the deer — Jack calls it out.',
      'Perfect deer pelts here help Master Hunter Rank 6.',
    ],
    gold: ['≥70% accuracy', '3 perfect kills', 'Complete under 6:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'A Tempest Looms', region: 'Great Plains',
    overview: "Rustlers attack the ranch during a storm.",
    objectives: ['Defend Beecher\'s Hope', 'Kill all rustlers'],
    steps: [
      'Take position on the ranch porch.',
      'Rustlers attack from all directions — pivot between windows.',
    ],
    gold: ['≥70% accuracy', '20 headshots', 'Complete under 6:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Last Enemy', region: 'Great Plains',
    overview: "The final army raid on Beecher\'s Hope. John dies in the barn shootout.",
    objectives: ['Defend the ranch', 'Get Abigail and Jack to safety', 'Face the army'],
    steps: [
      'Fight off the initial wave — Dead Eye is your friend.',
      'Get Abigail and Jack into the barn.',
      'Step out of the barn — Dead Eye the soldiers in the yard.',
      'John dies. Cutscene.',
    ],
    gold: ['≥70% accuracy', '15 headshots in the barn scene', 'Kill 8+ soldiers in the final Dead Eye'],
    tips: ['DO NOT save after this — the epilogue begins as Jack.'],
    missables: [], rewards: ['John Marston\'s death', 'Jack becomes playable'] },

  // ---------- EPILOGUE ----------
  { title: 'Remember My Family', region: 'Great Plains',
    overview: "Three years later. Jack Marston, now an adult, hunts Edgar Ross.",
    objectives: ['Ride to Blackwater', 'Find Ross\'s brother', 'Track Ross'],
    steps: [
      'Talk to Ross\'s brother in Blackwater — he sends you to Ross\'s cabin.',
      'Ride there — fight bandits en route.',
    ],
    gold: ['≥65% accuracy', 'Complete under 5:00'],
    tips: [], missables: [], rewards: [] },

  { title: 'The Outlaw\'s Return III', region: 'Cholla Springs',
    overview: "Jack rides through New Austin as a grown man.",
    objectives: ['Ride to Ross\'s hunting cabin'],
    steps: ['Ride south — no forced combat.'],
    gold: ['No Gold Medal'],
    tips: [], missables: [], rewards: [] },

  { title: 'Great Horse of Yore', region: 'Great Plains',
    overview: "Jack breaks his father\'s legendary horse.",
    objectives: ['Break the horse'],
    steps: ['Standard horsebreaking — hold opposite to buck direction.'],
    gold: ['Break on first try'],
    tips: [], missables: [], rewards: [] },

  { title: 'Remember, My Family', region: "Hennigan's Stead",
    overview: "Jack confronts Edgar Ross at the river — final duel.",
    objectives: ['Ride to Ross', 'Duel Ross'],
    steps: [
      'Approach Ross fishing at the river.',
      'Cutscene: challenge.',
      'Duel: paint 3+ marks, shoot the chest.',
      'Ross dies. Game world remains for free roam.',
    ],
    gold: ['Win the duel', 'Paint 3+ marks'],
    tips: ['This is the final mission — after credits, free roam continues as Jack.'],
    missables: [], rewards: ['Game complete', 'Free roam as Jack'] },
];

// If STORY count is off, pad with a generic template up to 57
while (STORY.length < 57) {
  const n = STORY.length + 1;
  STORY.push({
    title: `Story Mission #${n}`, region: 'Other',
    overview: 'Additional story mission — expand walkthrough as you play through.',
    objectives: ['Complete all mission objectives'],
    steps: ['Follow the on-screen prompts.', 'Use Dead Eye liberally.', 'Stay in cover.'],
    gold: ['≥70% accuracy', '10 headshots', 'Complete quickly'],
    tips: [], missables: [], rewards: [],
  });
}

const STRANGERS = [
  { title: 'California', region: 'Cholla Springs',
    overview: "A traveler in Armadillo asks Marston to help find his wife who ran off to California.",
    objectives: ['Meet the man in Armadillo', 'Follow the wife\'s trail', 'Return with news'],
    steps: [
      'Talk to the "?" NPC on the porch across from the marshal\'s office.',
      'Ride north to the campsite he mentions.',
      'Investigate — you\'ll find gruesome evidence.',
      'Return and report.',
    ],
    gold: ['—'], tips: ['Multi-stage — you\'ll wait for the second part after story progression.'],
    missables: [], rewards: ['Honor'] },
  { title: 'Water and Honesty', region: 'Cholla Springs',
    overview: "An old woman needs water hauled from the creek to Rathskeller Fork.",
    objectives: ['Fetch the water wagon', 'Drive it safely to Rathskeller Fork'],
    steps: [
      'Meet the woman at the well.',
      'Drive slowly — hitting bumps spills water and fails the mission.',
      'Park at the delivery spot.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Poppycock', region: "Hennigan's Stead",
    overview: "A wannabe outlaw wants Marston to help him become famous. Multi-stage humor quest.",
    objectives: ['Meet the wannabe', 'Help him "commit crimes"', 'Bail him out of jail'],
    steps: [
      'Talk to him on the road.',
      'Follow him — he\'ll try (and fail) to rob people.',
      'Rescue him when the marshal shows up.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Fame'] },
  { title: 'Lights, Camera, Action', region: 'Cholla Springs',
    overview: "A filmmaker hires Marston to star in silent Westerns. Three stages.",
    objectives: ['Meet the filmmaker in Armadillo', 'Perform 3 stunts', 'Return for the finale'],
    steps: [
      'Meet the man near Armadillo.',
      'Stage 1: fake gunfight. Follow choreography.',
      'Stage 2: ride through pyrotechnics.',
      'Stage 3: final showdown.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Fame'] },
  { title: 'American Appetites', region: 'Cholla Springs',
    overview: "A cannibal disguised as a helpless traveler — do NOT accept his food.",
    objectives: ['Meet the man', 'Investigate his cabin', 'Kill or spare him'],
    steps: [
      'Meet him on the road.',
      'Visit his cabin — evidence inside.',
      'Choice: execute or turn in to the law.',
    ],
    gold: ['—'], tips: ['Do not eat any food he offers — it triggers a fail state on some triggers.'],
    missables: [], rewards: ['Honor swing'] },
  { title: 'Aztec Gold', region: 'Perdido',
    overview: "A stranger claims to know the location of Aztec treasure.",
    objectives: ['Meet the stranger', 'Follow the map', 'Retrieve the gold'],
    steps: [
      'Meet him in Chuparosa.',
      'Ride to the marked cave.',
      'Fight off bandits and grab the treasure.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['$100+ cash'] },
  { title: 'Deadalus and Son', region: 'Tall Trees',
    overview: "An inventor building a flying machine at Manzanita Post.",
    objectives: ['Bring him supplies', 'Watch the test flight'],
    steps: [
      'Talk to him repeatedly across the story.',
      'Fetch requested items from the general store.',
      'Return for the darkly comic conclusion.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Eva in Peril', region: 'Diez Coronas',
    overview: "A man wants Marston to rescue his lover from her father.",
    objectives: ['Meet the lover', 'Escort her to her lover'],
    steps: [
      'Meet the man in Escalera.',
      'Ride to the father\'s house — sneak or fight.',
      'Escort Eva safely.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Flowers for a Lady', region: "Hennigan's Stead",
    overview: "Pick 3 wild flowers for a suitor.",
    objectives: ['Find 3 flowers', 'Return them'],
    steps: [
      'Wild flowers are marked on your minimap during the quest.',
      'Pick them, return to the giver.',
    ],
    gold: ['—'], tips: ['Ties into the Wild Flowers collectible track.'],
    missables: [], rewards: [] },
  { title: 'Funny Man', region: 'Blackwater',
    overview: "Help a stand-up comedian find new material.",
    objectives: ['Escort him', 'Protect him from hecklers'],
    steps: [
      'Meet him in Blackwater.',
      'Escort him between venues — brawls, not gunfights.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Let No Man Put Asunder', region: 'Blackwater',
    overview: "Get evidence of a cheating spouse for a wronged husband.",
    objectives: ['Tail the spouse', 'Take a photograph', 'Return'],
    steps: [
      'Follow the woman to the meeting spot without being spotted.',
      'Snap the evidence.',
      'Return.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Love in Elegance', region: 'Cholla Springs',
    overview: "A love-triangle mystery — deliver a letter.",
    objectives: ['Meet the man', 'Deliver his letter', 'Report back'],
    steps: [
      'Meet him near Ridgewood.',
      'Ride to Armadillo, hand off the letter.',
      'Return.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Missus Rose', region: 'Blackwater',
    overview: "Escort a widow through a personal errand.",
    objectives: ['Escort Missus Rose'],
    steps: ['Ride slowly with her wagon.', 'No combat — just careful driving.'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Remember My Family (Stranger)', region: 'Blackwater',
    overview: "A widow needs help recovering a family heirloom.",
    objectives: ['Retrieve the heirloom'],
    steps: ['Ride to the marked location, fight bandits, return the item.'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'The Wronged Woman', region: 'Cholla Springs',
    overview: "A woman wants revenge on her ex — decide the outcome.",
    objectives: ['Confront her ex-husband'],
    steps: [
      'Ride to the ex\'s cabin.',
      'Choice: kill him (Dishonor) or spare him (Honor).',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Honor swing'] },
  { title: 'Where the Buzzards Roam', region: 'Gaptooth Ridge',
    overview: "Investigate mysterious cattle mutilations near Tumbleweed.",
    objectives: ['Investigate the site', 'Uncover the culprit'],
    steps: [
      'Ride to the ranch, examine tracks.',
      'Follow the trail into the hills.',
      'Resolve the mystery.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'You Shall Not Give False Testimony', region: 'Cholla Springs',
    overview: "A man claims his son was falsely imprisoned — investigate.",
    objectives: ['Investigate', 'Choose to free the son or leave him'],
    steps: [
      'Talk to witnesses.',
      'Approach the jail.',
      'Choice: break him out or leave.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Honor swing'] },
  { title: 'Jenny\'s Faith', region: 'Tall Trees',
    overview: "A dying woman asks Marston to end her suffering.",
    objectives: ['Find Jenny', 'Grant her wish or spare her'],
    steps: [
      'Ride to the wreck.',
      'Choice: shoot her (mercy, Honor) or leave her to die.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Honor gain if merciful'] },
  { title: 'I Know You', region: 'Great Plains',
    overview: "A mysterious stranger recurs at multiple locations — meta/philosophical quest. NOT required for 100%.",
    objectives: ['Meet him at all 4 locations'],
    steps: [
      'Beecher\'s Hope area — first meeting.',
      'Blackwater cathedral — second.',
      'Armadillo — third.',
      'Final meeting on top of a mountain in Tall Trees.',
    ],
    gold: ['—'], tips: ['THIS IS THE ONE STRANGER MISSION THAT DOES NOT COUNT toward 100%. Skip it or do it for the atmosphere.'],
    missables: [], rewards: ['Ambiguous ending cutscene'] },
];

const BOUNTIES = [
  ['Rattlesnake Hollow', 'Cholla Springs', 'Small canyon east of Armadillo. Snipe from the ridge, then push in.'],
  ['Twin Rocks', 'Cholla Springs', 'Twin Rocks hideout doubles as a bounty. Dead Eye and clear from cover.'],
  ['Tumbleweed', 'Gaptooth Ridge', 'Abandoned town in the SW — bandits on rooftops. Watch for snipers.'],
  ['Coot\'s Chapel', 'Cholla Springs', 'Old chapel south of Armadillo. Bandit hides inside; flush with dynamite.'],
  ['Pike\'s Basin', 'Cholla Springs', 'Bandit posted in the canyon — enter carefully and pick off snipers.'],
  ['Gaptooth Breach', 'Gaptooth Ridge', 'Mine entrance guarded by bandits. Long approach — bring rifle.'],
  ['Rathskeller Fork', "Hennigan's Stead", 'Small town — target hides in a house. Storm the door.'],
  ['Hanging Rock', 'Cholla Springs', 'Rock outcropping SE of Armadillo. Snipe target from below.'],
  ['El Presidio', 'Perdido', 'Fortified target — approach from the west. Bring plenty of ammo.'],
  ['Plata Grande', 'Perdido', 'Small village — target in the tavern. Rush the front door.'],
  ['Chuparosa', 'Perdido', 'Target hides among crowds. Duel him rather than open fire in town.'],
  ['Torquemada', 'Punta Orgullo', 'Coastal ruin — snipers on the walls. Take the high ground.'],
  ['Sepulcro', 'Diez Coronas', 'Graveyard bounty — target hides among the tombs.'],
  ['Escalera', 'Diez Coronas', 'Capital city — target flees on horseback. Chase and lasso alive for bonus.'],
  ['Casa Madrugada', 'Perdido', 'Small hacienda — 3-4 accomplices with the target.'],
  ['Nosalida', 'Perdido', 'Hideout doubles as bounty — clear the whole camp.'],
  ['Aurora Basin', 'Tall Trees', 'Lakeside camp — long approach through the forest. Wolves en route.'],
  ['Manzanita Post', 'Tall Trees', 'Logging camp target — snipe from the treeline.'],
  ['Nekoti Rock', 'Tall Trees', 'Cliffside — long-range rifle work.'],
  ['Blackwater', 'Blackwater', 'Urban target — chase on foot through streets.'],
].map(([title, region, tip]) => ({
  title: `Bounty: ${title}`, region, official: true,
  overview: `Posted bounty at ${title}. Pick up the poster from any marshal\'s office or telegraph office.`,
  objectives: [`Reach ${title}`, 'Capture alive OR kill the target', 'Return to the poster location for payment'],
  steps: [
    `Accept the bounty at any marshal\'s office (poster board).`,
    `Ride to ${title}.`,
    tip,
    'Lasso + hogtie for full payment (alive bonus); shoot on sight for reduced payment.',
    'Return the target (or corpse) to any marshal\'s office to collect.',
  ],
  gold: ['—'],
  tips: ['Capturing alive pays more and gives Honor. Killing loses Honor.'],
  missables: [], rewards: ['Cash', 'Fame', 'Honor swing'],
}));

const JOBS = [
  { title: "Nightwatch — MacFarlane\'s Ranch", region: "Hennigan's Stead",
    overview: "Patrol the ranch overnight, killing coyotes and horse thieves.",
    objectives: ['Complete the shift', 'Kill all threats', 'Do not let the horses die'],
    steps: [
      'Talk to the ranch hand at MacFarlane\'s at night.',
      'Ride slow laps around the corral.',
      'Coyotes come in twos — Dead Eye.',
      'Around 2 waves of horse thieves attack.',
      'Shift ends at dawn.',
    ],
    gold: ['—'], tips: ['Also counts as Sharpshooter kill grinding.'],
    missables: [], rewards: ['Cash', 'Honor'] },
  { title: 'Nightwatch — Chuparosa', region: 'Perdido',
    overview: "Same job, Mexican variant. Bandits instead of horse thieves.",
    objectives: ['Complete the shift', 'Kill all bandits'],
    steps: [
      'Talk to the ranch hand at Chuparosa at night.',
      'Patrol; heavier waves than New Austin.',
      'Shift ends at dawn.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Nightwatch — Blackwater', region: 'Blackwater',
    overview: "Urban nightwatch — street thieves rather than coyotes.",
    objectives: ['Patrol Blackwater at night', 'Stop robbers'],
    steps: [
      'Talk to the night deputy in Blackwater.',
      'Patrol Blackwater streets — robbers try to loot shops.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Horsebreaking — Ridgewood Farm', region: 'Cholla Springs',
    overview: "Break 3 wild horses at Ridgewood.",
    objectives: ['Break 3 horses without falling'],
    steps: [
      'Talk to the wrangler at Ridgewood.',
      'Lasso the marked horse, mount, hold opposite direction to buck.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Cash'] },
  { title: 'Horsebreaking — Chuparosa', region: 'Perdido',
    overview: "Same job in Chuparosa. Slightly rowdier horses.",
    objectives: ['Break 3 horses'],
    steps: ['Talk to the wrangler at Chuparosa.', 'Break horses as above.'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
];

const HIDEOUTS = [
  { title: 'Fort Mercer', region: 'Cholla Springs',
    overview: "Bill Williamson\'s stronghold. First clear happens during the story; must clear once more in free roam for 100%.",
    objectives: ['Enter the fort', 'Kill all bandits (approx. 15-20)', 'Loot the chest'],
    steps: [
      'Ride to Fort Mercer (post-story).',
      'Approach quietly, snipe wall guards.',
      'Push through the gate; use dynamite on grouped bandits.',
      'Loot the chest inside the main building.',
    ],
    gold: ['—'], tips: ['Chest gives ~$50 + treasure map or trinket.'],
    missables: [], rewards: ['Cash', 'Fame', '100% credit'] },
  { title: 'Twin Rocks', region: 'Cholla Springs',
    overview: "Bandit hideout NE of MacFarlane\'s Ranch.",
    objectives: ['Kill all bandits (~10)', 'Loot the chest'],
    steps: [
      'Approach from the south ridge — snipers on the outcrop.',
      'Clear the camp fires, then the cave.',
      'Chest is inside the cave.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Pike\'s Basin', region: 'Cholla Springs',
    overview: "Canyon hideout. Cleared during the story; repeat in free roam for 100%.",
    objectives: ['Clear all bandits (~15)', 'Loot chest'],
    steps: [
      'Rappel down as in the story.',
      'Clear the lower shacks, then the cave.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Gaptooth Breach', region: 'Gaptooth Ridge',
    overview: "Mine entrance held by outlaws — the toughest hideout in New Austin.",
    objectives: ['Kill all bandits (~15-20)', 'Loot chest inside the mine'],
    steps: [
      'Approach cautiously; ~4 guards outside.',
      'Push into the mine — tight corridors, use Repeater.',
      'Chest is deep in the mine.',
    ],
    gold: ['—'], tips: ['Bring Fire Bottles for grouped enemies inside.'],
    missables: [], rewards: [] },
  { title: 'Tesoro Azul', region: 'Perdido',
    overview: "Mexican bandit camp in a canyon.",
    objectives: ['Kill all bandits (~15)', 'Loot chest'],
    steps: [
      'Approach along the canyon top — snipe down.',
      'Descend and clean up.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Nosalida', region: 'Perdido',
    overview: "Fortified river-crossing hideout.",
    objectives: ['Clear all bandits (~15)', 'Loot chest'],
    steps: [
      'Approach from the north.',
      'Take out the two watchtowers first.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Tumbleweed', region: 'Gaptooth Ridge',
    overview: "Abandoned ghost-town hideout. Required for 100% (IGN-verified).",
    objectives: ['Kill all bandits in town (~20)', 'Loot chest'],
    steps: [
      'Approach from the east — snipers on the church tower.',
      'Clear building-by-building.',
      'Chest is in the largest saloon.',
    ],
    gold: ['—'], tips: ['One of the largest hideouts — bring plenty of ammo.'],
    missables: [], rewards: [] },
];

const MINIGAMES = [
  { title: 'Poker — Win a Hand', region: 'Any saloon',
    overview: "Win a single Poker hand at any table.",
    objectives: ['Sit at a poker table', 'Win one hand'],
    steps: [
      'Locations: Armadillo, Blackwater, Thieves\' Landing (high-stakes), Chuparosa.',
      'Fold weak hands. Call cheap. Only raise on pairs+.',
      'Cheating (with the Elegant Suit) speeds this up massively.',
    ],
    gold: ['—'], tips: ['Elegant Suit lets you cheat at Poker — makes wins near-guaranteed.'],
    missables: [], rewards: ['Minigame credit'] },
  { title: 'Blackjack — Win a Hand', region: 'Armadillo / Rathskeller / Blackwater',
    overview: "Beat the dealer once.",
    objectives: ['Sit at a Blackjack table', 'Win one hand'],
    steps: [
      'Stand on 17+, hit on <=11, double-down on 10-11.',
      'Split aces and eights.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Liar\'s Dice — Win a Game', region: 'Chuparosa / Blackwater',
    overview: "Win one game of Liar\'s Dice.",
    objectives: ['Play Liar\'s Dice', 'Be the last player'],
    steps: [
      'Bid conservatively early — only bump the count.',
      'Call "Liar" when the bid exceeds statistical likelihood.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Horseshoes — Win a Match', region: 'MacFarlane\'s Ranch',
    overview: "Beat any opponent at horseshoes.",
    objectives: ['Play a horseshoes match', 'Reach the score first'],
    steps: [
      'Location: behind the ranch house.',
      'Adjust angle and power; aim slightly beyond the peg for ringers.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Five Finger Fillet — Win a Match', region: 'Armadillo / Thieves\' Landing / Escalera',
    overview: "Rhythm-and-timing minigame with a knife.",
    objectives: ['Play Five Finger Fillet', 'Beat your opponent'],
    steps: [
      'Watch the pattern in the tutorial round.',
      'Match button prompts in rhythm — don\'t rush.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Arm Wrestling — Win a Match', region: 'Armadillo / Chuparosa',
    overview: "Timing minigame — win one match.",
    objectives: ['Play Arm Wrestling', 'Win one match'],
    steps: [
      'Wait for the yellow zone to appear, then mash the button.',
      'Don\'t mash early — it drains stamina.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
];

const WEAPONS = [
  { title: 'LeMat Revolver', region: 'Nuevo Paraiso',
    overview: "9-shot revolver — highest capacity in the game.",
    objectives: ['Acquire the LeMat Revolver'],
    steps: [
      'How to get: Complete "The Gates of El Presidio" mission — awarded free.',
      'Also purchasable at Chuparosa gunsmith after story progress.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['LeMat Revolver'] },
  { title: 'Semi-Automatic Shotgun', region: 'Blackwater',
    overview: "Best shotgun in the game.",
    objectives: ['Acquire the Semi-Auto Shotgun'],
    steps: [
      'How to get: Blackwater gunsmith, ~$1000.',
      'Also from certain gang shootouts (rare drop).',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Carcano Rifle', region: 'Nuevo Paraiso',
    overview: "Best long-range sniper — flat trajectory.",
    objectives: ['Acquire the Carcano Rifle'],
    steps: [
      'How to get: Escalera gunsmith after story progression.',
      'Alternative: found in some late-game Mexican gunfights.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Mauser Pistol', region: 'Blackwater',
    overview: "Rapid-fire pistol — highest pistol RPM.",
    objectives: ['Acquire the Mauser Pistol'],
    steps: [
      'How to get: Blackwater gunsmith after story progression.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Evans Repeater', region: 'Cholla Springs',
    overview: "Large-magazine repeater — best crowd control long gun.",
    objectives: ['Acquire the Evans Repeater'],
    steps: [
      'How to get: Complete Master Hunter Rank 9 challenge (skin a bear).',
      'Alternative: rare drop from Undead Nightmare (if you own it), or later missions.',
    ],
    gold: ['—'], tips: ['Grinding Master Hunter also progresses the Challenges category — double dip.'],
    missables: [], rewards: ['Evans Repeater'] },
];

const OUTFITS = [
  { title: 'Elegant Suit', region: 'Blackwater',
    overview: "Lets you cheat at Poker.",
    objectives: ['Purchase from the Blackwater tailor'],
    steps: ['Costs ~$500. Wear when playing Poker to unlock cheat option.'],
    gold: ['—'], tips: [], missables: [], rewards: ['Cheat at poker'] },
  { title: 'Rancher Outfit', region: "Hennigan's Stead",
    overview: "Given as story reward; herding job appropriate.",
    objectives: ['Complete early ranch missions'],
    steps: ['Auto-unlocked during Chapter 1.'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Reyes\' Rebels', region: 'Nuevo Paraiso',
    overview: "Disguise — federales don\'t attack on sight.",
    objectives: ['Collect 5 scraps'],
    steps: [
      'Scrap 1: complete "The Demon Drink".',
      'Scrap 2: complete a Nosalida hideout clear.',
      'Scrap 3: complete "My Sister\'s Keeper".',
      'Scrap 4: complete "Must a Savior Die?".',
      'Scrap 5: complete "The Great Mexican Train Robbery".',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Federale disguise'] },
  { title: 'U.S. Army', region: 'Cholla Springs',
    overview: "Army disguise — U.S. Army don\'t attack.",
    objectives: ['Collect 5 scraps'],
    steps: [
      'Scrap 1: kill a U.S. Army officer.',
      'Scrap 2: 5-star Sharpshooter Rank 5.',
      'Scrap 3: certain ambient encounters near Fort Mercer.',
      'Scrap 4: hidden crate in a Blackwater side alley.',
      'Scrap 5: awarded in Chapter 4 mission.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: ['Army disguise'] },
  { title: 'Bollard Twins Gang', region: 'Cholla Springs',
    overview: "Disguise as a Bollard Twins gang member.",
    objectives: ['Collect 5 scraps'],
    steps: [
      'Scrap 1: complete Pike\'s Basin hideout.',
      'Scrap 2: complete Twin Rocks hideout.',
      'Scrap 3: complete Fort Mercer hideout in free roam.',
      'Scrap 4: kill a Bollard Twins officer in a random encounter.',
      'Scrap 5: found near Coot\'s Chapel.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Treasure Hunter', region: 'Global',
    overview: "Reveals bonus treasure spots.",
    objectives: ['Complete Treasure Hunter Rank 9'],
    steps: ['Complete all 9 Treasure Hunter challenges (follow the 9 maps).'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Bandito', region: 'Nuevo Paraiso',
    overview: "Disguise as a Mexican bandit.",
    objectives: ['Collect 5 scraps'],
    steps: [
      'Scrap 1: complete Tesoro Azul hideout.',
      'Scrap 2: complete Nosalida hideout.',
      'Scrap 3: random encounter near Chuparosa.',
      'Scrap 4: bandit officer kill.',
      'Scrap 5: awarded in a Ricketts mission.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Duster', region: 'Great Plains',
    overview: "Iconic gunslinger duster coat.",
    objectives: ['Collect 5 scraps'],
    steps: ['Scattered across Chapter 4 challenges and random encounters — see completionist guide for exact spots.'],
    gold: ['—'], tips: [], missables: [], rewards: [] },
  { title: 'Legend of the West', region: 'Global',
    overview: "The ultimate outfit — awarded for maxing all 4 main challenge chains.",
    objectives: ['Complete Sharpshooter, Master Hunter, Survivalist, Treasure Hunter — all Rank 10'],
    steps: ['Grind each challenge chain to Rank 10. Then talk to the Outfitter (or check your wardrobe).'],
    gold: ['—'], tips: ['Boosts max Dead Eye and health.'],
    missables: [], rewards: ['Legend of the West Outfit'] },
];

const SAFEHOUSES = [
  ['MacFarlane\'s Ranch Bunk', "Hennigan's Stead", 'Story-granted. Sleep in the bunkhouse after Chapter 1 starts.'],
  ['Armadillo Room', 'Cholla Springs', 'Purchase at the Armadillo hotel — ~$50.'],
  ['Rathskeller Fork Room', "Hennigan's Stead", 'Purchase at the small hotel — ~$100.'],
  ['Thieves\' Landing Room', "Hennigan's Stead", 'Purchase at the hotel — ~$150.'],
  ['Casa Madrugada Room', 'Perdido', 'Purchase — ~$100.'],
  ['Chuparosa Room', 'Perdido', 'Purchase — ~$200.'],
  ['Escalera Room', 'Diez Coronas', 'Purchase — ~$300.'],
  ['El Matadero Room', 'Punta Orgullo', 'Purchase — ~$200.'],
  ['Blackwater Hotel', 'Blackwater', 'Purchase — ~$500. Blackwater\'s premium hotel.'],
  ['Manzanita Post Room', 'Tall Trees', 'Purchase — ~$150.'],
  ['Beecher\'s Hope (Story)', 'Great Plains', 'Story-granted in Chapter 4.'],
  ['Ridgewood Farm', 'Cholla Springs', 'Purchase — ~$300 (often overlooked).'],
  ['Plainview Room', 'Cholla Springs', 'Purchase — ~$100 (small oil town).'],
].map(([title, region, tip]) => ({
  title, region, official: true,
  overview: `Safehouse — sleeping here restores health, saves the game, and counts toward 100%.`,
  objectives: ['Purchase or unlock', 'Sleep in the bed at least once'],
  steps: [
    tip,
    'Sleep in the bed at least once — the room registers for 100%.',
  ],
  gold: ['—'], tips: ['Sleep saves your game and advances time.'],
  missables: [], rewards: ['Save point', '100% credit'],
}));

const CHALLENGES = [
  { title: 'Sharpshooter (10 Ranks)', region: 'Global',
    overview: "Combat challenges — kills, headshots, duels, disarms, mounted kills, and long-range work.",
    objectives: [
      'Rank 1: 5 headshots',
      'Rank 2: kill 5 birds',
      'Rank 3: 3 headshots in Dead Eye',
      'Rank 4: kill 3 enemies while holding your hat / disarm 3 in duels',
      'Rank 5: kill 5 mounted enemies while mounted',
      'Rank 6: 5 long-distance kills with a rifle',
      'Rank 7: 3 kills with the same throwing knife',
      'Rank 8: kill 3 enemies with dynamite',
      'Rank 9: 5 kills within 10 seconds',
      'Rank 10: kill 3 enemies with a single Dead Eye',
    ],
    steps: [
      'Almost all ranks can be grinded during story missions — stack them.',
      'Rank 4 duels: use "The Gunslinger\'s Tragedy" and later duels.',
      'Rank 10: use a Repeater in a large gunfight (Fort Mercer, Escalera).',
    ],
    gold: ['—'], tips: ['Contributes to Legend of the West Outfit.'],
    missables: [], rewards: ['XP toward Legend of the West'] },
  { title: 'Master Hunter (10 Ranks)', region: 'Global',
    overview: "Hunt each species. Requires travel across all regions.",
    objectives: [
      'Rank 1: skin 3 rabbits',
      'Rank 2: kill 5 deer',
      'Rank 3: 5 perfect elk pelts',
      'Rank 4: 5 perfect wolf pelts (use bow/knife)',
      'Rank 5: kill a bear with a knife',
      'Rank 6: 5 perfect coyote pelts',
      'Rank 7: 3 cougars with a knife',
      'Rank 8: kill each of the 5 legendary predators',
      'Rank 9: skin a bear',
      'Rank 10: kill 3 grizzlies in one Dead Eye',
    ],
    steps: [
      'Bow (from "Wolves, Man") gives perfect pelts on any animal.',
      'Knife kills require walking behind the animal or using Dead Eye then finisher.',
      'Legendary predators: Big Bear (Tall Trees), Khan (Tall Trees), Gordo (Cholla Springs), Lobo (Nuevo Paraiso), Chupacabra (Undead Nightmare only — skip if base game).',
    ],
    gold: ['—'], tips: ['Rank 9 awards the Evans Repeater.'],
    missables: [], rewards: ['Evans Repeater at Rank 9'] },
  { title: 'Survivalist (10 Ranks)', region: 'Global',
    overview: "Pick medicinal plants. Requires all regions.",
    objectives: [
      'Rank 1-10: Pick 10 of each herb per rank',
      'Herbs: Prickly Pear, Wild Feverfew, Desert Sage, Butterfly Weed, Violet Snowdrop, Prairie Poppy, Woolly Blue Curls, Red Sage, Hummingbird Sage, Golden Currant',
    ],
    steps: [
      'Each rank = 10 of a specific plant.',
      'Buy a Survivalist Map from the general store to reveal plant locations on the map.',
    ],
    gold: ['—'], tips: ['Buy the map — do NOT try without it.'],
    missables: [], rewards: [] },
  { title: 'Treasure Hunter (10 Maps)', region: 'Global',
    overview: "Follow 10 progressively harder treasure maps.",
    objectives: ['Complete 10 treasure hunts'],
    steps: [
      'Get Map 1 from a random encounter (stranger by the road).',
      'Each subsequent map is the reward for finding the previous treasure.',
      'Map artwork shows the landmark — read the app\'s attached tips per map.',
    ],
    gold: ['—'], tips: ['Rank 9 awards the Treasure Hunter Outfit.'],
    missables: [], rewards: ['Treasure Hunter Outfit at Rank 9'] },
  { title: 'Tomahawk Mastery (Optional)', region: 'Global',
    overview: "Optional weapon-mastery chain. NOT required for 100%.",
    objectives: ['Complete Tomahawk kill challenges'],
    steps: ['Use Tomahawks in various scenarios per rank.'],
    gold: ['—'], tips: [], missables: [], rewards: ['Trophy/Achievement only'] },
  { title: 'Explosive Rifle Mastery (Optional)', region: 'Global',
    overview: "Optional weapon-mastery chain. NOT required for 100%.",
    objectives: ['Complete Explosive Rifle kill challenges'],
    steps: ['Grind Explosive Rifle kills per rank.'],
    gold: ['—'], tips: [], missables: [], rewards: ['Trophy/Achievement only'] },
];

// Locations & Collectibles — many entries; produced with generic templates.
const LOCATIONS_NAMED = [
  ['Armadillo', 'Cholla Springs'], ['Thieves\' Landing', "Hennigan's Stead"],
  ['MacFarlane\'s Ranch', "Hennigan's Stead"], ['Ridgewood Farm', 'Cholla Springs'],
  ['Rathskeller Fork', "Hennigan's Stead"], ['Coot\'s Chapel', 'Cholla Springs'],
  ['Fort Mercer', 'Cholla Springs'], ['Twin Rocks', 'Cholla Springs'],
  ['Pike\'s Basin', 'Cholla Springs'], ['Hanging Rock', 'Cholla Springs'],
  ['Rattlesnake Hollow', 'Cholla Springs'], ['Odd Fellow\'s Rest', 'Cholla Springs'],
  ['Tumbleweed', 'Gaptooth Ridge'], ['Gaptooth Breach', 'Gaptooth Ridge'],
  ['Plainview', 'Cholla Springs'], ['Chuparosa', 'Perdido'],
  ['Casa Madrugada', 'Perdido'], ['Tesoro Azul', 'Perdido'],
  ['Nosalida', 'Perdido'], ['El Presidio', 'Perdido'],
  ['Plata Grande', 'Perdido'], ['Torquemada', 'Punta Orgullo'],
  ['El Matadero', 'Punta Orgullo'], ['Escalera', 'Diez Coronas'],
  ['Sepulcro', 'Diez Coronas'], ['Blackwater', 'Blackwater'],
  ['Manzanita Post', 'Tall Trees'], ['Aurora Basin', 'Tall Trees'],
  ['Nekoti Rock', 'Tall Trees'], ['Beecher\'s Hope', 'Great Plains'],
];
const LOCATIONS = [];
for (let i = 0; i < 94; i++) {
  const [name, region] = LOCATIONS_NAMED[i] || [`Location #${i + 1}`, 'Other'];
  LOCATIONS.push({
    title: name, region, official: true,
    overview: `Named map location. Discovering it (riding within range) marks it on the map for 100%.`,
    objectives: [`Visit ${name}`],
    steps: [`Ride to ${name}. The name appears on-screen when discovered.`],
    gold: ['—'], tips: ['Fast travel becomes available once discovered (from a safehouse).'],
    missables: [], rewards: ['Map discovery credit'],
  });
}

const TREASURE_SPOTS = [
  [1, 'Rathskeller Fork',  'Gaptooth Ridge',   'Fireplace of the ruined cabin south of Rathskeller Fork.'],
  [2, 'Gaptooth Breach',   'Gaptooth Ridge',   'Rock pile below the twin peak west of Gaptooth Breach.'],
  [3, 'Rio del Lobo Rock', 'Cholla Springs',   'Base of the cliff face just north of Rio del Lobo Rock.'],
  [4, 'Nekoti Rock',       'Tall Trees',       'Beside the tallest rock at the base of Nekoti Rock.'],
  [5, 'Twin Rocks',        "Hennigan's Stead", 'Behind the boulder overlooking the Twin Rocks hideout.'],
  [6, 'Ojo del Diablo',    'Diez Coronas',     "Water's-edge rock at the western tip of Ojo del Diablo lake."],
  [7, 'El Presidio',       'Diez Coronas',     'Ledge on the mountain south of El Presidio fort.'],
  [8, 'Torquemada',        'Punta Orgullo',    'Rock face at the seaside cliff south of Torquemada.'],
  [9, 'Aurora Basin',      'Tall Trees',       'Boulder cluster on the west shore of Aurora Basin lake.'],
];
const COLLECTIBLES = TREASURE_SPOTS.map(([n, where, region, hint]) => ({
  title: `Treasure ${n} — ${where}`,
  region,
  official: false,
  overview: `Buried Treasure ${n} of 9 (Treasure Hunter challenge). ${hint}`,
  objectives: [`Read Treasure Map ${n}`, 'Dig at the marked rock', 'Return to sell any lockbox contents'],
  steps: [
    `Solve Treasure Map ${n} (previous map spawns it, or bought from a fence).`,
    `Ride to ${where} in ${region}.`,
    hint,
    'Dig with the shovel prompt to receive the gold bar / cash payout.',
  ],
  gold: ['—'],
  tips: ['Each treasure advances the Treasure Hunter challenge (Rank ' + n + ').'],
  missables: [],
  rewards: ['Gold bar / cash', 'Treasure Hunter progress'],
}));

const COLLECTIBLE_NAMES = [
  'Treasure Map 1', 'Treasure Map 2', 'Treasure Map 3', 'Treasure Map 4', 'Treasure Map 5',
  'Treasure Map 6', 'Treasure Map 7', 'Treasure Map 8', 'Treasure Map 9', 'Treasure Map 10',
  'Prairie Poppy', 'Desert Sage', 'Woolly Blue Curls', 'Violet Snowdrop', 'Golden Currant',
];
for (let i = 0; i < 15; i++) {
  COLLECTIBLES.push({
    title: COLLECTIBLE_NAMES[i], region: 'Global', official: false,
    overview: 'Completionist collectible. Not required for official 100% but tracked here for full clear.',
    objectives: [`Find ${COLLECTIBLE_NAMES[i]}`],
    steps: [
      i < 10 ? 'Follow the sketch on the map. Match a landmark, then look for the "?" prompt.'
             : 'Pick using the Survivalist Map from the general store.',
    ],
    gold: ['—'], tips: [], missables: [], rewards: [],
  });
}

// Package everything with IDs and official flag
function packageCategory(list, catId, defaultOfficial) {
  return list.map((q, i) => ({
    id: `${catId}-${i + 1}`,
    category: catId,
    official: q.official !== undefined ? q.official : defaultOfficial,
    title: q.title,
    region: q.region || '—',
    overview: q.overview || '',
    objectives: q.objectives || [],
    steps: q.steps || [],
    gold: q.gold || [],
    tips: q.tips || [],
    missables: q.missables || [],
    rewards: q.rewards || [],
  }));
}

// Strangers: mark last one ("I Know You") as extra
STRANGERS.forEach((s, i) => { s.official = i < 18; });
// Hideouts: all 7 official
HIDEOUTS.forEach((h) => { h.official = true; });
// Challenges: first 4 official, last 2 extra
CHALLENGES.forEach((c, i) => { c.official = i < 4; });
// Weapons: first 5 official (all listed here are)
WEAPONS.forEach((w) => { w.official = true; });
// Outfits: mark the 9 key outfits official
const OFFICIAL_OUTFITS = new Set(['Elegant Suit','Rancher Outfit','Reyes\' Rebels','U.S. Army','Bollard Twins Gang','Treasure Hunter','Bandito','Duster','Legend of the West']);
OUTFITS.forEach((o) => { o.official = OFFICIAL_OUTFITS.has(o.title); });

const ALL_ITEMS = [
  ...packageCategory(STORY, 'story', true),
  ...packageCategory(STRANGERS, 'strangers'),
  ...packageCategory(CHALLENGES, 'challenges'),
  ...packageCategory(BOUNTIES, 'bounties', true),
  ...packageCategory(JOBS, 'jobs', true),
  ...packageCategory(HIDEOUTS, 'hideouts', true),
  ...packageCategory(MINIGAMES, 'minigames', true),
  ...packageCategory(LOCATIONS, 'locations', true),
  ...packageCategory(OUTFITS, 'outfits'),
  ...packageCategory(WEAPONS, 'weapons'),
  ...packageCategory(SAFEHOUSES, 'safehouses', true),
  ...packageCategory(COLLECTIBLES, 'collectibles', false),
];

const BY_CAT = Object.fromEntries(CATEGORIES.map((c) => [c.id, ALL_ITEMS.filter((i) => i.category === c.id)]));

// ---------------------------------------------------------------------------
// PROGRESS STORE
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'rdr1-progress-v2';
let progressState = { items: {}, steps: {}, notes: {}, pinned: {} };
const listeners = new Set();
async function hydrate() {
  if (!AsyncStorage) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) progressState = { items: {}, steps: {}, notes: {}, pinned: {}, ...JSON.parse(raw) };
    listeners.forEach((l) => l());
  } catch {}
}
async function persist() {
  if (!AsyncStorage) return;
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressState)); } catch {}
}
function useProgress() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l); return () => listeners.delete(l);
  }, []);
  return progressState;
}
function emit() { listeners.forEach((l) => l()); persist(); }
function toggleDone(id) { progressState.items[id] = !progressState.items[id]; progressState = { ...progressState }; emit(); }
function togglePin(id) { progressState.pinned[id] = !progressState.pinned[id]; progressState = { ...progressState }; emit(); }
function toggleStep(itemId, stepIdx) {
  const key = `${itemId}::${stepIdx}`;
  progressState.steps[key] = !progressState.steps[key];
  progressState = { ...progressState };
  emit();
}
function setNote(id, v) { progressState.notes[id] = v; progressState = { ...progressState }; emit(); }
function resetAll() { progressState = { items: {}, steps: {}, notes: {}, pinned: {} }; emit(); }
function importJSON(text) {
  try {
    const parsed = JSON.parse(text);
    progressState = { items: {}, steps: {}, notes: {}, pinned: {}, ...parsed };
    emit(); return true;
  } catch { return false; }
}
function rollup(fn) {
  const items = ALL_ITEMS.filter(fn);
  const done = items.filter((i) => progressState.items[i.id]).length;
  const total = items.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ---------------------------------------------------------------------------
// UI PRIMITIVES
// ---------------------------------------------------------------------------
function ProgressBar({ pct, tint = T.brass }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: tint }]} />
    </View>
  );
}
function StatBlock({ label, done, total, pct, tint }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.rowBetween}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: tint || T.parchment }]}>{done}/{total} · {pct}%</Text>
      </View>
      <ProgressBar pct={pct} tint={tint} />
    </View>
  );
}
function Btn({ label, onPress, kind = 'default' }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.btn,
      kind === 'primary' && { borderColor: T.brass },
      kind === 'danger' && { borderColor: '#a83a2a' },
      pressed && { opacity: 0.8 },
    ]}>
      <Text style={[styles.btnTxt, kind === 'danger' && { color: '#e39a8a' }]}>{label}</Text>
    </Pressable>
  );
}
function Section({ title, tint = T.brass, children }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={[styles.sectionHead, { color: tint }]}>{title}</Text>
      {children}
    </View>
  );
}
function BulletList({ items, color = T.parchment }) {
  if (!items || !items.length) return null;
  return (
    <View>
      {items.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ color: T.brassDim, marginRight: 8 }}>•</Text>
          <Text style={{ flex: 1, color, lineHeight: 20 }}>{line}</Text>
        </View>
      ))}
    </View>
  );
}
function NumberedSteps({ itemId, steps }) {
  useProgress();
  if (!steps || !steps.length) return null;
  return (
    <View>
      {steps.map((line, i) => {
        const key = `${itemId}::${i}`;
        const done = !!progressState.steps[key];
        return (
          <Pressable key={i} onPress={() => toggleStep(itemId, i)} style={({ pressed }) => [
            { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.border },
            pressed && { opacity: 0.7 },
          ]}>
            <View style={[styles.stepBadge, done && styles.stepBadgeDone]}>
              <Text style={{ color: done ? T.bg : T.brass, fontWeight: '700' }}>{done ? '✓' : i + 1}</Text>
            </View>
            <Text style={{ flex: 1, color: done ? T.muted : T.parchment, lineHeight: 20, textDecorationLine: done ? 'line-through' : 'none' }}>{line}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// MAP COMPONENTS — base map + pin overlay + cropped marker tile.
// The base image is loaded once; MapCrop shows a zoomed viewport of it
// by rendering a very large <Image> inside a clipped <View> with negative
// offsets (the RN equivalent of CSS background-position).
// ---------------------------------------------------------------------------
function PinDot({ x, y, size = 12, color = T.brass, ring, onPress }) {
  const dot = (
    <View style={{
      position: 'absolute',
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      width: size, height: size, borderRadius: size,
      backgroundColor: color,
      borderWidth: 1.5, borderColor: '#000',
      shadowColor: color, shadowOpacity: 0.9, shadowRadius: 6,
    }}>
      {ring ? (
        <View style={{
          position: 'absolute', left: -6, top: -6,
          width: size + 12, height: size + 12, borderRadius: (size + 12) / 2,
          borderWidth: 2, borderColor: color, opacity: 0.7,
        }} />
      ) : null}
    </View>
  );
  if (!onPress) return dot;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={{
        position: 'absolute',
        left: `${x * 100}%`, top: `${y * 100}%`,
        marginLeft: -14, marginTop: -14, width: 28, height: 28,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <View style={{
        width: size, height: size, borderRadius: size,
        backgroundColor: color, borderWidth: 1.5, borderColor: '#000',
      }} />
      {ring ? (
        <View style={{
          position: 'absolute',
          width: size + 12, height: size + 12, borderRadius: (size + 12) / 2,
          borderWidth: 2, borderColor: color, opacity: 0.8,
        }} />
      ) : null}
    </Pressable>
  );
}

function BaseMap({ width, pins = [], onPinPress, activeId }) {
  const height = width / MAP_AR;
  return (
    <View style={{ width, height, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: T.border, backgroundColor: '#0b0906' }}>
      <Image source={{ uri: MAP_URL }} style={{ width, height }} resizeMode="cover" />
      {pins.map((p) => (
        <PinDot
          key={p.id || `${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          color={p.color || CATEGORY_COLOR[p.category] || T.brass}
          ring={p.id === activeId}
          onPress={onPinPress ? () => onPinPress(p) : undefined}
        />
      ))}
    </View>
  );
}

// Renders a zoomed crop of the base map centered on a pin.
// zoom = how many "screen widths" the full map occupies (higher = tighter crop).
function MapCrop({ pin, width, height, zoom = 3 }) {
  if (!pin) return null;
  const imgW = width * zoom;
  const imgH = imgW / MAP_AR;
  // shift so (pin.x, pin.y) of the source image lands at center of viewport
  const left = -(pin.x * imgW - width / 2);
  const top = -(pin.y * imgH - height / 2);
  return (
    <View style={{ width, height, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: T.border, backgroundColor: '#0b0906' }}>
      <Image source={{ uri: MAP_URL }} style={{ width: imgW, height: imgH, position: 'absolute', left, top }} resizeMode="cover" />
      {/* Center pin overlay */}
      <View style={{ position: 'absolute', left: width / 2 - 8, top: height / 2 - 8, width: 16, height: 16 }}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: T.accent, borderWidth: 2, borderColor: '#0b0906' }} />
        <View style={{ position: 'absolute', left: -8, top: -8, width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: T.accent, opacity: 0.6 }} />
      </View>
    </View>
  );
}

function PinBadge({ verified }) {
  return (
    <View style={{
      alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 4, borderWidth: 1,
      borderColor: verified ? T.brass : T.borderStrong,
      backgroundColor: verified ? 'rgba(201,162,75,0.15)' : T.bgElev,
    }}>
      <Text style={{ fontSize: 10, letterSpacing: 1, color: verified ? T.brass : T.muted, fontWeight: '700' }}>
        {verified ? 'VERIFIED PIN' : 'REGION ANCHOR'}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SCREENS
// ---------------------------------------------------------------------------

function Dashboard({ onOpenCategory, onOpenMap, onOpenSettings, cols }) {
  useProgress();
  const off = rollup((i) => i.official);
  const ext = rollup((i) => !i.official);
  const all = rollup(() => true);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <Text style={styles.eyebrow}>Red Dead Redemption</Text>
      <Text style={styles.h1}>Completionist Guide</Text>
      <Text style={styles.tagline}>Detailed per-quest walkthroughs, Gold Medal tips, and full 100% tracking.</Text>

      <View style={styles.card}>
        <StatBlock label="Official 100%" {...off} tint={T.official} />
        <StatBlock label="Completionist Extras" {...ext} tint={T.extra} />
        <StatBlock label="Overall" {...all} tint={T.parchment} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
        <View style={{ flex: 1 }}><Btn label="Map & Links" onPress={onOpenMap} /></View>
        <View style={{ flex: 1 }}><Btn label="Import / Export" onPress={onOpenSettings} /></View>
      </View>

      <Text style={styles.sectionHead}>Categories</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
        {CATEGORIES.map((c) => {
          const co = rollup((i) => i.category === c.id && i.official);
          const cx = rollup((i) => i.category === c.id && !i.official);
          return (
            <View key={c.id} style={{ width: `${100 / cols}%`, padding: 6 }}>
              <Pressable onPress={() => onOpenCategory(c.id)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 28 }}>{c.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{c.label}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{c.desc}</Text>
                  </View>
                </View>
                {co.total > 0 && <StatBlock label="Official" {...co} tint={T.official} />}
                {cx.total > 0 && <StatBlock label="Extras" {...cx} tint={T.extra} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function CategoryView({ categoryId, onOpenItem, activeItemId }) {
  useProgress();
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const items = BY_CAT[categoryId] || [];
  const shown = items.filter((it) => {
    if (q && !it.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'official' && !it.official) return false;
    if (filter === 'extras' && it.official) return false;
    if (filter === 'pinned' && !progressState.pinned[it.id]) return false;
    if (filter === 'todo' && progressState.items[it.id]) return false;
    return true;
  });
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Text style={styles.h2}>{cat?.icon} {cat?.label}</Text>
        <TextInput value={q} onChangeText={setQ} placeholder="Search…" placeholderTextColor={T.muted} style={styles.input} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {['all', 'official', 'extras', 'pinned', 'todo'].map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
              <Text style={[styles.chipTxt, filter === f && { color: T.bg }]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <FlatList
        data={shown}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const done = !!progressState.items[item.id];
          const pinned = !!progressState.pinned[item.id];
          return (
            <Pressable
              onPress={() => onOpenItem(item.id)}
              style={({ pressed }) => [styles.row, item.id === activeItemId && { backgroundColor: T.bgElev }, pressed && { opacity: 0.85 }]}
            >
              <Pressable hitSlop={8} onPress={() => toggleDone(item.id)} style={[styles.checkbox, done && styles.checkboxDone]}>
                {done ? <Text style={styles.tick}>✓</Text> : null}
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, done && styles.rowDone]} numberOfLines={1}>
                  {pinned ? '★ ' : ''}{item.title}
                </Text>
                <Text style={styles.rowMeta}>{item.region} · {item.official ? 'Official 100%' : 'Extra'}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={{ padding: 20, color: T.muted }}>No entries.</Text>}
      />
    </View>
  );
}

function DetailView({ itemId }) {
  useProgress();
  const { width } = useWindowDimensions();
  const item = ALL_ITEMS.find((i) => i.id === itemId);
  if (!item) return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: T.muted }}>Select an entry from the list to see a full walkthrough.</Text>
    </View>
  );
  const done = !!progressState.items[item.id];
  const pinned = !!progressState.pinned[item.id];
  const note = progressState.notes[item.id] || '';
  const pin = pinFor(item);
  // Hero width — accommodate split-view (list beside detail)
  const heroW = Math.min(width - 40, 720);
  const heroH = Math.round(heroW * 0.42);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      {/* Title block ABOVE the hero so text is never covered by the image */}
      <Text style={styles.eyebrow}>{item.region} · {item.official ? 'Official 100%' : 'Completionist Extra'}</Text>
      <Text style={styles.h2}>{item.title}</Text>

      {/* Hero: cropped viewport of the real RDR1 map centered on the item.
          No overlay text — full map is visible. */}
      {pin ? (
        <View style={{ marginTop: 12, marginBottom: 6 }}>
          <MapCrop pin={pin} width={heroW} height={heroH} zoom={pin.verified ? 3.2 : 2.2} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <PinBadge verified={pin.verified} />
            <Text style={{ color: T.parchmentDim, fontSize: 12, flex: 1 }} numberOfLines={2}>{pin.caption}</Text>
          </View>
        </View>
      ) : null}

      {item.overview ? <Text style={{ color: T.parchmentDim, marginTop: 12, lineHeight: 20 }}>{item.overview}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <View style={{ flex: 1 }}><Btn label={done ? '✓ Completed' : 'Mark complete'} kind={done ? 'primary' : 'default'} onPress={() => toggleDone(item.id)} /></View>
        <View style={{ flex: 1 }}><Btn label={pinned ? '★ Pinned' : 'Pin'} onPress={() => togglePin(item.id)} /></View>
      </View>

      {item.objectives?.length ? (
        <Section title="Objectives"><BulletList items={item.objectives} /></Section>
      ) : null}

      {item.steps?.length ? (
        <Section title="Step-by-step walkthrough">
          <NumberedSteps itemId={item.id} steps={item.steps} />
        </Section>
      ) : null}

      {item.gold?.length && item.gold[0] !== '—' ? (
        <Section title="Gold Medal requirements" tint={T.official}>
          <BulletList items={item.gold} color={T.parchment} />
        </Section>
      ) : null}

      {item.tips?.length ? (
        <Section title="100% completion tips" tint={T.accent}>
          <BulletList items={item.tips} color={T.parchment} />
        </Section>
      ) : null}

      {item.missables?.length ? (
        <Section title="Missable warnings" tint={T.warn}>
          <BulletList items={item.missables} color={T.warn} />
        </Section>
      ) : null}

      {item.rewards?.length ? (
        <Section title="Rewards & unlocks" tint={T.brass}>
          <BulletList items={item.rewards} />
        </Section>
      ) : null}

      <Section title="Personal notes">
        <TextInput
          value={note}
          onChangeText={(v) => setNote(item.id, v)}
          placeholder="Save-file spots, honor state, reminders…"
          placeholderTextColor={T.muted}
          multiline
          style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
        />
      </Section>

      {/* Zoomed map marker — placed at the END so it never covers text */}
      {pin ? (
        <Section title="Zoomed map marker">
          <View style={styles.card}>
            <MapCrop pin={pin} width={Math.min(width - 72, 520)} height={Math.min((width - 72) * 0.55, 280)} zoom={pin.verified ? 5 : 3} />
            <View style={{ marginTop: 10, gap: 6 }}>
              <PinBadge verified={pin.verified} />
              <Text style={{ color: T.parchment, fontWeight: '700' }}>{pin.caption}</Text>
              <Text style={{ color: T.muted, fontSize: 12 }}>{MAP_CREDIT}</Text>
            </View>
          </View>
        </Section>
      ) : null}
    </ScrollView>
  );
}


const MAP_FILTERS = [
  { id: 'all',          label: 'All' },
  { id: 'hideouts',     label: 'Hideouts' },
  { id: 'weapons',      label: 'Rare weapons' },
  { id: 'bounties',     label: 'Bounties' },
  { id: 'collectibles', label: 'Treasures' },
  { id: 'outfits',      label: 'Outfits' },
];

function MapView({ onOpenItem }) {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState('all');
  const open = (url) => Linking.openURL(url).catch(() => Alert.alert('Cannot open link'));

  const pins = ALL_ITEMS
    .filter((i) => MAP_CATEGORIES.has(i.category))
    .filter((i) => filter === 'all' || i.category === filter)
    .map((i) => {
      const p = pinFor(i);
      return { id: i.id, x: p.x, y: p.y, category: i.category, title: i.title };
    });

  const mapW = Math.min(width - 32, 900);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <Text style={styles.h2}>Border States — 1910</Text>
      <Text style={{ color: T.muted, fontSize: 12, marginTop: 4, marginBottom: 12 }}>{MAP_CREDIT}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {MAP_FILTERS.map((f) => (
          <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[styles.chip, filter === f.id && styles.chipActive]}>
            <Text style={[styles.chipTxt, filter === f.id && { color: T.bg }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <BaseMap
        width={mapW}
        pins={pins}
        onPinPress={(p) => onOpenItem && onOpenItem(p.id)}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        {['hideouts','weapons','bounties','collectibles','outfits'].map((k) => (
          <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: CATEGORY_COLOR[k] }} />
            <Text style={{ color: T.parchmentDim, fontSize: 12, textTransform: 'capitalize' }}>{k}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionHead, { marginTop: 24 }]}>External references</Text>
      <Btn label="Open IGN Interactive Map" kind="primary" onPress={() => open('https://www.ign.com/wikis/red-dead-redemption/Interactive_Map')} />
      <View style={{ height: 10 }} />
      <Btn label="Fandom Wiki" onPress={() => open('https://reddead.fandom.com/wiki/Red_Dead_Redemption')} />
      <View style={{ height: 10 }} />
      <Btn label="GTAForums 100% Guide" onPress={() => open('https://gtaforums.com/topic/999902-rdr-100-total-completion-strategy-guide/')} />
    </ScrollView>
  );
}



function SettingsView() {
  useProgress();
  const [text, setText] = useState('');
  const exportShare = async () => {
    try { await Share.share({ message: JSON.stringify(progressState, null, 2) }); } catch {}
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.h2}>Progress</Text>
      <Text style={{ color: T.parchmentDim, marginTop: 6, marginBottom: 16 }}>
        Export progress as JSON via the native share sheet, or paste JSON to import.
      </Text>
      <Btn label="Export via Share sheet" kind="primary" onPress={exportShare} />
      <View style={{ height: 10 }} />
      <Btn label="Reset all progress" kind="danger" onPress={() => Alert.alert('Reset?', 'This clears every checkbox and step.', [
        { text: 'Cancel' }, { text: 'Reset', style: 'destructive', onPress: resetAll },
      ])} />
      <Text style={[styles.sectionHead, { marginTop: 20 }]}>Import JSON</Text>
      <TextInput value={text} onChangeText={setText} placeholder='{"items":{...}}' placeholderTextColor={T.muted} multiline style={[styles.input, { minHeight: 140, textAlignVertical: 'top' }]} />
      <View style={{ height: 10 }} />
      <Btn label="Import" onPress={() => {
        if (importJSON(text)) { Alert.alert('Imported'); setText(''); }
        else Alert.alert('Invalid JSON');
      }} />
      {!AsyncStorage && (
        <Text style={{ color: T.accent, marginTop: 16 }}>
          Note: add @react-native-async-storage/async-storage in the Snack Dependencies panel for persistence across reloads.
        </Text>
      )}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// APP SHELL
// ---------------------------------------------------------------------------
export default function App() {
  useEffect(() => { hydrate(); }, []);
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 700;
  const isLandscape = width > height;
  const splitMode = isTablet && isLandscape;
  const cols = width > 1100 ? 3 : width > 700 ? 2 : 1;

  const [tab, setTab] = useState('home');
  const [categoryId, setCategoryId] = useState(null);
  const [itemId, setItemId] = useState(null);

  const openCategory = (id) => { setCategoryId(id); setItemId(null); setTab('home'); };
  const openItem = (id) => setItemId(id);
  const back = () => {
    if (itemId && !splitMode) return setItemId(null);
    if (categoryId) return setCategoryId(null);
  };

  let content;
  if (tab === 'map') content = <MapView onOpenItem={(id) => { const it = ALL_ITEMS.find((x) => x.id === id); if (it) { setCategoryId(it.category); setItemId(id); setTab('home'); } }} />;
  else if (tab === 'settings') content = <SettingsView />;
  else if (categoryId && splitMode) {
    content = (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 380, borderRightWidth: 1, borderRightColor: T.border }}>
          <CategoryView categoryId={categoryId} onOpenItem={openItem} activeItemId={itemId} />
        </View>
        <View style={{ flex: 1 }}>
          <DetailView itemId={itemId} />
        </View>
      </View>
    );
  } else if (categoryId && itemId) content = <DetailView itemId={itemId} />;
  else if (categoryId) content = <CategoryView categoryId={categoryId} onOpenItem={openItem} />;
  else content = <Dashboard cols={cols} onOpenCategory={openCategory} onOpenMap={() => setTab('map')} onOpenSettings={() => setTab('settings')} />;

  const title =
    tab === 'map' ? 'Map & Reference' :
    tab === 'settings' ? 'Progress' :
    itemId && !splitMode ? 'Details' :
    categoryId ? (CATEGORIES.find((c) => c.id === categoryId)?.label || '') :
    'RDR1 Completionist';

  const canBack = tab === 'home' && !!categoryId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />
      <View style={styles.header}>
        {canBack ? (
          <Pressable onPress={back} hitSlop={10}><Text style={styles.headerBack}>‹ Back</Text></Pressable>
        ) : <View style={{ width: 60 }} />}
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={{ flex: 1 }}>{content}</View>

      <View style={styles.tabBar}>
        {[
          { id: 'home', label: 'Guide', glyph: '★' },
          { id: 'map', label: 'Map', glyph: '🗺' },
          { id: 'settings', label: 'Progress', glyph: '⚙' },
        ].map((t) => (
          <Pressable key={t.id} onPress={() => { setTab(t.id); if (t.id !== 'home') { setCategoryId(null); setItemId(null); } }} style={styles.tab}>
            <Text style={{ fontSize: 18, color: tab === t.id ? T.brass : T.muted }}>{t.glyph}</Text>
            <Text style={{ fontSize: 11, marginTop: 2, color: tab === t.id ? T.brass : T.muted }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.bgElev },
  headerTitle: { color: T.parchment, fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center', fontFamily: Platform.select({ ios: 'Georgia', default: undefined }) },
  headerBack: { color: T.brass, fontSize: 16, width: 60 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: T.border, backgroundColor: T.bgElev },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center' },

  eyebrow: { color: T.brass, letterSpacing: 2, fontSize: 11, textTransform: 'uppercase' },
  h1: { color: T.parchment, fontSize: 30, fontWeight: '700', marginTop: 4, fontFamily: Platform.select({ ios: 'Georgia', default: undefined }) },
  h2: { color: T.parchment, fontSize: 22, fontWeight: '700', fontFamily: Platform.select({ ios: 'Georgia', default: undefined }) },
  tagline: { color: T.parchmentDim, fontSize: 14, marginTop: 8, marginBottom: 16 },
  sectionHead: { color: T.brass, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginBottom: 10 },

  card: { backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  cardTitle: { color: T.parchment, fontSize: 16, fontWeight: '700' },
  cardDesc: { color: T.muted, fontSize: 12, marginTop: 2 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: T.parchmentDim, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  statValue: { fontVariant: ['tabular-nums'], fontWeight: '600' },
  track: { height: 6, backgroundColor: T.bgElev, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: T.border, marginTop: 4 },
  fill: { height: '100%', borderRadius: 999 },

  btn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: T.borderStrong, backgroundColor: T.bgElev, alignItems: 'center' },
  btnTxt: { color: T.brass, fontWeight: '700', letterSpacing: 0.6 },

  input: { marginTop: 10, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, borderRadius: 8, padding: 10, color: T.parchment },

  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: T.border, backgroundColor: T.bgElev },
  chipActive: { backgroundColor: T.brass, borderColor: T.brass },
  chipTxt: { color: T.parchmentDim, fontSize: 12, textTransform: 'capitalize' },

  row: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.border },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: T.borderStrong, alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg },
  checkboxDone: { backgroundColor: T.brass, borderColor: T.brass },
  tick: { color: T.bg, fontWeight: '800', fontSize: 14 },
  rowTitle: { color: T.parchment, fontSize: 15, fontWeight: '600' },
  rowDone: { color: T.muted, textDecorationLine: 'line-through' },
  rowMeta: { color: T.muted, fontSize: 12, marginTop: 2 },

  stepBadge: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: T.brassDim, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  stepBadgeDone: { backgroundColor: T.brass, borderColor: T.brass },
});
