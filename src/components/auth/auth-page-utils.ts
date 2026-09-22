export type AuthPageMode = "login" | "signup" | "forgot";

export function sanitizeRedirect(raw: string | null): string {
  if (
    raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.includes("://")
  ) {
    return raw;
  }
  return "/ikigai-finder";
}
