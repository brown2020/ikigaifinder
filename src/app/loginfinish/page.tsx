"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  getIdToken,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import { useProfileStore } from "@/zustand/useProfileStore";
import { updateUserDetailsInFirestore } from "@/services/userService";
import { createServerSession } from "@/lib/auth/session-client";

function sanitizeRedirectPath(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("://")) return null;
  return value;
}

async function completeSignIn(
  email: string,
  name: string,
  offersOptIn: boolean,
  redirectTarget: string,
  deps: {
    setAuthDetails: ReturnType<typeof useAuthStore.getState>["setAuthDetails"];
    updateProfile: ReturnType<typeof useProfileStore.getState>["updateProfile"];
    router: ReturnType<typeof useRouter>;
  }
) {
  let isSuccess = false;
  try {
    const userCredential = await signInWithEmailLink(
      auth,
      email,
      window.location.href
    );

    const user = userCredential.user;
    if (user) {
      const idToken = await getIdToken(user, true);
      await createServerSession(idToken);
    }
    const authEmail = user?.email;
    const uid = user?.uid;
    const selectedName = name || user?.displayName || "";

    if (!uid || !authEmail) {
      throw new Error("No user found");
    }

    const authDetails = {
      uid,
      authEmail,
      selectedName,
      offersOptIn,
    };
    deps.setAuthDetails(authDetails);
    updateUserDetailsInFirestore(authDetails, uid).catch(() => {});
    await deps.updateProfile({ firstName: selectedName });
    isSuccess = true;
  } catch (error) {
    let errorMessage = "Unknown error signing in";
    if (error instanceof FirebaseError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  } finally {
    window.localStorage.removeItem("ikigaiFinderEmail");
    window.localStorage.removeItem("ikigaiFinderName");
    window.localStorage.removeItem("purposefinderOffersOptIn");
    if (isSuccess) {
      window.localStorage.removeItem("ikigaiFinderRedirectPath");
      deps.router.replace(redirectTarget);
    } else {
      deps.router.replace("/");
    }
  }
}

export default function LoginFinishPage() {
  const router = useRouter();
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [pendingState, setPendingState] = useState<{
    name: string;
    offersOptIn: boolean;
    redirectTarget: string;
  } | null>(null);

  useEffect(() => {
    const deps = { setAuthDetails, updateProfile, router };

    const url = new URL(window.location.href);
    const redirectFromUrl = sanitizeRedirectPath(
      url.searchParams.get("redirect")
    );
    const redirectFromStorage = sanitizeRedirectPath(
      window.localStorage.getItem("ikigaiFinderRedirectPath")
    );
    const redirectTarget =
      redirectFromUrl ?? redirectFromStorage ?? "/ikigai-finder";

    if (!isSignInWithEmailLink(auth, window.location.href)) {
      toast.error("Sign in link is not valid");
      deps.router.replace("/");
      return;
    }

    const email = window.localStorage.getItem("ikigaiFinderEmail");
    const name = window.localStorage.getItem("ikigaiFinderName") || "";
    const offersOptIn =
      window.localStorage.getItem("purposefinderOffersOptIn") === "Accepted";

    if (!email) {
      setPendingState({ name, offersOptIn, redirectTarget });
      setNeedsEmail(true);
      return;
    }

    completeSignIn(email, name, offersOptIn, redirectTarget, deps);
  }, [setAuthDetails, updateProfile, router]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !pendingState) return;
    setNeedsEmail(false);
    completeSignIn(
      emailInput.trim(),
      pendingState.name,
      pendingState.offersOptIn,
      pendingState.redirectTarget,
      { setAuthDetails, updateProfile, router }
    );
  };

  if (needsEmail) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm your email
        </h2>
        <p className="text-gray-600 mb-4">
          Please enter the email address you used to sign in.
        </p>
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@example.com"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-gray-700">Finishing sign-in…</div>
  );
}
