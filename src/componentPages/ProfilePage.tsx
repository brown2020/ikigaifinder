"use client";

import ProfileComponent from "@/components/ProfileComponent";
import ProfileDeleted from "@/components/ProfileDeleted";
import Toast from "@/components/Toast";
import withAuth from "@/components/withAuth";
import { useAuthStore, useIkigaiStore } from "@/zustand";
import { Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface toastType {
  show: boolean;
  type: "success" | "error" | "warning" | "";
  message: string;
}

function ProfilePage() {
  const router = useRouter();
  const { uid, authReady } = useAuthStore();
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<toastType>({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (!uid) router.push("/");
  }, [authReady, router, uid]);

  const closeToast = () => {
    setToast({ show: false, type: "", message: "" });
  };
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-4 p-5 ">
      <div className="text-3xl font-semibold">Your Info</div>

      <ProfileComponent />
      <div>
        {fetchIkigaiData?.ikigaiCoverImage && (
          <div className="p-4 border rounded-md shadow-md flex justify-between">
            <div className="w-fit">
              <Link href={`/ikigai/${uid}`} className="max-w-fit relative">
                <Image
                  src={fetchIkigaiData?.ikigaiCoverImage}
                  alt="ikigai image"
                  width={300}
                  height={300}
                  className="rounded-sm shadow-sm"
                />
                <div className="absolute right-2 top-2 sm:hidden block">
                  <Share size={25} />
                </div>
              </Link>
            </div>
            <Link href={`/ikigai/${uid}`} className="max-w-fit hidden sm:block">
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                <Share size={30} />
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border rounded-md shadow-md flex gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold text-red-500">Permanently Close Your Account</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-md p-2 px-9"
        >
          Delete Your Account
        </button>
      </div>
      {isOpen && (
        <ProfileDeleted
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          setToast={setToast}
        />
      )}
      {toast.show && (
        <Toast
          type={toast.type || "success"}
          message={toast.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default withAuth(ProfilePage);
