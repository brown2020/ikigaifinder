import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/firebaseAdmin";
import { getSessionCookieName } from "./session";

/**
 * Read and verify the Firebase session cookie (server-side).
 * Returns the authenticated user's uid or null.
 */
export async function getOptionalServerUid(): Promise<string | null> {
  const cookieName = getSessionCookieName();
  const sessionCookie = (await cookies()).get(cookieName)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid ?? null;
  } catch {
    return null;
  }
}
