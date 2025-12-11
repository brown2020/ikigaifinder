// ============================================================================
// Platform Detection Utilities
// ============================================================================

/**
 * Check if running in a React Native WebView
 *
 * @returns true if running in a React Native WebView environment
 */
export function isReactNativeWebView(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return typeof window.ReactNativeWebView !== "undefined";
}

/**
 * Check if running in an iOS React Native WebView
 *
 * Note: This currently just checks for any React Native WebView.
 * In the future, we could add iOS-specific detection if needed.
 *
 * @returns true if running in iOS React Native WebView
 */
export function isIOSReactNativeWebView(): boolean {
  return isReactNativeWebView();
}

/**
 * Check if running on the server (SSR)
 *
 * @returns true if running on the server
 */
export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * Check if running in a browser
 *
 * @returns true if running in a browser environment
 */
export function isBrowser(): boolean {
  return !isServer();
}

// ============================================================================
// Content Moderation
// ============================================================================

/**
 * List of restricted words for image generation prompts
 */
const RESTRICTED_WORDS = [
  "nude",
  "naked",
  "sexual",
  "explicit",
  "porn",
  "erotic",
  "provocative",
  "seductive",
  "intimate",
  "lingerie",
  "underwear",
  "bikini",
  "strip",
  "sex",
  "breasts",
  "genital",
  "vagina",
  "penis",
  "buttocks",
  "bare",
  "inappropriate",
  "obscene",
  "lewd",
] as const;

/**
 * Check if an image prompt contains restricted words
 *
 * Used to filter out potentially inappropriate content
 * before sending to the image generation API.
 *
 * @param prompt - Image generation prompt to check
 * @returns true if the prompt contains restricted content
 */
export function containsRestrictedContent(prompt: string): boolean {
  if (!prompt) return false;

  const normalizedPrompt = prompt.toLowerCase();
  return RESTRICTED_WORDS.some((word) => normalizedPrompt.includes(word));
}

// ============================================================================
// Device Detection
// ============================================================================

/**
 * Check if the device is a mobile device
 *
 * @returns true if on a mobile device
 */
export function isMobile(): boolean {
  if (isServer()) return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if the device is a touch device
 *
 * @returns true if the device supports touch
 */
export function isTouchDevice(): boolean {
  if (isServer()) return false;

  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
