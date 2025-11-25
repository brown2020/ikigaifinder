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
 */
export function useInitializeStores(): void {
  const uid = useAuthStore((state) => state.uid);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const fetchIkigai = useIkigaiStore((state) => state.fetchIkigai);

  useEffect(() => {
    if (!uid) return;

    // Fetch user data in parallel
    Promise.all([fetchProfile(), fetchIkigai()]).catch((error) => {
      console.error("Error initializing stores:", error);
    });
  }, [uid, fetchProfile, fetchIkigai]);
}

export default useInitializeStores;
