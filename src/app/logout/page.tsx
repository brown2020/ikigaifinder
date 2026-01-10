"use client";

import { auth } from "@/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import "react-tooltip/dist/react-tooltip.css";
import { clearServerSession } from "@/lib/auth/session-client";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

function LogoutPage() {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        clearServerSession().catch(() => {});
        router.replace("/");
      })
      .catch((error) => {
        console.error("Error during sign out:", error.message);
        toast.error("Failed to log out. Please try again.");
      });
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end">
          <Button variant="neutral" className="mr-2" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
