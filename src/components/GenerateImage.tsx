"use client";

import { generateImage } from "@/lib/generateImage";
import { useAuthStore } from "@/zustand";
import Image from "next/image";
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

type Props = { defaultPrompt: string };

export default function GenerateImage({ defaultPrompt }: Props) {
  const initialPrompt = `Generate a beautiful and inspiring image to represent the ikigai statement: ${defaultPrompt}`;
  const { uid } = useAuthStore();
  const [message, setMessage] = useState<string>(initialPrompt);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage(initialPrompt);
  }, [defaultPrompt, initialPrompt]);

  const handleGenerateImage = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await generateImage(message, uid);
      setImageUrl(result.imageUrl as string);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>
      <div className="mb-4">
        <TextareaAutosize
          minRows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a prompt"
          className="w-full p-2 border border-gray-300 rounded-md resize-none"
        />
      </div>
      <button
        onClick={handleGenerateImage}
        disabled={loading}
        className={`w-full p-2 text-white rounded-md ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
          <Image
            width={500}
            height={500}
            src={imageUrl}
            alt="Generated"
            className="w-full rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
}
