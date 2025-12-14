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

  const currentPageUrl = absoluteUrl(`/ikigai/${userId}`);
  const title = "Check out my Ikigai!";
  const bodyText = `I wanted to share my Ikigai with you. Check it out here:`;

  const toggleSharableStatus = async () => {
    try {
      if (!isOwner) return;
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
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const response = await fetch(
      `/api/downloadImage?url=${encodeURIComponent(imageUrl)}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Create filename with "ikigai finder" and current date
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    a.download = `ikigai-finder-${currentDate}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
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
          <Image
            className="h-full w-full max-w-xl max-h-xl object-cover mx-auto shadow-md"
            src={imageUrl}
            alt="Visual Result"
            height={300}
            width={300}
            priority
            unoptimized
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
            <div className="flex items-center gap-2 justify-center mt-4">
              <button className="btn-primary2" onClick={toggleSharableStatus}>
                {sharableUrl ? "Make Private" : "Make Sharable"}
              </button>
              <button className="btn-primary2" onClick={handleDownload}>
                Download
              </button>
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
        <Link href={"/ikigai-finder"}>
          <button className="btn-primary2 mx-auto">Create Your Ikigai</button>
        </Link>
      </div>
    </div>
  );
}
