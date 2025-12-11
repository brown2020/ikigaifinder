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
import { Button } from "./ui/Button";

interface ToastType {
  show: boolean;
  type: "success" | "error" | "warning" | "";
  message: string;
}

type ProfileDeletedProps = {
  isOpen: boolean;
  closeModal: () => void;
  setToast: (toast: ToastType) => void;
};

export default function ProfileDeleted({
  isOpen,
  closeModal,
  setToast,
}: ProfileDeletedProps) {
  const { uid } = useAuthStore();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const authApp = getAuth();
  const user = authApp.currentUser;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node))
        closeModal();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeModal]);

  const deleteDocs = async (refs: DocumentReference[]) => {
    try {
      await Promise.all(refs.map(deleteDoc));
      return true;
    } catch (error) {
      console.log("Error deleting document: ", error);
      setToast({ show: true, type: "error", message: `Error: ${error}` });
      return false;
    }
  };

  const handleDeleteIkigaiProfileData = async (): Promise<
    string | undefined
  > => {
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
      console.log("Error deleting data: ", error);
    }
  };

  const handleDeleteProfileData = async () => {
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
        console.log("Error during sign out:", error);
      }
    }
  };

  const deleteConfirmIkigaiProfile = async () => {
    setIsLoading(true);
    try {
      const removeIkigaiData = await handleDeleteIkigaiProfileData();
      if (removeIkigaiData) {
        await handleDeleteProfileData();
        setToast({
          show: true,
          type: "success",
          message: "Ikigai profile successfully deleted!",
        });
        setTimeout(handleAuthDelete, 4000);
      }
    } catch (error) {
      console.log("Error deleting data: ", error);
      setToast({ show: true, type: "error", message: `Error: ${error}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-5 w-full xs:max-w-md max-w-72"
          >
            <h2 className="text-lg font-bold">
              Are you sure you want to delete your account?
            </h2>
            <p className="text-sm mt-3">
              Please type <b>DELETE ACCOUNT</b> to confirm.
            </p>
            <input
              className="w-full p-2 border border-gray-300 rounded-sm min-h-12 font-semibold mt-6"
              onChange={(e) => setConfirmText(e.target.value?.toLowerCase())}
              placeholder="Type DELETE ACCOUNT to confirm"
            />
            <div className="mt-4 flex gap-2 justify-end">
              <Button
                variant="neutral"
                onClick={closeModal}
                className="px-9 py-3"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={deleteConfirmIkigaiProfile}
                disabled={confirmText !== "delete account"}
                isLoading={isLoading}
                className="px-9 py-3"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
