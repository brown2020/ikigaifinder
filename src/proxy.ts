import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/privacy-policy",
  "/terms-conditions",
  "/support",
  "/loginfinish",
  "/logout",
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

/**
 * Get the cookie name from environment or use default
 */
function getAuthCookieName(): string {
  return process.env.NEXT_PUBLIC_COOKIE_NAME ?? "authToken";
}

/**
 * Next.js 16 Proxy function for route protection
 * 
 * This runs on the Node.js runtime and handles:
 * - Authentication checks via cookie presence
 * - Route protection for authenticated-only pages
 * - Redirects for unauthenticated users
 */
export default async function proxy(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;
  const cookieName = getAuthCookieName();
  const authToken = request.cookies.get(cookieName)?.value;
  const isAuthenticated = Boolean(authToken);

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

  // Protected route without authentication - redirect to home
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
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

