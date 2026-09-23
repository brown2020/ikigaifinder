import type { Metadata } from "next";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "About",
  description:
    "What ikigai means, the four circles behind it, and how Ikigai Finder helps you discover yours.",
};

const circles = [
  {
    label: "What you love",
    color: "bg-love",
    body: "The activities, ideas, and people that give you energy and make time disappear.",
  },
  {
    label: "What you're good at",
    color: "bg-skill",
    body: "Your strengths, whether learned, practiced, or natural: the things others come to you for.",
  },
  {
    label: "What the world needs",
    color: "bg-world",
    body: "The problems you care about and the contribution you want to make to others.",
  },
  {
    label: "What you can be paid for",
    color: "bg-paid",
    body: "Work that people value enough to support, giving your purpose a sustainable footing.",
  },
] as const;

const steps = [
  {
    title: "Reflect",
    body: "Answer a short, guided set of questions for each of the four circles.",
  },
  {
    title: "Discover",
    body: "Our AI reads your answers together and drafts a handful of personal ikigai statements, each scored for passion, mission, vocation, and profession.",
  },
  {
    title: "Share",
    body: "Choose the statement that feels most true, illustrate it with a generated cover image, and share your ikigai card.",
  },
] as const;

export default function About() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <header>
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          A reason for being
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          <span lang="ja">生き甲斐</span> (ikigai) is a Japanese idea that
          translates roughly to &ldquo;a reason for being&rdquo;: the thing
          that gets you up in the morning. Ikigai Finder is a quiet, guided
          space to help you put yours into words.
        </p>
      </header>

      <section className="mt-16" aria-labelledby="four-circles">
        <h2
          id="four-circles"
          className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          The four circles
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Ikigai is often drawn as four overlapping circles. Where all four
          meet is the sweet spot: work and life that feel meaningful,
          skilful, useful, and sustainable at once.
        </p>

        <div className="mt-10 grid items-center gap-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <IkigaiDiagram className="mx-auto max-w-xs sm:max-w-none" showLabels />
          <ul className="space-y-6">
            {circles.map((circle) => (
              <li key={circle.label} className="flex gap-4">
                <span
                  className={`mt-2 size-2.5 shrink-0 rounded-full ${circle.color}`}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {circle.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {circle.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="how-it-works">
        <h2
          id="how-it-works"
          className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          How Ikigai Finder helps
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Powered by OpenAI, Ikigai Finder asks thoughtful questions, looks
          for the threads that connect your answers, and turns them into
          concrete statements you can reflect on, refine, and share.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="font-display text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="why-it-matters">
        <h2
          id="why-it-matters"
          className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Why ikigai matters
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Finding your ikigai can lead to a more fulfilling, balanced, and
          happy life. It can help you navigate career choices, grow
          personally, or simply find more joy in everyday activities. Whether
          you&apos;re at a crossroads, looking to align your work with your
          values, or just curious, Ikigai Finder is here to help.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="our-vision">
        <h2
          id="our-vision"
          className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Our vision
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          We envision a world where people wake up inspired, feel empowered by
          their work, and live with purpose every day. With the help of
          artificial intelligence and a passion for personal development, we
          aim to make the journey of self-discovery accessible to everyone.
        </p>
      </section>

      <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl bg-primary-soft p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ready to begin?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Go at your own pace. There are no wrong answers.
          </p>
        </div>
        <ButtonLink href="/ikigai-finder" className="shrink-0">
          Find your ikigai
        </ButtonLink>
      </div>
    </article>
  );
}
