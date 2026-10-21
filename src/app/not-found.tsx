import type { Metadata } from "next";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-xl grow flex-col items-center justify-center px-5 py-20 text-center">
      <IkigaiDiagram className="w-40 opacity-80" centerActive={false} />
      <Eyebrow className="mt-8">404</Eyebrow>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This page has wandered off. Check the address, or head back and keep looking for your reason for being.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="neutral" size="lg">
          Go home
        </ButtonLink>
        <ButtonLink href="/ikigai-finder/quick" size="lg">
          Find your ikigai
        </ButtonLink>
      </div>
    </div>
  );
}
