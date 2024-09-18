"use server";

import { adminBucket } from "@/firebase/firebaseAdmin"; // Adjust the path as needed

export async function generateImage(data: { prompt: string; uid?: string }) {
  const { prompt, uid = "generic" } = data;

  try {
    const response = await fetch(
      `https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "image/jpeg",
          Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        },
        body: JSON.stringify({
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          sampler: null,
          samples: 1,
          steps: 30,
          seed: 0,
          style_preset: null,
          safety_check: false,
          prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong with image generation API");
    }

    const imageData = await response.arrayBuffer();

    const filename = `generated/${uid}/${Date.now()}.jpg`;
    const file = adminBucket.file(filename);

    // Upload image data to Firebase Storage
    await file.save(Buffer.from(imageData), {
      contentType: "image/jpeg",
      public: true,
    });

    // Get the public URL for the uploaded file
    const downloadURL = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET}/${filename}`;

    // Return the URL
    console.log("Image URL:", downloadURL);
    return { imageUrl: downloadURL };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
