import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Bucket } from "@google-cloud/storage";

let adminBucket: Bucket;
let adminDb: Firestore;
let adminAuth: Auth;

const hasAdminCreds = Boolean(
  process.env.FIREBASE_PROJECT_ID?.trim() &&
    process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
    process.env.FIREBASE_PRIVATE_KEY?.trim()
);

try {
  if (hasAdminCreds) {
    const adminCredentials = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      clientCertsUrl: process.env.FIREBASE_CLIENT_CERTS_URL,
    };

    if (!getApps().length) {
      initializeApp({
        credential: cert(adminCredentials as ServiceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
      });
    }
    adminBucket = getStorage().bucket();
    adminDb = getFirestore();
    adminAuth = getAuth();
  } else {
    console.warn(
      "Firebase admin credentials missing; soft-skipping init for CI/SSG"
    );
    adminBucket = {} as Bucket;
    adminDb = {} as Firestore;
    adminAuth = {} as Auth;
  }
} catch (e) {
  console.warn("Firebase admin init failed:", e);
  adminBucket = {} as Bucket;
  adminDb = {} as Firestore;
  adminAuth = {} as Auth;
}

export { adminBucket, adminDb, adminAuth };
