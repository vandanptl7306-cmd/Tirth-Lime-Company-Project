import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  BadgeCheck,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PRODUCTS, buildWaLink } from "@/lib/products";
import factoryImg from "@/assets/factory.jpg";
import chunaWhite from "@/assets/chuna-white.jpg";
import chunaYellow from "@/assets/chuna-yellow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Khodiyar Industry — Premium Edible Chuna for Your Business" },
      {
        name: "description",
        content:
          "FSSAI-certified manufacturer of edible chuna (lime water). Tirth and Riddhi Siddhi product range for wholesalers, distributors and paan-shop vendors.",
      },
      { property: "og:title", content: "Khodiyar Industry — Edible Chuna Wholesale" },
      {
        property: "og:description",
        content:
          "Premium edible chuna manufactured to the highest hygiene standards. Reliable bulk supply across India.",
      },
    ],
  }),
  component: Home,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Hygienic Manufacturing",
    desc: "Every batch is produced in a controlled facility following strict food-safety protocols.",
  },
  {
    icon: Sparkles,
    title: "Premium Raw Materials",
    desc: "Carefully sourced limestone and filtered water for consistent purity and texture.",
  },
  {
    icon: Truck,
    title: "Reliable Bulk Supply",
    desc: "On-time dispatch and dependable distribution for wholesalers across India.",
  },
];

function Home() {
  const heroWa = buildWaLink(
    "Hello Khodiyar Industry, I'd like to inquire about your edible chuna range.",
  );

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 80% -10%, color-mix(in oklab, var(--brand-gold) 18%, transparent), transparent 60%), radial-gradient(1000px 600px at -10% 10%, color-mix(in oklab, var(--brand-blue) 12%, transparent), transparent 55%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <BadgeCheck className="h-4 w-4" />
              FSSAI Certified Manufacturer
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Premium Edible Chuna{" "}
              <span className="text-brand-blue">for Your Business.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              High-quality, hygienically manufactured lime water for wholesale and
              distribution. Trusted by retailers and paan-shop vendors across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-brand-blue"
              >
                <Link to="/products">
                  View Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white"
              >
                <a href={heroWa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Inquire on WhatsApp
                </a>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Two trusted brands: Tirth & Riddhi Siddhi",
                "White & yellow chuna variants",
                "Medium, Ghata, Packing & Loose",
                "Pan-India bulk distribution",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-gold-soft via-white to-secondary blur-2xl opacity-70" />
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                <img
                  src={chunaWhite}
                  alt="White edible chuna jar"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                <img
                  src={chunaYellow}
                  alt="Yellow edible chuna tub"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 left-4 right-4 mx-auto flex max-w-xs items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:left-auto sm:right-[-20px] sm:max-w-[280px]">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gold/15 text-brand-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">FSSAI Compliant</div>
                <div className="text-muted-foreground">
                  Food-grade manufacturing standards
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Trust built on quality and hygiene"
            description="Our manufacturing process and certifications give B2B partners confidence in every batch they distribute."
          />

          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-4 rounded-2xl border border-brand-gold/40 bg-card p-5 shadow-sm">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-gold text-primary shadow-sm">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
                Certification
              </div>
              <div className="text-lg font-bold text-foreground">
                FSSAI Certified Food-Grade Manufacturer
              </div>
              <p className="text-sm text-muted-foreground">
                Compliant with all applicable Food Safety and Standards Authority of India
                regulations for edible lime products.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-brand-gold group-hover:text-primary">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Catalog"
            title="Edible Chuna Product Range"
            description="Six variants under our Tirth and Riddhi Siddhi brands — choose the format your customers prefer."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                View full catalog <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-primary-foreground/10 shadow-2xl">
            <img
              src={factoryImg}
              alt="Khodiyar Industry manufacturing facility"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              About Us
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              A name B2B partners trust for{" "}
              <span className="text-brand-gold">edible chuna</span>
            </h2>
            <p className="mt-5 text-primary-foreground/80">
              Khodiyar Industry has been manufacturing edible chuna with an uncompromising
              focus on purity, hygiene and consistency. Our modern facility, careful sourcing
              and process discipline let wholesalers, distributors and paan-shop vendors
              stock our brands with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold"
              >
                <Link to="/about">Learn more about us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/quality">Quality & Hygiene</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Bulk Inquiry"
              title="Get a wholesale quote"
              description="Tell us what you need and we'll respond on WhatsApp with pricing and dispatch details."
            />
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "Fastest response via WhatsApp",
                "Custom quotes for distributors & retailers",
                "Pan-India dispatch and logistics support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
            <InquiryForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
