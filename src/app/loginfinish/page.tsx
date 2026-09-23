"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  getIdToken,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import { useProfileStore } from "@/zustand/useProfileStore";
import { updateUserDetailsInFirestore } from "@/services/userService";
import { createServerSession } from "@/lib/auth/session-client";
import { AuthCard, AuthPageShell } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  const pendingStateRef = useRef<{
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
      redirectFromUrl ?? redirectFromStorage ?? "/dashboard";

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
      pendingStateRef.current = { name, offersOptIn, redirectTarget };
      setNeedsEmail(true);
      return;
    }

    completeSignIn(email, name, offersOptIn, redirectTarget, deps);
  }, [setAuthDetails, updateProfile, router]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !pendingStateRef.current) return;
    setNeedsEmail(false);
    const pending = pendingStateRef.current;
    completeSignIn(
      emailInput.trim(),
      pending.name,
      pending.offersOptIn,
      pending.redirectTarget,
      { setAuthDetails, updateProfile, router }
    );
  };

  if (needsEmail) {
    return (
      <AuthPageShell>
        <AuthCard
          title="Confirm your email"
          description="For security, enter the email address you used to request the sign-in link."
        >
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <Input
              id="loginfinish-email"
              label="Email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
            />
            <Button type="submit" fullWidth size="lg">
              Continue
            </Button>
          </form>
        </AuthCard>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <LoadingSpinner label="Finishing sign-in…" className="py-16" />
    </AuthPageShell>
  );
}
