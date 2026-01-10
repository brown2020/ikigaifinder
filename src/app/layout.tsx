import type { Metadata, Viewport } from "next";
import BottomBar from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "@/components/ClientProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";

// ============================================================================
// Metadata & SEO
// ============================================================================

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ikigaifinder.ai"
  ),
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
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ============================================================================
// Structured Data (JSON-LD)
// ============================================================================

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

// ============================================================================
// Root Layout
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col h-full overflow-x-hidden">
        <ClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 supports-backdrop-filter:bg-background/70 backdrop-blur">
            <Navbar />
          </header>
          <main id="main" className="grow pb-12 sm:pb-0 scroll-mt-20">
            {children}
          </main>
          <div className="fixed bottom-0 z-50 w-full block sm:hidden">
            <BottomBar />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
