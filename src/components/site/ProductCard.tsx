import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWaLink, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const href = buildWaLink(
    `Hello Khodiyar Industry, I'd like to inquire about "${product.name} ${product.variant}". Please share bulk pricing.`,
  );
  const colorBadge =
    product.color === "yellow"
      ? "bg-brand-gold-soft text-amber-900"
      : "bg-secondary text-primary";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={`${product.name} ${product.variant}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${colorBadge}`}
        >
          {product.color}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-base font-bold text-foreground">{product.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-brand-blue">{product.variant}</p>
        </div>
        <p className="text-sm text-muted-foreground">{product.tag}</p>
        <Button
          asChild
          className="mt-auto justify-between bg-primary text-primary-foreground hover:bg-brand-blue"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            Inquire Now <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
