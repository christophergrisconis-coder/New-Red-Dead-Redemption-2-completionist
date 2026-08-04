import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/weapons")({
  head: () => ({
    meta: [
      { title: "Weapons — RDR1 Guide" },
      { name: "description", content: "The full weapon roster relevant to 100% and collection." },
    ],
  }),
  component: () => <CategoryPage categoryId="weapons" />,
});
