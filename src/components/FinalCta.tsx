"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { useAuthModal } from "@/context/AuthModalContext";

export default function FinalCta() {
  const router = useRouter();
  const { uid } = useAuthStore();
  const { openModal } = useAuthModal();
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
            <button
              className="btn-base btn-white"
              onClick={
                uid
                  ? () => router.push("/ikigai-finder")
                  : openModal
              }
            >
              {uid ? "Open Ikigai Finder" : "Create free account"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
