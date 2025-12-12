import { Timestamp } from "firebase/firestore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export interface AuthState {
  /** Firebase user ID */
  uid: string;
  /** User's email address */
  authEmail: string;
  /** User's display name */
  authDisplayName: string;
  /** URL to user's profile photo */
  authPhotoUrl: string;
  /** Whether the email has been verified */
  authEmailVerified: boolean;
  /** Whether auth state has been determined */
  authReady: boolean;
  /** Whether a magic link sign-in is pending */
  authPending: boolean;
  /** Whether user has access permissions */
  isAllowed: boolean;
  /** Last sign-in timestamp */
  lastSignIn: Timestamp | null;
  /** Whether user has opted into marketing emails */
  offersOptIn: boolean;
  /** User's selected/preferred name */
  selectedName: string;
  /** Whether user has premium subscription */
  premium: boolean;
}

interface AuthActions {
  /** Update auth state with partial values */
  setAuthDetails: (details: Partial<AuthState>) => void;
  /** Reset auth state to defaults (on sign out) */
  clearAuthDetails: () => void;
  /** Check if user is authenticated */
  isAuthenticated: () => boolean;
}

type AuthStore = AuthState & AuthActions;

// ============================================================================
// Initial State
// ============================================================================

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

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Authentication State Store
 *
 * Manages Firebase authentication state including:
 * - User profile information
 * - Authentication status
 * - Premium/subscription status
 */
export const useAuthStore = create<AuthStore>()(
  process.env.NODE_ENV === "development"
    ? devtools(
        (set, get) => ({
          ...initialAuthState,

          setAuthDetails: (details: Partial<AuthState>) => {
            set(
              (state) => ({ ...state, ...details }),
              false,
              "auth/setDetails"
            );
          },

          clearAuthDetails: () => {
            set(initialAuthState, false, "auth/clear");
          },

          isAuthenticated: () => {
            return Boolean(get().uid);
          },
        }),
        { name: "auth-store" }
      )
    : (set, get) => ({
        ...initialAuthState,

        setAuthDetails: (details: Partial<AuthState>) => {
          set((state) => ({ ...state, ...details }));
        },

        clearAuthDetails: () => {
          set(initialAuthState);
        },

        isAuthenticated: () => {
          return Boolean(get().uid);
        },
      })
);

// ============================================================================
// Selectors
// ============================================================================

/** Select basic user info */
export const selectUser = (state: AuthStore) => ({
  uid: state.uid,
  email: state.authEmail,
  displayName: state.authDisplayName,
  photoUrl: state.authPhotoUrl,
});

/** Select auth status */
export const selectAuthStatus = (state: AuthStore) => ({
  isAuthenticated: Boolean(state.uid),
  isReady: state.authReady,
  isPending: state.authPending,
  isEmailVerified: state.authEmailVerified,
});

/** Select subscription info */
export const selectSubscription = (state: AuthStore) => ({
  isPremium: state.premium,
  isAllowed: state.isAllowed,
});
