import { Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyLocation: string;
  updatedAt: string;
};

export default function Support({
  companyName,
  companyEmail,
  companyAddress,
  companyLocation,
  updatedAt,
}: Props) {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <header>
        <Eyebrow>Support</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          We&apos;re here to help
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {companyName} welcomes your questions or comments regarding this
          application.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="contact-information">
        <h2
          id="contact-information"
          className="font-display text-2xl font-semibold tracking-tight text-foreground"
        >
          Contact information
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          If you have any questions or doubts about the application, please
          contact {companyName} at:
        </p>

        <Card padded className="mt-6">
          <dl className="grid gap-8 sm:grid-cols-2">
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${companyEmail}`}
                    className="break-all font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {companyEmail}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Mailing address
                </dt>
                <dd className="mt-1 not-italic leading-relaxed text-foreground">
                  <address className="not-italic">
                    {companyName}
                    <br />
                    {companyAddress}
                    <br />
                    {companyLocation}
                  </address>
                </dd>
              </div>
            </div>
          </dl>
        </Card>
      </section>

      <p className="mt-12 text-sm text-muted-foreground">
        Last updated: {updatedAt}
      </p>
    </article>
  );
}
