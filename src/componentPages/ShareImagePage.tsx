"use client";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function ShareImagePage({ userId }: { userId: string }) {
  const uid = useAuthStore((s) => s.uid);
  const pathname = usePathname();
  const [sharableUrl, setSharableUrl] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const currentPageUrl = `https://ikigaifinder.ai/${pathname}`;
  const title = "Check out my Ikigai!";
  const bodyText = `I wanted to share my Ikigai with you. Check it out here:`;
  const isUser = uid === userId;
  const docRef = doc(db, `ikigaiUsers/${userId}/ikigai/main`);

  const toggleSharableStatus = async () => {
    try {
      const makeSharable = !sharableUrl;
      await updateDoc(docRef, { ikigaiSharableUrl: makeSharable });
      setSharableUrl(makeSharable);
    } catch (error) {
      console.error("Error updating sharable status:", error);
    }
  };

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.log("No such document!");
          setImageUrl("");
          setSharableUrl(false);
          return;
        }

        const data = docSnap.data();
        setImageUrl(data?.ikigaiCoverImage);
        setSharableUrl(data.ikigaiSharableUrl);
        setErrorMessage("");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error getting document:", error.message);
          setErrorMessage("Access to this image is restricted by the owner.");
        } else {
          console.log("An unknown error occurred while getting the document.");
        }
        setImageUrl("");
        setSharableUrl(false);
      }
    };
    if (userId) fetchImageUrl();
  }, [docRef, userId]);

  const handleDownload = async () => {
    const response = await fetch(
      `/api/downloadImage?url=${encodeURIComponent(imageUrl)}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.png"; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-5 px-5">
      {(sharableUrl || isUser) && imageUrl ? (
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

          {isUser && (
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
      ) : errorMessage && (
        <div className="mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-300 shadow-md w-full max-w-xl aspect-square">
          <div className="text-center h-full text-xl font-bold flex items-center justify-center">
            {errorMessage}
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
