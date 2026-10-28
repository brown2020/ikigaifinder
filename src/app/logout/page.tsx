"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { Button } from "@/components/ui/Button";

function LogoutPage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const leaving = useRef(false);
  const { signOut, isLoading, error } = useAuthActions();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleSignOut = async () => {
    leaving.current = true;
    let left = false;
    await signOut(() => {
      left = true;
      router.replace("/");
    });
    if (!left) {
      leaving.current = false;
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="logout-dialog"
      className="m-auto w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm sm:p-8"
      aria-labelledby="logout-title"
      aria-describedby="logout-description"
      onClose={() => {
        if (!leaving.current) router.back();
      }}
    >
      <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
        <LogOut className="size-5" aria-hidden="true" />
      </div>
      <h2 id="logout-title" className="font-display text-2xl font-semibold tracking-tight">
        Sign out?
      </h2>
      <p id="logout-description" className="mt-2 text-sm text-muted-foreground">
        You can sign back in any time to see your ikigai and saved answers.
      </p>
      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="neutral"
          onClick={() => {
            dialogRef.current?.close();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSignOut} isLoading={isLoading} loadingText="Signing out…">
          Sign out
        </Button>
      </div>
    </dialog>
  );
}

export default LogoutPage;
