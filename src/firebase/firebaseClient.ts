import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

/** True when public Firebase web config is present (false in CI without secrets). */
export const hasClientConfig = Boolean(firebaseConfig.apiKey?.trim());

let app: FirebaseApp | undefined;
let auth: Auth;

if (hasClientConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  // CI gate / SSG without Actions secrets: skip module-level init.
  console.warn(
    "Firebase client config missing (NEXT_PUBLIC_FIREBASE_APIKEY); deferring init"
  );
  auth = null as unknown as Auth;
}

function requireApp(): FirebaseApp {
  if (!app) throw new Error("Firebase client config is missing");
  return app;
}

type FirestoreModule = typeof import("firebase/firestore") & { db: Firestore };
type StorageModule = typeof import("firebase/storage") & { storage: FirebaseStorage };

let firestoreModule: Promise<FirestoreModule> | null = null;
let storageModule: Promise<StorageModule> | null = null;

/**
 * Firestore and Storage load on first use, so pages that never read or write
 * data (the landing page, quick start for guests) don't ship their SDKs.
 */
export function loadFirestore(): Promise<FirestoreModule> {
  firestoreModule ??= import("firebase/firestore")
    .then((sdk) => ({ ...sdk, db: sdk.getFirestore(requireApp()) }))
    .catch((error: unknown) => {
      firestoreModule = null;
      throw error;
    });
  return firestoreModule;
}

export function loadStorage(): Promise<StorageModule> {
  storageModule ??= import("firebase/storage")
    .then((sdk) => ({ ...sdk, storage: sdk.getStorage(requireApp()) }))
    .catch((error: unknown) => {
      storageModule = null;
      throw error;
    });
  return storageModule;
}

export { auth };
