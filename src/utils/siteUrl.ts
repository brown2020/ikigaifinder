const FALLBACK_SITE_URL = "https://ikigaifinder.ai";

/** Canonical public origin for metadata, robots, sitemap, and structured data. */
export function siteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_SITE_URL);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function absoluteSiteUrl(pathname = "/"): string {
  return new URL(pathname, siteUrl()).toString();
}

/** Serializes JSON-LD so it cannot close the surrounding script tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
