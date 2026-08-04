import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/hideouts")({
  head: () => ({
    meta: [
      { title: "Gang Hideouts — RDR1 Guide" },
      { name: "description", content: "Every gang hideout with clearing tactics and 100% credit tracking." },
    ],
  }),
  component: () => <CategoryPage categoryId="hideouts" />,
});
