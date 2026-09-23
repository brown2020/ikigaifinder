export type AuthPageMode = "login" | "signup" | "forgot";

export function sanitizeRedirect(raw: string | null, fallback = "/dashboard"): string {
  if (
    raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.includes("://")
  ) {
    return raw;
  }
  return fallback;
}
