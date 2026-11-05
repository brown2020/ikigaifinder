import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getFirebaseApp, hasClientConfig } from "@/firebase/firebaseClient";
import { readAnalyticsConsent } from "@/utils/analyticsConsent";
import { pageViewParams, shouldCollectAnalytics } from "@/utils/analyticsPage";

type AnalyticsSdk = typeof import("firebase/analytics");

let analyticsPromise: Promise<Analytics | null> | null = null;
let analyticsSdk: AnalyticsSdk | null = null;
let lastLoggedPage: string | null = null;

/**
 * Load Firebase Analytics once consent and the existing measurement id are present.
 * Resolves to null when analytics must stay off or the browser cannot run it.
 */
export function startAnalytics(): Promise<Analytics | null> {
  const firebaseApp = getFirebaseApp();
  if (
    !firebaseApp ||
    !shouldCollectAnalytics({
      hasConsent: readAnalyticsConsent(),
      measurementId: firebaseApp.options.measurementId,
      hasClientConfig,
    })
  ) {
    return Promise.resolve(null);
  }

  analyticsPromise ??= loadAnalytics(firebaseApp).catch((error: unknown) => {
    analyticsPromise = null;
    console.warn("Firebase Analytics did not start", error);
    return null;
  });
  return analyticsPromise;
}

async function loadAnalytics(firebaseApp: FirebaseApp): Promise<Analytics | null> {
  const sdk = await import("firebase/analytics");
  if (!(await sdk.isSupported())) return null;
  // App Router navigations are not document loads. The automatic hit would
  // only see the first URL and would duplicate the manual page_view.
  sdk.initializeAnalytics(firebaseApp, { config: { send_page_view: false } });
  const analytics = sdk.getAnalytics(firebaseApp);
  analyticsSdk = sdk;
  return analytics;
}

/** Log the current client URL. Repeated calls for the same path are ignored. */
export function logAnalyticsPageView(
  analytics: Analytics,
  pathname: string,
  search: string
): void {
  if (!analyticsSdk) return;
  const params = pageViewParams(pathname, search, {
    origin: window.location.origin,
    title: document.title,
  });
  if (params.page_path === lastLoggedPage) return;
  lastLoggedPage = params.page_path;
  analyticsSdk.logEvent(analytics, "page_view", params);
}
