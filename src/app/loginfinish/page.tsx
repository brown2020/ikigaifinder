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
    async function attemptSignIn() {
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Sign in link is not valid");
        }

        let email = window.localStorage.getItem("ikigaiFinderEmail");
        const name = window.localStorage.getItem("ikigaiFinderName") || "";
        const offersOptIn =
          window.localStorage.getItem("purposefinderOffersOptIn") ===
          "Accepted";

        console.log("User signed in successfully:", email, name, offersOptIn);
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

        console.log(
          "User auth data:",
          authEmail,
          uid,
          selectedName,
          offersOptIn
        );

        if (!uid || !authEmail) {
          throw new Error("No user found");
        }

        console.log(
          "User signed in successfully:",
          authEmail,
          uid,
          selectedName
        );

        const authDetails = {
          uid,
          authEmail,
          selectedName,
          offersOptIn,
        };
        setAuthDetails(authDetails);
        updateUserDetailsInFirestore(authDetails, uid);
        updateProfile({ firstName: selectedName });
      } catch (error) {
        let errorMessage = "Unknown error signing in";
        if (error instanceof FirebaseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        console.log("ERROR", errorMessage);
        alert(errorMessage);
      } finally {
        window.localStorage.removeItem("ikigaiFinderEmail");
        window.localStorage.removeItem("ikigaiFinderName");
        window.localStorage.removeItem("purposefinderOffersOptIn");
        router.replace("/ikigai-finder");
      }
    }

    attemptSignIn();
  }, [router, setAuthDetails, updateProfile]);
}
