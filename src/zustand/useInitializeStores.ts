import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import useProfileStore from "./useProfileStore";

export const useInitializeStores = () => {
  const { uid } = useAuthStore();
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!uid) return;
    fetchProfile();
  }, [uid, fetchProfile]);
};
