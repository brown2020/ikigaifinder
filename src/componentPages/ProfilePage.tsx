"use client";

import ProfileComponent from "@/components/ProfileComponent";
import { useAuthStore } from "@/zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { uid, authReady, authEmail } = useAuthStore();

  useEffect(() => {
    if (!uid) router.push("/");
  }, [authReady, router, uid]);
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-4 pt-5">
      <div className="text-3xl font-semibold">Your Profile</div>
      <div className="flex flex-col px-5 py-3 space-y-3 border border-gray-500 rounded-md">
        <div className="flex flex-col space-y-1">
          <div className="text-sm">Login email</div>
          <div className="px-3 py-2 text-black bg-gray-400 rounded-md">
            {authEmail}
          </div>
        </div>
      </div>
      
      <ProfileComponent />
    </div>
  );
}
