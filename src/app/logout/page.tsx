"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
      className="m-auto w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm sm:p-8"
      aria-labelledby="logout-title"
      aria-describedby="logout-description"
      onClose={() => router.back()}
    >
      <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
        <LogOut className="size-5" aria-hidden="true" />
      </div>
      <h2
        id="logout-title"
        className="font-display text-2xl font-semibold tracking-tight"
      >
        Sign out?
      </h2>
      <p id="logout-description" className="mt-2 text-sm text-muted-foreground">
        You can sign back in any time to see your ikigai and saved answers.
      </p>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="neutral"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </dialog>
  );
}

export default LogoutPage;
