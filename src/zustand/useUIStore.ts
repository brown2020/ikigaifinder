import { create } from "zustand";

interface UIStore {
  isAuthModalOpen: boolean;
  authRedirectPath: string | null;
  openAuthModal: (redirectPath?: string) => void;
  closeAuthModal: () => void;
}

function isSafeRedirect(path?: string): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://"));
}

export const useUIStore = create<UIStore>((set) => ({
  isAuthModalOpen: false,
  authRedirectPath: null,

  openAuthModal: (redirectPath) => {
    if (typeof window !== "undefined" && isSafeRedirect(redirectPath)) {
      window.localStorage.setItem("ikigaiFinderRedirectPath", redirectPath);
    }
    set({ isAuthModalOpen: true, authRedirectPath: redirectPath ?? null });
  },

  closeAuthModal: () => set({ isAuthModalOpen: false, authRedirectPath: null }),
}));

export const selectAuthRedirectPath = (state: UIStore) => state.authRedirectPath;
