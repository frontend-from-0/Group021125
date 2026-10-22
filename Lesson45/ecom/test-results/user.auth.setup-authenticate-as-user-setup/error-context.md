# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: setup/user.auth.setup.test.ts >> authenticate as user
- Location: e2e/setup/user.auth.setup.test.ts:40:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Profile' }).or(getByRole('textbox', { name: 'Email address' })).or(getByRole('button', { name: 'Accept' }))
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Profile' }).or(getByRole('textbox', { name: 'Email address' })).or(getByRole('button', { name: 'Accept' })) with timeout 30000ms
  - waiting for getByRole('heading', { name: 'Profile' }).or(getByRole('textbox', { name: 'Email address' })).or(getByRole('button', { name: 'Accept' }))

```

```yaml
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 16.2.9 (stale) Turbopack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 16.2.9 (stale) Turbopack
- img
- dialog "Build Error":
  - text: Build Error
  - button "Copy Error Info":
    - img
  - button "No related documentation found" [disabled]:
    - img
  - button "Attach Node.js inspector":
    - img
  - text: Export requireUser doesn't exist in target module
  - img
  - text: ./Lesson45/ecom/src/app/profile/page.tsx (10:1)
  - button "Open in editor":
    - img
  - text: "Export requireUser doesn't exist in target module 8 | } from \"@/components/ui/card\"; 9 | import { Typography } from \"@/components/ui/typography\"; > 10 | import { requireUser } from \"@/lib/auth0\"; | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 11 | 12 | export default async function ProfilePage() { 13 | const user = await requireUser(); The export requireUser was not found in module [project]/Lesson45/ecom/src/lib/auth0.ts [app-rsc] (ecmascript). Did you mean to import auth0? All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist."
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- alert
```

# Test source

```ts
  1  | import fs from "node:fs";
  2  | import path from "node:path";
  3  | import { expect, test as setup, type Page } from "@playwright/test";
  4  | 
  5  | const authDir = path.join(__dirname, "..", ".auth");
  6  | const authFile = path.join(authDir, "user.json");
  7  | 
  8  | async function completeAuth0Login(page: Page): Promise<void> {
  9  |   const email = process.env.E2E_USER_EMAIL;
  10 |   const password = process.env.E2E_USER_PASSWORD;
  11 | 
  12 |   if (!email || !password) {
  13 |     throw new Error(
  14 |       [
  15 |         "Missing E2E user credentials.",
  16 |         "Add to .env.local:",
  17 |         "  E2E_USER_EMAIL=user@test.com",
  18 |         "  E2E_USER_PASSWORD=your-password",
  19 |       ].join("\n"),
  20 |     );
  21 |   }
  22 | 
  23 |   const acceptButton = page.getByRole("button", { name: "Accept" });
  24 |   const emailInput = page.getByRole("textbox", { name: "Email address" });
  25 | 
  26 |   await expect(acceptButton.or(emailInput)).toBeVisible({ timeout: 15_000 });
  27 | 
  28 |   if (await acceptButton.isVisible()) {
  29 |     await acceptButton.click();
  30 |     await page.waitForURL(/localhost:3000/, { timeout: 30_000 });
  31 |     return;
  32 |   }
  33 | 
  34 |   await emailInput.fill(email);
  35 |   await page.getByRole("textbox", { name: "Password" }).fill(password);
  36 |   await page.getByRole("button", { name: "Continue", exact: true }).click();
  37 |   await page.waitForURL(/localhost:3000/, { timeout: 30_000 });
  38 | }
  39 | 
  40 | setup("authenticate as user", async ({ page }) => {
  41 |   fs.mkdirSync(authDir, { recursive: true });
  42 | 
  43 |   await page.goto("/profile");
  44 | 
  45 |   const profileHeading = page.getByRole("heading", { name: "Profile" });
  46 |   const auth0Email = page.getByRole("textbox", { name: "Email address" });
  47 |   const auth0Accept = page.getByRole("button", { name: "Accept" });
  48 | 
> 49 |   await expect(profileHeading.or(auth0Email).or(auth0Accept)).toBeVisible({
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  50 |     timeout: 30_000,
  51 |   });
  52 | 
  53 |   if (!(await profileHeading.isVisible())) {
  54 |     await completeAuth0Login(page);
  55 |     await page.goto("/profile");
  56 |   }
  57 | 
  58 |   await expect(page).toHaveURL(/\/profile/);
  59 |   await expect(profileHeading).toBeVisible();
  60 | 
  61 |   await page.context().storageState({ path: authFile });
  62 | });
  63 | 
```