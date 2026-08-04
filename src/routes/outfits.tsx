import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/outfits")({
  head: () => ({
    meta: [
      { title: "Outfits — RDR1 Guide" },
      { name: "description", content: "Every Marston outfit and its unlock requirements." },
    ],
  }),
  component: () => <CategoryPage categoryId="outfits" />,
});
