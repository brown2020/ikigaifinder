import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { AnswerType } from "@/types/question";

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

const useProfileStore = create<ProfileState>((set) => ({
  profile: defaultProfile,

  fetchProfile: async () => {
    console.log("fetchProfile", useAuthStore.getState(), ":>>>>>>>>>>>   useAuthStore.getState()")
    const uid = useAuthStore.getState().uid;

    console.log(uid, "test   uid")
    if (!uid) return;
    try {
      const authEmail = useAuthStore.getState().authEmail;
      const authDisplayName = useAuthStore.getState().authDisplayName;
      const authPhotoUrl = useAuthStore.getState().authPhotoUrl;
      const authEmailVerified = useAuthStore.getState().authEmailVerified;
      const selectedName = useAuthStore.getState().selectedName;
      const authFirstName =
        selectedName || authDisplayName?.split(" ")[0] || "";
      const authLastName = authDisplayName?.split(" ")[1] || "";

      const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().profile) {
        const d = docSnap.data().profile;
        set({
          profile: {
            email: authEmail || "",
            contactEmail: d.contactEmail || authEmail || "",
            displayName: d.displayName || authDisplayName || "",
            photoUrl: d.photoUrl || authPhotoUrl || "",
            emailVerified: authEmailVerified || false,
            firstName: d.firstName || authFirstName || "",
            lastName: d.lastName || authLastName || "",
            headerUrl: d.headerUrl || "",
            organization: d.organization || "",
            title: d.title || "",
            bio: d.bio || "",
            interests: d.interests || "",
            location: d.location || "",
            website: d.website || "",
            linkedin: d.linkedin || "",
            purposeId: d.purposeId || "",
            moonshotId: d.moonshotId || "",
            answers: d.answers || [],
          },
        });
      } else {
        const newProfile = {
          email: authEmail || "",
          contactEmail: authEmail || "",
          displayName: authDisplayName || "",
          photoUrl: authPhotoUrl || "",
          emailVerified: authEmailVerified || false,
          firstName: authFirstName || "",
          lastName: authLastName || "",
          headerUrl: "",
          organization: "",
          title: "",
          bio: "",
          interests: "",
          location: "",
          website: "",
          linkedin: "",
          purposeId: "",
          moonshotId: "",
          answers: [],
        };
        await setDoc(userRef, { profile: newProfile });
        set({ profile: newProfile });
        console.log("Profile created successfully");
      }
    } catch (error) {
      console.error("Error fetching or creating profile:", error);
    }
  },
  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    try {
      const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
      const oldFirstName = useProfileStore.getState().profile.firstName;
      const authDisplayName = useAuthStore.getState().authDisplayName;
      const selectedName = useAuthStore.getState().selectedName;
      const authFirstName =
        newProfile.firstName ||
        selectedName ||
        oldFirstName ||
        authDisplayName?.split(" ")[0] ||
        "";

      const profileFixed = { ...newProfile, firstName: authFirstName };

      set((state) => ({
        profile: { ...state.profile, ...profileFixed },
      }));

      const profileToUpdate = {
        ...profileFixed,
      };

      await setDoc(userRef, { profile: profileToUpdate }, { merge: true });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },
}));

export default useProfileStore;
