"use client";

import { useAuthStore } from "@/zustand";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
  EmailShareButton,
} from "react-share";
import { absoluteUrl } from "@/utils/baseUrl";
import { Button } from "@/components/ui/Button";

export default function ShareImagePage({
  userId,
  viewerUid,
  initialImageUrl,
  initialSharableUrl,
}: {
  userId: string;
  viewerUid: string | null;
  initialImageUrl: string | null;
  initialSharableUrl: boolean;
}): React.ReactElement {
  const clientUid = useAuthStore((s) => s.uid);

  const isOwner = useMemo(() => {
    // Prefer the server-verified uid (session cookie), fall back to client auth store.
    const effectiveUid = viewerUid ?? clientUid ?? "";
    return effectiveUid === userId;
  }, [clientUid, userId, viewerUid]);

  const [sharableUrl, setSharableUrl] = useState(initialSharableUrl);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl] = useState<string>(initialImageUrl ?? "");
  const [isUpdatingShare, setIsUpdatingShare] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentPageUrl = absoluteUrl(`/ikigai/${userId}`);
  const title = "Check out my Ikigai!";
  const bodyText = `I wanted to share my Ikigai with you. Check it out here:`;

  const toggleSharableStatus = async () => {
    try {
      if (!isOwner) return;
      if (isUpdatingShare) return;
      setIsUpdatingShare(true);
      const nextSharable = !sharableUrl;
      const response = await fetch("/api/ikigai/sharing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sharable: nextSharable }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update (${response.status})`);
      }

      setSharableUrl(nextSharable);
    } catch {
      setErrorMessage("Failed to update share settings. Please try again.");
    } finally {
      setIsUpdatingShare(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(
        `/api/downloadImage?url=${encodeURIComponent(imageUrl)}`
      );
      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Create filename with "ikigai finder" and current date (YYYY-MM-DD)
      const currentDate = new Date().toISOString().split("T")[0];
      a.download = `ikigai-finder-${currentDate}.png`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Failed to download the image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const canView = Boolean(imageUrl) && (sharableUrl || isOwner);
  const effectiveError =
    errorMessage ||
    (!imageUrl
      ? "No image is available for this Ikigai."
      : "Access to this image is restricted by the owner.");

  return (
    <div className="w-full max-w-3xl mx-auto py-5 px-5">
      {canView ? (
        <div>
          {errorMessage ? (
            <div
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}
          <Image
            className="h-full w-full max-w-xl max-h-xl object-cover mx-auto shadow-md"
            src={imageUrl}
            alt="My Ikigai card"
            height={768}
            width={768}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <div className="mt-6">
            {sharableUrl && (
              <div className="flex flex-wrap gap-3 mx-auto h-12 justify-center">
                <FacebookShareButton url={currentPageUrl} title={title}>
                  <FacebookIcon size={48} />
                </FacebookShareButton>

                <TwitterShareButton url={currentPageUrl} title={title}>
                  <TwitterIcon size={48} />
                </TwitterShareButton>

                <LinkedinShareButton url={currentPageUrl}>
                  <LinkedinIcon size={48} />
                </LinkedinShareButton>

                <EmailShareButton
                  url={currentPageUrl}
                  subject={title}
                  body={bodyText}
                >
                  <EmailIcon size={48} />
                </EmailShareButton>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-center mt-6">
              <Button
                variant={sharableUrl ? "neutral" : "secondary"}
                onClick={toggleSharableStatus}
                isLoading={isUpdatingShare}
                loadingText="Updating..."
                className="min-w-44"
              >
                {sharableUrl ? "Make private" : "Make sharable"}
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                isLoading={isDownloading}
                loadingText="Downloading..."
                className="min-w-44"
              >
                Download
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto p-6 bg-linear-to-r from-gray-100 to-gray-300 shadow-md w-full max-w-xl aspect-square">
          <div className="text-center h-full text-xl font-bold flex items-center justify-center">
            {effectiveError}
          </div>
        </div>
      )}
      <div className="w-full">
        <Link href="/ikigai-finder" className="block w-fit mx-auto mt-6">
          <Button variant="primary">Create your Ikigai</Button>
        </Link>
      </div>
    </div>
  );
}
