import { create } from "zustand";
import { safeInternalPath } from "@/components/auth/auth-page-utils";

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

export const useUIStore = create<UIStore>((set) => ({
  isAuthModalOpen: false,
  authRedirectPath: null,
  authPrompt: null,

  openAuthModal: (redirectPath, prompt) => {
    const safe = safeInternalPath(redirectPath);
    if (typeof window !== "undefined" && safe) {
      window.localStorage.setItem("ikigaiFinderRedirectPath", safe);
    }
    set({ isAuthModalOpen: true, authRedirectPath: safe, authPrompt: prompt ?? null });
  },

  closeAuthModal: () => set({ isAuthModalOpen: false, authRedirectPath: null, authPrompt: null }),
}));

export const selectAuthRedirectPath = (state: UIStore) => state.authRedirectPath;
