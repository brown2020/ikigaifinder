// canvasUtils.ts
import html2canvas from "html2canvas";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseClient";

export const captureAndUploadImage = async (uid: string, elementId: string) => {
  const domElement = document.getElementById(elementId);
  if (!domElement) return null;

  const canvas = await html2canvas(domElement, {
    allowTaint: true,
    useCORS: true,
    backgroundColor: null,
  });

  return new Promise<string | null>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (blob === null) {
        console.error("Canvas is empty or not properly initialized");
        return resolve(null);
      }

      try {
        const fileRef = ref(
          storage,
          `generated/${uid}/${new Date().toISOString()}.png`
        );
        await uploadBytes(fileRef, blob);
        const downloadUrl = await getDownloadURL(fileRef);
        resolve(downloadUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        reject(null);
      }
    });
  });
};
