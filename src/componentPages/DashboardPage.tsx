"use client";

import { useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";
import toast from "react-hot-toast";
import { useIkigaiStore } from "@/zustand";
import withAuth from "@/components/withAuth";

// ============================================================================
// Constants
// ============================================================================

const SHARE_TITLE = "Check out my Ikigai!";
const SHARE_BODY = "I wanted to share my Ikigai with you. Check it out here:";
const ICON_SIZE = 48;

// ============================================================================
// Component
// ============================================================================

function DashboardPage(): React.ReactElement {
  const pathname = usePathname();
  const ikigaiData = useIkigaiStore((state) => state.ikigaiData);

  const currentPageUrl = `https://ikigaifinder.ai${pathname}`;
  const coverImage = ikigaiData?.ikigaiCoverImage;

  /**
   * Handle image download
   */
  const handleDownload = useCallback(async (): Promise<void> => {
    if (!coverImage) {
      toast.error("No image available to download");
      return;
    }

    try {
      const response = await fetch(
        `/api/downloadImage?url=${encodeURIComponent(coverImage)}`
      );

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-ikigai.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    }
  }, [coverImage]);

  if (!coverImage) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-xl text-gray-600 text-center">
          No Ikigai image found. Please create one first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="w-full">
        {/* Ikigai Image */}
        <Image
          src={coverImage}
          alt="My Ikigai"
          width={375}
          height={375}
          className="w-full h-full object-cover max-w-3xl mx-auto rounded-sm"
          unoptimized
          priority
        />

        {/* Actions */}
        <div className="mt-6">
          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3 mx-auto h-12 justify-center">
            <FacebookShareButton url={currentPageUrl} hashtag="#ikigai">
              <FacebookIcon size={ICON_SIZE} round />
            </FacebookShareButton>

            <TwitterShareButton url={currentPageUrl} title={SHARE_TITLE}>
              <TwitterIcon size={ICON_SIZE} round />
            </TwitterShareButton>

            <LinkedinShareButton url={currentPageUrl} title={SHARE_TITLE}>
              <LinkedinIcon size={ICON_SIZE} round />
            </LinkedinShareButton>

            <EmailShareButton
              url={currentPageUrl}
              subject={SHARE_TITLE}
              body={SHARE_BODY}
            >
              <EmailIcon size={ICON_SIZE} round />
            </EmailShareButton>
          </div>

          {/* Download Button */}
          <button
            className="btn-primary2 h-12 flex items-center justify-center mx-auto rounded-sm mt-4"
            onClick={handleDownload}
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
