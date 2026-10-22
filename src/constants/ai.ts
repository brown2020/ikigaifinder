/**
 * AI provider identifiers, in one place so a model migration is a one-line change.
 * Check provider deprecation pages before changing: OpenAI retires `gpt-4o` from the API on 2027-01-14.
 */
export const TEXT_MODEL = "gpt-4o";

/** Fireworks deprecated its image generation API in 2026; replace this provider before it is removed. */
export const IMAGE_ENDPOINT =
  "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0";
