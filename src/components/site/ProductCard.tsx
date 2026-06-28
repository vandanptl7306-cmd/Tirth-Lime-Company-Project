import { ArrowUpRight, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWaLink, type Product } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

export function ProductCard({ product }: { product: Product }) {
  const { t, language } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const transKey = product.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  const productName = t(`products.${transKey}.name`);
  const productVariant = t(`products.${transKey}.variant`);
  const productTag = t(`products.${transKey}.tag`);

  const mediaItems = useMemo(() => {
    const items: { type: "image" | "video"; url: string }[] = [];
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => items.push({ type: "image", url: img }));
    } else if (product.image) {
      items.push({ type: "image", url: product.image });
    }
    if (product.videos && product.videos.length > 0) {
      product.videos.forEach((vid) => items.push({ type: "video", url: vid }));
    }
    return items;
  }, [product]);

  const handleNextMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  let waMsg = `Hello KHODIYAR GRUH UDHYOG, I'd like to inquire about "${productName} ${productVariant}". Please share bulk pricing.`;
  if (language === "gu") {
    waMsg = `નમસ્તે ખોડિયાર ગૃહ ઉદ્યોગ, હું "${productName} ${productVariant}" માટે પૂછપરછ કરવા માંગુ છું. કૃપા કરીને જથ્થાબંધ ભાવ શેર કરશો.`;
  } else if (language === "hi") {
    waMsg = `नमस्ते खोदियार गृह उद्योग, मैं "${productName} ${productVariant}" के लिए पूछताछ करना चाहता हूँ। कृपया थोक भाव साझा करें।`;
  }

  const href = buildWaLink(waMsg);

  const colorBadge =
    product.color === "yellow"
      ? "bg-brand-gold-soft text-amber-900"
      : "bg-secondary text-primary";

  const displayColor = t(`catalog.colors.${product.color}`);

  // Autoplay video when active slide is reached, pause other videos
  useEffect(() => {
    if (!containerRef.current) return;
    const videos = containerRef.current.querySelectorAll("video");
    videos.forEach((video) => {
      const idxAttr = video.getAttribute("data-slide-index");
      if (idxAttr !== null) {
        const slideIndex = Number(idxAttr);
        if (slideIndex === activeIndex) {
          video.muted = true;
          video.play().catch((err) => {
            console.log("Autoplay prevented:", err);
          });
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set perspective on mount
    gsap.set(card, { transformPerspective: 1000 });

    const xTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
    const yTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
    const imgXTo = gsap.quickTo(card.querySelector(".product-image-container"), "x", { duration: 0.4, ease: "power2.out" });
    const imgYTo = gsap.quickTo(card.querySelector(".product-image-container"), "y", { duration: 0.4, ease: "power2.out" });
    const scaleTo = gsap.quickTo(card.querySelector(".product-image-container"), "scale", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate tilt angles (max 8 degrees tilt)
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;

      yTo(rotateX);
      xTo(rotateY);

      // Subtle parallax effect on product image container inside
      imgXTo(-x * 0.04);
      imgYTo(-y * 0.04);
      scaleTo(1.03);

      // Subtle lift + hover shadow + border glow
      gsap.to(card, {
        y: -6,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(212, 163, 89, 0.5)", // brand-gold/50
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });

      const glare = card.querySelector(".product-card-glare") as HTMLElement;
      if (glare) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(glare, {
          opacity: 1,
          background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`,
          duration: 0.2,
          overwrite: "auto"
        });
      }
    };

    const handleMouseLeave = () => {
      yTo(0);
      xTo(0);
      imgXTo(0);
      imgYTo(0);
      scaleTo(1);

      gsap.to(card, {
        y: 0,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // default shadow-sm
        borderColor: "var(--border)",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });

      const glare = card.querySelector(".product-card-glare") as HTMLElement;
      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: 0.4,
          overwrite: "auto"
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="product-card-reveal opacity-0 group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div ref={containerRef} className="product-image-container relative aspect-square overflow-hidden bg-secondary select-none">
        
        {/* Media Slider Track */}
        <div 
          className="absolute inset-0 w-full h-full flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {mediaItems.map((item, idx) => (
            <div key={idx} className="w-full h-full shrink-0 relative">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`${productName} ${productVariant} - Photo ${idx + 1}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative group/video">
                  <video
                    src={item.url}
                    data-slide-index={idx}
                    controls
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 pointer-events-none shadow z-25">
                    <Film className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Glare effect */}
        <div className="product-card-glare absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-10" />

        {/* Color Badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider z-20 ${colorBadge}`}
        >
          {displayColor}
        </span>

        {/* Slider Controls (Chevron Arrows) */}
        {mediaItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevMedia}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-md backdrop-blur-sm cursor-pointer border border-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMedia}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-md backdrop-blur-sm cursor-pointer border border-white/10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Pagination Indicators (Dots) */}
            <div className="absolute bottom-3.5 left-0 right-0 flex justify-center gap-1.5 z-20">
              {mediaItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? "w-4 bg-brand-gold" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-base font-bold text-foreground">{productName}</h3>
          <p className="mt-0.5 text-sm font-medium text-brand-blue">{productVariant}</p>
        </div>
        <p className="text-sm text-muted-foreground">{productTag}</p>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-0.5 text-xs text-muted-foreground w-fit">
          <span className="font-semibold text-foreground">{t("catalog.packSizes")}</span>
          <span>12x1 & 24x1</span>
        </div>
        {product.minQuantity !== undefined && (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-brand-gold-soft/60 text-amber-900 border border-brand-gold/30 px-2 py-0.5 text-[11px] font-medium w-fit">
            <span className="font-semibold text-amber-950">{t("catalog.minQty")}</span>
            <span>{product.minQuantity} {t("catalog.boxes")}</span>
          </div>
        )}
        <Button
          asChild
          className="product-inquire-btn mt-auto justify-between bg-primary text-primary-foreground transition-colors duration-500 group-hover:bg-brand-blue group-hover:text-primary-foreground"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            {t("catalog.inquireNow")} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
