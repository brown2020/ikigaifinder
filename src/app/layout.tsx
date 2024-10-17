import type { Metadata } from "next";
import BottomBar from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "@/components/ClientProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import FooterNavBar from "@/components/FooterNavBar";

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
          <div className="flex-grow sm:pt-[64px] pb-20 sm:pb-9">
            {children}
          </div>
            <div className="fixed sm:bottom-0 bottom-[52px] z-50 w-full bg-white">
              <FooterNavBar />
            </div>
          <div className="fixed bottom-0 z-50 w-full block sm:hidden">
            <BottomBar />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
