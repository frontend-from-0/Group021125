# PocketMoney

Minimalist money tracker for kids ages 10–15. Sign in with Auth0, log money in/out, see balance and this week’s totals.

## Stack

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Auth0 (`@auth0/nextjs-auth0` v4)
- MongoDB Atlas + **Prisma 8 Mongo** (`@prisma/orm-mongo`) — same pattern as `Lesson47/ecom`
- Deploy on Vercel

## Setup

1. Copy env file and fill values:

```bash
cp .env.example .env.local
```

Required:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | MongoDB Atlas SRV string |
| `AUTH0_DOMAIN` | e.g. `your-tenant.eu.auth0.com` (no `https://`) |
| `AUTH0_CLIENT_ID` | Auth0 Regular Web Application |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret |
| `AUTH0_SECRET` | `openssl rand -hex 32` |
| `APP_BASE_URL` | `http://localhost:3000` locally |

2. In Auth0 (Regular Web App):

- Allowed Callback URLs: `http://localhost:3000/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Enable Database connection + Google (optional)

3. Install and generate the Prisma contract:

```bash
npm install
npm run contract:emit
```

4. Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prisma 8 notes

Mirrors [`Lesson47/ecom`](../../Lesson47/ecom) with the current `@prisma/orm-mongo` API:

- Contract: `src/prisma/contract.prisma`
- Client: `src/prisma/db.ts` uses `contractFromJson` + lazy `db` proxy → `db.orm.users` / `db.orm.transactions`
- After schema changes: `npm run contract:emit`
- Field names in ORM use `id` (not `_id`)
- `Date` fields are typed as ISO strings (`mongo/date-string@1`); pass/store `.toISOString()`

## Deploy (Vercel)

1. Import the `Lesson48/pocket-money` project (or repo root with correct root directory).
2. Set the same env vars in Vercel.
3. Add production Auth0 callback/logout URLs for your Vercel domain.
4. Build command uses `prisma contract emit && next build`.
