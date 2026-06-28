import { MessageCircle } from "lucide-react";
import { buildWaLink } from "@/lib/products";

export function WhatsAppFab() {
  const href = buildWaLink(
    "Hello KHODIYAR GRUH UDHYOG, I'd like to inquire about your edible chuna products.",
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-105 sm:bottom-7 sm:right-7 print:hidden"
    >
      {/* Ambient pulsing background rings */}
      <span className="absolute inset-0 -z-10 rounded-full bg-whatsapp/40 whatsapp-pulse-ring pointer-events-none" />
      <span className="absolute inset-0 -z-10 rounded-full bg-whatsapp/20 whatsapp-pulse-ring-delayed pointer-events-none" />

      <span className="relative grid h-6 w-6 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
        <MessageCircle className="relative h-5 w-5" />
      </span>
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
