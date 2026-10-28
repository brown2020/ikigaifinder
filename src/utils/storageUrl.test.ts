import { describe, expect, it } from "vitest";
import { isOwnBucketUrl, mediaUrlForPath, objectPathFromStored, parseObjectPath } from "./storageUrl";
import { resolveDisplaySrc } from "./mediaSrc";

const bucket = "ikigaifinderai.appspot.com";

describe("isOwnBucketUrl", () => {
  it("accepts the app's own Firebase download and signed URLs", () => {
    expect(isOwnBucketUrl(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o/generated%2Fu%2Fcard.png?alt=media&token=t`, bucket)).toBe(true);
    expect(isOwnBucketUrl(`https://storage.googleapis.com/${bucket}/generated/u/1.jpg?X-Goog-Signature=s`, bucket)).toBe(true);
    expect(isOwnBucketUrl(`https://${bucket}.storage.googleapis.com/generated/u/1.jpg`, bucket)).toBe(true);
  });

  it("rejects other buckets, hosts, schemes, and malformed input", () => {
    expect(isOwnBucketUrl("https://storage.googleapis.com/someone-else/file.png", bucket)).toBe(false);
    expect(isOwnBucketUrl("https://firebasestorage.googleapis.com/v0/b/other.appspot.com/o/x", bucket)).toBe(false);
    expect(isOwnBucketUrl(`https://evil.example.com/${bucket}/x.png`, bucket)).toBe(false);
    expect(isOwnBucketUrl(`http://storage.googleapis.com/${bucket}/x.png`, bucket)).toBe(false);
    expect(isOwnBucketUrl("http://169.254.169.254/latest/meta-data", bucket)).toBe(false);
    expect(isOwnBucketUrl("not a url", bucket)).toBe(false);
  });

  it("denies everything when the bucket is not configured", () => {
    expect(isOwnBucketUrl(`https://storage.googleapis.com/${bucket}/x.png`, undefined)).toBe(false);
  });
});

describe("stored object paths", () => {
  it("turns bucket URLs into same-origin media paths and drops anything else", () => {
    const signed = `https://storage.googleapis.com/${bucket}/generated/alice/1.jpg?X-Goog-Signature=s`;
    expect(objectPathFromStored(signed, bucket)).toBe("generated/alice/1.jpg");
    expect(mediaUrlForPath("generated/alice/1.jpg")).toBe("/api/media?object=generated%2Falice%2F1.jpg");
    expect(objectPathFromStored("/api/media?object=generated%2Falice%2F1.jpg", undefined)).toBe("generated/alice/1.jpg");
    expect(parseObjectPath("generated/alice/../x.jpg")).toBeNull();
    expect(resolveDisplaySrc("https://lh3.googleusercontent.com/a/photo", bucket)?.optimized).toBe(false);
    expect(resolveDisplaySrc("/assets/bg_image.webp", bucket)?.optimized).toBe(true);
    expect(resolveDisplaySrc("https://evil.example.com/a.png", bucket)).toBeNull();
    expect(resolveDisplaySrc(signed, undefined)).toBeNull();
  });
});
