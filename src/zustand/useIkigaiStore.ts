import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { withDevtools } from "./middleware";
import {
  defaultIkigai,
  fetchIkigaiData,
  updateIkigaiData,
  withStoredAnswers,
} from "@/services/ikigaiService";
import { clearGuestAnswers, countAnswered, loadGuestAnswers, saveGuestAnswers } from "@/utils/guestDraft";
import type { Ikigai } from "@/types";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface IkigaiStore {
  ikigaiData: Ikigai;
  /** Tracks the initial hydration (Firestore, or this device for guests), not individual saves. */
  status: LoadStatus;
  isSaving: boolean;
  error: Error | null;
  fetchIkigai: () => Promise<void>;
  /** Hydrates a signed-out visitor's answers from this device. */
  loadGuest: () => void;
  /**
   * Persists a partial update. Resolves to false if it failed or the user changed mid-flight.
   * `quiet` saves (autosave) don't flip `isSaving`, so buttons don't flash a spinner while typing.
   */
  updateIkigai: (data: Partial<Ikigai>, options?: { quiet?: boolean }) => Promise<boolean>;
  resetIkigai: () => void;
}

const isCurrentUser = (uid: string) => uid === useAuthStore.getState().uid;
const toError = (err: unknown, fallback: string) =>
  err instanceof Error ? err : new Error(fallback);

/**
 * Carries answers written before sign-up into the account. Guest answers win
 * only when they go further than what the account already has, so a stray
 * signed-out visit can't overwrite a returning user's work.
 */
async function adoptGuestAnswers(uid: string, data: Ikigai): Promise<Ikigai> {
  const draft = loadGuestAnswers();
  if (!draft) return data;
  const answers = withStoredAnswers(draft);
  if (countAnswered(answers) <= countAnswered(data.answers)) {
    clearGuestAnswers();
    return data;
  }
  const updated = await updateIkigaiData(uid, data, { answers, ikigaiOptions: [] });
  clearGuestAnswers();
  return updated;
}

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
        const data = await adoptGuestAnswers(uid, await fetchIkigaiData(uid));
        if (!isCurrentUser(uid)) return;
        set({ ikigaiData: data, status: "ready" }, false, "ikigai/fetchSuccess");
      } catch (err) {
        if (!isCurrentUser(uid)) return;
        set({ error: toError(err, "Failed to load your ikigai"), status: "error" }, false, "ikigai/fetchError");
      }
    },

    loadGuest: () => {
      const answers = withStoredAnswers(loadGuestAnswers() ?? undefined);
      set({ ikigaiData: { ...defaultIkigai, answers }, status: "ready", error: null }, false, "ikigai/loadGuest");
    },

    updateIkigai: async (updateData, options) => {
      const quiet = Boolean(options?.quiet);
      const uid = useAuthStore.getState().uid;
      if (!uid) {
        // Guests can only answer questions; everything else needs an account.
        if (!updateData.answers) return false;
        const answers = withStoredAnswers(updateData.answers);
        saveGuestAnswers(answers);
        set({ ikigaiData: { ...get().ikigaiData, answers } }, false, "ikigai/updateGuest");
        return true;
      }
      if (!quiet) set({ isSaving: true, error: null }, false, "ikigai/updateStart");
      try {
        const updated = await updateIkigaiData(uid, get().ikigaiData, updateData);
        if (!isCurrentUser(uid)) return false;
        set(quiet ? { ikigaiData: updated } : { ikigaiData: updated, isSaving: false }, false, "ikigai/updateSuccess");
        return true;
      } catch (err) {
        if (!isCurrentUser(uid)) return false;
        const error = toError(err, "Failed to save your ikigai");
        set(quiet ? { error } : { error, isSaving: false }, false, "ikigai/updateError");
        return false;
      }
    },

    resetIkigai: () =>
      set({ ikigaiData: defaultIkigai, status: "idle", error: null }, false, "ikigai/reset"),
  }))
);
