# Lesson 43 — Persist orders with Prisma 8 and MongoDB

Work in `Lesson43/express-demo`. The shop in `Lesson43/ecom` already uses Prisma 8 (Prisma Next) with MongoDB. This lesson gives the Express API the same client and moves orders out of the in-memory `Map`.

Orders are still created by the Stripe webhook, not by `POST /v1/orders`. Two behavior changes come with the database:

- `checkoutSessionId` is unique, so a retried `checkout.session.completed` updates one document.
- The webhook stops inventing a user id. The shop copies the Auth0 `sub` onto the Checkout Session, and Express stores that value.

Run every command from `Lesson43/express-demo` unless a step says otherwise. MongoDB must be 8.0 or newer and already running.

```bash
cd Lesson43/express-demo
mongosh --eval 'db.runCommand({ buildInfo: 1 }).version'
```

---

## 1. Add Prisma ORM

Install `tsx` if this project does not already have it. Prisma's CLI uses it to load `prisma.config.ts`.

```bash
npm install --save-dev tsx typescript
```

Initialize Prisma ORM for MongoDB. This command installs the Prisma 8 packages, writes `prisma.config.ts`, `src/prisma/db.ts`, `src/prisma/contract.prisma`, and updates `.env`:

```bash
npx prisma@latest orm init --yes --target mongodb --authoring psl --write-env
```

Open `.env` and set `DATABASE_URL` to your MongoDB connection string:

```bash
DATABASE_URL="mongodb://localhost:27017/mydb?directConnection=true"
```

If `Lesson43/ecom/.env` already has a `DATABASE_URL`, copy that value instead. Orders then sit in the same database as `products` and `user`. Restart Express after changing `.env`. Copy the same line into `.env.example`.

Leave the generated `src/prisma/db.ts` as it is. It looks like this:

```ts
import 'dotenv/config';
import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = mongo<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
```

`orm init` also updates `tsconfig.json` so that `with { type: 'json' }` compiles. Do not switch the project back to CommonJS `require` for this import.

---

## 2. Define the Order contract

Open `src/prisma/contract.prisma`. Replace the generated `User` / `Post` example with the Order model:

```prisma
model Order {
  id                ObjectId    @id @map("_id")
  checkoutSessionId String      @unique
  userId            String?
  customerEmail     String?
  amountTotal       Int?
  currency          String?
  status            OrderStatus
  createdAt         DateTime
  updatedAt         DateTime

  @@map("orders")
}

enum OrderStatus {
  PENDING
  PAID
  EXPIRED
}
```

`@@map("orders")` is both the MongoDB collection name and the client path: `db.orm.orders`. `checkoutSessionId @unique` is the idempotency key for Stripe retries.

MongoDB contracts in this version do not fill dates for you. Pass `createdAt` and `updatedAt` in every `create`, the same way `Lesson43/ecom/src/lib/products.ts` does.

Generate the contract and create the collection. Re-run `contract emit` every time you change `contract.prisma`:

```bash
npx prisma contract emit
npx prisma db init
```

`contract emit` writes `src/prisma/contract.json` and `src/prisma/contract.d.ts`. Commit both with the `.prisma` file. Do not edit them by hand.

Check the generated root before writing queries:

```bash
node -e "const c=require('./src/prisma/contract.json'); console.log(Object.keys(c.roots))"
```

The key must be `orders`. Queries below use `db.orm.orders`.

---

## 3. Use Prisma in Express

In your Express code, import `db` from `src/prisma/db.ts` and run queries. Example of the client API (the rest of this lesson uses `db.orm.orders`):

```ts
import { db } from '../../prisma/db';

const created = await db.orm.orders.create({
  checkoutSessionId: 'cs_test_1',
  userId: null,
  customerEmail: null,
  amountTotal: null,
  currency: null,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const orders = await db.orm.orders.all();

const order = await db.orm.orders.where({ _id: created._id }).first();
```

When Express shuts down, close the database connection. In `src/server.ts`:

```ts
await db.close();
```

Call that from a `SIGINT` / `SIGTERM` handler after the HTTP server stops. `db` connects lazily on the first query, so there is no manual `connect()` step.

---

## 4. Replace the in-memory store

