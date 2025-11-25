"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/zustand";

export default function HomeHeroSection(): React.ReactElement {
  const router = useRouter();
  const uid = useAuthStore((state) => state.uid);
  const openAuthModal = useUIStore((state) => state.openAuthModal);

  const handleGetStarted = useCallback((): void => {
    if (uid) {
      router.push("/ikigai-finder");
    } else {
      openAuthModal("/ikigai-finder");
    }
  }, [uid, router, openAuthModal]);

  const handleScrollHowItWorks = useCallback((): void => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="relative sm:px-10 px-5 min-h-screen-minus-64">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 animate-fade-in">
        <Image
          src="/assets/hero-gradient.webp"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          className="opacity-20"
          priority
        />
      </div>

      <div className="relative container mx-auto sm:px-4 sm:py-16 py-10 min-h-screen-minus-64 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-4 items-center">
          {/* Left column - Text content */}
          <div className="text-black space-y-6 animate-slide-up">
            <h1 className="text-4xl font-bold">Discover Your Ikigai</h1>
            <p className="text-xl">
              Align what you love, what you&apos;re great at, and what the world
              needs. Create an inspiring, shareable Ikigai card in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <span className="px-3 py-1 rounded-full bg-white/70">
                AI-guided
              </span>
              <span className="px-3 py-1 rounded-full bg-white/70">
                Takes ~3 minutes
              </span>
              <span className="px-3 py-1 rounded-full bg-white/70">
                Private by default
              </span>
            </div>

            {/* Desktop buttons */}
            <div className="mt-6 hidden sm:flex items-center gap-3">
              <button
                className="btn-base btn-primary-solid"
                onClick={handleGetStarted}
                type="button"
              >
                {uid ? "Get started" : "Sign in to get started"}
              </button>
              <button
                className="btn-base btn-neutral-solid"
                onClick={handleScrollHowItWorks}
                type="button"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Right column - Hero image */}
          <div className="animate-fade-in">
            <div className="animate-float">
              <Image
                src="/assets/home-hero.png"
                alt="Ikigai Finder Preview"
                width={500}
                height={500}
                style={{ objectFit: "cover" }}
                className="rounded-lg mx-auto"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="sm:hidden flex flex-col items-center gap-3 w-full">
            <button
              className="btn-base btn-primary-solid w-fit"
              onClick={handleGetStarted}
              type="button"
            >
              {uid ? "Get started" : "Sign in to get started"}
            </button>
            <button
              className="btn-base btn-neutral-solid w-fit"
              onClick={handleScrollHowItWorks}
              type="button"
            >
              See how it works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
