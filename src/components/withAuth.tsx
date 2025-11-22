import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
  return AuthenticatedComponent;
};

export default withAuth;
