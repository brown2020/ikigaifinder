/** CSP for HTML responses. Nonce is required; eval is only for the local dev server. */
export function contentSecurityPolicy(nonce: string, allowEval: boolean): string {
  if (!/^[\w+/-]{8,128}$/.test(nonce)) {
    throw new Error("Invalid CSP nonce");
  }
  // gtag.js is injected by Firebase Analytics after cookie consent. Host
  // allowlists still apply alongside the nonce. Ads and doubleclick are omitted.
  const scriptSrc = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    "https://apis.google.com",
    "https://www.googletagmanager.com",
    allowEval ? "'unsafe-eval'" : "",
  ].filter(Boolean).join(" ");
  const imgSrc = [
    "img-src 'self'",
    "data:",
    "blob:",
    "https://lh3.googleusercontent.com",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
  ].join(" ");
  const connectSrc = [
    "connect-src 'self'",
    "https://api.openai.com",
    "https://*.firebaseio.com",
    "wss://*.firebaseio.com",
    "https://*.googleapis.com",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://*.analytics.google.com",
    "https://*.google.com",
  ].join(" ");
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com data:",
    imgSrc,
    connectSrc,
    "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}
