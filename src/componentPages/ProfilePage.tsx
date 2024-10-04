"use client";

import ProfileComponent from "@/components/ProfileComponent";
import withAuth from "@/components/withAuth";
import { useAuthStore, useIkigaiStore } from "@/zustand";
import { Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfilePage() {
  const router = useRouter();
  const { uid, authReady } = useAuthStore();
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  useEffect(() => {
    if (!uid) router.push("/");
  }, [authReady, router, uid]);
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-4 p-5 ">
      <div className="text-3xl font-semibold">Your Info</div>

      <ProfileComponent />

      {fetchIkigaiData?.ikigaiCoverImage && (
        <div className="p-4 border rounded-md shadow-md flex justify-between">
          <div className="w-fit">
            <Link href={`/ikigai/${uid}`} className="max-w-fit">
              <Image
                src={fetchIkigaiData?.ikigaiCoverImage}
                alt="ikigai image"
                width={300}
                height={300}
                className="rounded-sm shadow-sm"
              />
            </Link>
          </div>
          <Link href={`/ikigai/${uid}`} className="max-w-fit">
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              <Share size={30} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default withAuth(ProfilePage);
