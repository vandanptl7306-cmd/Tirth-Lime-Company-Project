import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  FlaskConical,
  Factory,
  PackageCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality & Hygiene — Khodiyar Industry" },
      {
        name: "description",
        content:
          "FSSAI-certified edible chuna manufacturing with strict hygiene controls, premium raw materials and quality testing at every batch.",
      },
      { property: "og:title", content: "Quality & Hygiene — Khodiyar Industry" },
      {
        property: "og:description",
        content:
          "Inside our food-grade manufacturing process for edible chuna.",
      },
    ],
  }),
  component: QualityPage,
});

const STEPS = [
  {
    icon: FlaskConical,
    title: "Sourcing & Testing",
    desc: "Limestone and inputs are sourced from trusted partners and tested for purity before production.",
  },
  {
    icon: Factory,
    title: "Controlled Manufacturing",
    desc: "Production happens in a clean, controlled facility with documented food-safety procedures.",
  },
  {
    icon: PackageCheck,
    title: "Hygienic Packing",
    desc: "Each batch is packed in sealed, food-grade containers — ready for retail or repacking.",
  },
];

function QualityPage() {
  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Quality & Hygiene"
            title="Built for food-safety, batch after batch"
            description="From sourcing to sealing, every step is designed to deliver consistent purity and hygiene."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-gold/40 bg-gradient-to-br from-brand-gold-soft to-white p-8 sm:p-12">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-gold text-primary shadow-md">
                <BadgeCheck className="h-10 w-10" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-amber-900">
                  Certification
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                  FSSAI Certified Edible Chuna Manufacturer
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  We comply with all applicable Food Safety and Standards Authority of
                  India regulations for edible lime products, ensuring our partners stock a
                  product they can stand behind.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Step {i + 1}
                </div>
                <div className="mt-2 grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Hygiene-first", desc: "Cleaning and sanitation built into daily SOPs." },
              { icon: Sparkles, title: "Premium inputs", desc: "Quality raw materials, never compromised on cost." },
              { icon: Truck, title: "Reliable dispatch", desc: "Predictable lead times for repeat distributors." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                <p.icon className="h-6 w-6 text-brand-gold" />
                <h4 className="mt-3 text-base font-bold text-foreground">{p.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
