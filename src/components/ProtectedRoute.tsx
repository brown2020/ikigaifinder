"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { ClipLoader } from "react-spinners";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { uid, authReady } = useAuthStore();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // If auth is ready (initial check done)
    if (authReady) {
      if (!uid) {
        router.push("/");
      } else {
        setShowLoading(false);
      }
    } else {
        // Still waiting for auth state to be determined
        // useAuthToken hook will set authReady=true when done
    }
  }, [authReady, uid, router]);

  if (showLoading) {
     return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white">
        <ClipLoader color="#333b51" size={50} />
      </div>
    );
  }

  return <>{children}</>;
}

