import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import {
  defaultIkigai,
  fetchIkigaiData,
  updateIkigaiData,
} from "@/services/ikigaiService";
import type { Ikigai, IkigaiData } from "@/types";

// Re-export for backward compatibility
export { defaultIkigai };

// ============================================================================
// Types
// ============================================================================

interface IkigaiState {
  /** Current ikigai data */
  ikigaiData: Ikigai;
  /** Whether ikigai is being loaded/saved */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
}

interface IkigaiActions {
  /** Fetch ikigai data from Firestore */
  fetchIkigai: () => Promise<void>;
  /** Update ikigai data in Firestore */
  updateIkigai: (data: Partial<Ikigai>) => Promise<void>;
  /** Reset ikigai to default state */
  resetIkigai: () => void;
  /** Select an ikigai option */
  selectIkigai: (ikigai: IkigaiData | null) => void;
  /** Set ikigai options */
  setIkigaiOptions: (options: IkigaiData[]) => void;
  /** Clear any errors */
  clearError: () => void;
}

type IkigaiStore = IkigaiState & IkigaiActions;

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Ikigai State Store
 *
 * Manages the user's Ikigai journey including:
 * - Survey answers
 * - Generated ikigai options
 * - Selected ikigai
 * - Generated images
 */
export const useIkigaiStore = create<IkigaiStore>()(
  process.env.NODE_ENV === "development"
    ? devtools(
        (set, get) => ({
          // Initial state
          ikigaiData: defaultIkigai,
          isLoading: false,
          error: null,

          fetchIkigai: async () => {
            const uid = useAuthStore.getState().uid;
            if (!uid) {
              console.warn("Cannot fetch ikigai: No authenticated user");
              return;
            }

            set({ isLoading: true, error: null }, false, "ikigai/fetchStart");

            try {
              const data = await fetchIkigaiData(uid);
              set(
                { ikigaiData: data, isLoading: false },
                false,
                "ikigai/fetchSuccess"
              );
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error("Failed to fetch ikigai");
              set({ error, isLoading: false }, false, "ikigai/fetchError");
            }
          },

          updateIkigai: async (updateData: Partial<Ikigai>) => {
            const uid = useAuthStore.getState().uid;
            if (!uid) {
              console.warn("Cannot update ikigai: No authenticated user");
              return;
            }

            set({ isLoading: true, error: null }, false, "ikigai/updateStart");

            try {
              const currentData = get().ikigaiData;
              const updatedData = await updateIkigaiData(
                uid,
                currentData,
                updateData
              );
              set(
                { ikigaiData: updatedData, isLoading: false },
                false,
                "ikigai/updateSuccess"
              );
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error("Failed to update ikigai");
              set({ error, isLoading: false }, false, "ikigai/updateError");
            }
          },

          resetIkigai: () => {
            set(
              { ikigaiData: defaultIkigai, error: null },
              false,
              "ikigai/reset"
            );
          },

          selectIkigai: (ikigai: IkigaiData | null) => {
            set(
              (state) => ({
                ikigaiData: {
                  ...state.ikigaiData,
                  ikigaiSelected: ikigai,
                },
              }),
              false,
              "ikigai/select"
            );
          },

          setIkigaiOptions: (options: IkigaiData[]) => {
            set(
              (state) => ({
                ikigaiData: {
                  ...state.ikigaiData,
                  ikigaiOptions: options,
                },
              }),
              false,
              "ikigai/setOptions"
            );
          },

          clearError: () => {
            set({ error: null }, false, "ikigai/clearError");
          },
        }),
        { name: "ikigai-store" }
      )
    : (set, get) => ({
        // Initial state
        ikigaiData: defaultIkigai,
        isLoading: false,
        error: null,

        fetchIkigai: async () => {
          const uid = useAuthStore.getState().uid;
          if (!uid) {
            console.warn("Cannot fetch ikigai: No authenticated user");
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const data = await fetchIkigaiData(uid);
            set({ ikigaiData: data, isLoading: false });
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error("Failed to fetch ikigai");
            set({ error, isLoading: false });
          }
        },

        updateIkigai: async (updateData: Partial<Ikigai>) => {
          const uid = useAuthStore.getState().uid;
          if (!uid) {
            console.warn("Cannot update ikigai: No authenticated user");
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const currentData = get().ikigaiData;
            const updatedData = await updateIkigaiData(
              uid,
              currentData,
              updateData
            );
            set({ ikigaiData: updatedData, isLoading: false });
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error("Failed to update ikigai");
            set({ error, isLoading: false });
          }
        },

        resetIkigai: () => {
          set({ ikigaiData: defaultIkigai, error: null });
        },

        selectIkigai: (ikigai: IkigaiData | null) => {
          set((state) => ({
            ikigaiData: {
              ...state.ikigaiData,
              ikigaiSelected: ikigai,
            },
          }));
        },

        setIkigaiOptions: (options: IkigaiData[]) => {
          set((state) => ({
            ikigaiData: {
              ...state.ikigaiData,
              ikigaiOptions: options,
            },
          }));
        },

        clearError: () => {
          set({ error: null });
        },
      })
);

// ============================================================================
// Selectors
// ============================================================================

/** Select the current ikigai data */
export const selectIkigaiData = (state: IkigaiStore) => state.ikigaiData;

/** Select the selected ikigai option */
export const selectSelectedIkigai = (state: IkigaiStore) =>
  state.ikigaiData.ikigaiSelected;

/** Select ikigai options */
export const selectIkigaiOptions = (state: IkigaiStore) =>
  state.ikigaiData.ikigaiOptions;

/** Select answers */
export const selectAnswers = (state: IkigaiStore) => state.ikigaiData.answers;

/** Select loading/error state */
export const selectIkigaiStatus = (state: IkigaiStore) => ({
  isLoading: state.isLoading,
  error: state.error,
});

/** Check if all questions are answered */
export const selectIsComplete = (state: IkigaiStore) => {
  return state.ikigaiData.answers.every((step) =>
    step.questions.every((q) => q.answer && q.answer.length > 0)
  );
};
