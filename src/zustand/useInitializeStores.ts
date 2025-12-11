"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { useProfileStore } from "./useProfileStore";
import { useIkigaiStore } from "./useIkigaiStore";

/**
 * Hook to initialize Zustand stores after authentication
 *
 * Should be called once at the app root level (in ClientProvider).
 * Automatically fetches profile and ikigai data when user is authenticated.
 *
 * Note: We access store methods via getState() to avoid dependency array issues
 * that would cause unnecessary effect re-runs.
 */
export function useInitializeStores(): void {
  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    if (!uid) return;

    // Access store methods directly to ensure stable references
    const { fetchProfile } = useProfileStore.getState();
    const { fetchIkigai } = useIkigaiStore.getState();

    // Fetch user data in parallel
    Promise.all([fetchProfile(), fetchIkigai()]).catch((error) => {
      console.error("Error initializing stores:", error);
    });
  }, [uid]);
}

export default useInitializeStores;
