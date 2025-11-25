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
  /** Toast notifications queue */
  toasts: Toast[];
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
  /** Add a toast notification */
  addToast: (toast: Omit<Toast, "id">) => void;
  /** Remove a toast notification */
  removeToast: (id: string) => void;
  /** Clear all toasts */
  clearToasts: () => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
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
 * - Toast notifications
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isAuthModalOpen: false,
  authRedirectPath: null,
  isGlobalLoading: false,
  toasts: [],

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

  addToast: (toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// ============================================================================
// Selectors (use individual selectors to avoid object creation)
// ============================================================================

/** Select auth modal open state */
export const selectIsAuthModalOpen = (state: UIStore) => state.isAuthModalOpen;

/** Select auth redirect path */
export const selectAuthRedirectPath = (state: UIStore) => state.authRedirectPath;

/** Select open auth modal action */
export const selectOpenAuthModal = (state: UIStore) => state.openAuthModal;

/** Select close auth modal action */
export const selectCloseAuthModal = (state: UIStore) => state.closeAuthModal;

/** Select global loading state */
export const selectIsGlobalLoading = (state: UIStore) => state.isGlobalLoading;

/** Select set global loading action */
export const selectSetGlobalLoading = (state: UIStore) => state.setGlobalLoading;

/** Select toasts array */
export const selectToastsArray = (state: UIStore) => state.toasts;

/** Select add toast action */
export const selectAddToast = (state: UIStore) => state.addToast;

/** Select remove toast action */
export const selectRemoveToast = (state: UIStore) => state.removeToast;

export default useUIStore;

