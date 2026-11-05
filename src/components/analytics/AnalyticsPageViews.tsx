"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logAnalyticsPageView, startAnalytics } from "@/firebase/analytics";
import {
  readAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "@/utils/analyticsConsent";

/** Sends page_view after cookie consent, including on client navigations. */
export function AnalyticsPageViews(): null {
  const hasConsent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    () => false
  );
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (!hasConsent || !pathname) return;
    let cancelled = false;
    void startAnalytics().then((analytics) => {
      if (cancelled || !analytics) return;
      logAnalyticsPageView(analytics, pathname, search);
    });
    return () => {
      cancelled = true;
    };
  }, [hasConsent, pathname, search]);

  return null;
}
