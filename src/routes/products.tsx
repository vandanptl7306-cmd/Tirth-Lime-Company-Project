import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, getStoredProducts } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Edible Chuna Products — Khodiyar Industry" },
      {
        name: "description",
        content:
          "Browse the Tirth and Riddhi Siddhi edible chuna range — white and yellow variants in Medium, Ghata, Packing and Loose formats.",
      },
      { property: "og:title", content: "Edible Chuna Catalog — Khodiyar Industry" },
      {
        property: "og:description",
        content:
          "Wholesale catalog of edible chuna products. Inquire on WhatsApp for bulk pricing.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={t("catalog.eyebrow")}
            title={t("catalog.title")}
            description={t("catalog.desc")}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-primary p-8 text-primary-foreground sm:p-12">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  {t("catalog.customQuoteTitle")}
                </h3>
                <p className="mt-2 max-w-xl text-primary-foreground/80">
                  {t("catalog.customQuoteDesc")}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold"
              >
                <Link to="/contact">
                  {t("nav.getQuote")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
