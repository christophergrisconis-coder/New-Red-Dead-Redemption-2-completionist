import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { ALL_TRACKABLES } from "@/data";
import { isOfficial } from "@/data/types";

export default defineTool({
  name: "search_guide",
  title: "Search the guide",
  description:
    "Free-text search across every Red Dead Redemption 1 guide entry (titles, summaries, walkthroughs, tags) and return matching ids for get_walkthrough.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Search text, e.g. 'Evans Repeater' or 'treasure map'."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 15)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const results = ALL_TRACKABLES.filter((t) =>
      [t.title, t.summary, t.descriptiveWalkthrough, t.region, ...(t.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
      .slice(0, limit ?? 15)
      .map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        region: t.region,
        official100: isOfficial(t),
        summary: t.summary,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: results.length, results }, null, 2) }],
      structuredContent: { count: results.length, results },
    };
  },
});
