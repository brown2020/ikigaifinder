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
