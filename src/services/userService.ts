import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
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

    const userRef = doc(db, `ikigaiUsers/${uid}`);

    // Make serializable (removes undefined values, converts special types)
    const serializableDetails = JSON.parse(JSON.stringify(persistentDetails));

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

/**
 * Mark user as deleted in Firestore
 * 
 * @param uid - User ID
 */
export async function markUserAsDeleted(uid: string): Promise<void> {
  if (!uid) {
    throw new Error("User ID is required to mark user as deleted");
  }

  try {
    const userRef = doc(db, `ikigaiUsers/${uid}`);
    
    await setDoc(
      userRef,
      {
        deleted: true,
        deletedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to mark user as deleted:", error);
    throw new Error("Failed to delete user account");
  }
}

/**
 * Update user's premium status
 * 
 * @param uid - User ID
 * @param isPremium - Whether user has premium subscription
 */
export async function updatePremiumStatus(
  uid: string,
  isPremium: boolean
): Promise<void> {
  if (!uid) {
    throw new Error("User ID is required to update premium status");
  }

  try {
    const userRef = doc(db, `ikigaiUsers/${uid}`);
    
    await setDoc(
      userRef,
      {
        premium: isPremium,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to update premium status:", error);
    throw new Error("Failed to update subscription status");
  }
}
