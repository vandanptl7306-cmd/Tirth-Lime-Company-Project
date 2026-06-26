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
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

function QualityPage() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: FlaskConical,
      title: t("qualityPage.step1Title"),
      desc: t("qualityPage.step1Desc"),
    },
    {
      icon: Factory,
      title: t("qualityPage.step2Title"),
      desc: t("qualityPage.step2Desc"),
    },
    {
      icon: PackageCheck,
      title: t("qualityPage.step3Title"),
      desc: t("qualityPage.step3Desc"),
    },
  ];

  const pillars = [
    { icon: ShieldCheck, title: t("qualityPage.pillar1Title"), desc: t("qualityPage.pillar1Desc") },
    { icon: Sparkles, title: t("qualityPage.pillar2Title"), desc: t("qualityPage.pillar2Desc") },
    { icon: Truck, title: t("qualityPage.pillar3Title"), desc: t("qualityPage.pillar3Desc") },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo(
        ".quality-header-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
      );

      // 2. Certification banner scale-in / spring bounce
      gsap.fromTo(
        ".quality-banner-reveal",
        { opacity: 0, scale: 0.9, rotate: -2 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".quality-banner-reveal",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // 3. Staggered reveal of process steps
      gsap.fromTo(
        ".quality-step-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".quality-steps-container",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // 4. Staggered reveal of pillars
      gsap.fromTo(
        ".quality-pillar-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".quality-pillars-container",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 quality-header-reveal opacity-0">
          <SectionHeading
            align="left"
            eyebrow={t("qualityPage.eyebrow")}
            title={t("qualityPage.title")}
            description={t("qualityPage.desc")}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="quality-banner-reveal opacity-0 rounded-3xl border border-brand-gold/40 bg-gradient-to-br from-brand-gold-soft to-white p-8 sm:p-12">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-gold text-primary shadow-md">
                <BadgeCheck className="h-10 w-10" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-amber-900">
                  {t("whyChooseUs.certLabel")}
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                  {t("qualityPage.certTitle")}
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {t("qualityPage.certDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 quality-steps-container">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="quality-step-card opacity-0 relative rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  {t("qualityPage.stepLabel")} {i + 1}
                </div>
                <div className="mt-2 grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 quality-pillars-container">
            {pillars.map((p) => (
              <div key={p.title} className="quality-pillar-card opacity-0 rounded-2xl border border-border bg-card p-6">
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
