import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminBucket, adminDb } from "@/firebase/firebaseAdmin";
import { clearSessionCookie } from "@/lib/auth/session";
import { AccountDeletionError, deleteAccountData } from "@/lib/accountDeletion";

export const dynamic = "force-dynamic";
// Accounts with long cover histories need many recursive deletes.
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store" };

/** Deletes the caller's own account and all of its data. The uid comes only from a fresh, non-revoked ID token. */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  let uid: string;
  try {
    if (!token) throw new Error("missing token");
    ({ uid } = await adminAuth.verifyIdToken(token, true));
  } catch {
    return NextResponse.json(
      { error: "Please sign in again, then delete your account." },
      { status: 401, headers: NO_STORE }
    );
  }

  try {
    await deleteAccountData(adminDb, adminBucket, adminAuth, uid);
  } catch (error) {
    const detail = error instanceof AccountDeletionError ? `${error.step}:${error.causeCode}` : "unknown";
    console.error(`Account deletion failed (${detail})`);
    return NextResponse.json(
      { error: "We couldn't finish deleting your account. Anything already removed stays removed. Please try again." },
      { status: 500, headers: NO_STORE }
    );
  }

  const response = NextResponse.json({ deleted: true }, { headers: NO_STORE });
  clearSessionCookie(response);
  return response;
}
