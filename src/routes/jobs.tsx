import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Ambient Jobs — RDR1 Guide" },
      { name: "description", content: "Every ambient job — Nightwatch, horse breaking, cattle herding and more." },
    ],
  }),
  component: () => <CategoryPage categoryId="jobs" />,
});
