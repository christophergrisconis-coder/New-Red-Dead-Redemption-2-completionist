import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/bounties")({
  head: () => ({
    meta: [
      { title: "Bounties — RDR1 Guide" },
      { name: "description", content: "Every posted bounty in Red Dead Redemption with alive-vs-dead payouts." },
    ],
  }),
  component: () => <CategoryPage categoryId="bounties" />,
});
