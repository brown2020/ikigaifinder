import { create } from "zustand";
import { useAuthStore } from "@/zustand/useAuthStore";
import { AnswerType } from "@/types/question";
import { fetchProfileData, updateProfileData } from "@/services/profileService";

export type ProfileType = {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  headerUrl?: string;
  organization?: string;
  title?: string;
  bio?: string;
  interests?: string;
  location?: string;
  country?: string;
  identifyWith?: string[];
  website?: string;
  linkedin?: string;
  purposeId?: string;
  moonshotId?: string;
  answers: AnswerType[];
};

interface ProfileState {
  profile: ProfileType;
  ikigaiLoading: boolean;
  fetchProfile: () => void;
  updateProfile: (newProfile: Partial<ProfileType>) => void;
}

const defaultProfile: ProfileType = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  emailVerified: false,
  answers: [],
};

const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  ikigaiLoading: false,

  fetchProfile: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;
    try {
      // Pass current auth state to service
      const profile = await fetchProfileData(uid, useAuthStore.getState());
      set({ profile });
    } catch (error) {
      console.log("Error fetching or creating profile:", error);
    }
  },
  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    try {
      const currentProfile = get().profile;
      const updatedProfile = await updateProfileData(
        uid, 
        currentProfile, 
        newProfile, 
        useAuthStore.getState()
      );

      set({ profile: updatedProfile });
      console.log("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  },
}));

export default useProfileStore;
