export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function allowedImageType(contentType: string | undefined): string | null {
  const base = contentType?.split(";")[0]?.trim().toLowerCase() ?? "";
  return ALLOWED_TYPES.has(base) ? base : null;
}

/** Reads until maxBytes. Returns null instead of buffering past the cap. */
export async function readBounded(source: AsyncIterable<Uint8Array>, maxBytes: number): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let received = 0;
  for await (const chunk of source) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    received += buf.length;
    if (received > maxBytes) return null;
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}
