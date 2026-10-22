import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PLATFORM = new Set(["NODE_ENV", "VERCEL", "VERCEL_URL"]);
/** Documented in env.sample but read outside this repo's source. */
const READ_ELSEWHERE: Record<string, string> = {
  OPENAI_API_KEY: "read by @ai-sdk/openai",
  FIREBASE_UNIVERSE_DOMAIN: "copied verbatim from the service-account JSON",
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ts|tsx|mjs)$/.test(entry.name) && !entry.name.endsWith(".test.ts"))
    .map((entry) => join(entry.parentPath, entry.name));
}

const used = new Set(
  [...sourceFiles("src"), "next.config.mjs"].flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/process\.env\.([A-Z0-9_]+)/g)].map((m) => m[1])
  )
);
const documented = new Set(
  [...readFileSync("env.sample", "utf8").matchAll(/^#?\s*([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1])
);

describe("env.sample", () => {
  it("documents every environment variable the app reads", () => {
    const missing = [...used].filter((name) => !PLATFORM.has(name) && !documented.has(name));
    expect(missing).toEqual([]);
  });

  it("documents nothing the app no longer reads", () => {
    const stale = [...documented].filter((name) => !used.has(name) && !(name in READ_ELSEWHERE));
    expect(stale).toEqual([]);
  });
});
