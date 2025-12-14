"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { useProfileStore } from "@/zustand/useProfileStore";
import { updateUserDetailsInFirestore } from "@/services/userService";
import { getIdToken } from "firebase/auth";
import { createServerSession } from "@/lib/auth/session-client";

export default function LoginFinishPage() {
  const router = useRouter();
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  useEffect(() => {
    const sanitizeRedirectPath = (value: string | null): string | null => {
      if (!value) return null;
      if (!value.startsWith("/")) return null;
      if (value.startsWith("//")) return null;
      if (value.includes("://")) return null;
      return value;
    };

    async function attemptSignIn() {
      let isSuccess = false;
      const url = new URL(window.location.href);
      const redirectFromUrl = sanitizeRedirectPath(
        url.searchParams.get("redirect")
      );
      const redirectFromStorage = sanitizeRedirectPath(
        window.localStorage.getItem("ikigaiFinderRedirectPath")
      );
      const redirectTarget =
        redirectFromUrl ?? redirectFromStorage ?? "/ikigai-finder";

      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Sign in link is not valid");
        }

        let email = window.localStorage.getItem("ikigaiFinderEmail");
        const name = window.localStorage.getItem("ikigaiFinderName") || "";
        const offersOptIn =
          window.localStorage.getItem("purposefinderOffersOptIn") ===
          "Accepted";

        if (!email) {
          email = window.prompt("Please confirm your email");
          if (!email) {
            throw new Error("Email confirmation cancelled by user");
          }
        }

        const userCredential = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );

        const user = userCredential.user;
        // Create the server session cookie immediately so `proxy.ts` allows protected routes.
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
        setAuthDetails(authDetails);
        updateUserDetailsInFirestore(authDetails, uid).catch(() => {});
        updateProfile({ firstName: selectedName });
        isSuccess = true;
      } catch (error) {
        let errorMessage = "Unknown error signing in";
        if (error instanceof FirebaseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      } finally {
        window.localStorage.removeItem("ikigaiFinderEmail");
        window.localStorage.removeItem("ikigaiFinderName");
        window.localStorage.removeItem("purposefinderOffersOptIn");
        if (isSuccess) {
          window.localStorage.removeItem("ikigaiFinderRedirectPath");
          router.replace(redirectTarget);
        } else {
          router.replace("/");
        }
      }
    }

    attemptSignIn();
  }, [router, setAuthDetails, updateProfile]);

  return (
    <div className="p-8 text-center text-gray-700">Finishing sign-in…</div>
  );
}
