"use client";
import { useState } from "react";
import Image from "next/image";
import Select from "react-select";
import { artStyles } from "@/constants/questions";
import { selectStyles } from "@/constants/selectStyles";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore, useIkigaiStore, useProfileStore } from "@/zustand";
import { generatePrompt } from "@/utils/promptUtils";
import { generateImage } from "@/lib/generateImage";
import SVGOverlay from "./SVGOverlay";
import ImageSelector from "./ImageSelector";
import { captureAndUploadImage } from "@/utils/canvasUtils";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export type PromptDataType = {
  style?: string;
  mindset?: string;
  grandChallenge?: string;
  exponentialTechnology?: string;
  freestyle?: string;
  downloadUrl?: string;
  prompt?: string;
  timestamp?: Timestamp;
  id?: string;
};

export default function GenerateIkigaiImage() {
  const router = useRouter();
  const { uid } = useAuthStore();
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const profile = useProfileStore((s) => s.profile);
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [imageStyle, setImageStyle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [promptData, setPromptData] = useState<PromptDataType>({
    style: "",
    freestyle: "",
    downloadUrl: "/assets/bg_image.webp",
    prompt: "",
  });

  async function saveHistory(
    promptData: PromptDataType,
    prompt: string,
    downloadUrl: string
  ) {
    if (!uid) return;

    const coll = collection(db, "ikigaiProfiles", uid, "covers");
    const docRef = doc(coll);
    const p: PromptDataType = {
      ...promptData,
      downloadUrl: downloadUrl,
      prompt: prompt,
      id: docRef.id,
      timestamp: Timestamp.now(),
    };
    setPromptData(p);
    updateIkigai({
      ikigaiImage: downloadUrl,
    });
    await setDoc(docRef, p);
  }

  const handleGenerateSDXL = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt: string = generatePrompt(imagePrompt, imageStyle);

      const response = await generateImage(prompt, uid);

      const downloadURL = response.imageUrl;
      if (!downloadURL) {
        throw new Error("Error generating image");
      }
      await saveHistory(promptData, prompt, downloadURL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error generating image:", error.message);
      } else {
        console.error("An unknown error occurred during image generation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = async () => {
    try {
      if (!uid) return;

      setSaving(true);
      const downloadUrl = await captureAndUploadImage(uid, "visualization");

      if (downloadUrl) {
        updateIkigai({ ikigaiCoverImage: downloadUrl });
        router?.push(`/ikigai/${uid}`);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="w-full max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            let&apos;s make your Ikigai beautiful.
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
          <textarea
            className="w-full p-2 border border-gray-300 rounded-sm h-16 font-semibold "
            autoComplete="on"
            placeholder="Describe an image"
            onChange={(e) => setImagePrompt(e.target.value)}
          />
          <div className="flex justify-between gap-2 sm:flex-row  flex-col items-end">
            <div className="w-full sm:max-w-80">
              <div>Artistic Style (optional)</div>

              <Select
                isClearable={true}
                isSearchable={true}
                name="styles"
                onChange={(v) => setImageStyle(v ? v.value : "")}
                options={artStyles}
                styles={selectStyles}
              />
            </div>

            <button
              onClick={(e) => handleGenerateSDXL(e)}
              className={`px-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 min-w-36 sm:w-fit w-full`}
            >
              {loading ? (
                <PulseLoader color="#fff" size={12} />
              ) : (
                "Create Image"
              )}
            </button>
          </div>
        </div>
        <div className="mt-6">
          <ImageSelector />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveToProfile}
            className={`px-8 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 min-w-36 mt-3  sm:w-fit w-full`}
          >
            {saving ? <PulseLoader color="#fff" size={12} /> : "Save Image"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div
          className="relative w-full aspect-square flex items-center justify-center"
          id="visualization"
        >
          <Image
            className="object-cover w-full h-full"
            src={fetchIkigaiData?.ikigaiImage || "/assets/bg_image.webp"}
            alt="visualization"
            width={300}
            height={300}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <SVGOverlay
              profileName={profile.firstName || ""}
              ikigaiSelected={fetchIkigaiData?.ikigaiSelected}
              updatedAt={fetchIkigaiData?.updatedAt?.toDate() || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
