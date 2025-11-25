"use server";

import { adminBucket } from "@/firebase/firebaseAdmin";

// ============================================================================
// Types
// ============================================================================

interface ImageGenerationResult {
  imageUrl?: string;
  error?: string;
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
  safety_check: false,
};

/** Signed URL expiration: 100 years from now */
const SIGNED_URL_EXPIRY = "03-17-2125";

// ============================================================================
// Server Action
// ============================================================================

/**
 * Generate an image using Fireworks AI and upload to Firebase Storage
 * 
 * Uses Stable Diffusion XL to generate images based on text prompts,
 * then uploads the result to Firebase Storage for persistent access.
 * 
 * @param prompt - Text description of the image to generate
 * @param uid - User ID for organizing storage
 * @returns Object with imageUrl on success, or error message on failure
 */
export async function generateImage(
  prompt: string,
  uid: string
): Promise<ImageGenerationResult> {
  if (!prompt || !uid) {
    return { error: "Prompt and user ID are required" };
  }

  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) {
    console.error("FIREWORKS_API_KEY not configured");
    return { error: "Image generation service not configured" };
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
        prompt,
      }),
    });

    if (!response.ok) {
      const errorMessage = `Fireworks API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      return { error: "Failed to generate image. Please try again." };
    }

    // Get the image data
    const imageData = await response.arrayBuffer();

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
    return { error: "Failed to generate image. Please try again." };
  }
}
