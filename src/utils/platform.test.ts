import { afterEach, describe, expect, it } from "vitest";
import { isReactNativeWebView } from "./platform";

const g = globalThis as { window?: unknown };

describe("isReactNativeWebView", () => {
  afterEach(() => {
    delete g.window;
  });

  it("is false on the server", () => {
    expect(isReactNativeWebView()).toBe(false);
  });

  it("is false in a normal browser, even with a mobile user agent", () => {
    g.window = { navigator: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" } };
    expect(isReactNativeWebView()).toBe(false);
  });

  it("is true inside the app on iPad, whose webview reports a desktop Mac user agent", () => {
    g.window = {
      navigator: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15" },
      ReactNativeWebView: { postMessage: () => {} },
    };
    expect(isReactNativeWebView()).toBe(true);
  });
});
