import { describe, expect, it } from "vitest";
import { pageViewParams, shouldCollectAnalytics } from "./analyticsPage";

const liveMeasurementId = "G-42WK03G34Y";

describe("shouldCollectAnalytics", () => {
  it("allows the live measurement id only after consent when Firebase is configured", () => {
    expect(
      shouldCollectAnalytics({
        hasConsent: true,
        measurementId: liveMeasurementId,
        hasClientConfig: true,
      })
    ).toBe(true);
  });

  it("stays off before consent", () => {
    expect(
      shouldCollectAnalytics({
        hasConsent: false,
        measurementId: liveMeasurementId,
        hasClientConfig: true,
      })
    ).toBe(false);
  });

  it("stays off without a measurement id", () => {
    expect(
      shouldCollectAnalytics({
        hasConsent: true,
        measurementId: "  ",
        hasClientConfig: true,
      })
    ).toBe(false);
    expect(
      shouldCollectAnalytics({
        hasConsent: true,
        measurementId: undefined,
        hasClientConfig: true,
      })
    ).toBe(false);
  });

  it("stays off without the Firebase client config", () => {
    expect(
      shouldCollectAnalytics({
        hasConsent: true,
        measurementId: liveMeasurementId,
        hasClientConfig: false,
      })
    ).toBe(false);
  });
});

describe("pageViewParams", () => {
  it("keeps the query string on the path and the location", () => {
    expect(
      pageViewParams("/ikigai-finder", "step=2", {
        origin: "https://ikigaifinder.ai",
        title: "Questions",
      })
    ).toEqual({
      page_path: "/ikigai-finder?step=2",
      page_location: "https://ikigaifinder.ai/ikigai-finder?step=2",
      page_title: "Questions",
    });
  });

  it("omits a dangling question mark when there is no search", () => {
    expect(
      pageViewParams("/dashboard", "", {
        origin: "https://ikigaifinder.ai",
        title: "Dashboard",
      }).page_path
    ).toBe("/dashboard");
  });
});
