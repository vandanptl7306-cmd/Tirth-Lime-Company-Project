import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";
import { getStoredGallery, type GallerySlide } from "@/lib/gallery";

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
  const { t, language } = useLanguage();
  const [slides, setSlides] = useState<GallerySlide[]>(() => getStoredGallery());
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
          
          {/* PHOTO SLIDER & VIEWER CONTAINER */}
          <div className="flex flex-col gap-4">
            {slides.length > 0 ? (
              <>
                {/* Main Big Screen Viewport */}
                <div 
                  className="relative overflow-hidden rounded-3xl border border-border bg-secondary/30 aspect-[4/3] w-full shadow-lg group cursor-zoom-in"
                  onMouseEnter={() => setIsAutoplayPaused(true)}
                  onMouseLeave={() => setIsAutoplayPaused(false)}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={slides[currentIdx]?.img}
                    alt={slides[currentIdx]?.title[language] || slides[currentIdx]?.title["en"]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
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
                        <img 
                          src={slide.img} 
                          alt="Thumbnail" 
                          className="h-full w-full object-cover"
                        />
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
          <div className="space-y-5 text-base text-muted-foreground">
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
            <img
              src={slides[currentIdx]?.img}
              alt={slides[currentIdx]?.title[language] || slides[currentIdx]?.title["en"]}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/5"
            />
            
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

