"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

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
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
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

  handleGoHome = (): void => {
    window.location.href = "/";
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
    });
  };

  renderErrorDetails(): ReactNode {
    const { error, errorInfo, showDetails } = this.state;

    // Never show details in production
    if (IS_PRODUCTION) {
      return (
        <p className="text-sm text-gray-500 mt-4">
          Error ID: {Date.now().toString(36).toUpperCase()}
        </p>
      );
    }

    if (!showDetails) {
      return (
        <button
          type="button"
          onClick={this.handleToggleDetails}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
        >
          <Bug size={16} />
          Show technical details
        </button>
      );
    }

    return (
      <div className="mt-6 text-left">
        <button
          type="button"
          onClick={this.handleToggleDetails}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
        >
          <Bug size={16} />
          Hide technical details
        </button>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-64 text-sm font-mono">
          <p className="text-red-400 font-semibold mb-2">
            {error?.name}: {error?.message}
          </p>
          {error?.stack && (
            <pre className="text-gray-400 whitespace-pre-wrap text-xs">
              {error.stack}
            </pre>
          )}
          {errorInfo?.componentStack && (
            <>
              <p className="text-yellow-400 font-semibold mt-4 mb-2">
                Component Stack:
              </p>
              <pre className="text-gray-400 whitespace-pre-wrap text-xs">
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

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            {IS_PRODUCTION
              ? "We're sorry, but something unexpected happened. Please try again or return to the home page."
              : "An error occurred while rendering this page. Check the console for more details."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home size={18} />
              Go Home
            </button>
          </div>

          {/* Error Details (dev only) */}
          {this.renderErrorDetails()}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
