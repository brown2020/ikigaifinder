/**
 * AI provider identifiers and settings, in one place so a model migration is a one-line change.
 * Check https://developers.openai.com/api/docs/deprecations before changing.
 */
export const TEXT_MODEL = "gpt-6.1-sol";

/** Low reasoning keeps statements fast; a null summary stops the SDK from requesting detailed reasoning summaries. */
export const TEXT_PROVIDER_OPTIONS = {
  openai: { reasoningEffort: "low", reasoningSummary: null },
} as const;

export const IMAGE_MODEL = "gpt-image-2.5-flare";
