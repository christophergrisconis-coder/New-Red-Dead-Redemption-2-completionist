import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DATA_BY_CATEGORY } from "@/data";
import { isOfficial, type CategoryId } from "@/data/types";

const CATEGORY_IDS = Object.keys(DATA_BY_CATEGORY) as CategoryId[];

export default defineTool({
  name: "list_items",
  title: "List guide items",
  description:
    "List trackable entries in one Red Dead Redemption 1 category (story, strangers, bounties, collectibles, etc.), optionally filtered to official 100% items or a region.",
  inputSchema: {
    category: z
      .enum(CATEGORY_IDS as [CategoryId, ...CategoryId[]])
      .describe("Category to list."),
    officialOnly: z
      .boolean()
      .optional()
      .describe("When true, only entries required for official 100% completion."),
    region: z.string().optional().describe("Filter by region name, e.g. 'New Austin'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, officialOnly, region }) => {
    let rows = DATA_BY_CATEGORY[category] ?? [];
    if (officialOnly) rows = rows.filter((t) => isOfficial(t));
    if (region) {
      const needle = region.toLowerCase();
      rows = rows.filter((t) => t.region.toLowerCase().includes(needle));
    }
    const items = rows.map((t) => ({
      id: t.id,
      title: t.title,
      region: t.region,
      official100: isOfficial(t),
      summary: t.summary,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: items.length, items }, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
