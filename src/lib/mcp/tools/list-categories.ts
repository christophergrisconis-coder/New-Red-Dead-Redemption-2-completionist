import { defineTool } from "@lovable.dev/mcp-js";
import { computeDatasetStats, computeDatasetHealth } from "@/data";

export default defineTool({
  name: "list_categories",
  title: "List guide categories",
  description:
    "List all Red Dead Redemption 1 completion categories with official 100% counts, completionist extras, and dataset health.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const stats = computeDatasetStats().map((s) => ({
      categoryId: s.categoryId,
      label: s.label,
      mode: s.mode,
      official: s.actualOfficial,
      extras: s.actualExtras,
      total: s.actualTotal,
      officialRequirement: s.officialRequirementText,
    }));
    const health = computeDatasetHealth();
    return {
      content: [{ type: "text", text: JSON.stringify({ health, categories: stats }, null, 2) }],
      structuredContent: { health, categories: stats },
    };
  },
});
