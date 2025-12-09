/**
 * Custom Error Classes
 *
 * Centralized error classes for consistent error handling
 */

// ============================================================================
// Rate Limit Error
// ============================================================================

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends Error {
  public resetIn: number;

  constructor(message: string, resetIn: number) {
    super(message);
    this.name = "RateLimitError";
    this.resetIn = resetIn;
  }
}

// ============================================================================
// Validation Error
// ============================================================================

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ============================================================================
// API Error
// ============================================================================

/**
 * Error thrown when an API call fails
 */
export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

// ============================================================================
// Firebase Error
// ============================================================================

/**
 * Error thrown when a Firebase operation fails
 */
export class FirebaseError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "FirebaseError";
    this.code = code;
  }
}

