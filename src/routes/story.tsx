import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Story Missions — RDR1 Guide" },
      { name: "description", content: "Every Red Dead Redemption story mission with an original walkthrough and 100% checklist." },
    ],
  }),
  component: () => <CategoryPage categoryId="story" />,
});
