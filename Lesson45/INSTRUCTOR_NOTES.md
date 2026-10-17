# Lesson 45 – Automated testing part 2: end-to-end testing (Playwright) — Instructor notes

**Cohort:** Group021125 (Jr. Web Developer, 02112025) · **When:** Thu 22 Oct 2026, 19:30–21:00 Stockholm (20:30 TR)
**Historical source:** `frontend-from-0/Group200825` Lesson45 (12 Aug 2026, identical calendar topic) — starter `e256a21`, completed `c719d17`.
No Web Developer cohort has taught this topic before; the Group200825 (Front End) lesson is the only recent match. Group021125 Lesson44 (Jest) was also prepared from Group200825 Lesson44.

## Starter (student branch `prep-lesson-45`)
- `Lesson45/ecom/` = copy of this repo's `Lesson44/ecom` (Anna's Lesson 44 completed state on `main`, incl. Jest setup).
- Added from the historical starter: `Lesson45/playwright.md` (handout; "Run from" path changed to `Lesson45/ecom/`), `e2e/setup/auth.setup.ts` (admin login/storageState draft, port 4005), `e2e/fixtures/laptop2.avif`.
- As in the historical starter, `required` attributes were removed from `src/app/admin/products/new/create-product-form.tsx` (so server-side validation errors can be exercised from the browser).
- `jest.md` / `quality-control.md` from Lesson 44 are not carried over (same as history).

## Flow (historical)
1. Testing pyramid recap (unit/snapshot → integration → E2E) using `playwright.md`.
2. `npm init playwright@latest` in `Lesson45/ecom` → walk the generated `playwright.config.ts`: `testDir: './e2e'`, `baseURL` + `webServer` on port 3000 (`npm run dev`), dotenv loading `.env.local`/`.env`.
3. Logged-out tests (`e2e/logged-out/...`): visiting `/admin/products` and `/profile` must redirect to Auth0 Universal Login (assert email/password/Continue are visible).
4. Auth via `storageState`: projects `setup` → `chromium-logged-in-admin` (uses `e2e/.auth/admin.json`) and `chromium-logged-out`. Rewrite the starter `auth.setup.ts` → `auth.setup.test.ts` (wait for heading-or-login, `completeAuth0Login` with `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`, `assertNoAuth0CallbackError`, port 3000). Add `user.auth.setup.test.ts` (`E2E_USER_EMAIL`/`E2E_USER_PASSWORD`).
5. Logged-in admin test: `/admin/products` stays on `/admin/products`.
6. Tooling demo: `npx playwright test --ui`, `codegen`, trace viewer; `.gitignore` entries for reports and `e2e/.auth/*.json`; GitHub Actions workflow `playwright.yml`.
7. Jest add-on from the same historical commit: `src/app/error.test.tsx` (RTL render + `fireEvent` on "Try again" + `toMatchSnapshot`) — this is the snapshot test that was an open question for Lesson 44.

## Completed state (this branch)
`playwright.config.ts`, `e2e/**` tests, `.github/workflows/playwright.yml`, `.gitignore` additions, `@playwright/test` devDependency (lock updated, resolves 1.64.1), `src/app/error.test.tsx`.
Not copied: historical `error.test.tsx.snap` (generated for the Group200825 markup; Jest will write a fresh one on first run) and the stray `node-path` dependency.

## Caveats to check before class
- Students need an Auth0 test admin user (with `admin` role) and test user, and the `E2E_*` vars in `.env.local`.
- Logged-out assertions look for the text "Log in to dev-" (Auth0 tenant name) — adjust to this cohort's Auth0 tenant.
- The workflow file lives in `Lesson45/ecom/.github/` so GitHub will not run it from this monorepo (same as history; fine as a demo).
- `@playwright/test` 1.64 / Prisma packages warn on Node 20; use Node 22+.

## Fixed on both branches (17 Oct)
- `src/app/profile/page.tsx`: title is now `<CardTitle><h1>Profile</h1></CardTitle>`, so `user.auth.setup.test.ts`'s `getByRole("heading", { name: "Profile" })` matches. Admin "Products" was already an `h1`.
- `jest.config.ts`: `testPathIgnorePatterns: ["/node_modules/", "<rootDir>/e2e/"]`, so `npm test` runs only the Jest unit/snapshot tests; Playwright specs run with `npx playwright test`.

## Exercises
None prepared (Lesson 44 homework in Classroom is unit tests on the students' own NextJS e-commerce projects).
