import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { ClientProvider } from "@/components/ClientProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import MobileNav from "@/components/layout/MobileNav";
import { absoluteSiteUrl, jsonLdScript, siteUrl } from "@/utils/siteUrl";
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

const DEFAULT_TITLE = "Ikigai Finder AI: find your reason for being";
const DEFAULT_DESCRIPTION =
  "Find your ikigai, the Japanese idea of a reason for being. Answer a few honest questions, get personal ikigai statements drafted by AI, see why one fits you, and turn it into a card you can keep or share. Free, and no sign-up to start.";

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Ikigai Finder AI",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Ikigai Finder AI",
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
  metadataBase: siteUrl(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ikigai Finder AI",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/assets/ikigai-finder.webp",
        alt: "Ikigai Finder AI: find your reason for being",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description:
      "Find where what you love, what you're good at, what the world needs, and what you can be paid for overlap, and put it into one sentence.",
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

const SITE = absoluteSiteUrl("/");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}#website`,
      url: SITE,
      name: "Ikigai Finder AI",
      alternateName: "Ikigai Finder",
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE}#app`,
      name: "Ikigai Finder AI",
      url: SITE,
      description: DEFAULT_DESCRIPTION,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      isPartOf: { "@id": `${SITE}#website` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Four-question quick start, no sign-up needed",
        "Personal ikigai statements scored on passion, mission, vocation, and profession",
        "Personal insights report with first steps for the week",
        "Personal ikigai map in your own words",
        "Shareable ikigai card in square, story, and wide sizes",
      ],
    },
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
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
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
