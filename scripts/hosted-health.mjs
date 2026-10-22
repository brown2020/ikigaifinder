import assert from "node:assert/strict";

export const PRODUCTION_ORIGIN = "https://ikigaifinder.ai";

/**
 * Read-only production probes: no account, no AI provider call, no writes.
 * `transport` is injectable so tests can prove that outages and open auth boundaries fail.
 */
export async function checkProductionHealth(transport = fetch, origin = PRODUCTION_ORIGIN) {
  const request = (path, options = {}) =>
    transport(origin + path, { ...options, redirect: "manual", signal: AbortSignal.timeout(15000) });

  const home = await request("/");
  assert.equal(home.status, 200, "Landing page unavailable");
  assert.match(await home.text(), /<title>[^<]*Ikigai Finder/, "Landing page is not the Ikigai Finder app");

  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200, "robots.txt unavailable");
  assert.match(await robots.text(), /Sitemap:/, "robots.txt has no sitemap");

  const dashboard = await request("/dashboard");
  assert.ok([302, 303, 307, 308].includes(dashboard.status), "Anonymous dashboard must redirect");
  assert.equal(new URL(dashboard.headers.get("location") ?? "", origin).pathname, "/", "Anonymous dashboard must redirect home");

  const deletion = await request("/api/account", { method: "DELETE" });
  assert.equal(deletion.status, 401, "Account deletion must refuse anonymous callers");

  const sharing = await request("/api/ikigai/sharing", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "smoke-probe", sharable: true }),
  });
  assert.equal(sharing.status, 401, "Sharing must refuse anonymous callers");

  return { checkedAt: new Date().toISOString(), origin, checks: 5, status: "passed" };
}
