import { defineConfig, devices } from "@playwright/test";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_BASE_URL;
const isLocalRun = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // PLAYWRIGHT_BASE_URL이 지정되면(Vercel Preview 등 원격 대상) 로컬 dev 서버를 띄우지 않는다.
  webServer: isLocalRun
    ? {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
