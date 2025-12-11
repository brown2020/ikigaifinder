"use client";

import AuthForm from "./AuthForm";

// ============================================================================
// Types
// ============================================================================

interface LoginFormProps {
  onSuccess: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Login Form Component
 *
 * Wrapper around AuthForm for sign-in functionality.
 * Supports email/password, magic link, and password reset.
 */
export default function LoginForm({
  onSuccess,
}: LoginFormProps): React.ReactElement {
  return <AuthForm mode="signin" onSuccess={onSuccess} />;
}
