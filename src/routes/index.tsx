import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  BadgeCheck,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  MapPin,
  Globe,
  Map,
  Star,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PRODUCTS, buildWaLink, getStoredProducts } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";
import factoryImg from "@/assets/factory.jpg";
import chunaWhite from "@/assets/chuna-white.jpg";
import chunaYellow from "@/assets/chuna-yellow.jpg";
import { getStoredFeedback, type CustomerFeedback } from "@/lib/feedback";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KHODIYAR GRUH UDHYOG — Premium Edible Chuna for Your Business" },
      {
        name: "description",
        content:
          "FSSAI-certified manufacturer of edible chuna (lime water). Tirth and Riddhi Siddhi product range for wholesalers, distributors and paan-shop vendors.",
      },
      { property: "og:title", content: "KHODIYAR GRUH UDHYOG — Edible Chuna Wholesale" },
      {
        property: "og:description",
        content:
          "Premium edible chuna manufactured to the highest hygiene standards. Reliable bulk supply across India.",
      },
    ],
  }),
  component: Home,
});

const renderSplitText = (text: string) => {
  return text.split(" ").map((word, i) => (
    <span key={i} className="word-mask">
      <span className="hero-text-word">
        {word}
      </span>
    </span>
  ));
};

function Home() {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch((err) => {
        console.log("Autoplay failed or was blocked:", err);
      });
    }

    // Make body background transparent to reveal fixed video at negative z-index
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  let waInquireMsg = "Hello KHODIYAR GRUH UDHYOG, I'd like to inquire about your edible chuna range.";
  if (language === "gu") {
    waInquireMsg = "નમસ્તે ખોડિયાર ગૃહ ઉદ્યોગ, હું તમારા ખાવાલાયક ચૂનાની પ્રોડક્ટ શ્રેણી માટે પૂછપરછ કરવા માંગુ છું.";
  } else if (language === "hi") {
    waInquireMsg = "नमस्ते खोदियार गृह उद्योग, मैं आपकी खाने योग्य चूना उत्पाद श्रृंखला के बारे में पूछताछ करना चाहता हूँ।";
  }

  const heroWa = buildWaLink(waInquireMsg);

  let waDistributorMsg = "Hello, I want to discuss becoming a distributor for your edible chuna products.";
  if (language === "gu") {
    waDistributorMsg = "નમસ્તે, હું તમારા ખાવાલાયક ચૂનાના ઉત્પાદનો માટે વિતરક બનવા ચર્ચા કરવા માંગુ છું.";
  } else if (language === "hi") {
    waDistributorMsg = "नमस्ते, मैं आपके खाने योग्य चूना उत्पादों के लिए वितरक बनने के बारे में चर्चा करना चाहता हूँ।";
  }

  const distributorWa = buildWaLink(waDistributorMsg);

  const [products, setProducts] = useState(PRODUCTS);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  
  useEffect(() => {
    setFeedbacks(getStoredFeedback().filter(f => f.approved && f.rating >= 4));
  }, []);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles (max 10 degrees tilt)
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;

    // Parallax sub-elements moving at different depths for premium feel
    gsap.to(container.querySelector(".hero-jar-left"), {
      rotateX: rotateX * 0.8,
      rotateY: rotateY * 0.8,
      x: x * 0.04,
      y: y * 0.04,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(container.querySelector(".hero-jar-right"), {
      rotateX: rotateX * 1.2,
      rotateY: rotateY * 1.2,
      x: x * 0.07,
      y: y * 0.07,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleHeroMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    gsap.to(container.querySelectorAll(".hero-jar-left, .hero-jar-right"), {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "power4.out",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero load animation
      const heroTl = gsap.timeline();
      
      heroTl.fromTo(
        ".hero-animate-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" }
      );
      
      heroTl.fromTo(
        ".hero-text-word",
        { y: "100%" },
        {
          y: "0%",
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
        },
        "-=0.4"
      );
      
      heroTl.fromTo(
        ".hero-animate-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
      
      heroTl.fromTo(
        ".hero-animate-ctas, .hero-animate-bullets",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        },
        "-=0.3"
      );
      
      heroTl.fromTo(
        ".hero-animate-image",
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power4.out" },
        "-=0.8"
      );

      // 2. Trust Section (Why Choose Us)
      // Stamp bounce animation for certification banner
      gsap.fromTo(
        ".trust-banner",
        { scale: 0.85, opacity: 0, rotate: -3 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".trust-banner",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Staggered slide up of feature cards
      gsap.fromTo(
        ".trust-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".trust-cards-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Products staggered matrix cascade reveal
      gsap.fromTo(
        ".product-card-reveal",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            amount: 0.4,
            grid: "auto",
            from: "start"
          },
          ease: "power4.out",
          scrollTrigger: {
            trigger: "#products .grid",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // 4. Logistics network regional cards horizontal slides
      gsap.fromTo(
        ".network-highlights-card",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".network-highlights-card",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        ".region-card-gujarat",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".region-card-gujarat",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        ".region-card-border",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".region-card-border",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Location chips cascade waves scoped to each card triggers
      document.querySelectorAll(".region-card").forEach((card) => {
        const chips = card.querySelectorAll(".location-chip");
        gsap.fromTo(
          chips,
          { opacity: 0, scale: 0.6, y: 12 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 5. About Factory Section Ken Burns zoom-in
      gsap.fromTo(
        ".factory-image",
        { scale: 1 },
        {
          scale: 1.06,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".factory-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2, // Smooth, slow Ken Burns follow-through
          },
        }
      );


    });

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      icon: ShieldCheck,
      iconClass: "trust-icon-ShieldCheck",
      title: t("whyChooseUs.pillar1Title"),
      desc: t("whyChooseUs.pillar1Desc"),
    },
    {
      icon: Sparkles,
      iconClass: "trust-icon-Sparkles",
      title: t("whyChooseUs.pillar2Title"),
      desc: t("whyChooseUs.pillar2Desc"),
    },
    {
      icon: Truck,
      iconClass: "trust-icon-Truck",
      title: t("whyChooseUs.pillar3Title"),
      desc: t("whyChooseUs.pillar3Desc"),
    },
  ];

  const networkRegions = [
    {
      title: t("network.regions.gujarat"),
      description: t("network.regions.gujaratDesc"),
      hubs: [
        t("network.hubs.ahmedabad"),
        t("network.hubs.vadodara"),
        t("network.hubs.surat"),
        t("network.hubs.rajkot"),
        t("network.hubs.mehsana"),
        t("network.hubs.palanpur"),
        t("network.hubs.anand"),
        t("network.hubs.nadiad"),
        t("network.hubs.bhavnagar"),
        t("network.hubs.jamnagar")
      ]
    },
    {
      title: t("network.regions.rajasthan"),
      description: t("network.regions.rajasthanDesc"),
      hubs: [
        t("network.hubs.aburoad"),
        t("network.hubs.sanchore"),
        t("network.hubs.dungarpur"),
        t("network.hubs.banswara"),
        t("network.hubs.mountabu")
      ]
    },
    {
      title: t("network.regions.mp"),
      description: t("network.regions.mpDesc"),
      hubs: [
        t("network.hubs.dahod"),
        t("network.hubs.jhabua"),
        t("network.hubs.alirajpur"),
        t("network.hubs.godhra")
      ]
    },
    {
      title: t("network.regions.maharashtra"),
      description: t("network.regions.maharashtraDesc"),
      hubs: [
        t("network.hubs.vapi"),
        t("network.hubs.valsad"),
        t("network.hubs.navsari"),
        t("network.hubs.talasari"),
        t("network.hubs.nandurbar")
      ]
    }
  ];

  return (
    <SiteLayout className="bg-transparent">
      {/* Loop Background WhatsApp Video */}
      <div className="fixed inset-0 -z-20 w-full h-screen pointer-events-none overflow-hidden select-none print:hidden bg-slate-50 dark:bg-slate-950">
        <video
          ref={videoRef}
          src="/whatsapp-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.55] dark:opacity-[0.45]"
        />
        {/* Semi-transparent adaptive overlay to ensure maximum content readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/50 backdrop-blur-[0.5px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-slate-950 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>

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
            <div className="hero-animate-badge opacity-0 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <BadgeCheck className="h-4 w-4" />
              {t("hero.badge")}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {renderSplitText(t("hero.title"))}{" "}
              <span className="text-brand-blue block sm:inline">{renderSplitText(t("hero.titleAccent"))}</span>
            </h1>
            <p className="hero-animate-desc opacity-0 mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t("hero.desc")}
            </p>
            <div className="hero-animate-ctas opacity-0 mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-brand-blue"
              >
                <Link to="/products">
                  {t("hero.viewProducts")} <ArrowRight className="ml-2 h-4 w-4" />
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
                  {t("hero.inquireWhatsApp")}
                </a>
              </Button>
            </div>
            <ul className="hero-animate-bullets opacity-0 mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                t("hero.bullet1"),
                t("hero.bullet2"),
                t("hero.bullet3"),
                t("hero.bullet4"),
              ].map((bulletText) => (
                <li key={bulletText} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                  {bulletText}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="hero-animate-image opacity-0 relative"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            style={{ perspective: 1000 }}
          >
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-gold-soft via-white to-secondary blur-2xl opacity-70 pointer-events-none" />
            <div className="grid grid-cols-2 gap-4" style={{ transformStyle: "preserve-3d" }}>
              <div className="hero-jar-left aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition-shadow duration-500 hover:shadow-2xl">
                <img
                  src={chunaWhite}
                  alt="White edible chuna jar"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hero-jar-right mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition-shadow duration-500 hover:shadow-2xl">
                <img
                  src={chunaYellow}
                  alt="Yellow edible chuna tub"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="hero-compliance-badge absolute -bottom-4 left-4 right-4 mx-auto flex max-w-xs items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:left-auto sm:right-[-20px] sm:max-w-[280px]">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gold/15 text-brand-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">{t("hero.compliantBadge")}</div>
                <div className="text-muted-foreground">
                  {t("hero.compliantDesc")}
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
            eyebrow={t("whyChooseUs.eyebrow")}
            title={t("whyChooseUs.title")}
            description={t("whyChooseUs.desc")}
          />

          <div className="trust-banner opacity-0 mx-auto mt-10 flex max-w-2xl items-center gap-4 rounded-2xl border border-brand-gold/40 bg-card p-5 shadow-sm">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-gold text-primary shadow-sm">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
                {t("whyChooseUs.certLabel")}
              </div>
              <div className="text-lg font-bold text-foreground">
                {t("whyChooseUs.certTitle")}
              </div>
              <p className="text-sm text-muted-foreground">
                {t("whyChooseUs.certDesc")}
              </p>
            </div>
          </div>

          <div className="trust-cards-container mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="trust-card opacity-0 group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-[6px] hover:border-brand-gold/50 hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-brand-gold group-hover:text-primary">
                  <p.icon className={`h-6 w-6 ${p.iconClass}`} />
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
            eyebrow={t("catalog.eyebrow")}
            title={t("catalog.title")}
            description={t("catalog.desc")}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                {t("catalog.viewFull")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DISTRIBUTION & VENDOR NETWORK */}
      <section className="bg-secondary/40 py-20 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("network.eyebrow")}
            title={
              <span>
                {language === "gu" ? (
                  <span>અમારું વિક્રેતા અને વિતરણ <span className="text-brand-blue">નેટવર્ક</span></span>
                ) : language === "hi" ? (
                  <span>हमारा विक्रेता और वितरण <span className="text-brand-blue">नेटवर्क</span></span>
                ) : (
                  <span>Our Vendor & Distribution <span className="text-brand-blue">Network</span></span>
                )}
              </span>
            }
            description={t("network.desc")}
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Left/Main Column: Highlights */}
            <div className="network-highlights-card opacity-0 lg:col-span-1 flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">{t("network.presenceTitle")}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {t("network.presenceDesc")}
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-foreground block">{t("network.dispatchTitle")}</span>
                      <span className="text-muted-foreground">{t("network.dispatchDesc")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold">
                      <Map className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-foreground block">{t("network.borderTitle")}</span>
                      <span className="text-muted-foreground">{t("network.borderDesc")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3">{t("network.partnerTitle")}</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("network.partnerDesc")}
                </p>
                <Button asChild size="sm" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium">
                  <a href={distributorWa} target="_blank" rel="noopener noreferrer">
                    {t("network.becomeDistributor")}
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Columns: Regions Grid */}
            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              {networkRegions.map((region, idx) => {
                const isGujarat = idx === 0;
                const regionClass = isGujarat
                  ? "region-card-gujarat"
                  : "region-card-border";
                return (
                  <div
                    key={region.title}
                    className={`region-card ${regionClass} opacity-0 rounded-3xl border p-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-brand-gold/40 flex flex-col justify-between ${
                      isGujarat ? "sm:col-span-2 border-brand-gold/30 bg-gradient-to-br from-card via-card to-brand-gold-soft/20" : "border-border"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="relative mr-1 flex items-center justify-center">
                          <span className="absolute inline-flex h-4 w-4 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDuration: '3s', backgroundColor: isGujarat ? 'var(--brand-gold)' : 'var(--brand-blue)' }} />
                          <MapPin className={`relative h-4 w-4 ${isGujarat ? "text-brand-gold" : "text-brand-blue"}`} />
                        </div>
                        <h4 className="font-bold text-foreground text-lg">{region.title}</h4>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{region.description}</p>
                      
                      <div className="location-chips-container mt-4 flex flex-wrap gap-2">
                        {region.hubs.map((hub) => (
                          <span
                            key={hub}
                            className={`location-chip opacity-0 inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium border ${
                              hub.includes("Manufacturing") || hub.includes("ઉત્પાદન") || hub.includes("उत्पादन")
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-secondary text-secondary-foreground border-border hover:border-brand-gold/30 hover:bg-white transition-colors"
                            }`}
                          >
                            {hub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="factory-section bg-primary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-primary-foreground/10 shadow-2xl">
            <img
              src={factoryImg}
              alt="KHODIYAR GRUH UDHYOG manufacturing facility"
              loading="lazy"
              width={1024}
              height={1024}
              className="factory-image h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {t("aboutSection.eyebrow")}
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              {language === "gu" ? (
                <span>ખાવાલાયક ચૂના માટે B2B ભાગીદારોનું <span className="text-brand-gold">વિશ્વસનીય નામ</span></span>
              ) : language === "hi" ? (
                <span>खाने योग्य चूने के लिए B2B भागीदारों का <span className="text-brand-gold">विश्वसनीय नाम</span></span>
              ) : (
                <span>A name B2B partners trust for <span className="text-brand-gold">edible chuna</span></span>
              )}
            </h2>
            <p className="mt-5 text-primary-foreground/80">
              {t("aboutSection.desc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold"
              >
                <Link to="/about">{t("aboutSection.learnMore")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/quality">{t("aboutSection.qualityHygiene")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      {feedbacks.length > 0 && (
        <section className="py-20 border-t border-border bg-secondary/35">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <SectionHeading
                eyebrow={t("feedback.eyebrow")}
                title={t("feedback.approvedReviews")}
                description={t("feedback.approvedSubtitle")}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="trust-card rounded-3xl border border-border p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-card"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 text-brand-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4.5 w-4.5 ${
                            i < fb.rating ? "fill-brand-gold text-brand-gold" : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                    {/* Comment */}
                    <p className="text-sm italic text-foreground/80 leading-relaxed">
                      "{fb.comment}"
                    </p>
                  </div>
                  
                  {/* Reviewer Details */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/5 text-primary font-bold text-sm uppercase">
                      {fb.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{fb.name}</div>
                      <div className="text-[10px] font-semibold text-muted-foreground truncate">{fb.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INQUIRY */}
      <section id="inquiry" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow={t("inquirySection.eyebrow")}
              title={t("inquirySection.title")}
              description={t("inquirySection.desc")}
            />
            <ul className="mt-8 space-y-4 text-sm">
              {[
                t("inquirySection.bullet1"),
                t("inquirySection.bullet2"),
                t("inquirySection.bullet3"),
              ].map((bulletText) => (
                <li key={bulletText} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                  <span className="text-foreground">{bulletText}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="inquiry-form-card rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-bold text-foreground">{t("inquirySection.formTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("inquirySection.formDesc")}
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
