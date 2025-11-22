import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { ProfileType } from "@/zustand/useProfileStore";
import { AuthState } from "@/zustand/useAuthStore";

export const fetchProfileData = async (uid: string, authState: AuthState): Promise<ProfileType> => {
  const { 
    authEmail, 
    authDisplayName, 
    authPhotoUrl, 
    authEmailVerified, 
    selectedName 
  } = authState;
  
  const authFirstName = selectedName || authDisplayName?.split(" ")[0] || "";
  const authLastName = authDisplayName?.split(" ")[1] || "";

  const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists() && docSnap.data().profile) {
    const d = docSnap.data().profile;
    return {
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
      country: d.country || "", // Added field that was missing in destructuring but present in type
      identifyWith: d.identifyWith || [], // Added field
      website: d.website || "",
      linkedin: d.linkedin || "",
      purposeId: d.purposeId || "",
      moonshotId: d.moonshotId || "",
      answers: d.answers || [],
    };
  } else {
    const newProfile: ProfileType = {
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
    return newProfile;
  }
};

export const updateProfileData = async (
  uid: string, 
  currentProfile: ProfileType, 
  newProfile: Partial<ProfileType>,
  authState: AuthState
): Promise<ProfileType> => {
  const { authDisplayName, selectedName } = authState;
  const oldFirstName = currentProfile.firstName;
  
  const authFirstName =
    newProfile.firstName ||
    selectedName ||
    oldFirstName ||
    authDisplayName?.split(" ")[0] ||
    "";

  const profileFixed = { ...newProfile, firstName: authFirstName };
  
  // Merge with current profile to get full object for return
  const updatedProfile = { ...currentProfile, ...profileFixed };

  const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
  await setDoc(userRef, { profile: updatedProfile }, { merge: true });
  
  return updatedProfile;
};

