# Lesson 42 — Connect Stripe payment notifications / Stripe Webhooks (Instructor Notes)

**Topic:** Stripe webhooks — verify signatures and handle `checkout.session.completed`  
**Cohort:** Group021125 (Web Developer / 02112025)  
**When:** Wed 1 Oct 2026 (calendar cohort classroom)  
**Historical source:** `frontend-from-0/Group130625` Lesson42  
- Starter: `165919e`  
- Completed: `7b2aa81`

## Prerequisites

- Students need a **Stripe account** (test mode is enough).
- Prior payment / Checkout lesson should already cover creating a Checkout Session and using `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY`.
- Local Node/Express from Lesson 41 (`express-demo` layout) — this lesson continues that Express+TS app under `Lesson42/express-demo`.

## Env vars (from `.env.example`)

Copy `.env.example` → `.env` and fill:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `8000`) |
| `STRIPE_PUBLISHABLE_KEY` | Client-side Stripe key (from prior payment lesson) |
| `STRIPE_SECRET_KEY` | Server Stripe SDK (`src/common/stripe.ts`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from Stripe CLI (`whsec_…`) or Dashboard endpoint |

Also present for the template (not the focus today): `NODE_ENV`, `APP_ID`, `LOG_LEVEL`, `REQUEST_LIMIT`, `DATABASE_URL`.

## Starter vs completed (what you add live)

**Student starter PR** (`prep-lesson-42`): Express+TS demo with Stripe env placeholders; webhook `app.post` is **commented** in `src/app.ts`.

**This instructor PR** adds the during-lesson pieces:

- `src/common/stripe.ts` — Stripe client + `STRIPE_ENDPOINT_SECRET` from `STRIPE_WEBHOOK_SECRET`
- `src/resources/webhooks/controller.ts` — `receiveUpdates` with `constructEvent` + `checkout.session.completed` / `checkout.session.expired`
- Uncomment / wire `app.post('/v1/stripe/webhooks', express.raw({ type: 'application/json' }), …)` **before** `express.json()`
- `package.json` / lockfile — add `stripe` dependency
- Minor cleanup in `src/common/routes.ts` (drop unused products router import if present)

## Demo order (recommended)

1. **Why raw body?** Stripe signature verification needs the exact request bytes. Show the GitHub issue note in `app.ts` and place the webhook route **above** `app.use(express.json())` with `express.raw({ type: 'application/json' })`.
2. **Webhook route + controller** — register `POST /v1/stripe/webhooks`, walk through `stripe.webhooks.constructEvent(body, signature, secret)`.
3. **Stripe CLI listen** (preferred over ngrok for class):
   - `stripe listen --forward-to localhost:8000/v1/stripe/webhooks`
   - Copy the printed `whsec_…` into `.env` as `STRIPE_WEBHOOK_SECRET`
   - Restart the API so env reloads
4. **Trigger a payment** — complete a test Checkout Session; watch CLI events and the server log for `checkout.session.completed`.
5. **Handle the event** — in the switch, log `event.data.object`; point at line-items retrieve + `customer_details` email as follow-ups (comments already in the controller).

## Common pitfalls

- **Signature verification failed** — almost always: JSON middleware parsed the body first, wrong/missing `STRIPE_WEBHOOK_SECRET`, or CLI secret not updated after restarting `stripe listen`.
- **Missing `stripe-signature` header** — request did not come from Stripe/CLI; controller returns 400.
- **ngrok / public URL** — if not using CLI, Dashboard webhook URL must hit the raw route; HTTPS tunnel + correct path `/v1/stripe/webhooks`; still use the Dashboard endpoint’s signing secret, not a stale CLI secret.
- **Secret mix-ups** — publishable vs secret vs webhook (`whsec_`) keys are different; never commit `.env`.
- **Testing without CLI** — Dashboard “Send test webhook” still needs a reachable URL and the matching endpoint secret.

## Classroom tips

- Keep the class in **test mode**; use CLI forwarding so nobody needs to expose a public URL.
- Stress order of middleware: raw webhook route → then `express.json()` for the rest of the API.
- Do not merge this instructor branch into student `main` before class unless that is your usual pattern.
