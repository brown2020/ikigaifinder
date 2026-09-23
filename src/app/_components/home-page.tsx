import IkigaiDiagram from "@/components/ikigai/IkigaiDiagram";
import StartButton from "@/components/home/StartButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IKIGAI_CIRCLES, IKIGAI_INTERSECTIONS } from "@/constants/ikigai";
import { STEPPER_QUESTIONS_JSON } from "@/constants/questions";

const colorOf = Object.fromEntries(IKIGAI_CIRCLES.map((c) => [c.id, c.color]));
const labelOf = Object.fromEntries(IKIGAI_CIRCLES.map((c) => [c.id, c.label.toLowerCase()]));

const STEPS = [
  {
    title: "Reflect",
    body: "Answer sixteen short questions across the four circles. Your answers save as you go, so you can stop and come back.",
  },
  {
    title: "Choose",
    body: "AI drafts ikigai statements from your own words and shows how strongly each one draws on every overlap. Steer it, edit it, pick one.",
  },
  {
    title: "Keep it close",
    body: "Turn your statement into a card with a background painted for it. Download it, or share a link when you're ready.",
  },
];

const EXAMPLES = [
  "My ikigai is to help small manufacturers go green and stay resilient while attracting global talent.",
  "My ikigai is to teach healthcare workers to reach their potential and become the best versions of themselves.",
  "My ikigai is to lead retreats that help people reconnect with their vitality and sense of purpose.",
];

export default function HomePage(): React.ReactElement {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-20 lg:pb-28">
          <div className="animate-rise">
            <Eyebrow>生き甲斐 · a reason for being</Eyebrow>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Find the work that feels like <em className="font-normal text-primary">you</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Ikigai is the Japanese idea that purpose lives where what you love, what you&apos;re good at, what the world needs, and what you can be paid for overlap. We&apos;ll help you put yours into words.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StartButton />
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                How it works
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Free · about 10 minutes · private until you share</p>
          </div>
          <div className="relative mx-auto w-full max-w-[460px] animate-fade-in">
            <div className="absolute inset-8 rounded-full bg-primary-soft blur-3xl" aria-hidden="true" />
            <IkigaiDiagram className="relative animate-drift" showLabels />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl">
            <Eyebrow>The four circles</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Four honest questions, asked one at a time
            </h2>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {IKIGAI_CIRCLES.map((circle) => {
              const sample = STEPPER_QUESTIONS_JSON.find((s) => s.id === circle.stepId)?.questions[0]?.label;
              return (
                <li key={circle.id} className="bg-card p-6">
                  <span className="block size-3 rounded-full" style={{ backgroundColor: circle.color }} aria-hidden="true" />
                  <h3 className="mt-5 font-display text-xl font-semibold">{circle.label}</h3>
                  {sample && <p className="mt-3 text-muted-foreground">&ldquo;{sample}&rdquo;</p>}
                </li>
              );
            })}
          </ul>
          <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IKIGAI_INTERSECTIONS.map((x) => (
              <div key={x.key}>
                <dt className="flex items-center gap-2 font-medium">
                  <span className="flex -space-x-1" aria-hidden="true">
                    {x.between.map((id) => (
                      <span key={id} className="size-3 rounded-full ring-2 ring-card" style={{ backgroundColor: colorOf[id] }} />
                    ))}
                  </span>
                  {x.label}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  Where {labelOf[x.between[0]]} meets {labelOf[x.between[1]]}.
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            From a blank page to a sentence you believe
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-border-strong pt-6">
                <span className="font-display text-5xl font-light text-primary">{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8836b]">What a finished statement sounds like</p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {EXAMPLES.map((text) => (
              <li key={text}>
                <blockquote className="font-display text-2xl leading-snug">{text}</blockquote>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-[#b8aca0]">Illustrative examples. Yours is written from your own answers.</p>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Ready when you are.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Your answers stay private. Sharing is off until you turn it on.</p>
          <StartButton className="mt-8" />
        </div>
      </section>
    </>
  );
}
