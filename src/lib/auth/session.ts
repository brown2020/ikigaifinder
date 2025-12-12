import { NextResponse } from "next/server";

export const DEFAULT_SESSION_COOKIE_NAME = "__session";
export const DEFAULT_SESSION_EXPIRES_DAYS = 5;

export function getSessionCookieName(): string {
  // Server-only: do not use NEXT_PUBLIC_* for auth cookies.
  return process.env.FIREBASE_SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE_NAME;
}

export function getSessionExpiresInMs(): number {
  const daysRaw = process.env.FIREBASE_SESSION_EXPIRES_DAYS;
  const days = daysRaw ? Number.parseInt(daysRaw, 10) : DEFAULT_SESSION_EXPIRES_DAYS;
  const safeDays = Number.isFinite(days) && days > 0 ? days : DEFAULT_SESSION_EXPIRES_DAYS;
  return safeDays * 24 * 60 * 60 * 1000;
}

export function setSessionCookie(
  response: NextResponse,
  sessionCookie: string,
  expiresInMs: number
): void {
  response.cookies.set(getSessionCookieName(), sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(expiresInMs / 1000),
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}