Replace `src/resources/orders/store.ts` with this file. Reads use the same chain as the shop: `.where(...).first()`, `.where(...).all()`, and `.orderBy(...).all()`. Writes use `.create()`, `.update()`, and `.upsert()`. On MongoDB, `.upsert()` has no `conflictOn`. The match goes in `.where()`.

`.update()` and `.upsert()` return `null` when nothing matches. A missing document after a write is a failure, so the webhook can answer 500 and Stripe will retry.

ObjectId fields accept the 24-character hex string from the URL. Reject anything else before querying.

```ts
import logger from '../../common/logger';
import { db } from '../../prisma/db';

export type OrderStatus = 'PENDING' | 'PAID' | 'EXPIRED';

export interface Order {
  id: string;
  checkoutSessionId: string;
  userId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: OrderStatus;
  createdAt: Date;
}

type OrderInput = Omit<Order, 'id' | 'createdAt'>;

type OrderDocument = {
  _id: { toString(): string };
  checkoutSessionId: string;
  userId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

function toOrder(order: OrderDocument): Order {
  return {
    id: String(order._id),
    checkoutSessionId: order.checkoutSessionId,
    userId: order.userId,
    customerEmail: order.customerEmail,
    amountTotal: order.amountTotal,
    currency: order.currency,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export const upsertOrder = async (
  checkoutSessionId: string,
  data: Partial<OrderInput>,
): Promise<Order> => {
  const now = new Date();
  const order = await db.orm.orders.where({ checkoutSessionId }).upsert({
    create: {
      checkoutSessionId,
      userId: data.userId ?? null,
      customerEmail: data.customerEmail ?? null,
      amountTotal: data.amountTotal ?? null,
      currency: data.currency ?? null,
      status: data.status ?? 'PENDING',
      createdAt: now,
      updatedAt: now,
    },
    update: {
      userId: data.userId ?? null,
      customerEmail: data.customerEmail ?? null,
      amountTotal: data.amountTotal ?? null,
      currency: data.currency ?? null,
      status: data.status ?? 'PENDING',
      updatedAt: now,
    },
  });

  if (!order) {
    throw new Error(`Upsert returned no order for ${checkoutSessionId}`);
  }

  logger.info(`Order saved: ${String(order._id)}`);
  return toOrder(order);
};

export const getOrderByCheckoutSession = async (
  checkoutSessionId: string,
): Promise<Order | null> => {
  const order = await db.orm.orders.where({ checkoutSessionId }).first();
  return order ? toOrder(order) : null;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const orders = await db.orm.orders.orderBy({ createdAt: -1 }).all();
  return orders.map(toOrder);
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  if (!objectIdPattern.test(id)) {
    return null;
  }

  const order = await db.orm.orders.where({ _id: id }).first();
  return order ? toOrder(order) : null;
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const orders = await db.orm.orders.where({ userId }).all();
  return orders.map(toOrder);
};

export const markOrderExpired = async (
  checkoutSessionId: string,
): Promise<Order | null> => {
  const existing = await db.orm.orders.where({ checkoutSessionId }).first();

  if (existing?.status === 'PAID') {
    return toOrder(existing);
  }

  if (existing) {
    const updated = await db.orm.orders.where({ checkoutSessionId }).update({
      status: 'EXPIRED',
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new Error(`Expire update returned no order for ${checkoutSessionId}`);
    }

    return toOrder(updated);
  }

  const now = new Date();
  const created = await db.orm.orders.create({
    checkoutSessionId,
    userId: null,
    customerEmail: null,
    amountTotal: null,
    currency: null,
    status: 'EXPIRED',
    createdAt: now,
    updatedAt: now,
  });

  return toOrder(created);
};
```

JSON status values are now `PENDING`, `PAID`, and `EXPIRED`. `id` is the MongoDB `_id` as a string, not `order_1`.

---

## 5. Write the webhook through Prisma

`stripe listen` must hit the route in `src/app.ts`: `POST /v1/stripe/webhook`. The README still says `/v1/stripe/webhooks`. Use the singular path.

In `src/resources/webhooks/controller.ts`, keep signature verification as it is. Replace the `switch` and the final `sendStatus(200)` with this block. `await` both store calls. Answer 200 only after the write succeeds. Answer 500 when MongoDB throws, so Stripe retries.

