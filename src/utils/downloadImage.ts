/**
 * Download an image from a URL via the download proxy
 *
 * @param imageUrl - The URL of the image to download
 * @param filename - Optional custom filename (defaults to ikigai-finder-{date}.png)
 * @returns Promise that resolves when download completes
 * @throws Error if download fails
 */
export async function downloadImage(
  imageUrl: string,
  filename?: string
): Promise<void> {
  const response = await fetch(
    `/api/downloadImage?url=${encodeURIComponent(imageUrl)}`
  );

  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Use provided filename or generate one with current date
  if (filename) {
    link.download = filename;
  } else {
    const currentDate = new Date().toISOString().split("T")[0];
    link.download = `ikigai-finder-${currentDate}.png`;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
