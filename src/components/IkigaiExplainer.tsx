"use client";

import React, { useCallback } from "react";
import { Heart, Medal, PencilRuler, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/zustand";

// ============================================================================
// Constants
// ============================================================================

const IKIGAI_ITEMS = [
  {
    icon: Heart,
    label: "What you love",
    color: "#fe7288",
    bullets: [
      "Energizing hobbies",
      "Topics you can't stop exploring",
      "Moments of joy",
    ],
  },
  {
    icon: Medal,
    label: "What you're good at",
    color: "#6187c5",
    bullets: [
      "Natural talents",
      "Skills others notice",
      "Repeatable strengths",
    ],
  },
  {
    icon: PencilRuler,
    label: "What you can be paid for",
    color: "#68cac7",
    bullets: ["Market demand", "Valuable services", "Sustainable income"],
  },
  {
    icon: Rocket,
    label: "What the world needs",
    color: "#f9c93e",
    bullets: [
      "Meaningful problems",
      "Communities you care about",
      "Positive impact",
    ],
  },
] as const;

// ============================================================================
// Component
// ============================================================================

export default function IkigaiExplainer(): React.ReactElement {
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
    <section className="relative sm:px-10 px-5 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto sm:px-4 relative space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold">What is Ikigai?</h2>
          <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
            Ikigai is the intersection of passion, skill, value, and impact.
            Finding yours helps you make confident decisions and move with
            purpose.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {IKIGAI_ITEMS.map((item) => (
            <IkigaiCard key={item.label} item={item} />
          ))}
        </div>

        {/* CTA button */}
        <div className="pt-2">
          <button
            className="btn-base btn-primary-solid"
            onClick={handleClick}
            type="button"
          >
            {uid ? "Create your card" : "Sign in to create your card"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface IkigaiCardProps {
  item: (typeof IKIGAI_ITEMS)[number];
}

function IkigaiCard({ item }: IkigaiCardProps): React.ReactElement {
  const IconComponent = item.icon;

  return (
    <div className="rounded-2xl p-5 shadow-sm ring-1 ring-black/5 bg-gradient-to-br from-white to-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${item.color}22` }}
        >
          <IconComponent style={{ color: item.color }} size={20} />
        </div>
        <h3 className="text-lg font-medium">{item.label}</h3>
      </div>

      <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
        {item.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div
        className="h-1 w-12 rounded-full mt-4"
        style={{
          background: `linear-gradient(to right, ${item.color}, rgba(0,0,0,0))`,
        }}
      />
    </div>
  );
}
