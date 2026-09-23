"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { useProfileStore } from "./useProfileStore";
import { useIkigaiStore } from "./useIkigaiStore";

/** Loads per-user data on sign-in and clears it on sign-out. Call once at the app root. */
export function useInitializeStores(): void {
  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    const profile = useProfileStore.getState();
    const ikigai = useIkigaiStore.getState();
    if (!uid) {
      profile.resetProfile();
      ikigai.resetIkigai();
      return;
    }
    Promise.all([profile.fetchProfile(), ikigai.fetchIkigai()]).catch((error) => {
      console.error("Error initializing stores:", error);
    });
  }, [uid]);
}
