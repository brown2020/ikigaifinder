/**
 * Custom Error Classes
 *
 * Centralized error classes for consistent error handling across the application.
 * All custom errors extend from base classes for easier catching and handling.
 */

// ============================================================================
// Base Service Error
// ============================================================================

/**
 * Base error class for service-level errors
 * Provides consistent error structure with optional cause chaining
 */
export class ServiceError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ============================================================================
// Rate Limit Error
// ============================================================================

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends ServiceError {
  public readonly resetIn: number;

  constructor(message: string, resetIn: number) {
    super(message);
    this.resetIn = resetIn;
  }
}

// ============================================================================
// Validation Error
// ============================================================================

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends ServiceError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

// ============================================================================
// API Error
// ============================================================================

/**
 * Error thrown when an API call fails
 */
export class APIError extends ServiceError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500, cause?: unknown) {
    super(message, cause);
    this.statusCode = statusCode;
  }
}

// ============================================================================
// Firebase Error
// ============================================================================

/**
 * Error thrown when a Firebase operation fails
 */
export class FirebaseError extends ServiceError {
  public readonly code: string;

  constructor(message: string, code: string, cause?: unknown) {
    super(message, cause);
    this.code = code;
  }
}

// ============================================================================
// Profile Errors
// ============================================================================

/**
 * Error thrown when fetching profile data fails
 */
export class ProfileFetchError extends ServiceError {
  constructor(
    message: string = "Failed to fetch user profile",
    cause?: unknown
  ) {
    super(message, cause);
  }
}

/**
 * Error thrown when updating profile data fails
 */
export class ProfileUpdateError extends ServiceError {
  constructor(
    message: string = "Failed to update user profile",
    cause?: unknown
  ) {
    super(message, cause);
  }
}

// ============================================================================
// Ikigai Errors
// ============================================================================

/**
 * Error thrown when ikigai data is not found
 */
export class IkigaiNotFoundError extends ServiceError {
  constructor(uid: string) {
    super(`Ikigai data not found for user: ${uid}`);
  }
}

/**
 * Error thrown when updating ikigai data fails
 */
export class IkigaiUpdateError extends ServiceError {
  constructor(
    message: string = "Failed to update ikigai data",
    cause?: unknown
  ) {
    super(message, cause);
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if an error is a ServiceError
 */
export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Check if an error is an API error
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
