# Lesson 42 — Stripe Webhooks & Protected Orders (Instructor Notes)

**Topic:** Stripe webhooks + Auth0-protected orders API  
**Cohort:** Group021125 (Web Developer / 02112025)  
**When:** Wed 1 Oct 2026  

---

## Lesson Arc

### What's Already in the Starter

Students get a **fully working** Stripe webhook + orders skeleton:

| Component | Location | Description |
|-----------|----------|-------------|
| Webhook route | `src/app.ts` | `POST /v1/stripe/webhooks` with `express.raw()` |
| Webhook handler | `src/resources/webhooks/controller.ts` | Signature verification + `checkout.session.completed` |
| Order creation | `src/resources/orders/store.ts` | In-memory store; webhook creates orders |
| Auth middleware | `src/common/auth.ts` | `checkJwt` + `requireAdmin` (roles claim) |
| Auth error handler | `src/middlewares/authErrorHandler.ts` | Returns clear JSON for 401/403 errors |
| Admin route | `src/resources/orders/routes.ts` | `GET /v1/orders/all` protected by `checkJwt` + `requireAdmin` |
| Next.js frontend | `Lesson42/ecom/` | Full e-commerce app with Auth0 v4 + Stripe checkout |
| Teaching notes | `Lesson42/notes.md` | Bearer tokens & JWT explanation for students |

**Anna does NOT live-code the webhook plumbing.** It's pre-wired so students can focus on:
- Understanding concepts/security (verbal teaching)
- Completing the orders endpoints (hands-on practice)

---

## Auth Model

### checkJwt (express-oauth2-jwt-bearer)

Validates Auth0 access token and populates `req.auth.payload.sub` with the user id.

### requireAdmin (roles-based)

Checks for `admin` role in the custom claim `https://pyp-admin/roles`.

**Note:** This lesson uses **roles** (not scopes). The `/v1/orders/all` endpoint requires the `admin` role, NOT a `read:orders` scope.

---

## Student Exercise: Two Endpoints

Students complete **both** endpoints in `src/resources/orders/controller.ts`:

### 1. GET /v1/orders (getMyOrders)

**routes.ts change:** Add `checkJwt` middleware

```typescript
router.get('/', checkJwt, getMyOrders);
```

**controller.ts solution:**

```typescript
const getMyOrders = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized — missing user identity' });
  }

  const orders = getOrdersByUserId(userId);
  return res.status(200).json(orders);
};
```

### 2. GET /v1/orders/:id (getOneById)

**routes.ts change:** Add `checkJwt` middleware

```typescript
router.get('/:id', checkJwt, getOneById);
```

**controller.ts solution:**

```typescript
const getOneById = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const order = getOrderById(id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const userId = req.auth?.payload?.sub;
  if (order.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(200).json(order);
};
```

**Teaching points:**
- Extract `id` from `req.params`
- Check if order exists → 404
- Auth check: compare `order.userId` with `req.auth.payload.sub` → 403 if mismatch
- Return order as JSON

---

## Demo Order (Recommended)

### 1. Environment Setup (5 min)

```bash
cd Lesson42/express-demo
cp .env.example .env
# Fill in: STRIPE_SECRET_KEY, AUTH0_DOMAIN, AUTH0_AUDIENCE
npm install
npm run dev
```

### 2. Start Stripe CLI (5 min)

```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhooks
# Copy whsec_... to .env as STRIPE_WEBHOOK_SECRET
# Restart server to pick up new env
```

### 3. Walk Through Existing Code (10 min)

- **Why `express.raw()` before `express.json()`?** Stripe signature verification needs raw bytes
- **Webhook handler:** Show `constructEvent`, switch on `event.type`
- **Order store:** Simple Map-based store; `upsertOrder` called on `checkout.session.completed`
- **Auth middleware:** `checkJwt` validates Auth0 JWT; populates `req.auth.payload.sub`
- **Roles vs Scopes:** `/v1/orders/all` requires `admin` role via `requireAdmin` (show the roles claim `https://pyp-admin/roles`)
- **Error handler:** `authErrorHandler` returns clear JSON for 401/403 (not HTML)
- **Refer to `notes.md`** for Bearer token / JWT explanation students can review

### 4. Trigger Test Payment (5 min)

```bash
stripe trigger checkout.session.completed
# Watch server logs: "Order created/updated: order_1"
```

Show the order in `/v1/orders/all` (admin route).

### 5. Student Exercise (20 min)

Students implement both endpoints:
- `GET /v1/orders` — add `checkJwt` + implement `getMyOrders`
- `GET /v1/orders/:id` — add `checkJwt` + implement `getOneById`

### 6. Test with Next.js App (5 min)

The `ecom/` Next.js app has a test page at `/admin/test` that calls the Express API. Students can:
- Log in via Auth0
- Make test purchases through Stripe checkout
- View their orders via the protected endpoints

---

## Env Vars (from `.env.example`)

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default `8000`) |
| `STRIPE_SECRET_KEY` | Stripe SDK (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret (whsec_...) |
| `AUTH0_DOMAIN` | Tenant domain, e.g. `your-tenant.auth0.com` (no https://) |
| `AUTH0_AUDIENCE` | API identifier from Auth0 Dashboard |

See: https://auth0.com/docs/quickstart/backend/nodejs

---

## Related Files

| File | Purpose |
|------|---------|
| `Lesson42/notes.md` | Bearer tokens & JWT teaching notes (student-facing) |
| `Lesson42/ecom/` | Next.js e-commerce frontend (Auth0 v4 + Stripe) |
| `Lesson42/express-demo/src/common/auth.ts` | `checkJwt` + `requireAdmin` middleware |

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| **Signature verification failed** | JSON middleware parsed body first; check route order in `app.ts` |
| **Missing stripe-signature header** | Request didn't come from Stripe/CLI |
| **401 Unauthorized on /orders** | Token missing, expired, or wrong audience |
| **403 Forbidden on /orders/all** | User doesn't have `admin` role; assign in Auth0 Dashboard |
| **`req.auth` undefined** | `checkJwt` middleware not applied to route |
| **Order not found after webhook** | Server restarted (in-memory store cleared) |

---

## Files Modified (Instructor Branch)

This branch adds the **completed** student exercises:

- `src/resources/orders/routes.ts` — `checkJwt` added to `/` and `/:id` routes
- `src/resources/orders/controller.ts` — completed `getMyOrders` and `getOneById`
- `Lesson42/INSTRUCTOR_NOTES.md` — this file

The rest is identical to `main` (student starter).

---

## Classroom Tips

- Keep Stripe in **test mode**; use CLI forwarding (no public URLs needed)
- Emphasize `express.raw()` placement — most common webhook bug
- For Auth0 testing, have students use the `ecom/` Next.js app
- The `admin` role must be assigned in Auth0 Dashboard → Users → Roles
- Don't merge this branch to `main` before class
