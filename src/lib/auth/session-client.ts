"use client";

import { z } from "zod";

const CreateSessionResponseSchema = z.object({
  ok: z.boolean(),
});

export async function createServerSession(idToken: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create session (${response.status})`);
  }

  const json = await response.json();
  const parsed = CreateSessionResponseSchema.safeParse(json);
  if (!parsed.success || !parsed.data.ok) {
    throw new Error("Failed to create session");
  }
}

export async function clearServerSession(): Promise<void> {
  const response = await fetch("/api/auth/session", { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to clear session (${response.status})`);
  }
}


