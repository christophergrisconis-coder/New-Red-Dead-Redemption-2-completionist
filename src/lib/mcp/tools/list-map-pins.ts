import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { ALL_TRACKABLES } from "@/data";

export default defineTool({
  name: "list_map_pins",
  title: "List map pins",
  description:
    "List every guide entry that has a map pin on the Border States 1910 base map — rare weapons, treasure maps, hideouts and bounty locations — with normalized coordinates and captions.",
  inputSchema: {
    category: z.string().optional().describe("Optional category id filter, e.g. 'weapons' or 'collectibles'."),
    verifiedOnly: z.boolean().optional().describe("When true, only pins with verified coordinates."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, verifiedOnly }) => {
    const pins = ALL_TRACKABLES.flatMap((t) => {
      const pin = t.mapMarker?.pin;
      if (!pin) return [];
      if (category && t.category !== category) return [];
      if (verifiedOnly && !pin.verified) return [];
      return [
        {
          id: t.id,
          title: t.title,
          category: t.category,
          region: pin.region,
          x: pin.x,
          y: pin.y,
          caption: pin.caption,
          coordNote: pin.coordNote,
          verified: pin.verified,
        },
      ];
    });
    return {
      content: [{ type: "text", text: JSON.stringify({ count: pins.length, pins }, null, 2) }],
      structuredContent: { count: pins.length, pins },
    };
  },
});
