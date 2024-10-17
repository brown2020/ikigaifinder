import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">
          Privacy Policy
        </h1>
        <p className="text-lg leading-relaxed mb-10 text-center">
          Protecting your private information is our priority. This Statement of
          Privacy applies to{" "}
          <span className="font-semibold">Ikigaifinder.ai</span> pages and apps
          developed by Ikigaifinder.ai and governs data collection and usage. By
          using the Ikigaifinder.ai website and applications, you consent to the
          data practices described in this statement.
        </p>
        {privacyPolicyContent.map((section, index) => (
          <section className="mb-12" key={index}>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, pIndex) => (
              <p className="text-lg leading-relaxed mb-4" key={pIndex}>
                {paragraph?.split("\n").map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ))}
            {section.listItems && (
              <ul className="list-disc list-inside text-lg mb-4">
                {section.listItems.map((item, iIndex) => (
                  <li key={iIndex}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="text-center text-gray-500 mt-8">
          Last updated: November 1, 2022
        </p>
      </div>
    </div>
  );
}


const privacyPolicyContent = [
  {
    title: "Collection of your Personal Information",
    paragraphs: [
      "In order to better provide you with products and services, Ikigaifinder.ai may collect personally identifiable information, such as your:",
      "We do not collect any personal information unless you voluntarily provide it to us. You may need to provide certain personal information when using certain products or services, such as registering for an account, signing up for offers, or submitting payment information.",
    ],
    listItems: ["First and Last Name", "E-mail Address"],
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
