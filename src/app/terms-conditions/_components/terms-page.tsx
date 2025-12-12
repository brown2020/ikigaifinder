import React from "react";

export default function TermsPage(): React.ReactElement {
  return (
    <section className="relative sm:px-10 px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
      <div className="container mx-auto sm:px-4 relative">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
            These Terms of Use describe the terms and conditions applicable to
            your use of Ikigaifinder.ai services.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-8">
          <p className="leading-relaxed">
            Welcome and thank you for your interest in{" "}
            <span className="font-semibold">Ikigaifinder.ai</span> services and
            mobile apps! These Terms of Use (the “Agreement”) describe the terms
            and conditions applicable to your use of Ikigaifinder.ai (the
            “Sites”) and the related mobile applications (the “Mobile Apps”)
            (collectively, the “Services”). The Sites and Mobile Apps are owned
            and operated by Ikigaifinder.ai, and its affiliates and subsidiaries
            (collectively “Ikigaifinder.ai”).
          </p>
          <p className="leading-relaxed mt-4">
            In this Agreement, we refer to ourselves as Ikigaifinder.ai or “us”
            or “we”; we refer to you as “you” or “Customer.” Ikigaifinder.ai and
            Customer are referred to in this Agreement individually as a “Party”
            and collectively as the “Parties.”
          </p>
          <p className="leading-relaxed mt-4">
            By accessing or using the Services, including access to the Sites,
            you intend and expressly agree to be bound by all the terms and
            conditions of this Agreement and the Privacy Policy (available at
            /privacy), which is incorporated by reference. If you do not agree
            to these terms and conditions, you may not use the Services.
          </p>
          {termsContent?.length
            ? termsContent?.map((section, index) => (
                <section className="mb-12" key={index}>
                  <h2 className="text-xl font-semibold">{section?.title}</h2>
                  {section?.paragraphs.map((paragraph, pIndex) => (
                    <p className="leading-relaxed mt-3" key={pIndex}>
                      {paragraph?.split("\n").map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </section>
              ))
            : null}
          <p className="text-center text-gray-500 mt-8">
            Last updated: November 1, 2022
          </p>
        </div>
      </div>
    </section>
  );
}

const termsContent = [
  {
    title: "Access and Use",
    paragraphs: [
      "Ikigaifinder.ai grants you a limited license to access the Sites subject to this Agreement. If you choose to subscribe to and use the Mobile Apps, Ikigaifinder.ai further grants you a license to access and use the Services, subject to and conditioned upon your compliance with this Agreement, the Privacy Policy, and any other rules and requirements communicated to you by Ikigaifinder.ai, including your payment of any applicable fees. You acknowledge and agree thatIkigaifinder.ai may modify, update, and otherwise change the Services at any time and in its sole discretion.",
      "You represent and warrant that you are at least 18 years of age and have the legal authority to accept this Agreement on your behalf or on behalf of any party you represent. You alone are responsible for your activities and interaction with the Services.",
      "You shall not use the Services for any purposes beyond the scope of the access granted in this Agreement. You shall not at any time, directly or indirectly, and shall not permit any third-party to: (i) copy, modify, or create derivative works of the Services, in whole or in part; (ii) reverse engineer, disassemble, decompose, decode, adapt, or otherwise attempt to derive or gain access to any Mobile Apps component of the Services, in whole or in part; or (iii) use the Services in any manner or for any purpose that infringes, misappropriates, or otherwise violates any intellectual property right or other right of any person (including but not limited to web scraping), or that otherwise violates any law, regulation, or other legal requirement.",
      "Except for the limited license to access the Sites and Mobile Apps identified above, you acknowledge that nothing contained in this Agreement shall be construed as granting or conferring, by implication, estoppel, or otherwise, any right, title, or interest to any intellectual property, including any (i) inventions (whether patentable or not in any country), patents, patent applications, invention disclosures, improvements, trade secrets, proprietary information, know how, information, or technical data; (ii) copyright protected works, copyright registrations, mask works, mask work registrations, or applications in the United States or any foreign country; (iii) trademarks, trademark registrations, service marks, logos, or applications therefor in the United States or any foreign country; (iv) trade secrets; or (v) any other tangible or intangible proprietary rights anywhere in the world.",
      "You acknowledge and agree that at times the Services may be inaccessible or inoperable for any reason whatsoever, including, without limitation: (i) equipment malfunctions; (ii) periodic maintenance procedures or repairs which Ikigaifinder.ai may undertake from time to time without notice to you; or (iii) causes which are beyond the control ofIkigaifinder.ai or which are not reasonably foreseeable.",
      "Notwithstanding anything to the contrary in this Agreement,Ikigaifinder.ai may temporarily suspend access to the Services provided to you and any other third-party for security purposes, to prevent illegal or fraudulent activity, to comply with the requests of any legal agency or government entity, or if you violate the Agreement or the Privacy Policy.",
      "Ikigaifinder.ai may from time to time and in its sole discretion engage other service providers to assist in the performance of the Services, such as web hosting providers, payment processors, and other third-parties. You shall abide by the terms of use and other requirements associated with the services provided by such third-parties in connection with the Services.",
    ],
  },
  {
    title: "Customer Responsibilities",
    paragraphs: [
      "You acknowledge that you are solely responsible and liable for your use of the Services, directly or indirectly, including understanding whether such access or use is permitted by or in violation of this Agreement. You are further solely responsible for compliance with all applicable laws relating to your use of the Services. You shall further use the Services solely for lawful purposes, and shall conduct all business through the Services in accordance with all applicable laws and regulations, including but not limited to all applicable federal and state laws and regulations governing the offer and sale of securities, money laundering, and counter-terrorism.",
      "You alone are responsible for ensuring and maintaining that you are able to access and use the Services, including by securing your own compatible hardware, Mobile Apps, internet access, security Mobile Apps, backup devices or services, and any other requirements.Ikigaifinder.ai shall have no responsibility to provide any additional Mobile Apps or hardware. You further agree thatIkigaifinder.ai shall have no responsibility for any data loss or other damage or loss suffered in connection with your use of the Services, including any failure to provide adequate security or backup devices or services.",
      "You are responsible for ensuring Ikigaifinder.ai has accurate and current information for your Customer account, including current contact and payment information. You are further responsible for regularly reviewing the associated Customer email account for any communications from Ikigaifinder.ai.",
      "If you are provided with a username, password, credentials file, or any other piece of information as part of any security procedure (“Credentials”), you must treat such information as confidential, and must not disclose Credentials to any other person or entity. You acknowledge that your account and Credentials are personal to you, and further agree not to provide any other person with access to the Services or portions of the Services using your username, password, or other security information. You shall notify Ikigaifinder.ai immediately of any unauthorized access to or use of your Credentials or any other breach of security. Ikigaifinder.ai has the right to disable any username, password, credentials file, or other identifier at any time, whether chosen by you or provided by Ikigaifinder.ai.",
      "Ikigaifinder.ai shall make commercially reasonable efforts to provide adequate support services for the Services. Notwithstanding the foregoing, this Agreement does not entitle you to any guaranteed level, availability, or turnaround time of support services for the Services.",
    ],
  },
] as const;


