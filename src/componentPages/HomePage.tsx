"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthComponent from "@/components/AuthComponent";
import { useAuthStore } from "@/zustand/useAuthStore";

export default function HomePage() {
  const router = useRouter();
  const { uid } = useAuthStore();
 
  return (
    <div className="h-full relative">
      <Image
        src="/assets/bg_image.webp"
        alt="Ikigai Finder"
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute top-0 left-0 -z-20 brightness-50"
      />
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="flex flex-col z-10 gap-5 px-4 py-4 md:px-9 md:py-9 text-center max-w-4xl bg-black/50 rounded-lg text-white">
          <h2 className="text-3xl md:text-5xl font-semibold ">
            Embark on a Journey to Discover Your Ikigai: Uniting Passion,
            Purpose, and Profession for a Fulfilling Life
          </h2>

          <h2 className="text-xl md:text-2xl md:px-9">
            Join us on a journey to discover your unique ikigai, where your
            passions, strengths, and values align to create a fulfilling life
            filled with purpose and joy.
          </h2>
          {uid ? (
            <button
              autoFocus
              className="btn-white mx-auto"
              onClick={() => {
                router.push("ikigai-finder");
              }}
            >
              Get Started
            </button>
          ) : (
            <AuthComponent />
          )}
        </div>
      </div>
    </div>
  );
}
