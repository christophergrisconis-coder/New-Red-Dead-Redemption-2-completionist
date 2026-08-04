import { defineMcp } from "@lovable.dev/mcp-js";
import listCategories from "./tools/list-categories";
import listItems from "./tools/list-items";
import getWalkthrough from "./tools/get-walkthrough";
import searchGuide from "./tools/search-guide";
import listMapPins from "./tools/list-map-pins";

export default defineMcp({
  name: "red-dead-completionist",
  title: "Red Dead Completionist",
  version: "0.1.0",
  instructions:
    "Tools for the Red Dead Redemption 1 Completionist Guide. Use `list_categories` for the category overview and official 100% counts, `list_items` to enumerate a category, `search_guide` to find entries by text, `get_walkthrough` for the full per-quest walkthrough (objectives, checklist, gold medal, missables), and `list_map_pins` for map coordinates of rare weapons, treasures, hideouts and bounties. All data is read-only public guide content; there is no user progress tracking over MCP.",
  tools: [listCategories, listItems, searchGuide, getWalkthrough, listMapPins],
});
