"use server";

import { openai } from "@ai-sdk/openai";
import { APICallError, generateImage as generateProviderImage } from "ai";
import { adminBucket } from "@/firebase/firebaseAdmin";
import { requireAuth } from "@/lib/auth/session-server";
import { IMAGE_MODEL } from "@/constants/ai";
import { rateLimitImageGen } from "./rateLimit";
import { generateImageSchema, sanitizeInput } from "./validation";

interface ImageGenerationResult {
  imageUrl?: string;
  error?: string;
  rateLimited?: boolean;
  resetIn?: number;
}

/** Signed URL expiration: effectively permanent, so saved cards keep working. */
const SIGNED_URL_EXPIRY = "03-17-2125";

/** Maximum prompt length after sanitization */
const MAX_PROMPT_LENGTH = 1000;

const PROVIDER_TIMEOUT_MS = 120_000;

/** Maps provider failures to safe messages; provider errors can echo request details and are never forwarded. */
function providerErrorMessage(error: unknown, timedOut: boolean): ImageGenerationResult {
  if (timedOut) return { error: "Image generation timed out. Please try again." };
  if (APICallError.isInstance(error)) {
    if (error.statusCode === 429) return { error: "Image generation service is busy. Please try again in a moment.", rateLimited: true };
    if (error.statusCode === 400) return { error: "Unable to generate image with this prompt. Please try a different description." };
  }
  return { error: "Failed to generate image. Please try again." };
}

/**
 * Generates a card background with OpenAI image generation and uploads it to Firebase Storage.
 *
 * The user comes from the verified session cookie, never from the client, because the upload
 * uses the Admin SDK (which bypasses Storage rules). One provider attempt per request: a retry
 * after a lost response could bill twice.
 */
export async function generateImage(
  prompt: string
): Promise<ImageGenerationResult> {
  let uid: string;
  try {
    ({ uid } = await requireAuth());
  } catch {
    return { error: "You must be signed in to generate images." };
  }

  const validationResult = generateImageSchema.safeParse({ prompt, uid });
  if (!validationResult.success) {
    return { error: `Invalid input: ${validationResult.error.issues.map((e) => e.message).join(", ")}` };
  }

  const rateLimitResult = rateLimitImageGen(uid);
  if (!rateLimitResult.success) {
    return {
      error: `You've reached the image generation limit. Please try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`,
      rateLimited: true,
      resetIn: rateLimitResult.resetIn,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return { error: "Image generation service not configured" };
  }

  const sanitizedPrompt = sanitizeInput(prompt).slice(0, MAX_PROMPT_LENGTH);
  if (sanitizedPrompt.length < 10) {
    return { error: "Prompt is too short. Please provide more detail." };
  }

  const signal = AbortSignal.timeout(PROVIDER_TIMEOUT_MS);
  let image: Uint8Array;
  try {
    const result = await generateProviderImage({
      model: openai.image(IMAGE_MODEL),
      prompt: sanitizedPrompt,
      n: 1,
      size: "1024x1024",
      providerOptions: { openai: { quality: "medium", outputFormat: "jpeg" } },
      maxRetries: 0,
      abortSignal: signal,
    });
    image = result.image.uint8Array;
  } catch (error) {
    const status = APICallError.isInstance(error) ? error.statusCode : undefined;
    console.error(`Image generation failed (${signal.aborted ? "timeout" : status ?? "unknown"})`);
    return providerErrorMessage(error, signal.aborted);
  }

  if (image.byteLength < 1000) {
    console.error("Generated image is too small, likely an error");
    return { error: "Failed to generate image. Please try again." };
  }

  try {
    const file = adminBucket.file(`generated/${uid}/${Date.now()}.jpg`);
    await file.save(Buffer.from(image), {
      contentType: "image/jpeg",
      metadata: {
        cacheControl: "public, max-age=31536000",
        customMetadata: { generatedAt: new Date().toISOString(), uid, model: IMAGE_MODEL },
      },
    });
    const [imageUrl] = await file.getSignedUrl({ action: "read", expires: SIGNED_URL_EXPIRY });
    return { imageUrl };
  } catch (error) {
    console.error("Error saving generated image:", error instanceof Error ? error.message : "unknown");
    return { error: "Failed to generate image. Please try again." };
  }
}
