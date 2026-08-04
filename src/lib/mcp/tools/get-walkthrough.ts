import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TRACKABLE_BY_ID } from "@/data";
import { isOfficial } from "@/data/types";

export default defineTool({
  name: "get_walkthrough",
  title: "Get walkthrough",
  description:
    "Get the full walkthrough for one guide entry by id: objectives, step-by-step checklist, gold medal requirements, missable warnings, rewards, map marker details and unlock steps.",
  inputSchema: {
    id: z.string().min(1).describe("Trackable id, e.g. a mission or collectible id from list_items."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const t = TRACKABLE_BY_ID[id];
    if (!t) throw new ToolError(`No guide entry with id "${id}". Use list_items or search_guide to find valid ids.`);
    const payload = {
      id: t.id,
      title: t.title,
      category: t.category,
      region: t.region,
      official100: isOfficial(t),
      summary: t.summary,
      walkthrough: t.descriptiveWalkthrough,
      keyObjectives: t.keyObjectives,
      checklistSteps: t.checklistSteps.map((s) => s.label),
      goldMedal: t.goldMedal ?? [],
      quickFacts: t.quickFacts ?? [],
      missableWarnings: t.missableWarnings ?? [],
      missableWindow: t.missableWindow,
      rewardsOrOutcomes: t.rewardsOrOutcomes,
      followUpOpportunities: t.followUpOpportunities ?? [],
      relatedCollectibles: t.relatedCollectibles ?? [],
      unlockSteps: t.unlockSteps ?? [],
      mapMarker: t.mapMarker
        ? {
            caption: t.mapMarker.caption,
            coords: t.mapMarker.coords,
            pin: t.mapMarker.pin,
            image: t.mapMarker.image.url,
          }
        : undefined,
      mapMarkers: t.mapMarkers ?? [],
      tags: t.tags ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
