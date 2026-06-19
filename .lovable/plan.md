## Khodiyar Industry — B2B Edible Chuna Catalog

A single-page (multi-route) marketing site that showcases products, builds trust through FSSAI/hygiene messaging, and channels all inquiries to WhatsApp (+91 99984 21346).

### Design direction
- **Palette:** crisp white `#ffffff` background, deep navy `#0f1b3d` primary, mid-blue `#1e3a5f` secondary, gold `#d4a017` accent, soft slate text.
- **Typography:** Inter (headings + body) via `@fontsource-variable/inter`.
- **Components:** rounded cards with soft shadows, gold underline accents on headings, subtle hover lift on product cards and CTAs, FSSAI badge prominently displayed.
- Fully mobile-responsive (grid → stack), accessible labels, semantic HTML, single H1 per route.

### Route structure (TanStack Start)
- `/` — Home: Hero → Why Choose Us → Featured Products preview → About teaser → Inquiry form.
- `/products` — full 6-product catalog grid.
- `/quality` — Quality & Hygiene details + FSSAI.
- `/about` — Company story.
- `/contact` — Inquiry form + contact details + map link.
- Each route gets its own `head()` with unique title/description/OG meta.

### Sections / components
1. **Header** — sticky, logo wordmark "Khodiyar Industry" with gold accent dot, nav (Home, Products, Quality, About, Contact), "Get a Bulk Quote" gold CTA → `/contact`. Mobile hamburger sheet.
2. **Hero** — headline "Premium Edible Chuna for Your Business.", subheadline, two CTAs: "View Products" (→ /products) and "Inquire on WhatsApp" (wa.me link with prefilled message). Decorative lime/water illustration.
3. **Why Choose Us** — FSSAI certified badge card + 3 pillars (ShieldCheck, Sparkles, Truck icons): Hygienic Manufacturing, Premium Raw Materials, Reliable Bulk Supply.
4. **Product Catalog** — responsive grid (1/2/3 cols) of 6 cards. Each card: image placeholder, name, short tag, "Inquire Now" button that opens WhatsApp with prefilled "I'm interested in {product}".
   - Tirth Chuna Parcel White – Medium
   - Tirth Chuna Parcel White – Ghata
   - Tirth Chuna Parcel Yellow – Medium
   - Tirth Chuna Parcel Yellow – Ghata
   - Riddhi Siddhi Chuna Parcel Yellow – Packing
   - Riddhi Siddhi Chuna Parcel Yellow – Loose
5. **About** — paragraph on heritage, quality dedication, modern facility.
6. **Bulk Inquiry Form** — fields: Name, Company/Shop Name, Phone, Product (dropdown of 6), Estimated Quantity, optional Message. Submit composes a WhatsApp message and opens `https://wa.me/919998421346?text=...` in a new tab. Client-side validation, no backend.
7. **Footer** — address (Kachiyavalo Kuvo, Badarkha, Ahmedabad 387810), phone, email (patelsanjay5412@gmail.com), quick links, copyright.
8. **Floating WhatsApp FAB** — fixed bottom-right on all routes, green circle with WhatsApp icon, pulse animation.

### Technical notes
- Tailwind v4 tokens in `src/styles.css` (`--color-brand-navy`, `--color-brand-gold`, etc.) plus `@theme inline` mapping for shadcn.
- Inter font via `@fontsource-variable/inter` (installed with `bun add`).
- Lucide icons throughout (ShieldCheck, Sparkles, Truck, Phone, Mail, MapPin, MessageCircle, Menu).
- Product images: generated placeholder JPGs in `src/assets/products/` (one neutral white-jar shot reused with label color tints, or 6 distinct small generations).
- WhatsApp helper `buildWaLink(message)` centralizes the phone number.
- All forms use shadcn `Form` + `react-hook-form` + `zod` for validation.
- Reusable `<SectionHeading>`, `<ProductCard>`, `<InquiryForm>`, `<WhatsAppFab>`, `<SiteHeader>`, `<SiteFooter>`.

### Out of scope
- No checkout, cart, or payment.
- No database / Lovable Cloud (form goes to WhatsApp).
- No CMS — product list is a static TS array.
