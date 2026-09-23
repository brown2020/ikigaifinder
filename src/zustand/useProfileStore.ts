import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { withDevtools } from "./middleware";
import { fetchProfileData, updateProfileData } from "@/services/profileService";
import type { UserProfile } from "@/types";

interface ProfileStore {
  profile: UserProfile;
  isLoading: boolean;
  error: Error | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => void;
}

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
  answers: [],
};

const isCurrentUser = (uid: string) => uid === useAuthStore.getState().uid;
const toError = (err: unknown, fallback: string) =>
  err instanceof Error ? err : new Error(fallback);

export const useProfileStore = create<ProfileStore>()(
  withDevtools("profile-store", (set, get) => ({
    profile: defaultProfile,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
      const uid = useAuthStore.getState().uid;
      if (!uid) return;
      set({ isLoading: true, error: null }, false, "profile/fetchStart");
      try {
        const profile = await fetchProfileData(uid, useAuthStore.getState());
        if (!isCurrentUser(uid)) return;
        set({ profile, isLoading: false }, false, "profile/fetchSuccess");
      } catch (err) {
        if (!isCurrentUser(uid)) return;
        set({ error: toError(err, "Failed to fetch profile"), isLoading: false }, false, "profile/fetchError");
      }
    },

    updateProfile: async (data) => {
      const uid = useAuthStore.getState().uid;
      if (!uid) return;
      set({ isLoading: true, error: null }, false, "profile/updateStart");
      try {
        const profile = await updateProfileData(uid, get().profile, data, useAuthStore.getState());
        if (!isCurrentUser(uid)) return;
        set({ profile, isLoading: false }, false, "profile/updateSuccess");
      } catch (err) {
        if (!isCurrentUser(uid)) return;
        set({ error: toError(err, "Failed to update profile"), isLoading: false }, false, "profile/updateError");
      }
    },

    resetProfile: () => set({ profile: defaultProfile, error: null }, false, "profile/reset"),
  }))
);

export const selectFormattedName = (state: ProfileStore): string => {
  const { firstName, lastName, displayName, email } = state.profile;
  if (firstName) return lastName ? `${firstName} ${lastName}` : firstName;
  if (displayName) return displayName;
  return email?.split("@")[0] || "You";
};
