import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useMemo } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { useLanguage } from "@/hooks/useLanguage";
import { getStoredFeedback, saveStoredFeedback, type CustomerFeedback } from "@/lib/feedback";

export function FeedbackForm() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const schema = useMemo(() => z.object({
    name: z.string().min(2, language === "gu" ? "નામ ઓછામાં ઓછું ૨ અક્ષરનું હોવું જોઈએ" : language === "hi" ? "नाम कम से कम 2 अक्षर का होना चाहिए" : "Name must be at least 2 characters"),
    company: z.string().min(2, language === "gu" ? "કંપનીનું નામ જરૂરી છે" : language === "hi" ? "कंपनी का नाम आवश्यक है" : "Company/shop name must be at least 2 characters"),
    rating: z.number().min(1, t("feedback.ratingError")).max(5),
    comment: z.string().min(10, language === "gu" ? "પ્રતિસાદ ઓછામાં ઓછો ૧૦ અક્ષરનો હોવો જોઈએ" : language === "hi" ? "प्रतिक्रिया कम से कम 10 अक्षर की होनी चाहिए" : "Review must be at least 10 characters"),
  }), [language, t]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      rating: 0,
      comment: "",
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    setTimeout(() => {
      const stored = getStoredFeedback();
      const newFeedback: CustomerFeedback = {
        id: "f_" + Date.now(),
        name: values.name,
        company: values.company,
        rating: values.rating,
        comment: values.comment,
        approved: false, // Default is false, requires admin approval
        date: new Date().toISOString().split("T")[0],
      };

      saveStoredFeedback([...stored, newFeedback]);
      toast.success(t("feedback.successToast"));
      form.reset();
      setIsSubmitting(false);
    }, 1200);
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
                <FormLabel>{t("feedback.labels.name")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input placeholder={t("feedback.placeholders.name")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
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
                <FormLabel>{t("feedback.labels.company")}</FormLabel>
                <FormControl>
                  <div className="input-wrapper relative">
                    <Input placeholder={t("feedback.placeholders.company")} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border" {...field} />
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

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("feedback.labels.rating")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => form.setValue("rating", star, { shouldValidate: true })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="transition-transform duration-100 hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 transition-all ${
                          star <= (hoveredRating ?? field.value)
                            ? "fill-brand-gold text-brand-gold scale-105"
                            : "text-muted-foreground/45"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("feedback.labels.comment")}</FormLabel>
              <FormControl>
                <div className="input-wrapper relative">
                  <Textarea
                    rows={4}
                    placeholder={t("feedback.placeholders.comment")}
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
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("feedback.submitting")}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t("feedback.submit")}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
