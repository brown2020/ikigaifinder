import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { ikigaiType } from "@/types/interface";
import { defaultIkigai, fetchIkigaiData, updateIkigaiData } from "@/services/ikigaiService";

// Re-export defaultIkigai so it can be used by other files importing from here
export { defaultIkigai };

interface IkigaiStoreState {
  ikigaiData: ikigaiType;
  ikigaiLoading: boolean;
  ikigaiError: Error | null;
  fetchIkigai: () => Promise<void>;
  updateIkigai: (updateData: Partial<ikigaiType>) => Promise<void>;
}

export const useIkigaiStore = create<IkigaiStoreState>((set, get) => ({
  ikigaiData: defaultIkigai,
  ikigaiLoading: false,
  ikigaiError: null,

  fetchIkigai: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ ikigaiLoading: true });
    try {
      const data = await fetchIkigaiData(uid);
      set({
        ikigaiData: data,
        ikigaiLoading: false,
      });
    } catch (error) {
      set({ ikigaiError: error as Error, ikigaiLoading: false });
    }
  },

  updateIkigai: async (updateData: Partial<ikigaiType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;
    set({ ikigaiLoading: true });

    try {
      const currentIkigaiData = get().ikigaiData;
      const updatedIkigaiData = await updateIkigaiData(uid, currentIkigaiData, updateData);

      set({
        ikigaiData: updatedIkigaiData,
        ikigaiLoading: false,
      });
    } catch (error) {
      set({ ikigaiError: error as Error, ikigaiLoading: false });
    }
  },
}));
