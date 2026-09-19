import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright's baseURL is http://127.0.0.1:3000; without this, `next dev` treats
  // that as cross-origin and blocks the HMR websocket, which then retries forever
  // and can disrupt an in-progress page's event listeners mid-test.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
