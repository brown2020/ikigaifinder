import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/firebase/firebaseAdmin";
import { getOptionalServerUid } from "@/lib/auth/session-server";

const UpdateSharingSchema = z.object({
  userId: z.string().min(1),
  sharable: z.boolean(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const viewerUid = await getOptionalServerUid();
  if (!viewerUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = UpdateSharingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { userId, sharable } = parsed.data;
  if (viewerUid !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const docRef = adminDb
    .collection("ikigaiUsers")
    .doc(userId)
    .collection("ikigai")
    .doc("main");

  await docRef.set({ ikigaiSharableUrl: sharable }, { merge: true });

  return NextResponse.json({ ok: true, ikigaiSharableUrl: sharable });
}
