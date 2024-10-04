"use client";
import withAuth from "@/components/withAuth";
import { useIkigaiStore } from "@/zustand";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
function DashboardPage() {
  // const router = useRouter();
  const pathname = usePathname();
  const currentPageUrl = `https://ikigaifinder.ai/${pathname}`;
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const title = "Check out my Ikigai!";
  const bodyText = `I wanted to share my Ikigai with you. Check it out here:`;

  const handleDownload = async () => {
    const imageUrl = fetchIkigaiData?.ikigaiCoverImage; // Your Firebase image URL
    const response = await fetch(`/api/downloadImage?url=${encodeURIComponent(imageUrl)}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.png'; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-10">
      <div className="w-full">
        {fetchIkigaiData?.ikigaiCoverImage && (
          <Image
            src={fetchIkigaiData?.ikigaiCoverImage}
            alt="Ikigai Finder"
            width={375}
            height={375}
            className="w-full h-full object-cover max-w-3xl mx-auto rounded"
            unoptimized
          />
        )}
        <div className="mt-6">
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

          <button
            className="btn-primary2 h-12 flex items-center justify-center mx-auto rounded"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
