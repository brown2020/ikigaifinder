"use client";

import { useEffect, useRef, useState } from "react";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import IkigaiCard, { type CardFormat } from "@/components/ikigai/IkigaiCard";
import { safeHtml2Canvas } from "@/utils/canvasUtils";
import { cn } from "@/utils/cn";

const FORMATS: { format: Exclude<CardFormat, "square">; label: string; width: number; render: number; icon: typeof RectangleVertical }[] = [
  { format: "story", label: "Story (9:16)", width: 1080, render: 360, icon: RectangleVertical },
  { format: "wide", label: "LinkedIn (1.91:1)", width: 1200, render: 600, icon: RectangleHorizontal },
];

interface CardFormatDownloadsProps {
  statement: string;
  name?: string;
  imageUrl?: string;
  className?: string;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined))));
}

/**
 * Renders the card in other aspect ratios off to the side of the page and
 * downloads it, so people can post to Stories or LinkedIn without cropping.
 */
export default function CardFormatDownloads({ statement, name, imageUrl, className }: CardFormatDownloadsProps) {
  const [pending, setPending] = useState<(typeof FORMATS)[number] | null>(null);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending) return;
    let cancelled = false;
    (async () => {
      try {
        const card = holder.current?.firstElementChild as HTMLElement | null;
        if (!card) throw new Error("card not rendered");
        await waitForImages(card);
        const canvas = await safeHtml2Canvas(card, { scale: pending.width / card.offsetWidth });
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob || cancelled) return;
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `my-ikigai-${pending.format}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(href);
      } catch (error) {
        console.error("Card format download failed:", error);
        toast.error("We couldn't prepare that size. Please try again.");
      } finally {
        if (!cancelled) setPending(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pending]);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {FORMATS.map((f) => (
        <Button
          key={f.format}
          size="sm"
          variant="neutral"
          onClick={() => setPending(f)}
          disabled={Boolean(pending)}
          isLoading={pending?.format === f.format}
          loadingText="Preparing…"
          leftIcon={<f.icon className="size-4" aria-hidden="true" />}
        >
          {f.label}
        </Button>
      ))}
      {pending && (
        <div
          ref={holder}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 -z-50"
          style={{ width: pending.render }}
        >
          <IkigaiCard format={pending.format} statement={statement} name={name} date={new Date()} imageUrl={imageUrl} priority />
        </div>
      )}
    </div>
  );
}
