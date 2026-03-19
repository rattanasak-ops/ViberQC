import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthSessionProvider } from "@/components/layout/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://viberqc.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ViberQC — AI-Powered 360° Quality Control",
    template: "%s | ViberQC",
  },
  description:
    "Scan your Viber App for Code, Performance, and Security issues in 30 seconds. AI-powered 360° QC — all in one place.",
  keywords: [
    "Viber QC",
    "quality control",
    "AI testing",
    "app security",
    "performance testing",
    "code quality",
    "OWASP",
    "accessibility",
  ],
  authors: [{ name: "ViberQC" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "ViberQC — AI-Powered 360° Quality Control",
    description:
      "Scan your Viber App for Code, Performance, and Security issues in 30 seconds.",
    siteName: "ViberQC",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "ViberQC — AI-Powered 360° Quality Control",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViberQC — AI-Powered 360° Quality Control",
    description:
      "Scan your Viber App for Code, Performance, and Security issues in 30 seconds.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${APP_URL}/#website`,
                  url: APP_URL,
                  name: "ViberQC",
                  description: "AI-Powered 360° Quality Control for Viber Apps",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${APP_URL}/scan?url={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${APP_URL}/#app`,
                  name: "ViberQC",
                  url: APP_URL,
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Web",
                  description:
                    "Scan your Viber App for Code, Performance, and Security issues in 30 seconds.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              ],
            }),
          }}
        />
        <AuthSessionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none"
              >
                Skip to main content
              </a>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
