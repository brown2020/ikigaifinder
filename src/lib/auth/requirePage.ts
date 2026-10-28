import "server-only";

import { redirect } from "next/navigation";
import { getOptionalServerUid } from "./session-server";

/** Sends anonymous visitors to sign in. `redirectPath` is a hardcoded app path. */
export async function requirePageSession(redirectPath: string): Promise<void> {
  const uid = await getOptionalServerUid();
  if (!uid) redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
}
