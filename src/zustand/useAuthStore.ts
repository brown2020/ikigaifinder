import { Timestamp } from "firebase/firestore";
import { create } from "zustand";

export interface AuthState {
  uid: string;
  authEmail: string;
  authDisplayName: string;
  authPhotoUrl: string;
  authEmailVerified: boolean;
  authReady: boolean;
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

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
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

  setAuthDetails: (details: Partial<AuthState>) => {
    const { ...oldState } = get();
    const newState = { ...oldState, ...details };
    set(newState);
  },

  clearAuthDetails: () =>
    set({
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
    }),
}));
