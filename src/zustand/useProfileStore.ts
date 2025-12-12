import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { fetchProfileData, updateProfileData } from "@/services/profileService";
import type { UserProfile, SurveyAnswer } from "@/types";

// ============================================================================
// Types
// ============================================================================

/** @deprecated Use UserProfile from @/types instead */
export type ProfileType = UserProfile;

interface ProfileState {
  /** User profile data */
  profile: UserProfile;
  /** Whether profile is being loaded/saved */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
}

interface ProfileActions {
  /** Fetch profile from Firestore */
  fetchProfile: () => Promise<void>;
  /** Update profile in Firestore */
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  /** Reset profile to default state */
  resetProfile: () => void;
  /** Clear any errors */
  clearError: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

// ============================================================================
// Default Values
// ============================================================================

const defaultProfile: UserProfile = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  headerUrl: "",
  organization: "",
  title: "",
  bio: "",
  interests: "",
  location: "",
  country: "",
  identifyWith: [],
  website: "",
  linkedin: "",
  purposeId: "",
  moonshotId: "",
  answers: [] as SurveyAnswer[],
};

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Profile State Store
 *
 * Manages user profile data including:
 * - Personal information
 * - Contact details
 * - Social links
 * - Survey answers
 */
export const useProfileStore = create<ProfileStore>()(
  process.env.NODE_ENV === "development"
    ? devtools(
        (set, get) => ({
          // Initial state
          profile: defaultProfile,
          isLoading: false,
          error: null,

          fetchProfile: async () => {
            const uid = useAuthStore.getState().uid;
            if (!uid) {
              console.warn("Cannot fetch profile: No authenticated user");
              return;
            }

            set({ isLoading: true, error: null }, false, "profile/fetchStart");

            try {
              const authState = useAuthStore.getState();
              const profile = await fetchProfileData(uid, authState);
              set({ profile, isLoading: false }, false, "profile/fetchSuccess");
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error("Failed to fetch profile");
              set({ error, isLoading: false }, false, "profile/fetchError");
            }
          },

          updateProfile: async (data: Partial<UserProfile>) => {
            const uid = useAuthStore.getState().uid;
            if (!uid) {
              console.warn("Cannot update profile: No authenticated user");
              return;
            }

            set({ isLoading: true, error: null }, false, "profile/updateStart");

            try {
              const currentProfile = get().profile;
              const authState = useAuthStore.getState();
              const updatedProfile = await updateProfileData(
                uid,
                currentProfile,
                data,
                authState
              );
              set(
                { profile: updatedProfile, isLoading: false },
                false,
                "profile/updateSuccess"
              );
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error("Failed to update profile");
              set({ error, isLoading: false }, false, "profile/updateError");
            }
          },

          resetProfile: () => {
            set(
              { profile: defaultProfile, error: null },
              false,
              "profile/reset"
            );
          },

          clearError: () => {
            set({ error: null }, false, "profile/clearError");
          },
        }),
        { name: "profile-store" }
      )
    : (set, get) => ({
        // Initial state
        profile: defaultProfile,
        isLoading: false,
        error: null,

        fetchProfile: async () => {
          const uid = useAuthStore.getState().uid;
          if (!uid) {
            console.warn("Cannot fetch profile: No authenticated user");
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const authState = useAuthStore.getState();
            const profile = await fetchProfileData(uid, authState);
            set({ profile, isLoading: false });
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error("Failed to fetch profile");
            set({ error, isLoading: false });
          }
        },

        updateProfile: async (data: Partial<UserProfile>) => {
          const uid = useAuthStore.getState().uid;
          if (!uid) {
            console.warn("Cannot update profile: No authenticated user");
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const currentProfile = get().profile;
            const authState = useAuthStore.getState();
            const updatedProfile = await updateProfileData(
              uid,
              currentProfile,
              data,
              authState
            );
            set({ profile: updatedProfile, isLoading: false });
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error("Failed to update profile");
            set({ error, isLoading: false });
          }
        },

        resetProfile: () => {
          set({ profile: defaultProfile, error: null });
        },

        clearError: () => {
          set({ error: null });
        },
      })
);

// ============================================================================
// Selectors
// ============================================================================

/** Select the full profile */
export const selectProfile = (state: ProfileStore) => state.profile;

/** Select basic user info from profile */
export const selectProfileUser = (state: ProfileStore) => ({
  displayName: state.profile.displayName,
  firstName: state.profile.firstName,
  lastName: state.profile.lastName,
  email: state.profile.email,
  photoUrl: state.profile.photoUrl,
});

/** Select loading/error state */
export const selectProfileStatus = (state: ProfileStore) => ({
  isLoading: state.isLoading,
  error: state.error,
});

/** Get formatted display name */
export const selectFormattedName = (state: ProfileStore) => {
  const { firstName, lastName, displayName, email } = state.profile;

  if (firstName) {
    return lastName ? `${firstName} ${lastName}` : firstName;
  }

  if (displayName) {
    return displayName;
  }

  return email?.split("@")[0] ?? "User";
};
