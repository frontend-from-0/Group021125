# Instructor notes — Lesson 40 (Group021125)

**Cohort:** Group021125 (calendar / attendee `021125`)  
**Calendar (2026-09-17):** 40. Web Developer Eğitimi TR saat ile 20.30  
**Topic:** Connect Stripe payment (Stripe Checkout API)  
**Student starter PR:** "Lesson 40 preparation" (`prep-lesson-40`) — `Lesson40/ecom` only (no Stripe yet)  
**Instructor PR:** this branch (`instructor-lesson-40`) — completed Stripe Checkout wiring + these notes  

**Historical source:** `frontend-from-0/Group200825` Lesson40  
- Starter: `b43a96b416abf162d0d9b544bc52f3f5f2059746` ("Add Lesson40 starter files")  
- Completed: `29643f508c90bc5ba828e8801117017ddfb211c0` ("Lesson 40 completed files")  

**Adaptation notes:** Group200825 used folder `Lesson40/ecom-200825` with classic `@prisma/client` + `prisma/schema.prisma`. This cohort’s ecom lives at `Lesson40/ecom` and uses **Prisma Mongo / prisma-next** (`@prisma/orm-mongo`, `src/prisma/contract.*`) continuing from Lesson39 on `main`. Starter was copied from Group021125 Lesson39 completed ecom (not a blind copy of historical `ecom-200825`). Stripe teaching files (`lib/stripe.ts`, Checkout Session route, success page, checkout button, package deps, schema fields) follow the historical completed delta, remapped onto the Mongo contract + `Product` type.

**Backup historical (not used):** 2026-04-13 L40 in Group130625 / group110425-files — older ecom shape (`ecom-130625`). Prefer Group200825 as above.

**Open risk:** PR `l39-prep` on Group021125 is still OPEN and CONFLICTING with `main`. L40 starter is based on **merged `main` Lesson39 completed**, not that PR.

---

## Teaching sequence (suggested ~90–120 min)

1. **Frame (5 min)** — Goal: take money with **Stripe Checkout** (hosted payment page), not a custom card form. Students already have storefront product cards from L39.
2. **Stripe Dashboard setup (10–15 min)** — Create/login test mode; reveal **Secret key** → `STRIPE_SECRET_KEY` in `.env.local`. Create a test Product + Price; copy `price_…` id.
3. **Install SDK (5 min)** — `npm i stripe @stripe/stripe-js` (server uses `stripe`; browser helper optional for later).
4. **`src/lib/stripe.ts` (5–10 min)** — Server-only Stripe client; throw if secret missing. Stress: never expose secret key to the client.
5. **Checkout Session API route (20–25 min)** — `POST /api/stripe/checkout`: read `price_id` + `quantity` from `formData`, `stripe.checkout.sessions.create({ line_items, mode: 'payment', success_url })`, redirect 303 to `session.url`. Call out TODO: validate with Zod.
6. **Success page (5 min)** — `/checkout/success` reads `session_id` from searchParams; log / show confirmation (stretch: retrieve session from Stripe).
7. **Wire UI (15–20 min)** — `CheckoutButton` form POST to the route; place on `ProductCard`; plumb `stripePriceId` through `ProductGrid` / `Product` type / Prisma contract fields.
8. **Data model + create-product TODO (10–15 min)** — Add `stripePriceId` / `stripeProductId` on Product; comment in create-product action: create Stripe Product+Price when saving admin product (often left as live coding / homework).
9. **End-to-end test (10 min)** — Run app, click Checkout, pay with Stripe test card `4242…`, land on success page.
10. **Recap / Q&A (5 min)** — Checkout Session vs PaymentIntent; test vs live keys; why redirect flow.

---

## Core concepts

| Concept | What to stress |
|--------|----------------|
| **Stripe Checkout** | Hosted payment page; you create a **Checkout Session**, redirect the browser |
| **Price ID** | `price_…` identifies what the customer buys (amount/currency live on Stripe) |
| **Secret key** | Server-only (`STRIPE_SECRET_KEY`); use test mode keys in class |
| **Success URL** | Where Stripe sends the customer; can include `{CHECKOUT_SESSION_ID}` |
| **line_items** | Array of `{ price, quantity }` on the session |
| **mode: 'payment'** | One-time payment (vs subscription) |
| **Server route** | Next.js App Router Route Handler performs the redirect (303) |

---

## Terminology

| Term | Plain meaning |
|------|----------------|
| Checkout Session | Short-lived Stripe object representing one checkout attempt |
| Price / Product | Stripe catalog objects; Price holds amount; Product is the item |
| Test mode | Fake charges; test cards only |
| Publishable key | Client-safe key (not required for basic Checkout redirect) |
| Webhook | Server callback for payment events (out of scope unless stretch) |
| `server-only` | Package/import guard so secret code cannot be bundled to the client |

---

## Questions to ask the room

1. Why must `STRIPE_SECRET_KEY` never go into a Client Component?
2. What is the difference between a Stripe **Product** and a **Price**?
3. Why redirect with status **303** after creating the session?
4. Where should Zod validation run — browser, route handler, or both?
5. If `CheckoutButton` hardcodes a price id, what breaks when you have many products?
6. After payment, how would you verify the session server-side instead of trusting the query string alone?
7. How do `stripePriceId` fields in Mongo relate to the hardcoded demo price in the starter button?

---

## Demos (instructor live)

1. Stripe Dashboard → Developers → API keys (test) → copy secret into `.env.local`.
2. Create Product + Price → copy `price_…` into `CheckoutButton` (or a real product field).
3. Implement `lib/stripe.ts` + checkout route; show Network tab 303 to `checkout.stripe.com`.
4. Complete payment with `4242 4242 4242 4242`, any future expiry, any CVC.
5. Optional: retrieve session with `stripe.checkout.sessions.retrieve(session_id)` on the success page.

---

## Files touched in completed solution (this PR)

- **New:** `src/lib/stripe.ts`, `src/app/api/stripe/checkout/route.ts`, `src/app/checkout/success/page.tsx`, `src/components/storefront/checkout-button.tsx`
- **Updated:** `package.json` / lockfile (`stripe`, `@stripe/stripe-js`), `product-card.tsx`, `product-grid.tsx`, `types/product.ts`, `lib/products.ts`, `admin/products/new/action.ts` (TODO comment + placeholder ids), `src/prisma/contract.prisma` (+ json/d.ts)

Historical also tweaked classic Prisma client import paths — **not applicable** on this cohort’s Mongo setup.

---

## Env checklist

```bash
# .env.local (do not commit)
STRIPE_SECRET_KEY=sk_test_...
# plus existing Auth0 / DB / Blob vars from prior lessons
```

---

## Stretch / homework ideas

- Pass `stripePriceId` into `CheckoutButton` instead of hardcoding.
- On admin create-product: `stripe.products.create` + `stripe.prices.create`, save ids on the Mongo product.
- Zod-validate `price_id` / `quantity` in the route.
- Success page: retrieve session and show amount/email.
- Webhook `checkout.session.completed` to mark orders paid (advanced).
