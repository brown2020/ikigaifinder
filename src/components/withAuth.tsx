"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/zustand";
import { useContextStore } from "@/zustand/useContextStore";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const { uid } = useAuthStore();
    const { isUserNotExist } = useContextStore();

    useEffect(() => {
      if (!uid && isUserNotExist) {
        router.push("/");
      }
    }, [router, uid, isUserNotExist]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
