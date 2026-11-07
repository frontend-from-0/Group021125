import fs from "node:fs";
import path from "node:path";
import { expect, test as setup, type Page } from "@playwright/test";

const authDir = path.join(__dirname, "..", ".auth");
const authFile = path.join(authDir, "user.json");

async function completeAuth0Login(page: Page): Promise<void> {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      [
        "Missing E2E user credentials.",
        "Add to .env.local:",
        "  E2E_USER_EMAIL=user@test.com",
        "  E2E_USER_PASSWORD=your-password",
      ].join("\n"),
    );
  }

  const acceptButton = page.getByRole("button", { name: "Accept" });
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
    await page.waitForURL(/localhost/, { timeout: 30_000 });
    return;
  }

  const emailInput = page.getByRole("textbox", { name: "Email address" });
  if (await emailInput.isVisible()) {
    await emailInput.fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForURL(/localhost/, { timeout: 30_000 });
  }
}

setup("authenticate as user", async ({ browser }) => {
  fs.mkdirSync(authDir, { recursive: true });

  const context = await browser.newContext(
    fs.existsSync(authFile) ? { storageState: authFile } : undefined,
  );
  const page = await context.newPage();

  await page.goto("/profile");

  if (page.url().includes("auth0.com")) {
    await completeAuth0Login(page);
  }

  if (!page.url().includes("/profile")) {
    await page.goto("/profile");
  }

  if (page.url().includes("auth0.com")) {
    await completeAuth0Login(page);
    await page.goto("/profile");
  }

  if (page.url().includes("/auth/login") || page.url().includes("auth0.com")) {
    throw new Error(
      [
        "User session is missing or expired.",
        "Refresh it with:",
        "  npx playwright codegen http://localhost:3000/profile --save-storage=e2e/.auth/user.json",
      ].join("\n"),
    );
  }

  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

  await context.storageState({ path: authFile });
  await context.close();
});
