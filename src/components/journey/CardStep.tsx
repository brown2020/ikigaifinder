"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ImagePlus, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Input, Textarea } from "@/components/ui/Input";
import IkigaiCard from "@/components/ikigai/IkigaiCard";
import { CARD_STYLES } from "@/constants/questions";
import { DEFAULT_COVER } from "@/constants/ikigai";
import { generateImage } from "@/lib/generateImage";
import { saveGeneratedImageHistory, subscribeToCoverHistory } from "@/services/ikigaiService";
import { captureAndUploadImage } from "@/utils/canvasUtils";
import { containsRestrictedContent } from "@/utils/platform";
import { buildCoverPrompt } from "@/utils/promptUtils";
import { useAuthStore, useIkigaiStore, useProfileStore } from "@/zustand";
import { cn } from "@/utils/cn";
import JourneyProgress from "./JourneyProgress";

const CARD_ELEMENT_ID = "ikigai-card-capture";

export default function CardStep(): React.ReactElement {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const ikigai = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const firstName = useProfileStore((s) => s.profile.firstName ?? "");

  const [scene, setScene] = useState("");
  const [style, setStyle] = useState<string>("");
  const [name, setName] = useState(firstName);
  const [history, setHistory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [today] = useState(() => new Date());

  const background = ikigai.ikigaiImage || DEFAULT_COVER;
  const statement = ikigai.ikigaiSelected?.ikigai ?? "";

  useEffect(() => {
    if (!uid) return;
    return subscribeToCoverHistory(uid, setHistory);
  }, [uid]);

  if (!ikigai.ikigaiSelected) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <Eyebrow>One step back</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold">Choose a statement first</h1>
        <p className="mt-3 text-muted-foreground">Your card is built around the ikigai statement you pick.</p>
        <ButtonLink href="/generate-ikigai" className="mt-8" size="lg">
          See my ideas
        </ButtonLink>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (containsRestrictedContent(scene)) {
      toast.error("That description includes words we can't use. Try rephrasing it.");
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = buildCoverPrompt({ scene, style, statement });
      const result = await generateImage(prompt);
      if (result.error || !result.imageUrl) {
        toast.error(result.error ?? "We couldn't create an image. Please try again.");
        return;
      }
      await updateIkigai({ ikigaiImage: result.imageUrl });
      if (uid) {
        saveGeneratedImageHistory(uid, { style, freestyle: scene }, prompt, result.imageUrl).catch(
          (err) => console.error("Failed to save cover history:", err)
        );
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("We couldn't create an image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    setIsSaving(true);
    try {
      const url = await captureAndUploadImage(uid, CARD_ELEMENT_ID);
      if (!url) throw new Error("capture failed");
      const ok = await updateIkigai({ ikigaiCoverImage: url });
      if (!ok) throw new Error("save failed");
      toast.success("Your ikigai card is saved");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("We couldn't save your card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const backgrounds = Array.from(new Set([...(ikigai.ikigaiImage ? [ikigai.ikigaiImage] : []), ...history, DEFAULT_COVER]));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <JourneyProgress current="card" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className={cn("relative transition-opacity", isGenerating && "opacity-60")}>
            <IkigaiCard id={CARD_ELEMENT_ID} statement={statement} name={name.trim()} date={today} imageUrl={background} priority />
            {isGenerating && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-card/90 px-4 py-2 text-sm font-medium shadow">Painting your background…</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Eyebrow>Your card</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Make it yours</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Generate a background that fits your statement, then save the card to share or download.
          </p>

          <Card className="mt-8 space-y-6 p-5 sm:p-6">
            <Textarea
              id="card-scene"
              label="Describe a background"
              helperText="Optional. Leave blank and we'll paint a scene from your statement."
              placeholder="A quiet workshop at dawn, warm light through tall windows"
              value={scene}
              maxLength={600}
              onChange={(e) => setScene(e.target.value)}
              className="min-h-20"
            />

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Style</legend>
              <div className="flex flex-wrap gap-2">
                {CARD_STYLES.map((s) => {
                  const on = style === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setStyle(on ? "" : s)}
                      className={cn(
                        "h-9 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border-strong bg-card hover:border-primary/60"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleGenerate}
              isLoading={isGenerating}
              loadingText="Creating image…"
              leftIcon={<Wand2 className="size-4" aria-hidden="true" />}
            >
              Generate background
            </Button>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <ImagePlus className="size-4 text-muted-foreground" aria-hidden="true" /> Your backgrounds
              </p>
              <ul className="flex gap-2 overflow-x-auto pb-1">
                {backgrounds.map((url, i) => {
                  const on = url === background;
                  return (
                    <li key={url} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`Use background ${i + 1}`}
                        onClick={() => updateIkigai({ ikigaiImage: url })}
                        className={cn(
                          "relative block size-16 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-card transition focus-visible:outline-none focus-visible:ring-ring",
                          on ? "ring-primary" : "ring-transparent hover:ring-border-strong"
                        )}
                      >
                        <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                        {on && (
                          <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                            <Check className="size-5" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Input
              id="card-name"
              label="Name on card"
              placeholder="Leave blank for “My ikigai”"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
            />
          </Card>

          <div className="mt-6 flex items-center justify-between gap-3">
            <ButtonLink href="/generate-ikigai/report" variant="ghost">
              <ArrowLeft className="size-4" aria-hidden="true" /> Insights
            </ButtonLink>
            <Button size="lg" onClick={handleSave} isLoading={isSaving} loadingText="Saving card…" disabled={isGenerating}>
              Save my card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
