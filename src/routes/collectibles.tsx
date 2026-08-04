import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/collectibles")({
  head: () => ({
    meta: [
      { title: "Collectibles — RDR1 Guide" },
      { name: "description", content: "Treasure maps, flowers and completionist collection sets." },
    ],
  }),
  component: () => <CategoryPage categoryId="collectibles" />,
});
