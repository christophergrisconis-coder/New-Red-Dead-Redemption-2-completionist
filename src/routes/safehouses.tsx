import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/safehouses")({
  head: () => ({
    meta: [
      { title: "Safehouses — RDR1 Guide" },
      { name: "description", content: "Every safehouse purchase and its cost." },
    ],
  }),
  component: () => <CategoryPage categoryId="safehouses" />,
});