```ts
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId?.trim() || null;

        logger.info(`checkout.session.completed — session ${session.id}`);

        if (!userId) {
          logger.warn(`checkout.session.completed ${session.id} has no metadata.userId`);
        }

        const order = await upsertOrder(session.id, {
          userId,
          customerEmail: session.customer_details?.email ?? null,
          amountTotal: session.amount_total,
          currency: session.currency,
          status: 'PAID',
        });

        logger.info(`Order created/updated: ${order.id}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info(`checkout.session.expired — session ${session.id}`);
        await markOrderExpired(session.id);
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error(`Webhook persistence failed: ${message}`);
    return response.sendStatus(500);
  }

  response.sendStatus(200);
```

Delete the hardcoded `google-oauth2|115099880114970704071` fallback. A `stripe trigger` fixture has no `metadata.userId`, so that order is stored with `userId: null`. It shows up on `GET /v1/orders/all` and not on `GET /v1/orders`.

`markOrderExpired` leaves a `PAID` order alone. A late `expired` event must not undo a payment. If no order exists yet, it inserts one with status `EXPIRED`.

---

## 6. Await the store in the orders controller

The handlers in `src/resources/orders/controller.ts` send an error and then keep going. Once the store is async, that writes a second response. The forbidden branch also sends 404.

Replace the three handlers with:

```ts
const getMyOrders = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
    return;
  }

  const orders = await getOrdersByUserId(userId);
  res.status(200).json(orders);
};

const getOneById = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
    return;
  }

  const id = req.params.id;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(400).json({ error: 'Order id is not a valid id' });
    return;
  }

  const order = await getOrderById(id);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  if (order.userId !== userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  res.status(200).json(order);
};

const listAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const orders = await getAllOrders();
  res.status(200).json(orders);
};
```

`checkJwt` is already on the routes. Leave `src/resources/orders/routes.ts` as it is.

---

## 7. Put the Auth0 user on the Checkout Session

The webhook has no JWT. Express only learns who paid if the shop copied `sub` into Stripe metadata before the redirect.

In `Lesson43/ecom/src/app/api/checkout/route.ts`, import the session helper:

```ts
import { getSessionUser } from '@/lib/auth0';
```

Inside `POST`, load the user before creating the session:

```ts
const user = await getSessionUser();
```

Pass `userId` in metadata. Keep the existing `someSpecialValue` key:

```ts
metadata: {
  someSpecialValue: 'Very special value that I want to show to the user.',
  ...(user?.sub ? { userId: user.sub } : {}),
},
```

A guest checkout still creates a session. That order is saved with `userId: null`. A logged-in checkout sends `metadata.userId`, and `GET /v1/orders` for that access token returns the row.

---

## 8. Fix the README commands

In `Lesson43/express-demo/README.md`, point Stripe at the route that exists:

```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhook
```

Replace the closing note that says orders live in an in-memory store with:

```md
- **Orders are created by webhooks**, not by POST requests. `checkout.session.completed` upserts an order in MongoDB by `checkoutSessionId`.
- A retried webhook updates that same document. `checkout.session.expired` does not change an order that is already `PAID`.
- **Users and products** stay in the Next.js app. This API stores orders only.
```

Add `DATABASE_URL` to the environment table:

| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Same MongoDB 8 database as the ecom app, for example `mongodb://localhost:27017/ecom` |

---

## 9. Check it in class

Terminal 1:

```bash
cd Lesson43/express-demo
npm run dev
```

Terminal 2, after copying the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` and restarting Express:

```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhook
```

Terminal 3:

```bash
stripe trigger checkout.session.completed
stripe trigger checkout.session.completed
```

Then:

```bash
mongosh mongodb://localhost:27017/ecom --eval 'db.orders.find().pretty()'
```

The second trigger must not insert a second document. Both events use the same fixture session id, and `checkoutSessionId` is unique. `userId` is `null` because the fixture has no metadata. `status` is `PAID`.

Abandoned checkout:

```bash
stripe trigger checkout.session.expired
```

That fixture uses a different session id, so it inserts a new document with `status: "EXPIRED"`. It does not change the paid document.

Logged-in payment: sign in on the shop, check out, and confirm the new document's `userId` is that user's Auth0 `sub`. `GET /v1/orders` with their access token returns that order. `GET /v1/orders/:id` returns 403 for a different user and 400 when `id` is not a 24-character hex string.
