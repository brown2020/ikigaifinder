"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import "react-tooltip/dist/react-tooltip.css";
import { clearServerSession } from "@/lib/auth/session-client";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

function LogoutPage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        clearServerSession().catch(() => {});
        router.replace("/");
      })
      .catch(() => {
        toast.error("Failed to log out. Please try again.");
      });
  };

  return (
    <dialog
      ref={dialogRef}
      id="logout-dialog"
      className="rounded-lg shadow-lg p-6 max-w-sm w-full backdrop:bg-black/50"
      aria-labelledby="logout-title"
      onClose={() => router.back()}
    >
      <h2 id="logout-title" className="text-lg font-semibold mb-4">
        Confirm Logout
      </h2>
      <p className="mb-6">Are you sure you want to logout?</p>
      <div className="flex justify-end">
        <Button
          variant="neutral"
          className="mr-2"
          onClick={() => {
            dialogRef.current?.close();
            router.back();
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
    </dialog>
  );
}

export default LogoutPage;
