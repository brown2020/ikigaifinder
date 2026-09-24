import { create } from "zustand";

/** Optional copy explaining why the visitor is being asked to sign in. */
export interface AuthPrompt {
  title: string;
  body: string;
}

interface UIStore {
  isAuthModalOpen: boolean;
  authRedirectPath: string | null;
  authPrompt: AuthPrompt | null;
  openAuthModal: (redirectPath?: string, prompt?: AuthPrompt) => void;
  closeAuthModal: () => void;
}

function isSafeRedirect(path?: string): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://"));
}

export const useUIStore = create<UIStore>((set) => ({
  isAuthModalOpen: false,
  authRedirectPath: null,
  authPrompt: null,

  openAuthModal: (redirectPath, prompt) => {
    if (typeof window !== "undefined" && isSafeRedirect(redirectPath)) {
      window.localStorage.setItem("ikigaiFinderRedirectPath", redirectPath);
    }
    set({ isAuthModalOpen: true, authRedirectPath: redirectPath ?? null, authPrompt: prompt ?? null });
  },

  closeAuthModal: () => set({ isAuthModalOpen: false, authRedirectPath: null, authPrompt: null }),
}));

export const selectAuthRedirectPath = (state: UIStore) => state.authRedirectPath;
