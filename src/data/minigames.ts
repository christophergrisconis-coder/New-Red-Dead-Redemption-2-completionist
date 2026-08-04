import type { Minigame } from "./types";

/**
 * 6 minigame types required for official 100% completion — you must win
 * each at least once. Recommended locations (per Jimbatron RDR 100% guide)
 * align with the outfit scrap chains so a single win double-dips.
 */

export const MINIGAMES: Minigame[] = [
  {
    id: "minigame-horseshoes",
    title: "Horseshoes",
    category: "minigames",
    gameType: "Horseshoes",
    region: "Hennigan's Stead",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["MacFarlane's Ranch"],
    summary: "Win at Horseshoes — recommended at MacFarlane's Ranch (Bollard Twins outfit scrap).",
    descriptiveWalkthrough:
      "Line up Marston's arm with the pole, pull back and push forward fast, releasing in the middle of the meter. Getting a ringer unlocks 'What About Hand Grenades?' achievement — luck-heavy, save first.",
    keyObjectives: ["Win one match at MacFarlane's Ranch"],
    rewardsOrOutcomes: ["Bollard Twins outfit scrap", "What About Hand Grenades? (ringer)"],
    checklistSteps: [{ id: "s1", label: "Win at MacFarlane's Ranch" }],
    tags: ["yard", "scrap"],
  },
  {
    id: "minigame-blackjack",
    title: "Blackjack",
    category: "minigames",
    gameType: "Blackjack",
    region: "Cholla Springs",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["Rathskeller Fork"],
    summary: "Profit at Blackjack — required at Rathskeller Fork (Treasure Hunter outfit scrap).",
    descriptiveWalkthrough:
      "Simply finish with more money than you started. Winning the first hand of any bet works. Double down on 9/10/11 hands only. Wear the Elegant Suit to cheat once you have it.",
    keyObjectives: ["Make a profit at Rathskeller Fork"],
    rewardsOrOutcomes: ["Treasure Hunter outfit scrap"],
    checklistSteps: [{ id: "s1", label: "Profit at Rathskeller Fork" }],
    tags: ["cards", "scrap"],
  },
  {
    id: "minigame-five-finger-fillet",
    title: "Five Finger Fillet",
    category: "minigames",
    gameType: "Five Finger Fillet",
    region: "Diez Coronas",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["Torquemada"],
    summary: "Beat an opponent at Five Finger Fillet — required at Torquemada (Reyes' Rebels scrap).",
    descriptiveWalkthrough:
      "Match the on-screen prompts. Rhythm beats speed — miss a prompt and you lose the round. Best done immediately after 'Empty Promises' since you're already in the area.",
    keyObjectives: ["Win one match at Torquemada"],
    rewardsOrOutcomes: ["Reyes' Rebels outfit scrap"],
    checklistSteps: [{ id: "s1", label: "Win at Torquemada" }],
    tags: ["knife", "scrap", "mexico"],
  },
  {
    id: "minigame-liars-dice",
    title: "Liar's Dice",
    category: "minigames",
    gameType: "Liar's Dice",
    region: "Diez Coronas",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["Casa Madrugada"],
    summary: "Defeat all players at Liar's Dice — required at Casa Madrugada (Bandito outfit scrap).",
    descriptiveWalkthrough:
      "Ones are wild. Bid conservatively, wait for AI to make obviously false claims (they always do eventually), and call spot on when it looks tight. Chain the 'No Dice' achievement (no die lost).",
    keyObjectives: ["Win at Casa Madrugada"],
    rewardsOrOutcomes: ["Bandito outfit scrap", "No Dice achievement (bonus)"],
    checklistSteps: [{ id: "s1", label: "Win at Casa Madrugada" }],
    tags: ["dice", "scrap", "mexico"],
  },
  {
    id: "minigame-arm-wrestling",
    title: "Arm Wrestling",
    category: "minigames",
    gameType: "Arm Wrestling",
    region: "Blackwater",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["Pacific Union Railroad Camp"],
    summary: "Win an Arm Wrestling match — required at the Pacific Union RR Camp (U.S. Army outfit scrap).",
    descriptiveWalkthrough:
      "Wait for the opponent's push, resist with equal input, then counter-push when their meter dips. Rushing loses. Best paired with 'Lights, Camera, Action' Part II — the mission takes you here.",
    keyObjectives: ["Win at Pacific Union RR Camp"],
    rewardsOrOutcomes: ["U.S. Army Uniform outfit scrap"],
    checklistSteps: [{ id: "s1", label: "Win at Pacific Union RR Camp" }],
    tags: ["blackwater", "scrap"],
  },
  {
    id: "minigame-poker",
    title: "Poker",
    category: "minigames",
    gameType: "Poker",
    region: "Blackwater",
    isRequiredForOfficial100: true,
    isOptionalSideContent: false,
    locations: ["Blackwater Saloon"],
    summary: "Eliminate all other players at Poker — required at Blackwater Saloon (U.S. Army outfit scrap).",
    descriptiveWalkthrough:
      "Use the Elegant Suit to cheat (Saloon table only — the Hotel is high-stakes and disallows cheating). Go all-in on your first big hand for the 'High Roller' achievement (2,000 chips in one hand — save first, reload on loss).",
    keyObjectives: ["Win at Blackwater Saloon (all players out)"],
    rewardsOrOutcomes: ["U.S. Army Uniform outfit scrap", "High Roller achievement (bonus)"],
    checklistSteps: [{ id: "s1", label: "Win at Blackwater Saloon" }],
    tags: ["cards", "scrap", "blackwater"],
  },
];
