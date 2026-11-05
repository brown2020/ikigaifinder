import { getCookieConsentValue } from "react-cookie-consent";

/** Cookie written by the existing banner when the visitor accepts. */
export const COOKIE_CONSENT_NAME = "ikigai-cookie-consent";

const listeners = new Set<() => void>();

export function subscribeAnalyticsConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Call from the banner's onAccept, after the consent cookie is stored. */
export function notifyAnalyticsConsent(): void {
  for (const listener of listeners) listener();
}

export function readAnalyticsConsent(): boolean {
  return getCookieConsentValue(COOKIE_CONSENT_NAME) === "true";
}
