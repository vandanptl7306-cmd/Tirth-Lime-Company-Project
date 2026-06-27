import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { InquiryForm } from "@/components/site/InquiryForm";
import { FeedbackForm } from "@/components/site/FeedbackForm";
import { ADDRESS, EMAIL, PHONE_DISPLAY, WHATSAPP_NUMBER, buildWaLink } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t, language } = useLanguage();

  let waDiscussMsg = "Hello Khodiyar Industry, I'd like to discuss a bulk order.";
  if (language === "gu") {
    waDiscussMsg = "નમસ્તે ખોડિયાર ઇન્ડસ્ટ્રી, હું જથ્થાબંધ ઓર્ડર વિશે ચર્ચા કરવા માંગુ છું.";
  } else if (language === "hi") {
    waDiscussMsg = "नमस्ते खोदियार इंडस्ट्री, मैं थोक ऑर्डर के बारे में चर्चा करना चाहता हूँ।";
  }

  const wa = buildWaLink(waDiscussMsg);

  const contactItems = [
    {
      icon: MessageCircle,
      label: t("contactPage.labels.whatsapp"),
      value: PHONE_DISPLAY,
      href: wa,
      external: true,
      accent: true,
    },
    {
      icon: Phone,
      label: t("contactPage.labels.phone"),
      value: PHONE_DISPLAY,
      href: `tel:+${WHATSAPP_NUMBER}`,
      external: false,
    },
    {
      icon: Mail,
      label: t("contactPage.labels.email"),
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      external: false,
    },
    {
      icon: MapPin,
      label: t("contactPage.labels.address"),
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
            eyebrow={t("contactPage.eyebrow")}
            title={t("contactPage.title")}
            description={t("contactPage.desc")}
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
                {t("contactPage.chatWhatsApp")}
              </a>
            </Button>
          </div>

          <div
            id="inquiry"
            className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3"
          >
            <h2 className="text-2xl font-bold text-foreground">{t("inquirySection.formTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("inquirySection.formDesc")}
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK SUBMISSION SECTION */}
      <section className="border-t border-border py-16 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeading
                align="left"
                eyebrow={t("feedback.eyebrow")}
                title={t("feedback.title")}
                description={t("feedback.desc")}
              />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
