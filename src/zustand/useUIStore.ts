import { create } from "zustand";

// ============================================================================
// Types
// ============================================================================

interface UIState {
  /** Whether the auth modal is open */
  isAuthModalOpen: boolean;
  /** Redirect path after successful authentication */
  authRedirectPath: string | null;
  /** Whether to show loading overlay */
  isGlobalLoading: boolean;
}

interface UIActions {
  /** Open the auth modal */
  openAuthModal: (redirectPath?: string) => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
  /** Toggle the auth modal */
  toggleAuthModal: () => void;
  /** Set global loading state */
  setGlobalLoading: (isLoading: boolean) => void;
}

type UIStore = UIState & UIActions;

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * UI State Store
 *
 * Manages global UI state including:
 * - Auth modal visibility
 * - Global loading states
 *
 * Note: Toast notifications are handled by react-hot-toast directly.
 * Use `toast.success()`, `toast.error()`, etc. from 'react-hot-toast'.
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isAuthModalOpen: false,
  authRedirectPath: null,
  isGlobalLoading: false,

  // Actions
  openAuthModal: (redirectPath?: string) => {
    set({
      isAuthModalOpen: true,
      authRedirectPath: redirectPath ?? null,
    });
  },

  closeAuthModal: () => {
    set({
      isAuthModalOpen: false,
      authRedirectPath: null,
    });
  },

  toggleAuthModal: () => {
    const { isAuthModalOpen } = get();
    set({ isAuthModalOpen: !isAuthModalOpen });
  },

  setGlobalLoading: (isLoading: boolean) => {
    set({ isGlobalLoading: isLoading });
  },
}));

// ============================================================================
// Selectors (use individual selectors to avoid object creation)
// ============================================================================

/** Select auth modal open state */
export const selectIsAuthModalOpen = (state: UIStore) => state.isAuthModalOpen;

/** Select auth redirect path */
export const selectAuthRedirectPath = (state: UIStore) =>
  state.authRedirectPath;

/** Select open auth modal action */
export const selectOpenAuthModal = (state: UIStore) => state.openAuthModal;

/** Select close auth modal action */
export const selectCloseAuthModal = (state: UIStore) => state.closeAuthModal;

/** Select global loading state */
export const selectIsGlobalLoading = (state: UIStore) => state.isGlobalLoading;

/** Select set global loading action */
export const selectSetGlobalLoading = (state: UIStore) =>
  state.setGlobalLoading;

export default useUIStore;
