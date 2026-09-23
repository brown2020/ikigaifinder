"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/firebase/firebaseClient";
import { ref, listAll, deleteObject } from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
} from "firebase/firestore";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

type ProfileDeletedProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ProfileDeleted({
  isOpen,
  closeModal,
}: ProfileDeletedProps) {
  const { uid } = useAuthStore();
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const authApp = getAuth();
  const user = authApp.currentUser;

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node))
        closeModal();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  const deleteDocs = async (refs: DocumentReference[]) => {
    try {
      await Promise.all(refs.map(deleteDoc));
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete account data. Please try again.");
      return false;
    }
  };

  const handleDeleteIkigaiProfileData = async (): Promise<
    string | undefined
  > => {
    if (!uid) return;
    const mainIkigaiProfileRef = doc(db, "ikigaiProfiles", uid);
    const coverCollectionRef = collection(db, "ikigaiProfiles", uid, "covers");
    const storeFolderRef = ref(storage, `generated/${uid}`);
    const ikigaiRefs = [
      doc(db, `/ikigaiUsers/${uid}/ikigai/main`),
      doc(db, `/ikigaiUsers/${uid}`),
    ];

    try {
      const subCollectionSnapshot = await getDocs(coverCollectionRef);
      await Promise.all([
        ...subCollectionSnapshot.docs.map((doc) => deleteDoc(doc.ref)),
        deleteDocs([mainIkigaiProfileRef, ...ikigaiRefs]),
      ]);

      const fileList = await listAll(storeFolderRef);
      await Promise.all(fileList.items.map(deleteObject));
      return "Ikigai profile data successfully deleted!";
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete account data. Please try again.");
    }
  };

  const handleDeleteProfileData = async () => {
    if (!uid) return false;
    const profileRefs = [
      doc(db, `/ikigaiUsers/${uid}/settings/profile`),
      doc(db, `/ikigaiUsers/${uid}`),
    ];
    return await deleteDocs(profileRefs);
  };

  const handleAuthDelete = async () => {
    if (user) {
      try {
        await deleteUser(user);
        await signOut(auth);
        router.replace("/");
      } catch (error) {
        console.error("Error during account deletion/sign out:", error);
        toast.error(
          "Your data was deleted, but sign-out failed. Please refresh the page."
        );
      }
    }
  };

  const deleteConfirmIkigaiProfile = async () => {
    setIsLoading(true);
    try {
      if (!uid) {
        toast.error("You must be signed in to delete your account.");
        return;
      }
      const removeIkigaiData = await handleDeleteIkigaiProfileData();
      if (removeIkigaiData) {
        await handleDeleteProfileData();
        toast.success("Your account has been deleted.");
        deleteTimerRef.current = setTimeout(handleAuthDelete, 4000);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
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
              This permanently removes your profile, ikigai results, and
              generated images. To confirm, type{" "}
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
              onChange={(e) => setConfirmText(e.target.value?.toLowerCase())}
              placeholder="DELETE ACCOUNT"
              autoComplete="off"
            />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="neutral" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={deleteConfirmIkigaiProfile}
                disabled={confirmText !== "delete account"}
                isLoading={isLoading}
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
