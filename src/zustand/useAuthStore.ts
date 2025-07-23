import { db } from "@/firebase/firebaseClient";
import { Timestamp, doc, setDoc, serverTimestamp } from "firebase/firestore";
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

  setAuthDetails: async (details: Partial<AuthState>) => {
    const { ...oldState } = get();
    const newState = { ...oldState, ...details };
    set(newState);
    await updateUserDetailsInFirestore(newState, get().uid);
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

async function updateUserDetailsInFirestore(
  details: Partial<AuthState>,
  uid: string
) {
  if (uid) {
    const userRef = doc(db, `ikigaiUsers/${uid}`);

    // Filter only serializable fields
    const serializableDetails = JSON.parse(JSON.stringify(details));

    try {
      await setDoc(
        userRef,
        { ...serializableDetails, lastSignIn: serverTimestamp() },
        { merge: true }
      );
      console.log("Auth details updated successfully in Firestore.");
    } catch (error) {
      console.log("Error updating auth details in Firestore:", error);
    }
  }
}
