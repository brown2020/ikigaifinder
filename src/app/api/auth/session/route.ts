import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/firebase/firebaseAdmin";
import {
  clearSessionCookie,
  getSessionExpiresInMs,
  setSessionCookie,
} from "@/lib/auth/session";

const CreateSessionSchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const json = await request.json();
    const parsed = CreateSessionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { idToken } = parsed.data;
    // Verify the Firebase ID token first (proof of sign-in).
    await adminAuth.verifyIdToken(idToken);

    const expiresInMs = getSessionExpiresInMs();
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresInMs,
    });

    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, sessionCookie, expiresInMs);
    return response;
  } catch (error) {
    console.error("Failed to create session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}


