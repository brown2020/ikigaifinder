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
          <div className="fixed top-0 z-50 w-full">
            <Navbar />
          </div>
          <div className="flex-grow pt-[64px]">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
