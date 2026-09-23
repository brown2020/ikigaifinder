import { Eyebrow } from "@/components/ui/Eyebrow";

export default function PrivacyPage(): React.ReactElement {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="border-b border-border pb-10">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Protecting your private information is our priority. This Statement
          of Privacy applies to{" "}
          <span className="font-medium text-foreground">Ikigaifinder.ai</span>{" "}
          and governs data collection and usage.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: November 1, 2022
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {privacyPolicyContent.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground"
                key={paragraph.slice(0, 64)}
              >
                {paragraph}
              </p>
            ))}
            {section.listItems && (
              <ul className="mt-4 list-disc space-y-1.5 pl-5 leading-relaxed text-muted-foreground marker:text-primary">
                {section.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.closing?.map((paragraph) => (
              <p
                className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground"
                key={paragraph.slice(0, 64)}
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

type PrivacyPolicySection = {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  /** Paragraphs rendered after the list. */
  closing?: string[];
};

const privacyPolicyContent: PrivacyPolicySection[] = [
  {
    title: "Collection of your Personal Information",
    paragraphs: [
      "In order to better provide you with products and services, Ikigaifinder.ai may collect personally identifiable information, such as your:",
    ],
    listItems: ["First and Last Name", "E-mail Address"],
    closing: [
      "We do not collect any personal information unless you voluntarily provide it to us. You may need to provide certain personal information when using certain products or services, such as registering for an account, signing up for offers, or submitting payment information.",
    ],
  },
  {
    title: "Use of your Personal Information",
    paragraphs: [
      "Ikigaifinder.ai uses your personal information to operate and deliver the services you have requested. Additionally, we may inform you about other products or services available from Ikigaifinder.ai and its affiliates.",
    ],
  },
  {
    title: "Sharing Information with Third Parties",
    paragraphs: [
      "Ikigaifinder.ai does not sell, rent, or lease its customer lists to third parties. We may share data with trusted partners to help perform analysis, send emails, provide customer support, or arrange for deliveries, but all third parties are prohibited from using your personal information for any other purpose.",
    ],
  },
  {
    title: "Right to Deletion",
    paragraphs: [
      "Upon a verifiable request, we will delete your personal information from our records, except where legally required or necessary for services.",
    ],
    listItems: [
      "To complete transactions",
      "For security purposes",
      "To debug errors",
      "To comply with laws and other legitimate purposes",
    ],
  },
  {
    title: "Children Under Thirteen",
    paragraphs: [
      "Ikigaifinder.ai does not knowingly collect personal information from children under the age of thirteen. If you are under thirteen, you must ask for your parent or guardian’s permission to use this application.",
    ],
  },
  {
    title: "E-mail Communications",
    paragraphs: [
      "From time to time, we may contact you via email for promotions, alerts, or surveys. You may opt out by clicking the unsubscribe link in the email.",
    ],
  },
  {
    title: "External Data Storage Sites",
    paragraphs: [
      "We may store your data on third-party servers, with whom we have contracts to ensure data protection.",
    ],
  },
  {
    title: "Changes to this Statement",
    paragraphs: [
      "Ikigaifinder.ai reserves the right to change this Privacy Policy. We will notify you of significant changes via email or by placing a prominent notice on our website.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      "If you believe we have not adhered to this policy, please contact us at:",
      "Ikigaifinder.ai\n30765 Pacific Coast Hwy #354\nMalibu, CA\nEmail: info@ignitechannel.com",
    ],
  },
];
