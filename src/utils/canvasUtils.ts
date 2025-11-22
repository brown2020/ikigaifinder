// canvasUtils.ts
import html2canvas from "html2canvas";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseClient";

// Helper function to temporarily replace oklch colors with fallback colors
const UNSUPPORTED_COLOR_TOKENS = ["oklch(", "lab(", "lch("];

const prepareElementForCapture = (element: HTMLElement): (() => void) => {
  // Store original styles to restore later
  interface StyleChange {
    element: HTMLElement;
    property: string;
    originalValue: string;
  }

  const styleChanges: StyleChange[] = [];

  // List of common CSS color properties to check
  const colorProperties = [
    "color",
    "background-color",
    "background",
    "background-image",
    "border-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
    "text-decoration-color",
    "caret-color",
    "fill",
    "stroke",
    "box-shadow",
    "text-shadow",
  ];

  // Process an element to replace oklch colors
  const processElement = (el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);

    // Check each color property for oklch
    for (const prop of colorProperties) {
      const value = computedStyle.getPropertyValue(prop);
      const normalized = value?.toLowerCase() ?? "";

      const hasUnsupportedColor = UNSUPPORTED_COLOR_TOKENS.some((token) =>
        normalized.includes(token)
      );

      if (value && hasUnsupportedColor) {
        // Store original value
        styleChanges.push({
          element: el,
          property: prop,
          originalValue: value,
        });

        // Apply fallback color based on property type
        if (prop === "background-image") {
          el.style.setProperty(prop, "none");
        } else if (prop.includes("background")) {
          el.style.setProperty(prop, "#ffffff"); // White for backgrounds
        } else if (prop.includes("border") || prop.includes("outline")) {
          el.style.setProperty(prop, "#cccccc"); // Light gray for borders
        } else if (prop.includes("shadow")) {
          el.style.setProperty(prop, "none");
        } else {
          el.style.setProperty(prop, "#000000"); // Black for text and other colors
        }
      }
    }
  };

  // Process the main element
  processElement(element);

  // Process all child elements
  const allElements = element.querySelectorAll("*");
  allElements.forEach((el) => {
    processElement(el as HTMLElement);
  });

  // Return function to restore original styles
  return () => {
    styleChanges.forEach(({ element, property, originalValue }) => {
      element.style.setProperty(property, originalValue);
    });
  };
};

// Enhanced html2canvas wrapper that handles oklch colors
export const safeHtml2Canvas = async (element: HTMLElement, options = {}) => {
  // Apply temporary style changes
  const restoreStyles = prepareElementForCapture(element);

  try {
    // Capture with html2canvas
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      ...options,
    });

    return canvas;
  } finally {
    // Restore original styles
    restoreStyles();
  }
};

export const captureAndUploadImage = async (uid: string, elementId: string) => {
  const domElement = document.getElementById(elementId);
  console.log("domElement", domElement);
  if (!domElement) return null;

  try {
    const canvas = await safeHtml2Canvas(domElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      scale: 1,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
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
  } catch (error) {
    console.error("Error capturing image:", error);
    return null;
  }
};
