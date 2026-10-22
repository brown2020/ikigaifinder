import { describe, expect, it } from "vitest";
import { checkProductionHealth } from "../scripts/hosted-health.mjs";

type Reply = { status: number; body?: string; location?: string };
const healthy: Record<string, Reply> = {
  "GET /": { status: 200, body: "<html><title>Ikigai Finder AI: find your reason for being</title>" },
  "GET /robots.txt": { status: 200, body: "User-Agent: *\nSitemap: https://ikigaifinder.ai/sitemap.xml" },
  "GET /dashboard": { status: 307, location: "/?redirect=%2Fdashboard" },
  "DELETE /api/account": { status: 401 },
  "PATCH /api/ikigai/sharing": { status: 401 },
};

const transport = (overrides: Record<string, Reply> = {}) => async (url: string | URL | Request, init: RequestInit = {}) => {
  const key = `${init.method ?? "GET"} ${new URL(String(url)).pathname}`;
  const reply = overrides[key] ?? healthy[key];
  return new Response(reply.body ?? "", { status: reply.status, headers: reply.location ? { location: reply.location } : {} });
};

describe("checkProductionHealth", () => {
  it("passes against a healthy deployment", async () => {
    await expect(checkProductionHealth(transport())).resolves.toMatchObject({ status: "passed", checks: 5 });
  });

  it.each([
    ["an outage", { "GET /": { status: 503 } }, /Landing page unavailable/],
    ["a different site on the domain", { "GET /": { status: 200, body: "<title>Parked</title>" } }, /not the Ikigai Finder app/],
    ["an open dashboard", { "GET /dashboard": { status: 200 } }, /must redirect/],
    ["deletion open to anonymous callers", { "DELETE /api/account": { status: 200 } }, /refuse anonymous/],
    ["sharing open to anonymous callers", { "PATCH /api/ikigai/sharing": { status: 403 } }, /refuse anonymous/],
  ])("fails on %s", async (_label, overrides, message) => {
    await expect(checkProductionHealth(transport(overrides as Record<string, Reply>))).rejects.toThrow(message);
  });
});
