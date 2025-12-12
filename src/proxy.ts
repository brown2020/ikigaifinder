import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";
import { getSessionCookieName } from "@/lib/auth/session";

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/generate-ikigai",
  "/ikigai-finder",
  "/profile",
  "/ikigai",
] as const;

/**
 * API routes that should bypass auth checks
 */
const API_ROUTES = ["/api"] as const;

/**
 * Check if the given pathname matches any of the protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if the given pathname is an API route
 */
function isApiRoute(pathname: string): boolean {
  return API_ROUTES.some((route) => pathname.startsWith(route));
}

async function hasValidSessionCookie(request: NextRequest): Promise<boolean> {
  const cookieName = getSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  if (!sessionCookie) return false;

  try {
    // Verify and check revocation. This is slightly slower but correct for security gates.
    await adminAuth.verifySessionCookie(sessionCookie, true);
    return true;
  } catch {
    return false;
  }
}

/**
 * Next.js 16 Proxy function for route protection
 *
 * This runs on the Node.js runtime and handles:
 * - Authentication checks via cookie presence
 * - Route protection for authenticated-only pages
 * - Redirects for unauthenticated users
 */
export default async function proxy(
  request: NextRequest
): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;

  // Skip auth check for API routes
  if (isApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Skip auth check for static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Only pay the verification cost for protected routes.
  if (isProtectedRoute(pathname)) {
    const isAuthenticated = await hasValidSessionCookie(request);

    // Protected route without authentication - redirect to home
    if (!isAuthenticated) {
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Configure which routes this proxy should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
