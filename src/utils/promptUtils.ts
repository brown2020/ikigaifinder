/** Builds the background-image prompt for a card. The statement is used when no scene is described. */
export function buildCoverPrompt({
  scene,
  style,
  statement,
}: {
  scene?: string;
  style?: string;
  statement?: string;
}): string {
  const parts = [
    scene?.trim() ||
      `A symbolic, uplifting scene that evokes this life purpose: "${statement?.trim() || "a meaningful life"}". Show a place, objects, or people in action rather than words.`,
    style && `Rendered in the style of ${style}.`,
    "Beautiful, calm composition with space for overlaid text. No text, letters, or logos.",
  ];
  return parts.filter(Boolean).join("\n\n");
}
