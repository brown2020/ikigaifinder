"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/zustand";

const withAuth =  <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const { uid } = useAuthStore();
    useEffect(() => {
      setTimeout(() => {
        if (!uid) {
          router.push("/");
        }
      }, 300);
    }, [router, uid]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;


