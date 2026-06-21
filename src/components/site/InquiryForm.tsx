import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
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

  function onSubmit(values: FormValues) {
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
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(t("form.toast"));
    form.reset();
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
                  <Input placeholder={t("form.placeholders.name")} {...field} />
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
                  <Input placeholder={t("form.placeholders.company")} {...field} />
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
                  <Input type="tel" placeholder={t("form.placeholders.phone")} {...field} />
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
                  <Input placeholder={t("form.placeholders.quantity")} {...field} />
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
                <Input placeholder={t("form.placeholders.address")} {...field} />
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
                <Textarea
                  rows={4}
                  placeholder={t("form.placeholders.message")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="bg-brand-gold text-primary hover:bg-brand-gold/90 font-semibold"
        >
          <Send className="mr-2 h-4 w-4" />
          {t("form.submit")}
        </Button>
        <p className="text-xs text-muted-foreground">
          {t("form.info")}
        </p>
      </form>
    </Form>
  );
}
