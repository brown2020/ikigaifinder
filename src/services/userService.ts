import { auth, loadFirestore } from "@/firebase/firebaseClient";
import type { AuthState } from "@/zustand/useAuthStore";

// ============================================================================
// Types
// ============================================================================

/**
 * Fields that should not be persisted to Firestore
 */
const TRANSIENT_FIELDS: (keyof AuthState)[] = ["authPending", "authReady"];

/**
 * User details that are safe to persist
 */
type PersistableAuthDetails = Omit<Partial<AuthState>, "authPending" | "authReady">;

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Update user details in Firestore
 * 
 * Filters out transient state fields and persists the rest
 * to the user's document in Firestore.
 * 
 * @param details - Partial auth state to persist
 * @param uid - User ID
 */
export async function updateUserDetailsInFirestore(
  details: Partial<AuthState>,
  uid: string
): Promise<void> {
  if (!uid) {
    console.warn("Cannot update user details: No user ID provided");
    return;
  }

  try {
    // Filter out transient fields
    const persistentDetails = filterTransientFields(details);

    // Don't make an API call if there's nothing to persist
    if (Object.keys(persistentDetails).length === 0) {
      return;
    }

    const { db, doc, setDoc, serverTimestamp } = await loadFirestore();
    // The SDK loads lazily; if the person signed out (or deleted their account) meanwhile, don't write for them.
    if (auth?.currentUser?.uid !== uid) return;
    const userRef = doc(db, `ikigaiUsers/${uid}`);

    // Make serializable (removes undefined values, converts special types)
    const serializableDetails = structuredClone(persistentDetails);

    await setDoc(
      userRef,
      {
        ...serializableDetails,
        lastSignIn: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    // Log but don't throw - this is a background operation
    console.error("Failed to update user details in Firestore:", error);
  }
}

/**
 * Filter out transient fields from auth details
 */
function filterTransientFields(details: Partial<AuthState>): PersistableAuthDetails {
  const filtered = { ...details };

  for (const field of TRANSIENT_FIELDS) {
    delete filtered[field];
  }

  return filtered;
}
