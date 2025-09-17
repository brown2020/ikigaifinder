"use client";
import React from "react";
import { ShieldCheck, Zap, Download, Palette } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import DemoImageSlick from "@/components/DemoImageSlick";

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: "Fast & guided",
      description: "Smart prompts lead you to clarity without overwhelm.",
    },
    {
      icon: ShieldCheck,
      title: "Private by default",
      description: "Your data is yours. Export or delete anytime.",
    },
    {
      icon: Download,
      title: "One-click export",
      description: "Save a high-quality image of your Ikigai card.",
    },
    {
      icon: Palette,
      title: "Beautiful visuals",
      description: "Elegant diagram that’s easy to share and revisit.",
    },
  ];

  return (
    <section className="relative sm:px-10 px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
      <div className="container mx-auto sm:px-4 relative">
        <SectionHeader
          title="Why people love it"
          subtitle="Designed to be simple, respectful, and inspiring."
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ul className="space-y-6">
            {features.map((f, i) => (
              <li key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 flex items-center justify-center shrink-0">
                  <f.icon className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{f.title}</h3>
                  <p className="text-gray-700 mt-1">{f.description}</p>
                  <div
                    className="h-1 w-12 rounded-full mt-3"
                    style={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(to right,#3b82f6,#6366f1)"
                          : "linear-gradient(to right,#22c55e,#06b6d4)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="w-full md:ml-auto">
            <div className="w-full max-w-lg md:ml-auto">
              <DemoImageSlick />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
