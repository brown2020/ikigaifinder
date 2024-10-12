"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";

interface HomeHeroSectionT {
  handleOpenAuthModal: () => void;
}

export default function HomeHeroSection({
    handleOpenAuthModal,
}: HomeHeroSectionT) {
  const router = useRouter();
  const { uid } = useAuthStore();

  return (
    <div className="relative sm:px-10 px-5 min-h-screen-minus-64">
      <div className="absolute inset-0 z-0 animate-fade-in">
        <Image
          src="/assets/hero-gradient.webp"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>

      <div className="relative container mx-auto sm:px-4 sm:py-16 py-10 min-h-screen-minus-64 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-4 items-center">
          <div className="text-black space-y-6 animate-slide-up">
            <h1 className="text-4xl font-bold">
              Find Your Ikigai: The Journey to Meaning and Joy
            </h1>
            <p className="text-xl">
              Embark on a transformative quest with our AI-driven Ikigai Finder!
              Uncover your unique purpose by aligning your passions, talents,
              and the needs of the world. Take the first step towards a life
              filled with fulfillment and happiness your Ikigai is just a click
              away!
            </p>

            <button
              className={
                "px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-6 sm:block hidden"
              }
              onClick={
                uid ? () => router.push("/ikigai-finder") : handleOpenAuthModal
              }
              autoFocus={!!uid}
            >
              {uid ? "Get Started" : "Sign In Your Account"}
            </button>
          </div>

          <div className="animate-fade-in">
            <div className="animate-float">
              <Image
                src="/assets/home-hero.png"
                alt="Hero Image"
                width={500}
                height={500}
                objectFit="cover"
                className="rounded-lg mx-auto"
                unoptimized
              />
            </div>
          </div>
          <button
            className={
              "px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 sm:hidden block w-fit mx-auto"
            }
            onClick={
              uid ? () => router.push("/ikigai-finder") : handleOpenAuthModal
            }
            autoFocus={!!uid}
          >
            {uid ? "Get Started" : "Sign In Your Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
