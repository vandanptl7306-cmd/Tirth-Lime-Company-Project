import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { InquiryForm } from "@/components/site/InquiryForm";
import { ADDRESS, EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER, buildWaLink } from "@/lib/products";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Bulk Inquiries — Khodiyar Industry" },
      {
        name: "description",
        content:
          "Get a wholesale quote for edible chuna. Reach Khodiyar Industry by WhatsApp, phone or email.",
      },
      { property: "og:title", content: "Contact Khodiyar Industry" },
      {
        property: "og:description",
        content:
          "Send a bulk inquiry or reach us directly on WhatsApp at +91 99984 21346.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const wa = buildWaLink("Hello Khodiyar Industry, I'd like to discuss a bulk order.");
  const contactItems = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: PHONE_DISPLAY,
      href: wa,
      external: true,
      accent: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: PHONE_DISPLAY,
      href: `tel:+${WHATSAPP_NUMBER}`,
      external: false,
    },
    {
      icon: Mail,
      label: "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      external: false,
    },
    {
      icon: MapPin,
      label: "Address",
      value: ADDRESS,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
      external: true,
    },
  ];

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Let's talk bulk supply"
            description="Send an inquiry through the form or reach us directly — we typically respond on WhatsApp within working hours."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="space-y-4 lg:col-span-2">
            {contactItems.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className={`flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  c.accent ? "border-whatsapp/30" : ""
                }`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                    c.accent
                      ? "bg-whatsapp text-white"
                      : "bg-accent text-primary"
                  }`}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-0.5 break-words text-sm font-medium text-foreground">
                    {c.value}
                  </div>
                </div>
              </a>
            ))}
            <Button
              asChild
              size="lg"
              className="w-full bg-whatsapp text-white hover:bg-whatsapp/90"
            >
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp now
              </a>
            </Button>
          </div>

          <div
            id="inquiry"
            className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3"
          >
            <h2 className="text-2xl font-bold text-foreground">Bulk Inquiry Form</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in your details and we'll respond with pricing on WhatsApp.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
