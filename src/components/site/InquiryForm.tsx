import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, buildWaLink } from "@/lib/products";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().min(2, "Please enter your company or shop name"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) are allowed"),
  product: z.string().min(1, "Please select a product"),
  quantity: z.string().min(1, "Please enter an estimated quantity"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function InquiryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      product: "",
      quantity: "",
      message: "",
    },
  });

  function onSubmit(values: FormValues) {
    const lines = [
      "*New Bulk Inquiry — Khodiyar Industry*",
      `Name: ${values.name}`,
      `Company / Shop: ${values.company}`,
      `Phone: ${values.phone}`,
      `Product: ${values.product}`,
      `Estimated Quantity: ${values.quantity}`,
    ];
    if (values.message?.trim()) lines.push(`Message: ${values.message.trim()}`);
    const url = buildWaLink(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp with your inquiry…");
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
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Sanjay Patel" {...field} />
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
                <FormLabel>Company / Shop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Shree Traders" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+91 98765 43210" {...field} />
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
                <FormLabel>Estimated Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 500 units / 100 kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Interested In</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.id} value={`${p.name} ${p.variant}`}>
                      {p.name} — {p.variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Any additional details about your requirement…"
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
          Send Inquiry via WhatsApp
        </Button>
        <p className="text-xs text-muted-foreground">
          Submitting opens WhatsApp with your inquiry pre-filled. No data is stored on our
          servers.
        </p>
      </form>
    </Form>
  );
}
