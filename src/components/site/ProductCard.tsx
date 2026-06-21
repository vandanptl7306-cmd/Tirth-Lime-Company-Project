import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWaLink, type Product } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";

export function ProductCard({ product }: { product: Product }) {
  const { t, language } = useLanguage();
  const transKey = product.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  const productName = t(`products.${transKey}.name`);
  const productVariant = t(`products.${transKey}.variant`);
  const productTag = t(`products.${transKey}.tag`);

  let waMsg = `Hello Khodiyar Industry, I'd like to inquire about "${productName} ${productVariant}". Please share bulk pricing.`;
  if (language === "gu") {
    waMsg = `નમસ્તે ખોડિયાર ઇન્ડસ્ટ્રી, હું "${productName} ${productVariant}" માટે પૂછપરછ કરવા માંગુ છું. કૃપા કરીને જથ્થાબંધ ભાવ શેર કરશો.`;
  } else if (language === "hi") {
    waMsg = `नमस्ते खोदियार इंडस्ट्री, मैं "${productName} ${productVariant}" के लिए पूछताछ करना चाहता हूँ। कृपया थोक भाव साझा करें।`;
  }

  const href = buildWaLink(waMsg);

  const colorBadge =
    product.color === "yellow"
      ? "bg-brand-gold-soft text-amber-900"
      : "bg-secondary text-primary";

  const displayColor = t(`catalog.colors.${product.color}`);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={`${productName} ${productVariant}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${colorBadge}`}
        >
          {displayColor}
        </span>
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
          className="mt-auto justify-between bg-primary text-primary-foreground hover:bg-brand-blue"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            {t("catalog.inquireNow")} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
