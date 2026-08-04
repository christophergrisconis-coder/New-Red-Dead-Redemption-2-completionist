import type { CategoryMeta } from './types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'story', label: 'Story Missions', short: 'Story', description: 'All 57 storyline missions across New Austin, Mexico, West Elizabeth and the epilogue.', icon: '🎯', expectedOfficial: 57, officialText: 'Complete all 57 main story missions.' },
  { id: 'strangers', label: 'Stranger Missions', short: 'Strangers', description: 'Side stories that count toward official 100% (18 of 19).', icon: '🪶', expectedOfficial: 18, officialText: '18 count toward 100%. "I Know You" is tracked as extra.' },
  { id: 'challenges', label: 'Ambient Challenges', short: 'Challenges', description: 'Hunting, Sharpshooter, Survivalist and Treasure Hunter chains.', icon: '🎖', expectedOfficial: 4, officialText: '4 required chains — 10 ranks each = 40 ranks total.' },
  { id: 'bounties', label: 'Bounty Locations', short: 'Bounties', description: '20 posted bounty locations across three provinces.', icon: '📜', expectedOfficial: 20, officialText: '20 bounty locations (8 New Austin + 8 Nuevo Paraíso + 4 West Elizabeth).' },
  { id: 'jobs', label: 'Ambient Jobs', short: 'Jobs', description: 'Nightwatch and Horsebreaking shifts required for 100%.', icon: '🤠', expectedOfficial: 5, officialText: '5 job shifts (3 Nightwatch + 2 Horsebreaking).' },
  { id: 'hideouts', label: 'Gang Hideouts', short: 'Hideouts', description: '7 hideouts to clear in free-roam.', icon: '🏚', expectedOfficial: 7, officialText: 'Clear 7 hideouts once each in free roam.' },
  { id: 'minigames', label: 'Minigames', short: 'Minigames', description: 'Win each of the 6 minigame types once.', icon: '🎲', expectedOfficial: 6, officialText: 'Win each of 6 minigame types once.' },
  { id: 'locations', label: 'Map Locations', short: 'Locations', description: 'Discover all 94 named locations across the frontier.', icon: '🗺', expectedOfficial: 94, officialText: 'Discover all 94 locations.' },
  { id: 'outfits', label: 'Key Outfits', short: 'Outfits', description: '9 key outfits per IGN checklist (extras are cosmetic).', icon: '👕', expectedOfficial: 9, officialText: '9 key outfits (IGN Checklist).' },
  { id: 'weapons', label: 'Rare Weapons', short: 'Weapons', description: '5 rare weapons required for 100%.', icon: '🔫', expectedOfficial: 5, officialText: '5 rare weapons: LeMat, Semi-Auto Shotgun, Carcano, Mauser, Evans Repeater.' },
  { id: 'safehouses', label: 'Safehouses', short: 'Safehouses', description: '13 safehouses (IGN checklist): 8 purchasable + 3 story + Ridgewood + Plainview.', icon: '🏠', expectedOfficial: 13, officialText: '13 safehouses.' },
  { id: 'collectibles', label: 'Collectibles', short: 'Collect', description: 'Treasure maps, flowers and completionist collections.', icon: '💎', expectedOfficial: 0, officialText: 'Completionist tracking only.' },
];

export const CATEGORY_BY_ID: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
