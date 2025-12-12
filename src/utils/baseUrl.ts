export function getBaseUrl(): string {
  // Client-side: use the current origin.
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: prefer explicit config.
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured;

  // Vercel preview/prod.
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  // Local fallback.
  return "http://localhost:3000";
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, getBaseUrl()).toString();
}


