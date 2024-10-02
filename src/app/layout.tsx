import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "Ikigai Finder",
  description: "Find your Ikigai by answering a series of questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-full">
        <ClientProvider>
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <div className="flex-grow">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
