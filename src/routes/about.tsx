import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { getStoredGallery, DEFAULT_GALLERY, type GallerySlide } from "@/lib/gallery";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KHODIYAR GRUH UDHYOG — Edible Chuna Manufacturer" },
      {
        name: "description",
        content:
          "KHODIYAR GRUH UDHYOG manufactures edible chuna with a focus on purity, hygiene and reliable B2B supply across India.",
      },
      { property: "og:title", content: "About KHODIYAR GRUH UDHYOG" },
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
  const { t, language } = useLanguage();
  const [slides, setSlides] = useState<GallerySlide[]>(DEFAULT_GALLERY);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync slides on load/active updates
  useEffect(() => {
    setSlides(getStoredGallery());
  }, []);

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Autoplay carousel
  useEffect(() => {
    if (isAutoplayPaused || lightboxOpen || slides.length === 0) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [isAutoplayPaused, lightboxOpen, slides.length]);

  // Center active thumbnail in thumbnail scrollbar
  useEffect(() => {
    if (sliderRef.current && slides.length > 0) {
      const activeThumbnail = sliderRef.current.children[currentIdx] as HTMLElement;
      if (activeThumbnail) {
        const slider = sliderRef.current;
        const scrollLeft = activeThumbnail.offsetLeft - (slider.offsetWidth / 2) + (activeThumbnail.offsetWidth / 2);
        slider.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [currentIdx, slides.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade + reveal
      gsap.fromTo(
        ".about-header-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
      );

      // 2. Main content reveal (gallery slides in from left, story from right)
      gsap.fromTo(
        ".about-gallery-reveal",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-gallery-reveal",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        ".about-text-reveal",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-text-reveal",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // 3. Stats section count-up and fade-in stagger
      gsap.fromTo(
        ".about-stat-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats-container",
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => {
              document.querySelectorAll(".about-stat-number").forEach((el) => {
                const target = parseFloat(el.getAttribute("data-target") || "0");
                gsap.to(el, {
                  innerText: target,
                  duration: 1.8,
                  snap: { innerText: 1 },
                  ease: "power1.out"
                });
              });
            }
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { k: "2", v: t("aboutPage.stat1Label") },
    { k: "6", v: t("aboutPage.stat2Label") },
    { k: "100%", v: t("aboutPage.stat3Label") },
  ];

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 about-header-reveal opacity-0">
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
          
          {/* PHOTO SLIDER & VIEWER CONTAINER */}
          <div className="about-gallery-reveal opacity-0 flex flex-col gap-4">
            {slides.length > 0 ? (
              <>
                {/* Main Big Screen Viewport */}
                <div 
                  className="relative overflow-hidden rounded-3xl border border-border bg-secondary/30 aspect-[4/3] w-full shadow-lg group cursor-zoom-in"
                  onMouseEnter={() => setIsAutoplayPaused(true)}
                  onMouseLeave={() => setIsAutoplayPaused(false)}
                  onClick={() => setLightboxOpen(true)}
                >
                  {slides[currentIdx]?.type === "video" ? (
                    <video
                      src={slides[currentIdx]?.img}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={slides[currentIdx]?.img}
                      alt={slides[currentIdx]?.title[language] || slides[currentIdx]?.title["en"]}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Bottom Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white opacity-95 transition-opacity duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
                      {t("aboutPage.eyebrow")} — {currentIdx + 1}/{slides.length}
                    </span>
                    <h4 className="text-lg font-black mt-1">
                      {slides[currentIdx]?.title[language] || slides[currentIdx]?.title["en"]}
                    </h4>
                    <p className="text-xs text-white/80 mt-1 max-w-md font-medium leading-relaxed">
                      {slides[currentIdx]?.desc[language] || slides[currentIdx]?.desc["en"]}
                    </p>
                  </div>

                  {/* Hover Fullscreen Overlay Trigger (Visual only - open modal on click) */}
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="bg-white/95 text-primary rounded-full px-5 py-2.5 shadow-xl text-xs font-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-border/10">
                      <Maximize2 className="h-4 w-4 text-brand-blue" />
                      Click for Big Screen
                    </div>
                  </div>
                </div>

                {/* Slider Strip of Thumbnails */}
                <div className="relative flex items-center">
                  <button 
                    onClick={handlePrev}
                    className="absolute left-0 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-md hover:bg-secondary text-primary transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div 
                    ref={sliderRef}
                    className="flex gap-3 overflow-x-auto py-2 scroll-smooth no-scrollbar w-full px-10"
                  >
                    {slides.map((slide, idx) => (
                      <button
                        key={slide.id || idx}
                        onMouseEnter={() => {
                          setCurrentIdx(idx);
                          setIsAutoplayPaused(true);
                        }}
                        onMouseLeave={() => setIsAutoplayPaused(false)}
                        onClick={() => setCurrentIdx(idx)}
                        className={`relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                          currentIdx === idx 
                            ? "border-brand-blue scale-95 shadow-md" 
                            : "border-border/60 hover:border-brand-blue/50 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {slide.type === "video" ? (
                          <div className="relative h-full w-full">
                            <video 
                              src={slide.img} 
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="h-5 w-5 text-white opacity-85" />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={slide.img} 
                            alt="Thumbnail" 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="absolute right-0 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-md hover:bg-secondary text-primary transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-64 border-2 border-dashed border-border rounded-3xl flex items-center justify-center text-muted-foreground text-sm">
                No gallery photos available. Check back later!
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TEXT CONTENT */}
          <div className="about-text-reveal opacity-0 space-y-5 text-base text-muted-foreground">
            <div className="h-1 bg-gradient-to-r from-brand-gold to-brand-blue w-20 rounded-full" />
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

      {/* FULLSCREEN LIGHTBOX PORTAL / BIG SCREEN VIEW */}
      {lightboxOpen && slides.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 shadow-xl"
            title="Close big screen"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 shadow-xl hover:scale-110 active:scale-95"
            aria-label="Previous Image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 shadow-xl hover:scale-110 active:scale-95"
            aria-label="Next Image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Main big image container (Hover close removed, only click to dismiss or lock) */}
          <div 
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-white/10 shadow-2xl transition-all scale-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {slides[currentIdx]?.type === "video" ? (
              <video
                src={slides[currentIdx]?.img}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/5 bg-black"
              />
            ) : (
              <img
                src={slides[currentIdx]?.img}
                alt={slides[currentIdx]?.title[language] || slides[currentIdx]?.title["en"]}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/5"
              />
            )}
            
            {/* Localized Details inside big screen view */}
            <div className="w-full text-center text-white px-6 pb-2 select-none">
              <h3 className="text-xl font-bold tracking-tight text-brand-gold">
                {slides[currentIdx].title[language] || slides[currentIdx].title["en"]}
              </h3>
              <p className="text-xs text-white/70 mt-1.5 max-w-2xl mx-auto font-medium">
                {slides[currentIdx].desc[language] || slides[currentIdx].desc["en"]}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 sm:grid-cols-3 lg:px-8 about-stats-container">
          {stats.map((s) => {
            const numVal = parseFloat(s.k.replace("%", ""));
            const suffix = s.k.includes("%") ? "%" : "";
            return (
              <div key={s.v} className="about-stat-card opacity-0 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center">
                <div className="text-4xl font-bold text-brand-gold flex items-center justify-center">
                  <span className="about-stat-number" data-target={numVal}>0</span>
                  {suffix && <span>{suffix}</span>}
                </div>
                <div className="mt-1 text-sm uppercase tracking-wider text-primary-foreground/75">
                  {s.v}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

