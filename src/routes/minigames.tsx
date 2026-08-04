import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/guide/CategoryPage";

export const Route = createFileRoute("/minigames")({
  head: () => ({
    meta: [
      { title: "Minigames — RDR1 Guide" },
      { name: "description", content: "Poker, Blackjack, Liar's Dice, Five Finger Fillet, Horseshoes and Arm Wrestling requirements." },
    ],
  }),
  component: () => <CategoryPage categoryId="minigames" />,
});
