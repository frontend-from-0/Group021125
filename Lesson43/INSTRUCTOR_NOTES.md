# Lesson 43 — Node.js webhooks handler + Prisma/Mongo (Instructor Notes)

**Topic:** Add Prisma + MongoDB to the Express Stripe webhooks app  
**Cohort / repo:** Group021125 (Web Developer) → `frontend-from-0/Group021125`  
**When:** Thu 8 Oct 2026, 19:30 Europe/Istanbul  
**Historical source:** `frontend-from-0/Group130625` Lesson43  
- Starter: `afe1abc` “Lesson43 starter files”  
- Completed: `3982503` “Add Lesson43 completed files”

Student PR: Express+TS webhooks starter (`webhooks-express-nodejs`) with Stripe webhook wiring, users routes, no DB yet.  
This instructor PR: Prisma schema (Mongo), client helper, Zod schemas, dbService, users controller updates + these notes. **Do not merge** into student-visible `main` until you decide.

## Continuity with Lesson 42 (this cohort)

- **L42** (this cohort) put **full Stripe webhook plumbing** in the student starter, with live focus on webhook concepts/security and practicing **orders endpoints** + Auth0 JWT — different shape than older cohorts.
- **L43 historical** adds **Prisma + Mongo** persistence to the Express webhooks app (users/products/orders models). Follow this historical starter/completed for L43 code.
- Bridge in class: “L42 got events + order HTTP APIs working; L43 persists domain data with Prisma/Mongo instead of in-memory / ad-hoc.”
- Do **not** alter open L42 PRs; this lesson is based on current `main` (which already includes Lesson42).

## Goals

- Introduce Prisma with **MongoDB** provider (`@db.ObjectId`, embedded `Address` type).
- Model User / Product / Order / OrderItems and relations.
- Wire `@prisma/client`, `prisma.config.ts`, `src/common/prisma.ts`, `dbService`.
- Validate inputs with **Zod** (`users/schemas.ts`); update users controller to use DB.
- Env: `DATABASE_URL` for Mongo.

## Before class

- [ ] Recording on
- [ ] Mongo connection string ready (Atlas or local) for demo — never commit secrets
- [ ] `npm install` in starter; plan `npx prisma generate` after schema lands
- [ ] Skim L42 webhook controller so the “where would we write Order on `checkout.session.completed`?” callback is clear

## Teaching flow

1. Recap webhook flow from L42 (verify signature → handle event type → side effects).
2. Why an ORM/ODM here: typed models, migrations-ish workflow for Mongo with Prisma.
3. Add deps: `prisma`, `@prisma/client`, `zod` (as in completed `package.json`).
4. Author `prisma/schema.prisma` — walk each model; note `@@map` collection names.
5. `prisma.config.ts` + generate client to `generated/prisma` (per schema `output`).
6. `src/common/prisma.ts` singleton; `dbService.ts` thin data access.
7. Zod schemas for user payloads; refactor `users/controller.ts` to create/read via Prisma.
8. Optional stretch: on webhook paid event, create/update `Order` rows (tie back to L42 orders work).

## Starter vs completed

| Starter | Completed adds |
|---------|----------------|
| Express TS app, Stripe webhook controller, users routes (no DB) | `prisma/schema.prisma`, `prisma.config.ts`, Prisma client helper, `dbService`, Zod schemas, users controller DB wiring, lockfile/deps |

## Pitfalls

- Wrong `DATABASE_URL` / network access on Atlas.
- Forgetting `prisma generate` after schema changes.
- ObjectId field typing vs string IDs in route params.
- Committing `.env` (keep `.env.example` only).
- Generator `output` path vs import path mismatches.

## Exercises

No Lesson43 homework folder on `130625-exercises` / `02112025-exercises` matching this Prisma lesson. Skipped.

## Files in this instructor PR

| Path | Role |
|------|------|
| `Lesson43/webhooks-express-nodejs/` | Completed Prisma/Mongo end state |
| `Lesson43/INSTRUCTOR_NOTES.md` | These notes |
