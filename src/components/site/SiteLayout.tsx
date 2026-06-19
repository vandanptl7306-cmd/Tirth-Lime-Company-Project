import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
      <WhatsAppFab />
      <Toaster richColors position="top-center" />
    </div>
  );
}
