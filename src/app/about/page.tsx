import type { Metadata } from "next";
import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";

const DESCRIPTION =
  "What ikigai means, the four circles behind it, how Ikigai Finder helps you put yours into words, and answers to common questions.";

export const metadata: Metadata = {
  title: "About ikigai and Ikigai Finder",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ikigai and Ikigai Finder",
    description: DESCRIPTION,
    url: "/about",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is ikigai?",
    answer:
      "Ikigai (生き甲斐) is a Japanese idea that roughly means \"a reason for being\". It is often drawn as four overlapping circles: what you love, what you're good at, what the world needs, and what you can be paid for. Your ikigai sits where all four meet.",
  },
  {
    question: "Is Ikigai Finder free?",
    answer: "Yes. Answering the questions, getting ideas, your insights report, and your card are all free.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Not to start. You can answer every question without signing up, and your answers stay on your device. Create a free account when you want to see your ideas; your answers come with you.",
  },
  {
    question: "How long does it take?",
    answer:
      "The quick start is four questions, one per circle, and gives you first ideas in about two minutes. The full reflection has sixteen questions and takes about ten minutes. You can start quick and go deeper later.",
  },
  {
    question: "Who can see my answers?",
    answer:
      "Only you. Your answers and insights report are private to your account. Sharing is off until you turn it on, and even then your public page shows only your card, your statement, and the words on your ikigai map, never your answers.",
  },
  {
    question: "How is AI used?",
    answer:
      "OpenAI models read your answers and draft ikigai statements and your insights report. An image model paints the background for your card. You choose which statement to keep and can rewrite it in your own words.",
  },
  {
    question: "Can I change my ikigai later?",
    answer:
      "Yes. Revisit your answers or explore new ideas any time. Your dashboard keeps your past statements and invites a check-in every three months so you can see how your ikigai changes.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
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
    body: "Answer four quick questions, one per circle, or take the full reflection. If you get stuck, written questions offer prompts to start from.",
  },
  {
    title: "Choose",
    body: "AI drafts personal ikigai statements from your words, each scored for passion, mission, vocation, and profession. Shortlist, compare, and pick one.",
  },
  {
    title: "Understand",
    body: "A short report shows why your statement fits, where to grow, and three first steps you can try as a 7-day experiment.",
  },
  {
    title: "Keep it close",
    body: "Turn your statement into a card with a background painted for it. Download it, or share a link when you're ready.",
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
          Ikigai Finder asks honest questions, looks for the threads that
          connect your answers, and turns them into short, concrete statements
          you can reflect on, refine, and act on.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
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
          A sentence you believe gives choices a direction. It helps when
          you&apos;re weighing a career move, deciding what to say yes to, or
          wondering why some weeks feel heavier than others. You don&apos;t
          need a new life to use it; most people start by doing a little more
          of what their statement points to.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="faq">
        <h2
          id="faq"
          className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Common questions
        </h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-display text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                {question}
                <span aria-hidden="true" className="text-xl font-normal text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
        <JsonLd data={faqJsonLd} />
      </section>

      <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl bg-primary-soft p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ready to begin?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four questions, about two minutes, no sign-up to start.
          </p>
        </div>
        <ButtonLink href="/ikigai-finder/quick" className="shrink-0">
          Find your ikigai
        </ButtonLink>
      </div>
    </article>
  );
}
