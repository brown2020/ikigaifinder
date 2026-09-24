"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import SharePanel from "@/components/share/SharePanel";
import type { IkigaiReport } from "@/types";

interface ShareImagePageProps {
  userId: string;
  isOwner: boolean;
  imageUrl: string | null;
  statement: string | null;
  sharable: boolean;
  keywords: IkigaiReport["keywords"] | null;
}

export default function ShareImagePage({ userId, isOwner, imageUrl, statement, sharable, keywords }: ShareImagePageProps) {
  const [isPublic, setIsPublic] = useState(sharable);

  if (!imageUrl) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <Lock className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold">
          {isOwner ? "You haven't made a card yet" : "This ikigai is private"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isOwner
            ? "Finish your journey to create a card you can share."
            : "Its owner hasn't shared it publicly. You can still discover your own."}
        </p>
        <ButtonLink href={isOwner ? "/dashboard" : "/ikigai-finder/quick"} size="lg" className="mt-8">
          {isOwner ? "Go to my ikigai" : "Find my ikigai"}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-[0_24px_60px_-30px_rgba(31,26,23,0.45)]">
          <Image src={imageUrl} alt={statement ? `Ikigai card: ${statement}` : "Ikigai card"} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" priority />
        </div>

        <div>
          {isOwner ? (
            <>
              <Eyebrow>{isPublic ? "Your public page" : "Only you can see this"}</Eyebrow>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">This is how others see your card</h1>
              <SharePanel className="mt-8" userId={userId} coverImage={imageUrl} initialSharable={sharable} onSharableChange={setIsPublic} />
            </>
          ) : (
            <>
              <Eyebrow>生き甲斐 · ikigai</Eyebrow>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {statement ?? "Someone found their reason for being."}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Ikigai is where what you love, what you&apos;re good at, what the world needs, and what you can be paid for overlap. Answer four quick questions and see yours in about two minutes.
              </p>
              <ButtonLink href="/ikigai-finder/quick" size="lg" className="mt-8">
                Find my ikigai
              </ButtonLink>
              <p className="mt-3 text-sm text-muted-foreground">Free · no sign-up to start</p>
              <IkigaiDiagram className="mt-10 max-w-[300px]" words={keywords ?? undefined} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
