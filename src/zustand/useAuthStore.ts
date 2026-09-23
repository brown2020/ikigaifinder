import type { Timestamp } from "firebase/firestore";
import { create } from "zustand";
import { withDevtools } from "./middleware";

export interface AuthState {
  uid: string;
  authEmail: string;
  authDisplayName: string;
  authPhotoUrl: string;
  authEmailVerified: boolean;
  /** Whether Firebase has resolved the initial auth state. */
  authReady: boolean;
  /** Whether an email-link sign-in is pending. */
  authPending: boolean;
  isAllowed: boolean;
  lastSignIn: Timestamp | null;
  offersOptIn: boolean;
  selectedName: string;
  premium: boolean;
}

interface AuthActions {
  setAuthDetails: (details: Partial<AuthState>) => void;
  clearAuthDetails: () => void;
}

const initialAuthState: AuthState = {
  uid: "",
  authEmail: "",
  authDisplayName: "",
  authPhotoUrl: "",
  authEmailVerified: false,
  authReady: false,
  authPending: false,
  isAllowed: false,
  lastSignIn: null,
  offersOptIn: false,
  selectedName: "",
  premium: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  withDevtools("auth-store", (set) => ({
    ...initialAuthState,
    setAuthDetails: (details) => set(details, false, "auth/setDetails"),
    // Only called once Firebase has resolved to "signed out", so auth is ready.
    clearAuthDetails: () =>
      set({ ...initialAuthState, authReady: true }, false, "auth/clear"),
  }))
);
