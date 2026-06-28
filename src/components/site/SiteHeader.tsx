import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/hooks/useLanguage";
import { type Language } from "@/lib/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoImg from "@/assets/logo.png";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group py-1">
      <img
        src={logoImg}
        alt="KHODIYAR GRUH UDHYOG"
        className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
      />
    </Link>
  );
}

function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
        <SelectTrigger className="h-8 w-[105px] text-xs bg-background py-1 px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="gu">ગુજરાતી</SelectItem>
          <SelectItem value="hi">हिन्दी</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/quality", label: t("nav.quality") },
    { to: "/ingredients", label: t("nav.ingredients") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSelector />
          <Button
            asChild
            className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold shadow-sm"
          >
            <Link to="/contact">{t("nav.getQuote")}</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-border/50 mb-3">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Language / ભાષા / भाषा</div>
                  <LanguageSelector className="w-full" />
                </div>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
                    activeProps={{ className: "text-primary bg-accent" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="mt-4 bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold"
                >
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    {t("nav.getQuote")}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
