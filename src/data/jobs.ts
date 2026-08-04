import type { Job, Region } from "./types";

/**
 * 5 jobs required for official 100% completion (verified against Jimbatron
 * RDR 100% guide):
 *  - Nightwatch at MacFarlane's Ranch
 *  - Horsebreaking at Ridgewood Farm
 *  - Horsebreaking at Chuparosa
 *  - Nightwatch at Chuparosa
 *  - Nightwatch at Blackwater
 *
 * Cattle Herding and standalone Horse Breaking at MacFarlane's do NOT count
 * toward the 100% job stat (they're part of the Bonnie MacFarlane story
 * chain instead).
 */

interface Seed {
  slug: string;
  title: string;
  jobType: string;
  region: Region;
  payout: string;
  summary: string;
  walkthrough: string;
  tags?: string[];
}

function job(s: Seed): Job {
  return {
    id: `job-${s.slug}`,
    title: s.title,
    category: "jobs",
    jobType: s.jobType,
    region: s.region,
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    payout: s.payout,
    summary: s.summary,
    descriptiveWalkthrough: s.walkthrough,
    keyObjectives: ["Accept the job", "Complete the shift"],
    rewardsOrOutcomes: [s.payout, "Fame + Honor", "Outfit scrap credit (see notes)"],
    checklistSteps: [{ id: "shift", label: "Complete one shift" }],
    tags: s.tags,
  };
}

const SEEDS: Seed[] = [
  {
    slug: "nightwatch-macfarlanes",
    title: "Nightwatch — MacFarlane's Ranch",
    jobType: "Nightwatch",
    region: "Hennigan's Stead",
    payout: "$4",
    summary: "First required job. Also unlocks a Bollard Twins outfit scrap.",
    walkthrough:
      "Speak to the ranch foreman at night. Respond to icon alerts around the ranch — non-lethal takedowns preserve honor and count for the same payout. Completing this unlocks a required outfit scrap for the Bollard Twins outfit.",
    tags: ["ranch", "scrap"],
  },
  {
    slug: "horsebreaking-ridgewood",
    title: "Horsebreaking — Ridgewood Farm",
    jobType: "Horse Breaking",
    region: "Cholla Springs",
    payout: "$5",
    summary: "Break wild horses at Ridgewood Farm — also required for the optional Walton's Gang outfit.",
    walkthrough:
      "Available after the Bonnie MacFarlane story missions unlock the lasso. Push the left stick opposite to the horse's lean and don't overcorrect. Two clean rides completes the shift.",
    tags: ["ranch", "walton-outfit-step"],
  },
  {
    slug: "horsebreaking-chuparosa",
    title: "Horsebreaking — Chuparosa",
    jobType: "Horse Breaking",
    region: "Perdido",
    payout: "$5",
    summary: "Break wild horses in Mexico. Also required for the Reyes' Rebels outfit scrap chain.",
    walkthrough:
      "Speak to the Mexican rancher at the Chuparosa corral. Same technique as MacFarlane's. Required step for the Reyes' Rebels outfit.",
    tags: ["mexico", "scrap"],
  },
  {
    slug: "nightwatch-chuparosa",
    title: "Nightwatch — Chuparosa",
    jobType: "Nightwatch",
    region: "Perdido",
    payout: "$4",
    summary: "Patrol Chuparosa overnight — also required for the Bandito outfit scrap chain.",
    walkthrough:
      "Speak to the Rurales captain at the cantina after dark. Arrest rather than shoot when possible. Unlocks a Bandito outfit scrap.",
    tags: ["mexico", "scrap"],
  },
  {
    slug: "nightwatch-blackwater",
    title: "Nightwatch — Blackwater",
    jobType: "Nightwatch",
    region: "Blackwater",
    payout: "$5",
    summary: "Patrol Blackwater overnight — also required for the U.S. Army Uniform outfit scrap chain.",
    walkthrough:
      "Available after arriving in Blackwater. Alerts include pickpockets and saloon brawls — lasso runners for best payout. Also a good venue for the optional Tomahawk Rank 2 challenge (throw / melee / horseback kills).",
    tags: ["blackwater", "scrap", "tomahawk-friendly"],
  },
];

export const JOBS: Job[] = SEEDS.map(job);
