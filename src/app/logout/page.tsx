"use client";

import withAuth from "@/components/withAuth";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "react-tooltip/dist/react-tooltip.css";

function LogoutPage() {
  const router = useRouter();
  const { uid, authReady } = useAuthStore();

  useEffect(() => {
    if (!uid) router.push("/");
  }, [authReady, router, uid]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        console.log("Error during sign out:", error.message);
      });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end">
          <button onClick={() => router.back()} className="mr-2 btn-muted">
            Cancel
          </button>
          <button onClick={handleSignOut} className="btn-primary w-fit">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(LogoutPage);
