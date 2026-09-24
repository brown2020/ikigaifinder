"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useAuthStore } from "@/zustand";

/** Primary call to action that adapts to whether the visitor is signed in. */
export default function StartButton({ className }: { className?: string }) {
  const uid = useAuthStore((s) => s.uid);
  return (
    <ButtonLink href={uid ? "/dashboard" : "/ikigai-finder"} size="lg" className={className}>
      {uid ? "Continue my journey" : "Find my ikigai"}
      <ArrowRight className="size-4" aria-hidden="true" />
    </ButtonLink>
  );
}
