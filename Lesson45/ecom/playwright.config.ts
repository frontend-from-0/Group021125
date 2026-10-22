import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "admin-setup",
      testMatch: "**/auth.setup.ts",
      testDir: "./e2e/setup/",
      timeout: 60_000,
    },
    {
      name: "user-setup",
      testMatch: "**/user.auth.setup.ts",
      testDir: "./e2e/setup/",
      timeout: 60_000,
    },
    {
      name: "chromium-logged-in-admin",
      testDir: "./e2e/logged-in-admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
      dependencies: ["admin-setup"],
    },
    {
      name: "chromium-logged-in-user",
      testDir: "./e2e/logged-in-user",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["user-setup"],
    },
    {
      name: "chromium-logged-out",
      testDir: "./e2e/logged-out",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
