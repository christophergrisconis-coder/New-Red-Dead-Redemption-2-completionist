import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — RDR1 Guide" },
      { name: "description", content: "Hunting, Sharpshooter, Survivalist and Treasure Hunter ranks tracked rank-by-rank." },
    ],
  }),
  component: () => <CategoryPage categoryId="challenges" />,
});
