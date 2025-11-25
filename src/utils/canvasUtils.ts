import html2canvas from "html2canvas";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseClient";

// ============================================================================
// Types
// ============================================================================

interface StyleChange {
  element: HTMLElement;
  property: string;
  originalValue: string;
}

type Html2CanvasOptions = Partial<{
  allowTaint: boolean;
  useCORS: boolean;
  backgroundColor: string | null;
  scale: number;
  windowWidth: number;
  windowHeight: number;
}>;

// ============================================================================
// Constants
// ============================================================================

/**
 * CSS color tokens that are not supported by html2canvas
 */
const UNSUPPORTED_COLOR_TOKENS = ["oklch(", "lab(", "lch("] as const;

/**
 * CSS properties that may contain color values
 */
const COLOR_PROPERTIES = [
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
] as const;

/**
 * Fallback colors for unsupported color functions
 */
const FALLBACK_COLORS = {
  background: "#ffffff",
  border: "#cccccc",
  default: "#000000",
  none: "none",
} as const;

// ============================================================================
// Style Preparation
// ============================================================================

/**
 * Get the appropriate fallback color for a CSS property
 */
function getFallbackColor(property: string): string {
  if (property === "background-image") return FALLBACK_COLORS.none;
  if (property.includes("background")) return FALLBACK_COLORS.background;
  if (property.includes("border") || property.includes("outline")) {
    return FALLBACK_COLORS.border;
  }
  if (property.includes("shadow")) return FALLBACK_COLORS.none;
  return FALLBACK_COLORS.default;
}

/**
 * Check if a CSS value contains unsupported color functions
 */
function hasUnsupportedColor(value: string): boolean {
  const normalized = value.toLowerCase();
  return UNSUPPORTED_COLOR_TOKENS.some((token) => normalized.includes(token));
}

/**
 * Process an element to replace unsupported colors with fallbacks
 */
function processElement(
  element: HTMLElement,
  styleChanges: StyleChange[]
): void {
  const computedStyle = window.getComputedStyle(element);

  for (const property of COLOR_PROPERTIES) {
    const value = computedStyle.getPropertyValue(property);

    if (value && hasUnsupportedColor(value)) {
      // Store original value for restoration
      styleChanges.push({
        element,
        property,
        originalValue: value,
      });

      // Apply fallback color
      element.style.setProperty(property, getFallbackColor(property));
    }
  }
}

/**
 * Prepare an element for html2canvas capture by replacing unsupported colors
 * 
 * @param element - The DOM element to prepare
 * @returns A function to restore original styles
 */
function prepareElementForCapture(element: HTMLElement): () => void {
  const styleChanges: StyleChange[] = [];

  // Process the main element
  processElement(element, styleChanges);

  // Process all child elements
  const allElements = element.querySelectorAll("*");
  allElements.forEach((el) => {
    processElement(el as HTMLElement, styleChanges);
  });

  // Return restoration function
  return () => {
    styleChanges.forEach(({ element, property, originalValue }) => {
      element.style.setProperty(property, originalValue);
    });
  };
}

// ============================================================================
// Canvas Capture
// ============================================================================

/**
 * Enhanced html2canvas wrapper that handles unsupported color functions
 * 
 * @param element - The DOM element to capture
 * @param options - html2canvas options
 * @returns Canvas element containing the captured image
 */
export async function safeHtml2Canvas(
  element: HTMLElement,
  options: Html2CanvasOptions = {}
): Promise<HTMLCanvasElement> {
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
    // Always restore original styles
    restoreStyles();
  }
}

// ============================================================================
// Image Upload
// ============================================================================

/**
 * Capture a DOM element and upload to Firebase Storage
 * 
 * @param uid - User ID for storage path
 * @param elementId - ID of the DOM element to capture
 * @returns Download URL of the uploaded image, or null on failure
 */
export async function captureAndUploadImage(
  uid: string,
  elementId: string
): Promise<string | null> {
  const element = document.getElementById(elementId);

  if (!element) {
    console.warn(`Element with id "${elementId}" not found`);
    return null;
  }

  try {
    const canvas = await safeHtml2Canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
      scale: 1,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });

    return new Promise<string | null>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to create blob from canvas");
          resolve(null);
          return;
        }

        try {
          const fileName = `generated/${uid}/${new Date().toISOString()}.png`;
          const fileRef = ref(storage, fileName);

          await uploadBytes(fileRef, blob);
          const downloadUrl = await getDownloadURL(fileRef);

          resolve(downloadUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          reject(null);
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error capturing image:", error);
    return null;
  }
}

/**
 * Download a canvas as an image file
 * 
 * @param canvas - The canvas element to download
 * @param filename - Name for the downloaded file
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename = "ikigai-image.png"
): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
