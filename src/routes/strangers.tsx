import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/strangers")({
  head: () => ({
    meta: [
      { title: "Stranger Missions — RDR1 Guide" },
      { name: "description", content: "Track every Red Dead Redemption stranger quest chain with walkthroughs." },
    ],
  }),
  component: () => <CategoryPage categoryId="strangers" />,
});
