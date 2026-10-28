export type AuthPageMode = "login" | "signup" | "forgot";

const REDIRECT_BASE = "https://redirect.invalid";

/** Same-origin path, or null when the value would leave this site (including `/\host`). */
export function safeInternalPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw.includes("\\") || raw.includes("://") || /[\u0000-\u001F\u007F]/.test(raw)) return null;
  let url: URL;
  try {
    url = new URL(raw, REDIRECT_BASE);
  } catch {
    return null;
  }
  if (url.origin !== REDIRECT_BASE || url.username || url.password) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function sanitizeRedirect(raw: string | null, fallback = "/dashboard"): string {
  return safeInternalPath(raw) ?? fallback;
}
