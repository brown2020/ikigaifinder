import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { ProfileFetchError, ProfileUpdateError } from "@/lib/errors";
import type { UserProfile } from "@/types";
import type { AuthState } from "@/zustand/useAuthStore";

// ============================================================================
// Types
// ============================================================================

interface ProfileDocument {
  profile: UserProfile;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract first name from display name or email
 */
function extractFirstName(authState: AuthState): string {
  const { selectedName, authDisplayName, authEmail } = authState;

  if (selectedName) return selectedName;
  if (authDisplayName) return authDisplayName.split(" ")[0];
  if (authEmail) return authEmail.split("@")[0];
  return "";
}

/**
 * Extract last name from display name
 */
function extractLastName(authDisplayName: string): string {
  const parts = authDisplayName?.split(" ") ?? [];
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

/**
 * Create a default profile from auth state
 */
function createDefaultProfile(authState: AuthState): UserProfile {
  return {
    email: authState.authEmail ?? "",
    contactEmail: authState.authEmail ?? "",
    displayName: authState.authDisplayName ?? "",
    photoUrl: authState.authPhotoUrl ?? "",
    emailVerified: authState.authEmailVerified ?? false,
    firstName: extractFirstName(authState),
    lastName: extractLastName(authState.authDisplayName),
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
}

/**
 * Merge stored profile with auth state
 */
function mergeProfileWithAuth(
  storedProfile: Partial<UserProfile>,
  authState: AuthState
): UserProfile {
  return {
    email: authState.authEmail ?? "",
    contactEmail: storedProfile.contactEmail ?? authState.authEmail ?? "",
    displayName: storedProfile.displayName ?? authState.authDisplayName ?? "",
    photoUrl: storedProfile.photoUrl ?? authState.authPhotoUrl ?? "",
    emailVerified: authState.authEmailVerified ?? false,
    firstName: storedProfile.firstName ?? extractFirstName(authState),
    lastName:
      storedProfile.lastName ?? extractLastName(authState.authDisplayName),
    headerUrl: storedProfile.headerUrl ?? "",
    organization: storedProfile.organization ?? "",
    title: storedProfile.title ?? "",
    bio: storedProfile.bio ?? "",
    interests: storedProfile.interests ?? "",
    location: storedProfile.location ?? "",
    country: storedProfile.country ?? "",
    identifyWith: storedProfile.identifyWith ?? [],
    website: storedProfile.website ?? "",
    linkedin: storedProfile.linkedin ?? "",
    purposeId: storedProfile.purposeId ?? "",
    moonshotId: storedProfile.moonshotId ?? "",
    answers: storedProfile.answers ?? [],
  };
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Fetch user profile from Firestore
 * Creates a new profile if one doesn't exist
 *
 * @param uid - User ID
 * @param authState - Current auth state for profile defaults
 * @returns User profile
 */
export async function fetchProfileData(
  uid: string,
  authState: AuthState
): Promise<UserProfile> {
  if (!uid) {
    throw new Error("User ID is required to fetch profile");
  }

  try {
    const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ProfileDocument;

      if (data.profile) {
        return mergeProfileWithAuth(data.profile, authState);
      }
    }

    // No profile exists - create one
    const newProfile = createDefaultProfile(authState);
    await setDoc(userRef, { profile: newProfile });
    return newProfile;
  } catch (error) {
    throw new ProfileFetchError("Failed to fetch user profile", error);
  }
}

/**
 * Update user profile in Firestore
 *
 * @param uid - User ID
 * @param currentProfile - Current profile data
 * @param updates - Partial profile updates
 * @param authState - Current auth state
 * @returns Updated profile
 */
export async function updateProfileData(
  uid: string,
  currentProfile: UserProfile,
  updates: Partial<UserProfile>,
  authState: AuthState
): Promise<UserProfile> {
  if (!uid) {
    throw new Error("User ID is required to update profile");
  }

  try {
    // Ensure firstName is set
    const firstName =
      updates.firstName ??
      authState.selectedName ??
      currentProfile.firstName ??
      extractFirstName(authState);

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      firstName,
    };

    const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
    await setDoc(userRef, { profile: updatedProfile }, { merge: true });

    return updatedProfile;
  } catch (error) {
    throw new ProfileUpdateError("Failed to update user profile", error);
  }
}

/**
 * Delete user profile from Firestore
 *
 * @param uid - User ID
 */
export async function deleteProfileData(uid: string): Promise<void> {
  if (!uid) {
    throw new Error("User ID is required to delete profile");
  }

  try {
    const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
    await setDoc(userRef, { profile: null, deleted: true }, { merge: true });
  } catch (error) {
    throw new ProfileUpdateError("Failed to delete user profile", error);
  }
}
