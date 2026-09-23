import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { ClientProvider } from "@/components/ClientProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

function safeSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || "https://ikigaifinder.ai";
  try {
    return new URL(raw);
  } catch {
    return new URL("https://ikigaifinder.ai");
  }
}

function safeJsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export const metadata: Metadata = {
  title: {
    default: "Ikigai Finder AI - Discover Your Life Purpose",
    template: "%s | Ikigai Finder AI",
  },
  description:
    "Discover your Ikigai - the Japanese concept of life purpose - through an AI-powered guided journey. Answer thoughtful questions and receive personalized purpose statements with beautiful shareable cards.",
  keywords: [
    "ikigai",
    "life purpose",
    "AI",
    "career guidance",
    "self-discovery",
    "passion",
    "mission",
    "vocation",
    "profession",
    "purpose finder",
    "meaning of life",
    "personal development",
  ],
  authors: [{ name: "Ikigai Finder AI" }],
  creator: "Ikigai Finder AI",
  publisher: "Ikigai Finder AI",
  metadataBase: safeSiteUrl(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ikigai Finder AI",
    title: "Ikigai Finder AI - Discover Your Life Purpose",
    description:
      "AI-powered tool to discover your Ikigai. Complete a guided survey and receive personalized purpose statements with beautiful shareable cards.",
    images: [
      {
        url: "/assets/ikigai-finder.webp",
        alt: "Ikigai Finder AI - Discover Your Purpose",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ikigai Finder AI - Discover Your Life Purpose",
    description:
      "AI-powered tool to discover your Ikigai. Find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
    images: ["/assets/ikigai-finder.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
  manifest: "/manifest.json",
  category: "self-improvement",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#faf7f2" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ikigai Finder AI",
  description:
    "AI-powered tool to discover your Ikigai - the Japanese concept of life purpose.",
  url: "https://ikigaifinder.ai",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI-guided self-discovery",
    "Personalized Ikigai statements",
    "Beautiful shareable cards",
    "Venn diagram visualization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdScript(jsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden">
        <ClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex grow flex-col scroll-mt-20">
            {children}
          </main>
          <SiteFooter />
          <MobileNav />
        </ClientProvider>
      </body>
    </html>
  );
}
