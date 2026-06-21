import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import factoryImg from "@/assets/factory.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Khodiyar Industry — Edible Chuna Manufacturer" },
      {
        name: "description",
        content:
          "Khodiyar Industry manufactures edible chuna with a focus on purity, hygiene and reliable B2B supply across India.",
      },
      { property: "og:title", content: "About Khodiyar Industry" },
      {
        property: "og:description",
        content:
          "Our story, our facility, and our commitment to quality edible chuna.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { k: "2", v: t("aboutPage.stat1Label") },
    { k: "6", v: t("aboutPage.stat2Label") },
    { k: "100%", v: t("aboutPage.stat3Label") },
  ];

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow={t("aboutPage.eyebrow")}
            title={t("aboutPage.title")}
            description={t("aboutPage.desc")}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
            <img
              src={factoryImg}
              alt="Khodiyar Industry manufacturing facility"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-5 text-base text-muted-foreground">
            <p>{t("aboutPage.storyP1")}</p>
            <p>{t("aboutPage.storyP2")}</p>
            <p>{t("aboutPage.storyP3")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-brand-blue"
              >
                <Link to="/products">{t("aboutPage.viewProducts")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">{t("aboutPage.getQuote")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 sm:grid-cols-3 lg:px-8">
          {stats.map((s) => (
            <div key={s.v} className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center">
              <div className="text-4xl font-bold text-brand-gold">{s.k}</div>
              <div className="mt-1 text-sm uppercase tracking-wider text-primary-foreground/75">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
