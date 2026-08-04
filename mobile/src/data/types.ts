export type Region =
  | 'New Austin'
  | 'West Elizabeth'
  | 'Nuevo Paraiso'
  | 'Blackwater'
  | 'Tall Trees'
  | 'Great Plains'
  | 'Cholla Springs'
  | 'Gaptooth Ridge'
  | "Hennigan's Stead"
  | 'Rio Bravo'
  | 'Perdido'
  | 'Punta Orgullo'
  | 'Diez Coronas'
  | 'Other';

export type CategoryId =
  | 'story'
  | 'strangers'
  | 'challenges'
  | 'bounties'
  | 'jobs'
  | 'hideouts'
  | 'minigames'
  | 'collectibles'
  | 'locations'
  | 'outfits'
  | 'weapons'
  | 'safehouses';

export interface ChecklistStep {
  id: string;
  label: string;
}

export interface Trackable {
  id: string;
  title: string;
  category: CategoryId;
  region: Region;
  isRequiredForOfficial100: boolean;
  isCompletionistExtra?: boolean;
  categorySubtype?: string;
  summary: string;
  walkthrough: string;
  objectives: string[];
  rewards: string[];
  steps: ChecklistStep[];
  tags?: string[];
  meta?: Record<string, string>;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  icon: string; // emoji glyph for zero-dep icons
  expectedOfficial: number;
  officialText: string;
}

export function isOfficial(t: Trackable) {
  return t.isRequiredForOfficial100;
}
export function isExtra(t: Trackable) {
  return t.isCompletionistExtra ?? !t.isRequiredForOfficial100;
}
