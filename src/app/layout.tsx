import type { Metadata } from "next";
import BottomBar from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "@/components/ClientProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";

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
          <div className="sm:fixed top-0 z-50 w-full">
            <Navbar />
          </div>
          <div className="flex-grow sm:pt-[64px] pb-10 sm:pb-0">{children}</div>
          <div className="fixed bottom-0 z-50 w-full block sm:hidden">
            <BottomBar />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
