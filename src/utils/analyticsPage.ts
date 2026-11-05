/** Whether Firebase Analytics may load. Consent is the existing cookie banner. */
export function shouldCollectAnalytics(input: {
  hasConsent: boolean;
  measurementId: string | undefined;
  hasClientConfig: boolean;
}): boolean {
  return input.hasConsent && input.hasClientConfig && Boolean(input.measurementId?.trim());
}

export type AnalyticsPageView = {
  page_path: string;
  page_location: string;
  page_title: string;
};

/** page_view fields for an App Router URL, including the query string. */
export function pageViewParams(
  pathname: string,
  search: string,
  location: { origin: string; title: string }
): AnalyticsPageView {
  const page_path = search ? `${pathname}?${search}` : pathname;
  return {
    page_path,
    page_location: `${location.origin}${page_path}`,
    page_title: location.title,
  };
}
