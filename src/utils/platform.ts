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

