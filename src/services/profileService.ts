import { loadFirestore } from "@/firebase/firebaseClient";
import { ProfileFetchError, ProfileUpdateError } from "@/lib/errors";
import type { UserProfile } from "@/types";
import { splitPersonName, usablePersonName } from "@/utils/personName";
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
function nameFromAuth(authState: AuthState): { firstName: string; lastName: string } {
  return splitPersonName(usablePersonName(authState.selectedName) || usablePersonName(authState.authDisplayName));
}

/** Keep a saved name. An email address stored in the name field is not a name. */
function keptName(stored: string | undefined, fallback: string): string {
  return usablePersonName(stored) || usablePersonName(fallback);
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
    firstName: nameFromAuth(authState).firstName,
    lastName: nameFromAuth(authState).lastName,
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
    firstName: keptName(storedProfile.firstName, nameFromAuth(authState).firstName),
    lastName: keptName(storedProfile.lastName, nameFromAuth(authState).lastName),
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
    const { db, doc, getDoc, setDoc } = await loadFirestore();
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
    try {
      await setDoc(userRef, { profile: newProfile });
    } catch (writeError) {
      throw new ProfileFetchError(
        "Failed to create new user profile",
        writeError
      );
    }
    return newProfile;
  } catch (error) {
    // Re-throw ProfileFetchError as-is, wrap other errors
    if (error instanceof ProfileFetchError) {
      throw error;
    }
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
    const firstName = keptName(
      updates.firstName ?? currentProfile.firstName,
      nameFromAuth(authState).firstName
    );

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      firstName,
    };

    const { db, doc, setDoc } = await loadFirestore();
    const userRef = doc(db, `ikigaiUsers/${uid}/settings/profile`);
    await setDoc(userRef, { profile: updatedProfile }, { merge: true });

    return updatedProfile;
  } catch (error) {
    throw new ProfileUpdateError("Failed to update user profile", error);
  }
}
