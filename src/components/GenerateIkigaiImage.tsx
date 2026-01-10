"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
import { artStyles } from "@/constants/questions";
import { selectStyles } from "@/constants/selectStyles";
import { useAuthStore, useIkigaiStore, useProfileStore } from "@/zustand";
import { generatePrompt } from "@/utils/promptUtils";
import { generateImage } from "@/lib/generateImage";
import { saveGeneratedImageHistory } from "@/services/ikigaiService";
import { captureAndUploadImage } from "@/utils/canvasUtils";
import { containsRestrictedContent } from "@/utils/platform";
import SVGOverlay from "./SVGOverlay";
import ImageSelector from "./ImageSelector";
import IkigaiStepper from "./IkigaiStepper";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { ImagePromptData } from "@/types";

// ============================================================================
// Utilities
// ============================================================================

/**
 * Convert a Firestore timestamp (or timestamp-like object) to a Date
 */
function toDate(timestamp: unknown): Date | null {
  if (!timestamp) return null;
  
  // Already a Date
  if (timestamp instanceof Date) return timestamp;
  
  // Firestore Timestamp instance
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  
  // Plain object with seconds (from Firestore JSON)
  if (typeof timestamp === "object" && "seconds" in timestamp) {
    const ts = timestamp as { seconds: number; nanoseconds?: number };
    return new Date(ts.seconds * 1000 + (ts.nanoseconds ?? 0) / 1000000);
  }
  
  return null;
}

// ============================================================================
// Component
// ============================================================================

export default function GenerateIkigaiImage(): React.ReactElement {
  const router = useRouter();

  // Store state
  const uid = useAuthStore((state) => state.uid);
  const ikigaiData = useIkigaiStore((state) => state.ikigaiData);
  const updateIkigai = useIkigaiStore((state) => state.updateIkigai);
  const profile = useProfileStore((state) => state.profile);

  // Local state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [promptData, setPromptData] = useState<ImagePromptData>({
    style: "",
    freestyle: "",
    downloadUrl: "/assets/bg_image.webp",
    prompt: "",
  });

  // Convert timestamp to Date safely
  const updatedAtDate = useMemo(() => toDate(ikigaiData.updatedAt), [ikigaiData.updatedAt]);

  /**
   * Save generated image to history
   */
  const saveHistory = useCallback(
    async (data: ImagePromptData, prompt: string, downloadUrl: string): Promise<void> => {
      if (!uid) return;

      try {
        const saved = await saveGeneratedImageHistory(uid, data, prompt, downloadUrl);
        setPromptData(saved);
        await updateIkigai({ ikigaiImage: downloadUrl });
      } catch (error) {
        console.error("Failed to save image history:", error);
      }
    },
    [uid, updateIkigai]
  );

  /**
   * Handle image generation
   */
  const handleGenerateImage = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();

      if (!uid) {
        toast.error("Please sign in to generate images");
        return;
      }

      // Check for restricted content
      if (containsRestrictedContent(imagePrompt)) {
        toast.error("Your prompt contains inappropriate content. Please try again.");
        return;
      }

      setIsGenerating(true);

      try {
        const prompt = generatePrompt(imagePrompt, imageStyle);
        const response = await generateImage(prompt, uid);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        if (response.imageUrl) {
          await saveHistory(promptData, prompt, response.imageUrl);
          toast.success("Image generated successfully!");
        }
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to generate image. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [uid, imagePrompt, imageStyle, promptData, saveHistory]
  );

  /**
   * Handle saving the ikigai image to profile
   */
  const handleSaveToProfile = useCallback(async (): Promise<void> => {
    if (!uid) {
      toast.error("Please sign in to save your Ikigai");
      return;
    }

    setIsSaving(true);

    try {
      const downloadUrl = await captureAndUploadImage(uid, "visualization");

      if (downloadUrl) {
        await updateIkigai({ ikigaiCoverImage: downloadUrl });
        toast.success("Ikigai saved successfully!");

        // Wait briefly for Firestore propagation
        await new Promise((resolve) => setTimeout(resolve, 500));

        router.replace(`/ikigai/${uid}`);
      } else {
        toast.error("Failed to capture image. Please try again.");
      }
    } catch (error) {
      console.error("Error saving to profile:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [uid, updateIkigai, router]);

  /**
   * Handle navigation back
   */
  const handleBack = useCallback((): void => {
    router.push("/generate-ikigai");
  }, [router]);

  return (
    <div className="p-10">
      {/* Progress Stepper */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <IkigaiStepper currentStep={6} />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* Left Column - Form */}
        <div className="w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Let&apos;s make your Ikigai beautiful.
            </h1>

          <p className="text-lg font-semibold mb-6">
            Create a background image that embodies your vision. Once
            you&apos;re done, you can save it, download it, or share your Ikigai
            on social media.
          </p>

          <p className="text-lg font-semibold mb-6">
            Type a description of the background image you desire for your
            Ikigai in this text box, or let the AI create an image based on your
            Ikigai alone.
          </p>

          {/* Prompt Input */}
          <Textarea
            label="Describe your background image (optional)"
            helperText="Tip: include mood, lighting, colors, and setting."
            placeholder="Example: A serene mountain landscape at sunset, soft pastel colors, cinematic lighting"
            onChange={(e) => setImagePrompt(e.target.value)}
            value={imagePrompt}
            className="min-h-[96px]"
          />

          {/* Style Select and Generate Button */}
          <div className="flex justify-between gap-2 sm:flex-row flex-col items-end">
            <div className="w-full sm:max-w-80">
              <div className="mb-1 text-sm text-gray-600">
                Artistic Style (optional)
              </div>
              <Select
                isClearable
                isSearchable
                name="styles"
                onChange={(option) => setImageStyle(option?.value ?? "")}
                options={artStyles}
                styles={selectStyles}
                placeholder="Select a style..."
              />
            </div>

            <Button
              onClick={handleGenerateImage}
              variant="primary"
              isLoading={isGenerating}
              loadingText="Creating..."
              className="min-w-36 sm:w-fit w-full"
              type="button"
            >
              Create image
            </Button>
          </div>
        </div>

        {/* Image Selector */}
        <div className="mt-6">
          <ImageSelector />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 flex-wrap">
          <Button
            onClick={handleBack}
            variant="neutral"
            className="min-w-36 mt-3 sm:w-fit w-full"
            type="button"
          >
            Back to Ideas
          </Button>

          <Button
            onClick={handleSaveToProfile}
            variant="primary"
            isLoading={isSaving}
            loadingText="Saving..."
            className="min-w-36 mt-3 sm:w-fit w-full"
            type="button"
          >
            Save ikigai image
          </Button>
        </div>
      </div>

        {/* Right Column - Preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-200">
          <div
            className="relative w-full aspect-square max-w-[600px] max-h-[600px]"
            id="visualization"
          >
            <Image
              className="object-cover w-full h-full"
              src={ikigaiData.ikigaiImage || "/assets/bg_image.webp"}
              alt="Ikigai visualization background"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <SVGOverlay
                profileName={profile.firstName ?? ""}
                ikigaiSelected={ikigaiData.ikigaiSelected}
                updatedAt={updatedAtDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export type for backward compatibility
export type { ImagePromptData as PromptDataType };
