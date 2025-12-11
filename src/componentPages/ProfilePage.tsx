"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share } from "lucide-react";
import ProfileComponent from "@/components/ProfileComponent";
import ProfileDeleted from "@/components/ProfileDeleted";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useIkigaiStore } from "@/zustand";

interface toastType {
  show: boolean;
  type: "success" | "error" | "warning" | "";
  message: string;
}

function ProfilePage() {
  const uid = useAuthStore((s) => s.uid);
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<toastType>({
    show: false,
    type: "",
    message: "",
  });

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
                  className="rounded-xs shadow-xs"
                />
                <div className="absolute right-2 top-2 sm:hidden block">
                  <Share size={25} />
                </div>
              </Link>
            </div>
            <Link href={`/ikigai/${uid}`} className="max-w-fit hidden sm:block">
              <Button variant="neutral" leftIcon={<Share size={30} />} />
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border rounded-md shadow-md flex sm:flex-row flex-col gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold text-red-500">
          Permanently Close Your Account
        </h2>
        <Button
          variant="danger"
          onClick={() => setIsOpen(true)}
          className="px-9"
        >
          Delete Your Account
        </Button>
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

export default ProfilePage;
