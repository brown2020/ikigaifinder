import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function TermsPage(): React.ReactElement {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="border-b border-border pb-10">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          These Terms of Use describe the terms and conditions applicable to
          your use of Ikigaifinder.ai services.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: November 1, 2022
        </p>
      </header>

      <div className="mt-10 space-y-4 leading-relaxed text-muted-foreground">
        <p>
          Welcome and thank you for your interest in{" "}
          <span className="font-medium text-foreground">Ikigaifinder.ai</span>{" "}
          services and mobile apps! These Terms of Use (the “Agreement”)
          describe the terms and conditions applicable to your use of
          Ikigaifinder.ai (the “Sites”) and the related mobile applications
          (the “Mobile Apps”) (collectively, the “Services”). The Sites and
          Mobile Apps are owned and operated by Ikigaifinder.ai, and its
          affiliates and subsidiaries (collectively “Ikigaifinder.ai”).
        </p>
        <p>
          In this Agreement, we refer to ourselves as Ikigaifinder.ai or “us”
          or “we”; we refer to you as “you” or “Customer.” Ikigaifinder.ai and
          Customer are referred to in this Agreement individually as a “Party”
          and collectively as the “Parties.”
        </p>
        <p>
          By accessing or using the Services, including access to the Sites,
          you intend and expressly agree to be bound by all the terms and
          conditions of this Agreement and the Privacy Policy (available at{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            /privacy-policy
          </Link>
          ), which is incorporated by reference. If you do not agree to these
          terms and conditions, you may not use the Services.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {termsContent.map((section) => (
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
          </section>
        ))}
      </div>
    </article>
  );
}

const termsContent = [
  {
    title: "Access and Use",
    paragraphs: [
      "Ikigaifinder.ai grants you a limited license to access the Sites subject to this Agreement. If you choose to subscribe to and use the Mobile Apps, Ikigaifinder.ai further grants you a license to access and use the Services, subject to and conditioned upon your compliance with this Agreement, the Privacy Policy, and any other rules and requirements communicated to you by Ikigaifinder.ai, including your payment of any applicable fees. You acknowledge and agree that Ikigaifinder.ai may modify, update, and otherwise change the Services at any time and in its sole discretion.",
      "You represent and warrant that you are at least 18 years of age and have the legal authority to accept this Agreement on your behalf or on behalf of any party you represent. You alone are responsible for your activities and interaction with the Services.",
      "You shall not use the Services for any purposes beyond the scope of the access granted in this Agreement. You shall not at any time, directly or indirectly, and shall not permit any third-party to: (i) copy, modify, or create derivative works of the Services, in whole or in part; (ii) reverse engineer, disassemble, decompose, decode, adapt, or otherwise attempt to derive or gain access to any Mobile Apps component of the Services, in whole or in part; or (iii) use the Services in any manner or for any purpose that infringes, misappropriates, or otherwise violates any intellectual property right or other right of any person (including but not limited to web scraping), or that otherwise violates any law, regulation, or other legal requirement.",
      "Except for the limited license to access the Sites and Mobile Apps identified above, you acknowledge that nothing contained in this Agreement shall be construed as granting or conferring, by implication, estoppel, or otherwise, any right, title, or interest to any intellectual property, including any (i) inventions (whether patentable or not in any country), patents, patent applications, invention disclosures, improvements, trade secrets, proprietary information, know how, information, or technical data; (ii) copyright protected works, copyright registrations, mask works, mask work registrations, or applications in the United States or any foreign country; (iii) trademarks, trademark registrations, service marks, logos, or applications therefor in the United States or any foreign country; (iv) trade secrets; or (v) any other tangible or intangible proprietary rights anywhere in the world.",
      "You acknowledge and agree that at times the Services may be inaccessible or inoperable for any reason whatsoever, including, without limitation: (i) equipment malfunctions; (ii) periodic maintenance procedures or repairs which Ikigaifinder.ai may undertake from time to time without notice to you; or (iii) causes which are beyond the control of Ikigaifinder.ai or which are not reasonably foreseeable.",
      "Notwithstanding anything to the contrary in this Agreement, Ikigaifinder.ai may temporarily suspend access to the Services provided to you and any other third-party for security purposes, to prevent illegal or fraudulent activity, to comply with the requests of any legal agency or government entity, or if you violate the Agreement or the Privacy Policy.",
      "Ikigaifinder.ai may from time to time and in its sole discretion engage other service providers to assist in the performance of the Services, such as web hosting providers, payment processors, and other third-parties. You shall abide by the terms of use and other requirements associated with the services provided by such third-parties in connection with the Services.",
    ],
  },
  {
    title: "Customer Responsibilities",
    paragraphs: [
      "You acknowledge that you are solely responsible and liable for your use of the Services, directly or indirectly, including understanding whether such access or use is permitted by or in violation of this Agreement. You are further solely responsible for compliance with all applicable laws relating to your use of the Services. You shall further use the Services solely for lawful purposes, and shall conduct all business through the Services in accordance with all applicable laws and regulations, including but not limited to all applicable federal and state laws and regulations governing the offer and sale of securities, money laundering, and counter-terrorism.",
      "You alone are responsible for ensuring and maintaining that you are able to access and use the Services, including by securing your own compatible hardware, Mobile Apps, internet access, security Mobile Apps, backup devices or services, and any other requirements. Ikigaifinder.ai shall have no responsibility to provide any additional Mobile Apps or hardware. You further agree that Ikigaifinder.ai shall have no responsibility for any data loss or other damage or loss suffered in connection with your use of the Services, including any failure to provide adequate security or backup devices or services.",
      "You are responsible for ensuring Ikigaifinder.ai has accurate and current information for your Customer account, including current contact and payment information. You are further responsible for regularly reviewing the associated Customer email account for any communications from Ikigaifinder.ai.",
      "If you are provided with a username, password, credentials file, or any other piece of information as part of any security procedure (“Credentials”), you must treat such information as confidential, and must not disclose Credentials to any other person or entity. You acknowledge that your account and Credentials are personal to you, and further agree not to provide any other person with access to the Services or portions of the Services using your username, password, or other security information. You shall notify Ikigaifinder.ai immediately of any unauthorized access to or use of your Credentials or any other breach of security. Ikigaifinder.ai has the right to disable any username, password, credentials file, or other identifier at any time, whether chosen by you or provided by Ikigaifinder.ai.",
      "Ikigaifinder.ai shall make commercially reasonable efforts to provide adequate support services for the Services. Notwithstanding the foregoing, this Agreement does not entitle you to any guaranteed level, availability, or turnaround time of support services for the Services.",
    ],
  },
] as const;
