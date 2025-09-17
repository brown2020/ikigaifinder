"use client";
import React from "react";
import { Brain, ListChecks, Share2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: "Answer a few prompts",
      description:
        "Tell us what you love, excel at, and care about. It takes ~3 minutes.",
    },
    {
      icon: ListChecks,
      title: "AI suggests intersections",
      description:
        "We analyze your inputs across the four areas and propose ideas where they overlap.",
    },
    {
      icon: Share2,
      title: "Create your statement card",
      description:
        "Craft an inspiring statement, generate a background image, and export a beautiful shareable card.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative sm:px-10 px-5 py-12 bg-gradient-to-b from-blue-50/60 to-white"
    >
      <div className="container mx-auto sm:px-4">
        <SectionHeader
          title="How it works"
          subtitle="Three simple steps to clarity and momentum."
        />
        <ol className="relative mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <li key={step.title} className="group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 flex items-center justify-center">
                  <step.icon className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Step {idx + 1}</span>
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="text-gray-700 mt-1">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
