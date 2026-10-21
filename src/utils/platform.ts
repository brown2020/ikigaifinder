// ============================================================================
// Platform Detection Utilities
// ============================================================================

/**
 * True inside the native app. react-native-webview injects `window.ReactNativeWebView`
 * on every platform; the user agent is not reliable because iPadOS WKWebView reports
 * a desktop Macintosh UA.
 */
export function isReactNativeWebView(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return typeof window.ReactNativeWebView !== "undefined";
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

