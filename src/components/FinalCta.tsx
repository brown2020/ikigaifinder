"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/zustand";
import { Button } from "@/components/ui/Button";

export default function FinalCta(): React.ReactElement {
  const router = useRouter();
  const uid = useAuthStore((state) => state.uid);
  const openAuthModal = useUIStore((state) => state.openAuthModal);

  const handleClick = useCallback((): void => {
    if (uid) {
      router.push("/ikigai-finder");
    } else {
      openAuthModal("/ikigai-finder");
    }
  }, [uid, router, openAuthModal]);

  return (
    <section className="sm:px-10 px-5 py-12">
      <div className="container mx-auto sm:px-4">
        <div className="relative overflow-hidden rounded-2xl bg-blue-600 text-white p-8">
          <div className="absolute inset-0 opacity-10 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">
                Ready to find your Ikigai?
              </h3>
              <p className="text-blue-50 mt-1">
                Join free and create your card in minutes.
              </p>
            </div>
            <Button
              onClick={handleClick}
              type="button"
              variant="neutral"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              {uid ? "Open Ikigai Finder" : "Create free account"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
