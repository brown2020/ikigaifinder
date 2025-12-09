"use client";

import { useCallback, useState } from "react";
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
import { Download, Image as ImageIcon } from "lucide-react";
import { useIkigaiStore } from "@/zustand";
import withAuth from "@/components/withAuth";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

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
  const isLoading = useIkigaiStore((state) => state.isLoading);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

    setIsDownloading(true);

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
    } finally {
      setIsDownloading(false);
    }
  }, [coverImage]);

  // Show loading skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show empty state
  if (!coverImage) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Ikigai Card Yet
        </h2>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Complete your Ikigai journey to create a beautiful, shareable card
          that represents your life purpose.
        </p>
        <a
          href="/ikigai-finder"
          className="btn-base btn-primary-solid"
        >
          Start Your Journey
        </a>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="w-full max-w-3xl mx-auto">
        {/* Section Title */}
        <h1 className="text-2xl font-bold text-center mb-6">Your Ikigai Card</h1>

        {/* Ikigai Image */}
        <div className="relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
          )}
          <Image
            src={coverImage}
            alt="My Ikigai - A personalized card representing my life purpose"
            width={768}
            height={768}
            sizes="(max-width: 768px) 100vw, 768px"
            className={`w-full h-full object-cover max-w-3xl mx-auto rounded-sm transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          {/* Share Section */}
          <p className="text-center text-gray-600 mb-3">Share your Ikigai</p>

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
            className="btn-base btn-primary-solid h-12 flex items-center justify-center gap-2 mx-auto rounded-sm mt-6 min-w-40"
            onClick={handleDownload}
            disabled={isDownloading}
            type="button"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={18} />
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
