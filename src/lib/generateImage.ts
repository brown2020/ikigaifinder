"use server";

import { adminBucket } from "@/firebase/firebaseAdmin";
import { rateLimitImageGen } from "./rateLimit";
import { generateImageSchema, sanitizeInput } from "./validation";

// ============================================================================
// Types
// ============================================================================

interface ImageGenerationResult {
  imageUrl?: string;
  error?: string;
  rateLimited?: boolean;
  resetIn?: number;
}

interface FireworksRequestBody {
  cfg_scale: number;
  height: number;
  width: number;
  sampler: string | null;
  samples: number;
  steps: number;
  seed: number;
  style_preset: string | null;
  safety_check: boolean;
  prompt: string;
}

// ============================================================================
// Constants
// ============================================================================

const FIREWORKS_API_URL =
  "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0";

const IMAGE_CONFIG: Omit<FireworksRequestBody, "prompt"> = {
  cfg_scale: 7,
  height: 1024,
  width: 1024,
  sampler: null,
  samples: 1,
  steps: 30,
  seed: 0,
  style_preset: null,
  safety_check: true, // Enable safety check for production
};

/** Signed URL expiration: 100 years from now */
const SIGNED_URL_EXPIRY = "03-17-2125";

/** Maximum prompt length after sanitization */
const MAX_PROMPT_LENGTH = 1000;

// ============================================================================
// Server Action
// ============================================================================

/**
 * Generate an image using Fireworks AI and upload to Firebase Storage
 *
 * Uses Stable Diffusion XL to generate images based on text prompts,
 * then uploads the result to Firebase Storage for persistent access.
 *
 * Includes:
 * - Rate limiting (5 requests per minute per user)
 * - Input validation and sanitization
 * - Error handling with user-friendly messages
 *
 * @param prompt - Text description of the image to generate
 * @param uid - User ID for organizing storage and rate limiting
 * @returns Object with imageUrl on success, or error message on failure
 */
export async function generateImage(
  prompt: string,
  uid: string
): Promise<ImageGenerationResult> {
  // Validate required inputs
  const validationResult = generateImageSchema.safeParse({ prompt, uid });

  if (!validationResult.success) {
    const errors = validationResult.error.issues
      .map((e) => e.message)
      .join(", ");
    return { error: `Invalid input: ${errors}` };
  }

  // Rate limiting check
  const rateLimitResult = rateLimitImageGen(uid);
  if (!rateLimitResult.success) {
    return {
      error: `You've reached the image generation limit. Please try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`,
      rateLimited: true,
      resetIn: rateLimitResult.resetIn,
    };
  }

  // Check API key configuration
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) {
    console.error("FIREWORKS_API_KEY not configured");
    return { error: "Image generation service not configured" };
  }

  // Sanitize the prompt
  const sanitizedPrompt = sanitizeInput(prompt).slice(0, MAX_PROMPT_LENGTH);

  if (sanitizedPrompt.length < 10) {
    return { error: "Prompt is too short. Please provide more detail." };
  }

  try {
    // Generate the image using Fireworks AI
    const response = await fetch(FIREWORKS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "image/jpeg",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...IMAGE_CONFIG,
        prompt: sanitizedPrompt,
      }),
    });

    if (!response.ok) {
      const errorMessage = `Fireworks API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);

      // Return user-friendly error messages
      if (response.status === 429) {
        return {
          error: "Image generation service is busy. Please try again in a moment.",
          rateLimited: true,
        };
      }
      if (response.status === 400) {
        return {
          error: "Unable to generate image with this prompt. Please try a different description.",
        };
      }
      return { error: "Failed to generate image. Please try again." };
    }

    // Get the image data
    const imageData = await response.arrayBuffer();

    // Validate image data
    if (imageData.byteLength < 1000) {
      console.error("Generated image is too small, likely an error");
      return { error: "Failed to generate image. Please try again." };
    }

    // Upload to Firebase Storage
    const fileName = `generated/${uid}/${Date.now()}.jpg`;
    const file = adminBucket.file(fileName);

    await file.save(Buffer.from(imageData), {
      contentType: "image/jpeg",
      metadata: {
        cacheControl: "public, max-age=31536000",
        customMetadata: {
          generatedAt: new Date().toISOString(),
          uid,
          promptLength: String(sanitizedPrompt.length),
        },
      },
    });

    // Get a signed URL for long-term access
    const [imageUrl] = await file.getSignedUrl({
      action: "read",
      expires: SIGNED_URL_EXPIRY,
    });

    return { imageUrl };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error generating image:", errorMessage);

    // Don't expose internal error details to users
    return { error: "Failed to generate image. Please try again." };
  }
}
