import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import { ADDRESS, EMAIL, PHONE_DISPLAY } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";

export function SiteFooter() {
  const { t } = useLanguage();

  const QUICK_LINKS = [
    ["/products", t("nav.products")],
    ["/quality", t("nav.quality")],
    ["/ingredients", t("nav.ingredients")],
    ["/about", t("nav.about")],
    ["/contact", t("nav.contact")],
    ["/admin", "Admin Panel"],
  ] as const;

  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="text-xl font-bold tracking-wide">
            {t("logo.title")}
          </div>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/75">
            {t("footer.desc")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
            {t("footer.quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK_LINKS.map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-primary-foreground/80 transition-colors hover:text-brand-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
            {t("footer.contact")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <span>{ADDRESS}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <a href={`tel:+${PHONE_DISPLAY.replace(/\D/g, "")}`} className="hover:text-brand-gold">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <a href={`mailto:${EMAIL}`} className="break-all hover:text-brand-gold">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {t("logo.title")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
