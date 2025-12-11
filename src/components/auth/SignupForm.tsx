"use client";

import AuthForm from "./AuthForm";

// ============================================================================
// Types
// ============================================================================

interface SignupFormProps {
  onSuccess: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Signup Form Component
 *
 * Wrapper around AuthForm for sign-up functionality.
 * Supports email/password, magic link, and terms acceptance.
 */
export default function SignupForm({
  onSuccess,
}: SignupFormProps): React.ReactElement {
  return <AuthForm mode="signup" onSuccess={onSuccess} />;
}
