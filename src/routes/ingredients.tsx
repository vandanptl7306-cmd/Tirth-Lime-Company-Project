import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { IngredientsSection } from "@/components/site/IngredientsSection";

export const Route = createFileRoute("/ingredients")({
  head: () => ({
    meta: [
      { title: "Ingredients & Purity — KHODIYAR GRUH UDHYOG" },
      {
        name: "description",
        content: "Discover the pure, natural raw materials used in our edible chuna manufacturing. From premium limestone to multi-stage filtered water.",
      },
    ],
  }),
  component: IngredientsPage,
});

function IngredientsPage() {
  return (
    <SiteLayout>
      <div className="pt-6">
        <IngredientsSection />
      </div>
    </SiteLayout>
  );
}
