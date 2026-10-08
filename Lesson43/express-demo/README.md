# Lesson 42 — Stripe Webhooks & Protected Orders API

**Topic:** Stripe webhooks with `checkout.session.completed` → create orders  
**Auth:** Express API protected with Auth0 (`express-oauth2-jwt-bearer`)

---

## Classroom Goals

1. **Understand Stripe webhooks** — how Stripe notifies your backend when payments complete
2. **See Auth0 JWT protection on Express** — the `checkJwt` middleware validates tokens
3. **Build orders endpoints** (student exercise) — complete the TODO stubs

---

## What's Already Wired (Starter Code)

| Component | Description |
|-----------|-------------|
| **Webhook route** | `POST /v1/stripe/webhooks` receives Stripe events (signature verified) |
| **Order creation** | `checkout.session.completed` → upserts order in memory store |
| **Auth middleware** | `checkJwt` from `express-oauth2-jwt-bearer` is ready to protect orders routes |
| **GET /v1/orders/all** | Admin-only list of all orders |

---

## TODO (Live Coding)

Complete both stubs in `src/resources/orders/controller.ts` and add `checkJwt` in `src/resources/orders/routes.ts`.

### `GET /v1/orders`

1. Protect the route with `checkJwt`
2. Read the user id from `req.auth.payload.sub`
3. Return 401 if it is missing
4. Call `getOrdersByUserId(userId)`
5. Return the orders as JSON

### `GET /v1/orders/:id`

1. Protect the route with `checkJwt`
2. Extract `id` from `req.params.id`
3. Call `getOrderById(id)` to fetch the order
4. Return 404 if not found
5. Verify the order belongs to the authenticated user (`order.userId === req.auth.payload.sub`)
6. Return 403 if the user doesn't own the order
7. Return the order as JSON

---

## Auth0 Integration: Next.js → Express API

This Express API is the **resource server**. The Next.js app (using Auth0 v4 SDK) is the client.

### In Auth0 Dashboard

1. Create an **API** (APIs → Create API)
   - Name: e.g. "Orders API"
   - Identifier: e.g. `https://orders.example.com` ← this is your `AUTH0_AUDIENCE`
2. Your Next.js app should already have an Auth0 Application configured

### In Next.js (Auth0 v4 SDK)

```ts
// Get an access token for the Express API
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function getServerSideProps(context) {
  // Auth0 v4 returns { token } (not { accessToken })
  const { token } = await getAccessToken(context.req, context.res, {
    audience: 'https://orders.example.com', // Your API identifier
  });

  const res = await fetch('http://localhost:8000/v1/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const orders = await res.json();

  return { props: { orders } };
}
```

### In This Express API

The `checkJwt` middleware (in `src/common/auth.ts`) validates the token:

```ts
import { checkJwt } from '../../common/auth';

router.get('/orders', checkJwt, getMyOrders);
// req.auth.payload.sub contains the user's Auth0 ID
```

---

## Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Where to get it |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI: `stripe listen --forward-to localhost:8000/v1/stripe/webhook` prints `whsec_...` |
| `AUTH0_DOMAIN` | Your Auth0 tenant domain, e.g. `your-tenant.auth0.com` (without `https://`) |
| `AUTH0_AUDIENCE` | The API identifier you created in Auth0 Dashboard |
| `DATABASE_URL` | Same MongoDB 8 database as the ecom app, for example `mongodb://localhost:27017/ecom` |

---

## Running Locally

```bash
npm install
npm run dev
```

In another terminal, forward Stripe events:

```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhook
# Copy the webhook signing secret (whsec_...) to .env
```

Trigger a test payment to see an order created:

```bash
stripe trigger checkout.session.completed
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/v1/stripe/webhook` | Stripe signature | Receives Stripe events |
| GET | `/v1/orders` | JWT (checkJwt) | **TODO** — List orders for authenticated user |
| GET | `/v1/orders/:id` | JWT (checkJwt) | **TODO** — Get one order by ID |
| GET | `/v1/orders/all` | JWT + admin role | List all orders |
| GET | `/` | None | Health check |

---

## Notes

- **Orders are created by webhooks**, not by POST requests. `checkout.session.completed` upserts an order in MongoDB by `checkoutSessionId`.
- A retried webhook updates that same document. `checkout.session.expired` does not change an order that is already `PAID`.
- **Users and products** stay in the Next.js app. This API stores orders only.
