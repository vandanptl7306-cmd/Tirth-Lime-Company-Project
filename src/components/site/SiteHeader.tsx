import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/quality", label: "Quality & Hygiene" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
        K
        <span className="absolute h-1.5 w-1.5 -translate-y-3 translate-x-3 rounded-full bg-brand-gold" />
      </div>
      <div className="leading-tight">
        <div className="text-base font-bold text-foreground sm:text-lg">
          Khodiyar <span className="text-brand-gold">Industry</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Edible Chuna · FSSAI
        </div>
      </div>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button
            asChild
            className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold shadow-sm"
          >
            <Link to="/contact">Get a Bulk Quote</Link>
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
                {NAV.map((item) => (
                  <Link
                    key={item.to}
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
                    Get a Bulk Quote
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
