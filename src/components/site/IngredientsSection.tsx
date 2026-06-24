import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Droplets, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

gsap.registerPlugin(ScrollTrigger);

export function IngredientsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const limeSliceRef = useRef<SVGGElement>(null);
  const waterLineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If running in SSR or refs aren't ready, skip
    if (!sectionRef.current || !limeSliceRef.current || !waterLineRef.current) return;

    // Use GSAP context for clean scoping and easy cleanup on unmount
    const ctx = gsap.context(() => {
      // 1. Main scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Trigger when the top of the section is 70% down the viewport
          end: "bottom 20%",
          toggleActions: "play none none none", // Play once when scrolled into view
        },
      });

      // Staggered text header fade-in/slide-up
      tl.fromTo(
        ".ingredient-header-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power4.out" }
      );

      // Lime slice drop (starts slightly before text finishes)
      tl.fromTo(
        limeSliceRef.current,
        { y: -380, rotation: -120, scale: 0.8, opacity: 0 },
        { y: 150, rotation: 15, scale: 1, opacity: 1, duration: 0.9, ease: "power2.in" },
        "-=0.7"
      );

      // Water surface wave reaction on impact
      tl.to(
        waterLineRef.current,
        {
          d: "M 0 350 Q 100 375 200 355 T 400 350 L 400 600 L 0 600 Z",
          duration: 0.15,
          ease: "power1.out",
        },
        "-=0.05"
      );
      
      tl.to(waterLineRef.current, {
        d: "M 0 350 Q 100 325 200 345 T 400 350 L 400 600 L 0 600 Z",
        duration: 0.25,
        ease: "power1.inOut",
      });

      tl.to(waterLineRef.current, {
        d: "M 0 350 Q 100 348 200 350 T 400 350 L 400 600 L 0 600 Z",
        duration: 0.4,
        ease: "power2.out",
      });

      // Concentric circles SVG ripples
      // Ripple 1
      tl.fromTo(
        "#ripple-1",
        { rx: 0, ry: 0, strokeOpacity: 0.9 },
        { rx: 130, ry: 35, strokeOpacity: 0, duration: 1.4, ease: "power2.out" },
        "<-0.35" // Align with the impact moment
      );

      // Ripple 2
      tl.fromTo(
        "#ripple-2",
        { rx: 0, ry: 0, strokeOpacity: 0.7 },
        { rx: 90, ry: 24, strokeOpacity: 0, duration: 1.2, ease: "power2.out" },
        "<-0.25"
      );

      // Ripple 3
      tl.fromTo(
        "#ripple-3",
        { rx: 0, ry: 0, strokeOpacity: 0.5 },
        { rx: 50, ry: 14, strokeOpacity: 0, duration: 0.9, ease: "power2.out" },
        "<-0.2"
      );

      // Lime slice slow sink into water
      tl.to(
        limeSliceRef.current,
        {
          y: 270, // sinks deep into water container
          rotation: -12,
          duration: 2.0,
          ease: "power1.out",
        },
        "<-0.3" // Starts sinking right as it hits water
      );

      // Swaying animation as it sinks (wobble)
      tl.to(
        limeSliceRef.current,
        {
          x: -20,
          duration: 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3,
        },
        "<-0.3"
      );

      // Settle lime slice back to center X coordinate
      tl.to(limeSliceRef.current, { x: 0, duration: 0.6, ease: "power1.out" });

      // Bubbles rising from splash
      tl.fromTo(
        ".lime-bubble",
        { y: 150, opacity: 0, scale: 0.4 },
        {
          y: -140,
          opacity: (i) => [0.8, 0.6, 0.7, 0.5, 0.8, 0.6][i] || 0.6,
          scale: (i) => [1, 1.3, 0.8, 1.1, 1.4, 0.9][i] || 1,
          x: (i) => [15, -12, 22, -18, 10, -5][i] || 0,
          duration: 2.4,
          stagger: 0.04,
          ease: "power1.out",
        },
        "<-0.8"
      );

      // Loop a gentle floating animation after the main timeline completes
      tl.to(limeSliceRef.current, {
        y: "+=8",
        rotation: "+=3",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1, // Infinite bobbing
      });

      // 2. Parallax scroll effect on the beaker SVG visual container
      gsap.fromTo(
        containerRef.current,
        { y: 50 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2, // Smooth lagging scrub
          },
        }
      );

      // 3. Progressive scroll triggers for ingredient bullet cards
      gsap.utils.toArray(".ingredient-card").forEach((card: any) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert(); // Automatically reverts and kills ScrollTriggers
  }, []);

  // Proximity mouse-move parallax effect for interactive polish
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!limeSliceRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Soft push away from cursor when hovering near the settled slice
    gsap.to(limeSliceRef.current, {
      x: x * 0.08,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!limeSliceRef.current) return;
    gsap.to(limeSliceRef.current, {
      x: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  };

  const ingredientsList = [
    {
      icon: Sparkles,
      title: t("ingredients.item1Title"),
      desc: t("ingredients.item1Desc"),
      color: "from-lime-500/10 to-emerald-500/5",
      iconColor: "text-lime-600",
    },
    {
      icon: Droplets,
      title: t("ingredients.item2Title"),
      desc: t("ingredients.item2Desc"),
      color: "from-cyan-500/10 to-blue-500/5",
      iconColor: "text-cyan-600",
    },
    {
      icon: ShieldCheck,
      title: t("ingredients.item3Title"),
      desc: t("ingredients.item3Desc"),
      color: "from-emerald-500/10 to-teal-500/5",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="ingredients"
      className="relative overflow-hidden bg-gradient-to-b from-background via-lime-50/20 to-secondary/40 py-24 text-foreground border-y border-border/70"
    >
      {/* Background Ambience / Glow circles */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-lime-500/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT COLUMN: TEXT CONTENT & INGREDIENT LIST */}
          <div className="space-y-8 lg:col-span-6">
            <div className="space-y-4">
              <span className="ingredient-header-item inline-block text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
                {t("ingredients.eyebrow")}
              </span>
              <h2 className="ingredient-header-item text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {t("ingredients.title")}
              </h2>
              <p className="ingredient-header-item text-base text-muted-foreground max-w-xl leading-relaxed">
                {t("ingredients.desc")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              {ingredientsList.map((item, idx) => (
                <div
                  key={idx}
                  className="ingredient-card opacity-0 group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/60 bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-lime-500/30 hover:bg-white hover:shadow-xl hover:shadow-lime-100/20"
                >
                  {/* Card Background Gradient Glow on Hover */}
                  <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary border border-border/80 ${item.iconColor} transition-colors group-hover:bg-lime-50/50`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-emerald-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground/80 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ANIMATION CONTAINER */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[420px] aspect-[3/4.5] overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-b from-white to-secondary/30 shadow-2xl backdrop-blur-md group cursor-pointer"
            >
              {/* Glass Frame Border Light effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/[0.005] to-black/[0.015] pointer-events-none" />
              <div className="absolute -top-[150px] -right-[150px] w-[300px] h-[300px] rounded-full bg-lime-400/10 blur-3xl pointer-events-none group-hover:bg-lime-400/15 transition-colors duration-700" />
              
              {/* SVG Canvas */}
              <svg
                viewBox="0 0 400 600"
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Water Color Gradients */}
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.18" />
                    <stop offset="30%" stopColor="#0F766E" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#115E59" stopOpacity="0.7" />
                  </linearGradient>

                  {/* Rind Linear Gradient */}
                  <linearGradient id="rindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="50%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>

                  {/* Pulp Gradient */}
                  <linearGradient id="pulpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BEF264" />
                    <stop offset="100%" stopColor="#65A30D" />
                  </linearGradient>
                  
                  {/* Highlight Glow Filter for ripples */}
                  <filter id="rippleGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* SVG Water Ripple Waves (Concentric ellipses) */}
                <g id="ripples" filter="url(#rippleGlow)" className="pointer-events-none">
                  <ellipse
                    id="ripple-1"
                    cx="200"
                    cy="350"
                    rx="0"
                    ry="0"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeOpacity="0"
                  />
                  <ellipse
                    id="ripple-2"
                    cx="200"
                    cy="350"
                    rx="0"
                    ry="0"
                    fill="none"
                    stroke="#0891B2"
                    strokeWidth="1.8"
                    strokeOpacity="0"
                  />
                  <ellipse
                    id="ripple-3"
                    cx="200"
                    cy="350"
                    rx="0"
                    ry="0"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="1.2"
                    strokeOpacity="0"
                  />
                </g>

                {/* Translucent Water Body */}
                <path
                  ref={waterLineRef}
                  id="water"
                  d="M 0 350 Q 100 348 200 350 T 400 350 L 400 600 L 0 600 Z"
                  fill="url(#waterGrad)"
                  stroke="#0D9488"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />

                {/* Bubbles rising from bottom */}
                <g id="bubbles" className="pointer-events-none">
                  <circle className="lime-bubble" cx="185" cy="450" r="3.5" fill="#65A30D" fillOpacity="0.45" />
                  <circle className="lime-bubble" cx="215" cy="430" r="5" fill="#0D9488" fillOpacity="0.2" />
                  <circle className="lime-bubble" cx="170" cy="460" r="4.5" fill="#0D9488" fillOpacity="0.15" />
                  <circle className="lime-bubble" cx="230" cy="470" r="3" fill="#0891B2" fillOpacity="0.4" />
                  <circle className="lime-bubble" cx="195" cy="490" r="6" fill="#0D9488" fillOpacity="0.2" />
                  <circle className="lime-bubble" cx="205" cy="510" r="4" fill="#65A30D" fillOpacity="0.45" />
                </g>

                {/* Detailed SVG Lime Slice */}
                <g
                  ref={limeSliceRef}
                  id="lime-slice"
                  style={{ transformOrigin: "200px 200px" }}
                >
                  {/* Ambient drop shadow under the lime */}
                  <circle cx="200" cy="204" r="58" fill="#000000" fillOpacity="0.15" filter="url(#rippleGlow)" className="pointer-events-none" />

                  {/* Outer Green Rind */}
                  <circle cx="200" cy="200" r="58" fill="url(#rindGrad)" stroke="#14532D" strokeWidth="2.5" />
                  
                  {/* Pale Yellow-Green Inner Pith */}
                  <circle cx="200" cy="200" r="53" fill="#ECFDF5" />

                  {/* 8 Lime wedges radiating from the core */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 200, 200)`}>
                      <path
                        d="M 200 196 L 200 152 A 44 44 0 0 1 228 164 Z"
                        fill="url(#pulpGrad)"
                        className="transition-colors duration-300 hover:fill-lime-400"
                      />
                      {/* Juice Vesicles details / shiny reflections */}
                      <circle cx="207" cy="172" r="1.5" fill="#F0FDF4" fillOpacity="0.8" />
                      <circle cx="214" cy="180" r="1" fill="#F0FDF4" fillOpacity="0.6" />
                      <circle cx="204" cy="160" r="1" fill="#FFFFFF" fillOpacity="0.7" />
                    </g>
                  ))}

                  {/* Center Lime Core */}
                  <circle cx="200" cy="200" r="6" fill="#ECFDF5" />
                  <circle cx="200" cy="200" r="3.5" fill="#BEF264" />
                </g>
              </svg>

              {/* Water Overlay reflection line on Beaker */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] via-white/[0.04] to-white/[0.01] skew-x-12 pointer-events-none" />

              {/* Interactive Hover prompt */}
              <div className="absolute bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-700 bg-white/90 px-3 py-1.5 rounded-full border border-border/80 shadow-md">
                  Hover to Float Slice
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
