"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  errorId: string;
}

// ============================================================================
// Constants
// ============================================================================

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ============================================================================
// Component
// ============================================================================

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays
 * a user-friendly fallback UI instead of crashing the app.
 * 
 * In production, error details are hidden for security.
 * In development, full error information is shown for debugging.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const digest = error.message
      .split("")
      .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
      .toString(36)
      .toUpperCase();
    return { hasError: true, error, errorId: `E${digest}` };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Call optional error callback (for error reporting services)
    this.props.onError?.(error, errorInfo);

    // Log error in development
    if (!IS_PRODUCTION) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you could send to error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleToggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: "",
    });
  };

  renderErrorDetails(): ReactNode {
    const { error, errorInfo, showDetails, errorId } = this.state;

    // Never show details in production
    if (IS_PRODUCTION) {
      return (
        <p className="mt-6 text-xs text-muted-foreground">
          Error ID: <code className="font-mono">{errorId || "UNKNOWN"}</code>
        </p>
      );
    }

    const toggleClasses =
      "inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    if (!showDetails) {
      return (
        <button
          type="button"
          onClick={this.handleToggleDetails}
          aria-expanded={false}
          className={`${toggleClasses} mt-6`}
        >
          <Bug className="size-4" aria-hidden="true" />
          Show technical details
        </button>
      );
    }

    return (
      <div className="mt-6 text-left">
        <button
          type="button"
          onClick={this.handleToggleDetails}
          aria-expanded={true}
          className={`${toggleClasses} mb-2`}
        >
          <Bug className="size-4" aria-hidden="true" />
          Hide technical details
        </button>
        <div className="max-h-64 overflow-auto rounded-xl border border-border bg-muted p-4 font-mono text-sm text-foreground">
          <p className="mb-2 font-semibold text-destructive">
            {error?.name}: {error?.message}
          </p>
          {error?.stack && (
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
              {error.stack}
            </pre>
          )}
          {errorInfo?.componentStack && (
            <>
              <p className="mb-2 mt-4 font-semibold text-foreground">
                Component stack:
              </p>
              <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                {errorInfo.componentStack}
              </pre>
            </>
          )}
        </div>
      </div>
    );
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-5">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[0_1px_2px_rgba(31,26,23,0.04),0_8px_24px_-12px_rgba(31,26,23,0.12)] sm:p-10"
        >
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-destructive-soft text-destructive">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 text-muted-foreground">
            {IS_PRODUCTION
              ? "We're sorry, but something unexpected happened. Please try again or return to the home page."
              : "An error occurred while rendering this page. Check the console for more details."}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleRetry}
              className={buttonClasses({ variant: "primary" })}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
            {/* The boundary lives in the root layout, so reset it alongside navigating. */}
            <Link
              href="/"
              onClick={this.handleRetry}
              className={buttonClasses({ variant: "neutral" })}
            >
              <Home className="size-4" aria-hidden="true" />
              Go home
            </Link>
          </div>

          {this.renderErrorDetails()}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
