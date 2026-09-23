import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { withDevtools } from "./middleware";
import { defaultIkigai, fetchIkigaiData, updateIkigaiData } from "@/services/ikigaiService";
import type { Ikigai } from "@/types";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface IkigaiStore {
  ikigaiData: Ikigai;
  /** Tracks the initial Firestore hydration, not individual saves. */
  status: LoadStatus;
  isSaving: boolean;
  error: Error | null;
  fetchIkigai: () => Promise<void>;
  /** Persists a partial update. Resolves to false if it failed or the user changed mid-flight. */
  updateIkigai: (data: Partial<Ikigai>) => Promise<boolean>;
  resetIkigai: () => void;
}

const isCurrentUser = (uid: string) => uid === useAuthStore.getState().uid;
const toError = (err: unknown, fallback: string) =>
  err instanceof Error ? err : new Error(fallback);

export const useIkigaiStore = create<IkigaiStore>()(
  withDevtools("ikigai-store", (set, get) => ({
    ikigaiData: defaultIkigai,
    status: "idle",
    isSaving: false,
    error: null,

    fetchIkigai: async () => {
      const uid = useAuthStore.getState().uid;
      if (!uid) return;
      set({ status: "loading", error: null }, false, "ikigai/fetchStart");
      try {
        const data = await fetchIkigaiData(uid);
        if (!isCurrentUser(uid)) return;
        set({ ikigaiData: data, status: "ready" }, false, "ikigai/fetchSuccess");
      } catch (err) {
        if (!isCurrentUser(uid)) return;
        set({ error: toError(err, "Failed to load your ikigai"), status: "error" }, false, "ikigai/fetchError");
      }
    },

    updateIkigai: async (updateData) => {
      const uid = useAuthStore.getState().uid;
      if (!uid) return false;
      set({ isSaving: true, error: null }, false, "ikigai/updateStart");
      try {
        const updated = await updateIkigaiData(uid, get().ikigaiData, updateData);
        if (!isCurrentUser(uid)) return false;
        set({ ikigaiData: updated, isSaving: false }, false, "ikigai/updateSuccess");
        return true;
      } catch (err) {
        if (!isCurrentUser(uid)) return false;
        set({ error: toError(err, "Failed to save your ikigai"), isSaving: false }, false, "ikigai/updateError");
        return false;
      }
    },

    resetIkigai: () =>
      set({ ikigaiData: defaultIkigai, status: "idle", error: null }, false, "ikigai/reset"),
  }))
);
