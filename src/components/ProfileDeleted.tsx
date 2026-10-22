"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/styles";
import { useDeleteAccount } from "@/hooks/use-delete-account";
import { cn } from "@/utils/cn";

type ProfileDeletedProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ProfileDeleted({
  isOpen,
  closeModal,
}: ProfileDeletedProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmText, setConfirmText] = useState("");
  const { deleteAccount, isDeleting, error } = useDeleteAccount();

  useEffect(() => {
    if (!isOpen || isDeleting) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node))
        closeModal();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isDeleting, closeModal]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    if (isDeleting) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, closeModal]);

  const confirmDelete = async () => {
    if (await deleteAccount()) {
      toast.success("Your account has been deleted.", { duration: 6000 });
      router.replace("/");
    }
  };

  return (
    <div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <dialog
            open
            className="fixed inset-0 z-50 m-auto h-fit w-[calc(100%-2.5rem)] max-w-md rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl sm:p-8"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            aria-modal="true"
            ref={modalRef}
          >
            <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-destructive-soft text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <h2
              id="delete-account-title"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Delete your account?
            </h2>
            <p
              id="delete-account-description"
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              This permanently deletes your account and sign-in, your profile and
              photo, your answers, ikigai results, and generated images. Shared
              links stop working. To confirm, type{" "}
              <strong className="font-semibold text-foreground">DELETE ACCOUNT</strong>{" "}
              below.
            </p>
            <label htmlFor="delete-account-confirm" className="sr-only">
              Type DELETE ACCOUNT to confirm account deletion
            </label>
            <input
              id="delete-account-confirm"
              ref={inputRef}
              className={cn(fieldClasses, "mt-6 h-12 font-medium")}
              onChange={(e) => setConfirmText(e.target.value.trim().toLowerCase())}
              placeholder="DELETE ACCOUNT"
              autoComplete="off"
              disabled={isDeleting}
            />
            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-destructive/20 bg-destructive-soft px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="neutral" onClick={closeModal} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={confirmText !== "delete account"}
                isLoading={isDeleting}
                loadingText="Deleting…"
              >
                Delete account
              </Button>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
