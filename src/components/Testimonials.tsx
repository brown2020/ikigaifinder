import React from "react";
import { Container } from "@/components/ui";

const testimonials = [
  {
    quote: "I had been stuck for months. This made my next steps feel obvious.",
    name: "Alex R.",
  },
  {
    quote: "The visual map helped me communicate my goals to my mentor.",
    name: "Priya K.",
  },
  {
    quote:
      "Simple, beautiful, and respectful of privacy. Exactly what I wanted.",
    name: "Marcus L.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
      <Container className="relative">
        <h2 className="text-3xl font-semibold text-center">
          Loved by purposeful people
        </h2>
        <ul className="mt-8 max-w-4xl mx-auto space-y-8">
          {testimonials.map((t, i) => (
            <li key={t.name} className="relative pl-6">
              <div
                className="absolute left-0 top-1 w-1 h-16 rounded-full"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(to bottom,#f59e0b,#ef4444)"
                      : "linear-gradient(to bottom,#06b6d4,#3b82f6)",
                }}
              />
              <blockquote className="text-foreground text-lg leading-relaxed">
                “{t.quote}”
              </blockquote>
              <div className="text-sm text-muted-foreground mt-2">
                — {t.name}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
