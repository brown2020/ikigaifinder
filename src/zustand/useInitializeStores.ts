import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import useProfileStore from "./useProfileStore";
import { useIkigaiStore } from "./useIkigaiStore";

export const useInitializeStores = () => {
  const { uid } = useAuthStore();
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const fetchIkigai = useIkigaiStore((state) => state.fetchIkigai);

  useEffect(() => {
    if (!uid) return;
    fetchProfile();
    fetchIkigai();  
  }, [uid, fetchProfile, fetchIkigai]);
};
