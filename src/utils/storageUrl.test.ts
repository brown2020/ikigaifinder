import { describe, expect, it } from "vitest";
import { isOwnBucketUrl } from "./storageUrl";

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
