import React from "react";

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
    <section className="relative sm:px-10 px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
      <div className="container mx-auto sm:px-4 relative">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Support</h1>
          <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
            {companyName} welcomes your questions or comments regarding this
            application.
          </p>
        </div>

        <div className="max-w-xl mx-auto mt-8 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 bg-white/80 backdrop-blur">
          <h4 className="text-lg font-semibold">Contact Information</h4>
          <p className="text-gray-700 mt-2">
            If you have any questions or doubts about the application, please
            contact {companyName} at:
          </p>

          <div className="mt-4 space-y-1 text-gray-700">
            <p>{companyName}</p>
            <p>{companyAddress}</p>
            <p>{companyLocation}</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-700">Email Address:</p>
            <a
              href={`mailto:${companyEmail}`}
              className="text-blue-600 hover:text-blue-700"
            >
              {companyEmail}
            </a>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Last updated: {updatedAt}
          </p>
        </div>
      </div>
    </section>
  );
}
