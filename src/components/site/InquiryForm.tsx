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
  
  const [inquiryItems, setInquiryItems] = useState<{
    product: string;
    packSize: string;
    quantity: string;
  }[]>([
    { product: "", packSize: "12x1 pack", quantity: "" }
  ]);

  const handleAddItemRow = () => {
    setInquiryItems([...inquiryItems, { product: "", packSize: "12x1 pack", quantity: "" }]);
  };

  const handleRemoveItemRow = (index: number) => {
    const updated = inquiryItems.filter((_, idx) => idx !== index);
    setInquiryItems(updated);
  };

  const handleItemChange = (index: number, field: "product" | "packSize" | "quantity", value: string) => {
    const updated = inquiryItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setInquiryItems(updated);
  };

  function onSubmit(values: FormValues) {
    const hasInvalidItem = inquiryItems.some(item => !item.product || !item.packSize || !item.quantity);
    if (hasInvalidItem) {
      toast.error(language === "gu" ? "કૃપા કરીને બધા ઉત્પાદનોની વિગતો ભરો." : 
                  language === "hi" ? "कृपया सभी उत्पादों का विवरण भरें।" :
                  "Please fill out product details for all rows.");
      return;
    }

    setSubmitStatus("loading");

    const header = language === "gu" ? "*નવી જથ્થાબંધ પૂછપરછ — ખોડિયાર ગૃહ ઉદ્યોગ*" : 
                   language === "hi" ? "*नई थोक पूछताछ — खोदियार गृह उद्योग*" :
                   "*New Bulk Inquiry — KHODIYAR GRUH UDHYOG*";

    const itemsText = inquiryItems.map((item, index) => {
      return `  ${index + 1}. ${item.product} — ${item.packSize} [Qty: ${item.quantity}]`;
    }).join("\n");

    const lines = [
      header,
      `${t("form.labels.name")}: ${values.name}`,
      `${t("form.labels.company")}: ${values.company}`,
      `${t("form.labels.phone")}: ${values.phone}`,
      `${t("form.labels.address")}: ${values.address}`,
      "",
      language === "gu" ? "*જરૂરી ઉત્પાદનો:*" : language === "hi" ? "*आवश्यक उत्पाद:*" : "*Products Inquired:*",
      itemsText,
    ];
    if (values.message?.trim()) {
      lines.push("");
      lines.push(`${t("form.labels.message")}: ${values.message.trim()}`);
    }
    const url = buildWaLink(lines.join("\n"));

    // Artificial compiler delay for B2B portal feedback
    setTimeout(() => {
      setSubmitStatus("success");
      
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        toast.success(t("form.toast"));
        form.reset();
        setInquiryItems([{ product: "", packSize: "12x1 pack", quantity: "" }]);
        
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
              <FormItem className="sm:col-span-2">
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
        </div>

        {/* INQUIRY PRODUCTS BUILDER */}
        <div className="border-t border-border/80 pt-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-brand-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {language === "gu" ? "પૂછપરછ માટે ઉત્પાદનો" : language === "hi" ? "पूछताछ के लिए उत्पाद" : "Products for Inquiry"}
            </span>
            <Button
              type="button"
              onClick={handleAddItemRow}
              size="sm"
              className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 hover:text-brand-blue text-xs font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {language === "gu" ? "ઉત્પાદન ઉમેરો" : language === "hi" ? "उत्पाद जोड़ें" : "Add Product"}
            </Button>
          </div>

          <div className="space-y-3">
            {inquiryItems.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 border border-border/60 bg-secondary/10 p-3.5 rounded-2xl items-end relative animate-fade-in animate-duration-200">
                
                {/* Product Selector */}
                <div className="flex-1 grid gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t("form.labels.product")}
                  </label>
                  <select
                    required
                    value={item.product}
                    onChange={(e) => handleItemChange(idx, "product", e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold bg-background w-full"
                  >
                    <option value="" disabled>{t("form.placeholders.product")}</option>
                    {products.map((p) => {
                      const transKey = p.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                      const pName = t(`products.${transKey}.name`);
                      const pVar = t(`products.${transKey}.variant`);
                      return (
                        <option key={p.id} value={`${pName} (${pVar})`}>
                          {pName} — {pVar}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Pack Size Selector */}
                <div className="grid gap-1.5 w-full sm:w-36">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t("form.labels.packSize")}
                  </label>
                  <select
                    value={item.packSize}
                    onChange={(e) => handleItemChange(idx, "packSize", e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold bg-background w-full"
                  >
                    <option value="12x1 pack">12X1 Pack</option>
                    <option value="24x1 pack">24X1 Pack</option>
                  </select>
                </div>

                {/* Quantity Input */}
                <div className="grid gap-1.5 w-full sm:w-28">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t("form.labels.quantity")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold bg-background w-full"
                  />
                </div>

                {/* Delete button */}
                {inquiryItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    className="h-10 w-10 border border-destructive/20 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center shrink-0 self-end"
                    title={t("admin.delete")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )}

              </div>
            ))}
          </div>
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
