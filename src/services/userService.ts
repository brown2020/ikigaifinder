import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { AuthState } from "@/zustand/useAuthStore";

export async function updateUserDetailsInFirestore(
  details: Partial<AuthState>,
  uid: string
) {
  if (!uid) return;

  const userRef = doc(db, `ikigaiUsers/${uid}`);

  // Filter only serializable fields and exclude transient state
  // We only want to save user profile data, not UI state like authPending
  const { 
    authPending, 
    authReady, 
    ...persistentDetails 
  } = details;

  const serializableDetails = JSON.parse(JSON.stringify(persistentDetails));

  try {
    await setDoc(
      userRef,
      { ...serializableDetails, lastSignIn: serverTimestamp() },
      { merge: true }
    );
    console.log("Auth details updated successfully in Firestore.");
  } catch (error) {
    console.log("Error updating auth details in Firestore:", error);
  }
}

