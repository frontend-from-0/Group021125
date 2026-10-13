# Lesson 44 – Automated testing part 1: Unit and Snapshot tests — Instructor notes

**Cohort:** Group021125 (Web Developer) · **When:** Thu 15 Oct 2026, 19:30–21:00 Stockholm (20:30 TR)
**Historical source:** `frontend-from-0/Group200825` Lesson44 (5 Aug 2026, identical title) — starter `8dfd7df`, completed `52f0147`.
Chosen because this cohort's `ecom` app is the same codebase (`package.json` name `ecom-200825`). Alternative: Group130625 Lesson45 (`ecom-130625`, also has a `forbidden` page snapshot test).
Starter = this cohort's Lesson43 `ecom` (backend `express-demo` not carried over, same as historical) + `jest.md` + `quality-control.md`.

## Flow
1. `quality-control.md`: why test, test pyramid (unit / integration / e2e), linting, CI.
2. `jest.md`: install `jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @types/jest ts-node`; `npm init jest@latest` → `jest.config.ts` with `next/jest`; `jest.setup.ts` imports `@testing-library/jest-dom`; `"test": "jest"`.
3. Unit test pure code first: `src/types/currency.test.ts`.
4. Refactor for testability: move role/session helpers out of `src/lib/auth0.ts` into `src/lib/auth0-utils.ts` (so tests don't instantiate Auth0Client); update imports (admin layout, profile, navbar, checkout route; proxy keeps importing `auth0` from `lib/auth0`).
5. `src/lib/auth0-utils` → `auth0.test.ts`: `jest.mock('./auth0')` and `jest.mock('next/navigation')` (factory must return an object: `() => ({ ... })`), test `hasRole`. Commented second case left as a student exercise.
6. Snapshot test (not in the historical completed commit, do live if time): render a simple component (e.g. `forbidden`/`not-found` page) with RTL and `expect(asFragment()).toMatchSnapshot()`; show `-u` to update.
7. Coverage: `npx jest --coverage` (don't commit `coverage/`).

Verified on this branch: `npx jest` → 2 suites, 6 tests passing. (`tsc` shows 2 errors that were already in `admin/products/new/action.ts`.) Note: `@testing-library/jest-dom@7` wants Node ≥ 22.
