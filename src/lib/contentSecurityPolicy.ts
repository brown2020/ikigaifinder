/** CSP for HTML responses. Nonce is required; eval is only for the local dev server. */
export function contentSecurityPolicy(nonce: string, allowEval: boolean): string {
  if (!/^[\w+/-]{8,128}$/.test(nonce)) {
    throw new Error("Invalid CSP nonce");
  }
  const scriptSrc = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    "https://apis.google.com",
    allowEval ? "'unsafe-eval'" : "",
  ].filter(Boolean).join(" ");
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "connect-src 'self' https://api.openai.com https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com",
    "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}
