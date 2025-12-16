/**
 * Simple in-memory rate limiter for server actions
 * 
 * Note: In production with multiple server instances,
 * consider using Redis or a distributed rate limiter.
 */

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

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.firstRequest > DEFAULT_WINDOW_MS * 2) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
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

/**
 * Rate limit for AI generation endpoints
 * More restrictive limits to prevent abuse
 */
export function rateLimitAI(userId: string): RateLimitResult {
  return rateLimit(`ai:${userId}`, {
    limit: 20, // 20 AI generations per minute
    windowMs: 60 * 1000,
  });
}

/**
 * Rate limit for image generation endpoints
 * Very restrictive as image generation is expensive
 */
export function rateLimitImageGen(userId: string): RateLimitResult {
  return rateLimit(`img:${userId}`, {
    limit: 5, // 5 image generations per minute
    windowMs: 60 * 1000,
  });
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






