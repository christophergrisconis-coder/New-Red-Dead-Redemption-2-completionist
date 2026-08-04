import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — RDR1 Guide" },
      { name: "description", content: "Every discoverable town, settlement and landmark, tracked by region." },
    ],
  }),
  component: () => <CategoryPage categoryId="locations" />,
});
