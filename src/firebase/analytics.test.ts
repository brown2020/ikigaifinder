import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCookieConsentValue: vi.fn<(name?: string) => string | undefined>(),
  getAnalytics: vi.fn(),
  initializeAnalytics: vi.fn(),
  isSupported: vi.fn<() => Promise<boolean>>(async () => true),
  logEvent: vi.fn(),
  hasClientConfig: true,
  measurementId: "G-42WK03G34Y" as string | undefined,
}));

vi.mock("react-cookie-consent", () => ({
  getCookieConsentValue: mocks.getCookieConsentValue,
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: mocks.getAnalytics,
  initializeAnalytics: mocks.initializeAnalytics,
  isSupported: mocks.isSupported,
  logEvent: mocks.logEvent,
}));

vi.mock("@/firebase/firebaseClient", () => ({
  get hasClientConfig() {
    return mocks.hasClientConfig;
  },
  getFirebaseApp: () =>
    mocks.hasClientConfig
      ? { options: { measurementId: mocks.measurementId } }
      : null,
}));

const instance = { appName: "analytics" };

async function loadAnalyticsModule() {
  vi.resetModules();
  return import("./analytics");
}

describe("startAnalytics", () => {
  beforeEach(() => {
    mocks.hasClientConfig = true;
    mocks.measurementId = "G-42WK03G34Y";
    mocks.getCookieConsentValue.mockReset();
    mocks.getCookieConsentValue.mockReturnValue(undefined);
    mocks.isSupported.mockReset();
    mocks.isSupported.mockResolvedValue(true);
    mocks.getAnalytics.mockReset();
    mocks.getAnalytics.mockReturnValue(instance);
    mocks.initializeAnalytics.mockReset();
    mocks.initializeAnalytics.mockReturnValue(instance);
    mocks.logEvent.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not call getAnalytics before consent", async () => {
    const { startAnalytics } = await loadAnalyticsModule();
    await expect(startAnalytics()).resolves.toBeNull();
    expect(mocks.isSupported).not.toHaveBeenCalled();
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
    expect(mocks.initializeAnalytics).not.toHaveBeenCalled();
  });

  it("initializes with isSupported and getAnalytics after consent, without an automatic page view", async () => {
    mocks.getCookieConsentValue.mockReturnValue("true");
    const { startAnalytics } = await loadAnalyticsModule();
    const first = await startAnalytics();
    const second = await startAnalytics();
    expect(first).toBe(instance);
    expect(second).toBe(instance);
    expect(mocks.isSupported).toHaveBeenCalledTimes(1);
    expect(mocks.initializeAnalytics).toHaveBeenCalledTimes(1);
    expect(mocks.initializeAnalytics).toHaveBeenCalledWith(
      { options: { measurementId: "G-42WK03G34Y" } },
      { config: { send_page_view: false } }
    );
    expect(mocks.getAnalytics).toHaveBeenCalledTimes(1);
    expect(mocks.getAnalytics).toHaveBeenCalledWith({
      options: { measurementId: "G-42WK03G34Y" },
    });
  });

  it("retries after a failed load", async () => {
    mocks.getCookieConsentValue.mockReturnValue("true");
    mocks.isSupported.mockRejectedValueOnce(new Error("blocked"));
    const { startAnalytics } = await loadAnalyticsModule();
    await expect(startAnalytics()).resolves.toBeNull();
    await expect(startAnalytics()).resolves.toBe(instance);
    expect(mocks.getAnalytics).toHaveBeenCalledTimes(1);
  });

  it("does not call getAnalytics when the browser cannot run analytics", async () => {
    mocks.getCookieConsentValue.mockReturnValue("true");
    mocks.isSupported.mockResolvedValue(false);
    const { startAnalytics } = await loadAnalyticsModule();
    await expect(startAnalytics()).resolves.toBeNull();
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
  });

  it("does not call getAnalytics without the measurement id", async () => {
    mocks.getCookieConsentValue.mockReturnValue("true");
    mocks.measurementId = " ";
    const { startAnalytics } = await loadAnalyticsModule();
    await expect(startAnalytics()).resolves.toBeNull();
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
  });

  it("logs page_view for each client route and skips a repeat of the same path", async () => {
    mocks.getCookieConsentValue.mockReturnValue("true");
    vi.stubGlobal("window", { location: { origin: "https://ikigaifinder.ai" } });
    vi.stubGlobal("document", { title: "Ikigai Finder" });
    const { startAnalytics, logAnalyticsPageView } = await loadAnalyticsModule();
    const analytics = await startAnalytics();
    if (!analytics) throw new Error("expected analytics");
    logAnalyticsPageView(analytics, "/ikigai-finder", "step=2");
    logAnalyticsPageView(analytics, "/ikigai-finder", "step=2");
    logAnalyticsPageView(analytics, "/generate-ikigai", "");
    expect(mocks.logEvent).toHaveBeenCalledTimes(2);
    expect(mocks.logEvent).toHaveBeenNthCalledWith(1, instance, "page_view", {
      page_path: "/ikigai-finder?step=2",
      page_location: "https://ikigaifinder.ai/ikigai-finder?step=2",
      page_title: "Ikigai Finder",
    });
    expect(mocks.logEvent).toHaveBeenNthCalledWith(2, instance, "page_view", {
      page_path: "/generate-ikigai",
      page_location: "https://ikigaifinder.ai/generate-ikigai",
      page_title: "Ikigai Finder",
    });
    vi.unstubAllGlobals();
  });
});
