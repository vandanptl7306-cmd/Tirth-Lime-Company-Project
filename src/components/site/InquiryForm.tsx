import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, buildWaLink, getStoredProducts } from "@/lib/products";
import { useLanguage } from "@/hooks/useLanguage";

export function InquiryForm() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const schema = useMemo(() => z.object({
    name: z.string().min(2, t("form.validation.name")),
    company: z.string().min(2, t("form.validation.company")),
    phone: z
      .string()
      .min(7, t("form.validation.phoneMin"))
      .regex(/^[0-9+\-\s()]+$/, t("form.validation.phoneRegex")),
    product: z.string().min(1, t("form.validation.product")),
    packSize: z.string().min(1, t("form.validation.packSize")),
    quantity: z.string().min(1, t("form.validation.quantity")),
    address: z.string().min(5, t("form.validation.address")),
    message: z.string().optional(),
  }), [language, t]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      product: "",
      packSize: "",
      quantity: "",
      address: "",
      message: "",
    },
  });

  // Re-trigger validation when schema (language) changes so current errors translate instantly
  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.trigger();
    }
  }, [language, form]);

  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");

  function onSubmit(values: FormValues) {
    setSubmitStatus("loading");

    const header = language === "gu" ? "*નવી જથ્થાબંધ પૂછપરછ — ખોડિયાર ઇન્ડસ્ટ્રી*" : 
                   language === "hi" ? "*नई थोक पूछताछ — खोदियार इंडस्ट्री*" :
                   "*New Bulk Inquiry — Khodiyar Industry*";

    const lines = [
      header,
      `${t("form.labels.name")}: ${values.name}`,
      `${t("form.labels.company")}: ${values.company}`,
      `${t("form.labels.phone")}: ${values.phone}`,
      `${t("form.labels.product")}: ${values.product}`,
      `${t("form.labels.packSize")}: ${values.packSize}`,
      `${t("form.labels.quantity")}: ${values.quantity}`,
      `${t("form.labels.address")}: ${values.address}`,
    ];
    if (values.message?.trim()) {
      lines.push(`${t("form.labels.message")}: ${values.message.trim()}`);
    }
    const url = buildWaLink(lines.join("\n"));

    // Artificial compiler/compiling animation delay for B2B portal feedback
    setTimeout(() => {
      setSubmitStatus("success");
      
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        toast.success(t("form.toast"));
        form.reset();
        
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 1000);
      }, 1000);
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.name")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input placeholder={t("form.placeholders.name")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
                    <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.company")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input placeholder={t("form.placeholders.company")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
                    <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.phone")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input type="tel" placeholder={t("form.placeholders.phone")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
                    <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.quantity")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input placeholder={t("form.placeholders.quantity")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
                    <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.product")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.placeholders.product")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((p) => {
                      const transKey = p.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                      const pName = t(`products.${transKey}.name`);
                      const pVar = t(`products.${transKey}.variant`);
                      return (
                        <SelectItem key={p.id} value={`${pName} ${pVar}`}>
                          {pName} — {pVar}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.labels.packSize")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.placeholders.packSize")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="12x1 pack">{t("form.packSizes.pack12")}</SelectItem>
                    <SelectItem value="24x1 pack">{t("form.packSizes.pack24")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.labels.address")}</FormLabel>
              <FormControl>
                <div className="input-wrapper relative">
                  <Input placeholder={t("form.placeholders.address")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
                  <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                  </svg>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.labels.message")}</FormLabel>
              <FormControl>
                <div className="input-wrapper relative">
                  <Textarea
                    rows={4}
                    placeholder={t("form.placeholders.message")}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                    {...field}
                  />
                  <svg className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none" viewBox="0 0 100 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 1 L 0 1 M 50 1 L 100 1" fill="none" stroke="var(--brand-gold)" strokeWidth="2" className="input-focus-line" />
                  </svg>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={submitStatus !== "idle"}
          className={`relative overflow-hidden font-semibold transition-all duration-300 ${
            submitStatus === "success"
              ? "bg-emerald-600 hover:bg-emerald-600 text-white scale-[1.02]"
              : "bg-brand-gold text-primary hover:bg-brand-gold/90"
          }`}
        >
          {/* Button shimmer element */}
          {submitStatus === "idle" && (
            <span className="absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-[150%] btn-sheen pointer-events-none" />
          )}

          {/* SVG Particle Star Burst Elements */}
          {submitStatus === "success" && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {[...Array(8)].map((_, i) => (
                <svg
                  key={i}
                  className={`absolute h-3 w-3 text-brand-gold fill-current animate-burst-particle-${i + 1}`}
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: "-6px",
                    marginTop: "-6px",
                  }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          )}

          <span className="relative z-10 flex items-center justify-center">
            {submitStatus === "idle" && (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" />
                {t("form.submit")}
              </>
            )}
            {submitStatus === "loading" && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "gu" ? "પૂછપરછ તૈયાર થઈ રહી છે..." : language === "hi" ? "पूछताछ तैयार हो रही है..." : "Compiling Inquiry..."}
              </>
            )}
            {submitStatus === "success" && (
              <>
                <Check className="mr-2 h-4 w-4 animate-bounce" />
                {language === "gu" ? "વાટ્સએપ લોંચ થઈ રહ્યું છે..." : language === "hi" ? "व्हाट्सएप लॉन्च हो रहा है..." : "Redirecting to WhatsApp..."}
              </>
            )}
          </span>
        </Button>
        <p className="text-xs text-muted-foreground">
          {t("form.info")}
        </p>
      </form>
    </Form>
  );
}
