/**
 * Per-user AI quotas. Production counts in Firestore so every instance shares
 * one window. Unit tests keep the in-memory counter.
 */
import { adminDb } from "@/firebase/firebaseAdmin";

// ============================================================================
// Types
// ============================================================================

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  limit?: number;
  /** Time window in milliseconds */
  windowMs?: number;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Store interval ID for cleanup (allows proper shutdown)
let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;

if (process.env.NODE_ENV === "test" && typeof setInterval !== "undefined" && !cleanupIntervalId) {
  cleanupIntervalId = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.firstRequest > DEFAULT_WINDOW_MS * 2) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Cleanup function to clear the interval (call on server shutdown)
 */
export function cleanupRateLimiter(): void {
  if (cleanupIntervalId) {
    clearInterval(cleanupIntervalId);
    cleanupIntervalId = null;
  }
  rateLimitStore.clear();
}

// ============================================================================
// Rate Limiter
// ============================================================================

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (e.g., user ID or IP)
 * @param options - Rate limit options
 * @returns Object with success status and remaining requests
 * 
 * @example
 * const result = rateLimit(`user:${userId}`, { limit: 5, windowMs: 60000 });
 * if (!result.success) {
 *   throw new Error(`Rate limit exceeded. Try again in ${result.resetIn}ms`);
 * }
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  // Get existing record or create new one
  let record = rateLimitStore.get(identifier);

  // Reset if window has expired
  if (!record || now - record.firstRequest > windowMs) {
    record = { count: 0, firstRequest: now };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);

  // Calculate remaining requests and reset time
  const remaining = Math.max(0, limit - record.count);
  const resetIn = Math.max(0, windowMs - (now - record.firstRequest));

  return {
    success: record.count <= limit,
    remaining,
    resetIn,
  };
}

const AI_LIMIT = { limit: 20, windowMs: 60 * 1000 };
const IMAGE_LIMIT = { limit: 5, windowMs: 60 * 1000 };

export interface RateLimitDb {
  doc(path: string): unknown;
  runTransaction<T>(update: (tx: RateLimitTransaction) => Promise<T>): Promise<T>;
}

interface RateLimitTransaction {
  get(ref: unknown): Promise<{ exists: boolean; data(): { count?: unknown; windowStart?: unknown } | undefined }>;
  set(ref: unknown, data: { count: number; windowStart: number }): void;
}

const KEY = /^[\w:.-]{1,200}$/;

/** Shared window across processes. Fails closed so a store outage cannot skip the quota. */
export async function firestoreRateLimit(
  db: RateLimitDb,
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const denied = { success: false, remaining: 0, resetIn: windowMs };
  if (!KEY.test(identifier)) return denied;
  try {
    return await db.runTransaction(async (tx) => {
      const ref = db.doc(`_rateLimits/${identifier}`);
      const snap = await tx.get(ref);
      const now = Date.now();
      const data = snap.exists ? snap.data() : undefined;
      const windowStart = typeof data?.windowStart === "number" ? data.windowStart : 0;
      const open = windowStart > 0 && now - windowStart <= windowMs;
      const nextWindow = open ? windowStart : now;
      const count = (open && typeof data?.count === "number" ? data.count : 0) + 1;
      tx.set(ref, { count, windowStart: nextWindow });
      return {
        success: count <= limit,
        remaining: Math.max(0, limit - count),
        resetIn: Math.max(0, windowMs - (now - nextWindow)),
      };
    });
  } catch (error) {
    console.error("Rate limit check failed:", error instanceof Error ? error.name : "unknown");
    return denied;
  }
}

async function enforce(identifier: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "test") return rateLimit(identifier, options);
  return firestoreRateLimit(adminDb as unknown as RateLimitDb, identifier, options);
}

/** Rate limit for AI text generation. */
export async function rateLimitAI(userId: string): Promise<RateLimitResult> {
  return enforce(`ai:${userId}`, AI_LIMIT);
}

/** Rate limit for image generation. */
export async function rateLimitImageGen(userId: string): Promise<RateLimitResult> {
  return enforce(`img:${userId}`, IMAGE_LIMIT);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || now - record.firstRequest > windowMs) {
    return { success: true, remaining: limit, resetIn: 0 };
  }

  const remaining = Math.max(0, limit - record.count);
  const resetIn = Math.max(0, windowMs - (now - record.firstRequest));

  return {
    success: record.count < limit,
    remaining,
    resetIn,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or admin overrides
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}









